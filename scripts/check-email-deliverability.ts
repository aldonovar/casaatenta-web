import { createPublicKey } from "node:crypto";
import {
  resolveCname,
  resolveMx,
  resolveNs,
  resolveTxt,
} from "node:dns/promises";
import { isIP } from "node:net";
import { parseArgs } from "node:util";

const DEFAULT_DOMAIN = "casa-atenta.com";
const DEFAULT_DKIM_SELECTORS = ["resend"];
const DEFAULT_RETURN_PATH = "send.casa-atenta.com";
const VERISIGN_RDAP_BASE_URL = "https://rdap.verisign.com/com/v1/domain/";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MAX_SPF_DNS_LOOKUPS = 10;
const MAX_SPF_RECURSION_DEPTH = 32;

type FindingStatus = "PASS" | "WARN" | "FAIL";

type Finding = {
  status: FindingStatus;
  check: string;
  message: string;
};

type RdapEvent = {
  eventAction?: unknown;
  eventDate?: unknown;
};

type RdapDomain = {
  events?: unknown;
};

type SpfDnsMechanism = "include" | "a" | "mx" | "ptr" | "exists";

type ParsedSpfMechanism = {
  kind: SpfDnsMechanism | "ip4" | "ip6" | "all";
  qualifier: "+" | "-" | "?" | "~";
  target?: string;
};

type ParsedSpfRecord = {
  mechanisms: ParsedSpfMechanism[];
  redirectTarget?: string;
  errors: string[];
};

type SpfAuditContext = {
  lookupCount: number;
  failures: Set<string>;
  effectivePolicyQualifiers: Set<ParsedSpfMechanism["qualifier"]>;
  recordCache: Map<string, ParsedSpfRecord | null>;
  readTxt: (host: string) => Promise<string[]>;
};

function finding(
  status: FindingStatus,
  check: string,
  message: string,
): Finding {
  return { status, check, message };
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isNoDnsData(error: unknown): boolean {
  const code = (error as NodeJS.ErrnoException | undefined)?.code;
  return code === "ENODATA" || code === "ENOTFOUND";
}

function normalizeDomain(value: string, optionName: string): string {
  const domain = value.trim().toLowerCase().replace(/\.$/, "");
  const valid =
    domain.length > 0 &&
    domain.length <= 253 &&
    domain.split(".").every((label) => {
      return (
        label.length > 0 &&
        label.length <= 63 &&
        /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
      );
    });

  if (!valid || !domain.includes(".")) {
    throw new Error(`${optionName} no contiene un dominio DNS válido.`);
  }

  return domain;
}

function normalizeSpfDnsName(value: string, context: string): string {
  const domain = value.trim().toLowerCase().replace(/\.$/, "");
  const labels = domain.split(".");
  const valid =
    domain.length > 0 &&
    domain.length <= 253 &&
    labels.length > 1 &&
    labels.every((label, index) => {
      if (label.length === 0 || label.length > 63) return false;
      const isTopLabel = index === labels.length - 1;
      return isTopLabel
        ? /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label)
        : /^[a-z0-9_](?:[a-z0-9_-]*[a-z0-9_])?$/.test(label);
    });

  if (!valid) {
    throw new Error(`${context} no contiene un nombre DNS SPF válido.`);
  }

  return domain;
}

function normalizeSelector(value: string): string {
  const selector = value.trim().toLowerCase();
  if (
    selector.length === 0 ||
    selector.length > 63 ||
    !/^[a-z0-9](?:[a-z0-9_-]*[a-z0-9])?$/.test(selector)
  ) {
    throw new Error(
      `Selector DKIM inválido: ${JSON.stringify(value)}. Usa solo una etiqueta DNS.`,
    );
  }
  return selector;
}

async function txtRecords(name: string): Promise<string[]> {
  try {
    return (await resolveTxt(name)).map((chunks) => chunks.join(""));
  } catch (error) {
    if (!isNoDnsData(error)) throw error;
  }

  try {
    const aliases = await resolveCname(name);
    if (aliases.length === 1) {
      return (await resolveTxt(aliases[0])).map((chunks) => chunks.join(""));
    }
  } catch (error) {
    if (!isNoDnsData(error)) throw error;
  }

  return [];
}

function parseTagList(record: string): {
  values: Map<string, string>;
  duplicates: string[];
} {
  const values = new Map<string, string>();
  const duplicates: string[] = [];

  for (const rawPart of record.split(";")) {
    const part = rawPart.trim();
    if (!part) continue;
    const equalsIndex = part.indexOf("=");
    if (equalsIndex <= 0) continue;
    const key = part.slice(0, equalsIndex).trim().toLowerCase();
    const value = part.slice(equalsIndex + 1).trim();
    if (values.has(key)) duplicates.push(key);
    values.set(key, value);
  }

  return { values, duplicates };
}

function rsaModulusBits(publicKeyBase64: string): number {
  const compactKey = publicKeyBase64.replace(/\s+/g, "");
  if (compactKey.length === 0 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compactKey)) {
    throw new Error("el valor p= no es Base64 válido");
  }

  const wrappedKey = compactKey.match(/.{1,64}/g)?.join("\n");
  if (!wrappedKey) throw new Error("la clave pública está vacía");

  const key = createPublicKey(
    `-----BEGIN PUBLIC KEY-----\n${wrappedKey}\n-----END PUBLIC KEY-----`,
  );
  if (key.asymmetricKeyType !== "rsa") {
    throw new Error(`se obtuvo ${key.asymmetricKeyType ?? "tipo desconocido"}`);
  }

  const bits = key.asymmetricKeyDetails?.modulusLength;
  if (!bits) throw new Error("no se pudo determinar el módulo RSA");
  return bits;
}

function spfQualifier(value: string): {
  qualifier: ParsedSpfMechanism["qualifier"];
  term: string;
} {
  const firstCharacter = value[0];
  if (
    firstCharacter === "+" ||
    firstCharacter === "-" ||
    firstCharacter === "?" ||
    firstCharacter === "~"
  ) {
    return {
      qualifier: firstCharacter,
      term: value.slice(1),
    };
  }
  return { qualifier: "+", term: value };
}

function validateSpfMacroString(value: string): string | null {
  for (let index = 0; index < value.length; index += 1) {
    const character = value[index];
    const codePoint = character.codePointAt(0);
    if (!codePoint || codePoint < 0x21 || codePoint > 0x7e) {
      return "contiene caracteres fuera del rango ASCII imprimible de SPF";
    }
    if (character !== "%") continue;

    const nextCharacter = value[index + 1];
    if (
      nextCharacter === "%" ||
      nextCharacter === "_" ||
      nextCharacter === "-"
    ) {
      index += 1;
      continue;
    }
    if (nextCharacter !== "{") {
      return `contiene una expansión macro inválida cerca de ${JSON.stringify(
        value.slice(index, index + 4),
      )}`;
    }

    const closingBrace = value.indexOf("}", index + 2);
    if (closingBrace < 0) {
      return "contiene una expansión macro sin llave de cierre";
    }
    const transformer = value.slice(index + 2, closingBrace);
    if (!/^[slodipvhcrtSLODIPVHCRT](?:\d+)?r?[.\-+,/_=]*$/.test(transformer)) {
      return `contiene un transformador macro inválido: %{${transformer}}`;
    }
    index = closingBrace;
  }

  return null;
}

function literalSpfDomain(
  value: string,
  context: string,
): { domain?: string; error?: string } {
  const macroError = validateSpfMacroString(value);
  if (macroError) return { error: `${context} ${macroError}.` };
  if (value.includes("%")) {
    return {
      error: `${context} usa macros; este control estático no puede resolverlas de forma segura sin el contexto del mensaje.`,
    };
  }

  try {
    return { domain: normalizeSpfDnsName(value, context) };
  } catch (error) {
    return { error: errorMessage(error) };
  }
}

function validateSpfDomainSpec(value: string, context: string): string | null {
  const macroError = validateSpfMacroString(value);
  if (macroError) return `${context} ${macroError}.`;
  if (value.includes("%")) return null;
  try {
    normalizeSpfDnsName(value, context);
    return null;
  } catch (error) {
    return errorMessage(error);
  }
}

function parseSpfRecord(record: string, host: string): ParsedSpfRecord {
  const parsed: ParsedSpfRecord = {
    mechanisms: [],
    errors: [],
  };
  const terms = record.trimEnd().split(/[ \t]+/);

  if (terms[0]?.toLowerCase() !== "v=spf1") {
    parsed.errors.push(`${host}: la versión SPF debe ser exactamente v=spf1.`);
    return parsed;
  }

  const modifierNames = new Set<string>();

  for (const rawTerm of terms.slice(1)) {
    if (!rawTerm) continue;
    const { qualifier, term } = spfQualifier(rawTerm);
    if (!term) {
      parsed.errors.push(`${host}: el término ${rawTerm} está vacío.`);
      continue;
    }

    const modifier = term.match(/^([A-Za-z][A-Za-z0-9_.-]*)=(.*)$/);
    if (modifier) {
      if (term !== rawTerm) {
        parsed.errors.push(
          `${host}: un modificador no puede llevar calificador (${rawTerm}).`,
        );
        continue;
      }

      const modifierName = modifier[1].toLowerCase();
      const modifierValue = modifier[2];
      if (modifierNames.has(modifierName)) {
        parsed.errors.push(
          `${host}: el modificador ${modifierName}= aparece más de una vez.`,
        );
        continue;
      }
      modifierNames.add(modifierName);

      if (modifierName === "redirect") {
        const target = literalSpfDomain(modifierValue, `${host}: redirect=`);
        if (target.error) parsed.errors.push(target.error);
        else parsed.redirectTarget = target.domain;
      } else if (modifierName === "exp") {
        const error = validateSpfDomainSpec(modifierValue, `${host}: exp=`);
        if (error) parsed.errors.push(error);
      } else {
        const error = validateSpfMacroString(modifierValue);
        if (error) {
          parsed.errors.push(
            `${host}: el modificador ${modifierName}= ${error}.`,
          );
        }
      }
      continue;
    }

    if (term.includes("=")) {
      parsed.errors.push(
        `${host}: el término ${rawTerm} no es un modificador SPF válido.`,
      );
      continue;
    }

    if (term.toLowerCase() === "all") {
      parsed.mechanisms.push({ kind: "all", qualifier });
      continue;
    }

    const include = term.match(/^include:(.+)$/i);
    if (include) {
      const target = literalSpfDomain(include[1], `${host}: include:`);
      if (target.error) parsed.errors.push(target.error);
      else {
        parsed.mechanisms.push({
          kind: "include",
          qualifier,
          target: target.domain,
        });
      }
      continue;
    }

    const exists = term.match(/^exists:(.+)$/i);
    if (exists) {
      const error = validateSpfDomainSpec(exists[1], `${host}: exists:`);
      if (error) parsed.errors.push(error);
      else {
        parsed.mechanisms.push({
          kind: "exists",
          qualifier,
          target: exists[1],
        });
      }
      continue;
    }

    const ptr = term.match(/^ptr(?::(.+))?$/i);
    if (ptr) {
      if (ptr[1]) {
        const error = validateSpfDomainSpec(ptr[1], `${host}: ptr:`);
        if (error) {
          parsed.errors.push(error);
          continue;
        }
      }
      parsed.mechanisms.push({
        kind: "ptr",
        qualifier,
        target: ptr[1],
      });
      continue;
    }

    const addressMechanism = term.match(
      /^(a|mx)(?::(.+?))?(?:\/(\d{1,3}))?(?:\/\/(\d{1,3}))?$/i,
    );
    if (addressMechanism) {
      const kind = addressMechanism[1].toLowerCase() as "a" | "mx";
      const target = addressMechanism[2];
      const ipv4Cidr = addressMechanism[3];
      const ipv6Cidr = addressMechanism[4];
      if (target) {
        const error = validateSpfDomainSpec(target, `${host}: ${kind}:`);
        if (error) {
          parsed.errors.push(error);
          continue;
        }
      }
      if (ipv4Cidr !== undefined && Number(ipv4Cidr) > 32) {
        parsed.errors.push(
          `${host}: ${rawTerm} usa una longitud CIDR IPv4 mayor que 32.`,
        );
        continue;
      }
      if (ipv6Cidr !== undefined && Number(ipv6Cidr) > 128) {
        parsed.errors.push(
          `${host}: ${rawTerm} usa una longitud CIDR IPv6 mayor que 128.`,
        );
        continue;
      }
      parsed.mechanisms.push({ kind, qualifier, target });
      continue;
    }

    const ip4 = term.match(/^ip4:([^/]+)(?:\/(\d{1,2}))?$/i);
    if (ip4) {
      if (isIP(ip4[1]) !== 4) {
        parsed.errors.push(`${host}: ${rawTerm} no contiene una IPv4 válida.`);
      } else if (ip4[2] !== undefined && Number(ip4[2]) > 32) {
        parsed.errors.push(
          `${host}: ${rawTerm} usa una longitud CIDR IPv4 mayor que 32.`,
        );
      } else {
        parsed.mechanisms.push({ kind: "ip4", qualifier });
      }
      continue;
    }

    const ip6 = term.match(/^ip6:([^/]+)(?:\/(\d{1,3}))?$/i);
    if (ip6) {
      if (isIP(ip6[1]) !== 6) {
        parsed.errors.push(`${host}: ${rawTerm} no contiene una IPv6 válida.`);
      } else if (ip6[2] !== undefined && Number(ip6[2]) > 128) {
        parsed.errors.push(
          `${host}: ${rawTerm} usa una longitud CIDR IPv6 mayor que 128.`,
        );
      } else {
        parsed.mechanisms.push({ kind: "ip6", qualifier });
      }
      continue;
    }

    parsed.errors.push(
      `${host}: mecanismo o sintaxis SPF no reconocida: ${rawTerm}.`,
    );
  }

  const allIndexes = parsed.mechanisms.flatMap((mechanism, index) =>
    mechanism.kind === "all" ? [index] : [],
  );
  if (allIndexes.length > 1) {
    parsed.errors.push(`${host}: contiene más de un mecanismo all.`);
  } else if (
    allIndexes.length === 1 &&
    allIndexes[0] !== parsed.mechanisms.length - 1
  ) {
    parsed.errors.push(
      `${host}: el mecanismo all no es terminal; hay mecanismos inalcanzables después de él.`,
    );
  }

  return parsed;
}

function countSpfDnsLookup(
  host: string,
  mechanism: SpfDnsMechanism | "redirect",
  context: SpfAuditContext,
): boolean {
  context.lookupCount += 1;
  if (context.lookupCount <= MAX_SPF_DNS_LOOKUPS) return true;

  context.failures.add(
    `${host}: ${mechanism} excede el límite SPF de ${MAX_SPF_DNS_LOOKUPS} términos que causan consultas DNS (se contaron al menos ${context.lookupCount}).`,
  );
  return false;
}

async function readParsedSpfRecord(
  host: string,
  context: SpfAuditContext,
): Promise<ParsedSpfRecord | null> {
  if (context.recordCache.has(host)) {
    return context.recordCache.get(host) ?? null;
  }

  const records = (await context.readTxt(host)).filter((record) =>
    /^v=spf1(?:[ \t]|$)/i.test(record),
  );
  if (records.length === 0) {
    context.failures.add(`${host}: no publica exactamente un TXT SPF v=spf1.`);
    context.recordCache.set(host, null);
    return null;
  }
  if (records.length > 1) {
    context.failures.add(
      `${host}: publica ${records.length} registros SPF; SPF exige exactamente uno.`,
    );
    context.recordCache.set(host, null);
    return null;
  }

  const parsed = parseSpfRecord(records[0], host);
  for (const error of parsed.errors) context.failures.add(error);
  context.recordCache.set(host, parsed);
  return parsed;
}

async function auditSpfHost(
  host: string,
  context: SpfAuditContext,
  activePath: string[],
  requireEffectivePolicy: boolean,
): Promise<ParsedSpfRecord | null> {
  if (activePath.includes(host)) {
    context.failures.add(
      `ciclo SPF detectado: ${[...activePath, host].join(" -> ")}.`,
    );
    return null;
  }
  if (activePath.length >= MAX_SPF_RECURSION_DEPTH) {
    context.failures.add(
      `${host}: la recursión SPF excede la profundidad de seguridad de ${MAX_SPF_RECURSION_DEPTH}.`,
    );
    return null;
  }

  let parsed: ParsedSpfRecord | null;
  try {
    parsed = await readParsedSpfRecord(host, context);
  } catch (error) {
    context.failures.add(
      `${host}: no se pudo leer el TXT SPF público: ${errorMessage(error)}.`,
    );
    return null;
  }
  if (!parsed) return null;

  const allMechanisms = parsed.mechanisms.filter(
    (mechanism) => mechanism.kind === "all",
  );
  if (
    requireEffectivePolicy &&
    allMechanisms.length === 0 &&
    !parsed.redirectTarget
  ) {
    context.failures.add(
      `${host}: no tiene un mecanismo all terminal ni un redirect= verificable.`,
    );
  }
  if (requireEffectivePolicy && allMechanisms.length === 1) {
    context.effectivePolicyQualifiers.add(allMechanisms[0].qualifier);
  }

  const nextPath = [...activePath, host];
  for (const mechanism of parsed.mechanisms) {
    if (
      mechanism.kind !== "include" &&
      mechanism.kind !== "a" &&
      mechanism.kind !== "mx" &&
      mechanism.kind !== "ptr" &&
      mechanism.kind !== "exists"
    ) {
      continue;
    }

    const withinBudget = countSpfDnsLookup(host, mechanism.kind, context);
    if (mechanism.kind === "include" && mechanism.target && withinBudget) {
      await auditSpfHost(mechanism.target, context, nextPath, false);
    }
  }

  if (parsed.redirectTarget) {
    const withinBudget = countSpfDnsLookup(host, "redirect", context);
    if (withinBudget) {
      await auditSpfHost(
        parsed.redirectTarget,
        context,
        nextPath,
        requireEffectivePolicy && allMechanisms.length === 0,
      );
    }
  }

  return parsed;
}

async function checkSpf(
  host: string,
  label: string,
  readTxt: (host: string) => Promise<string[]> = txtRecords,
): Promise<Finding[]> {
  const context: SpfAuditContext = {
    lookupCount: 0,
    failures: new Set<string>(),
    effectivePolicyQualifiers: new Set<ParsedSpfMechanism["qualifier"]>(),
    recordCache: new Map<string, ParsedSpfRecord | null>(),
    readTxt,
  };
  const rootRecord = await auditSpfHost(host, context, [], true);

  if (context.failures.size > 0 || !rootRecord) {
    return [...context.failures].map((message) =>
      finding("FAIL", label, message),
    );
  }

  const findings: Finding[] = [];
  if (context.effectivePolicyQualifiers.has("+")) {
    findings.push(
      finding(
        "FAIL",
        label,
        "la política +all autoriza a cualquier emisor y debe considerarse una falla de autenticación.",
      ),
    );
  } else if (context.effectivePolicyQualifiers.has("?")) {
    findings.push(
      finding(
        "FAIL",
        label,
        "la política ?all es neutral y no ofrece una política SPF efectiva.",
      ),
    );
  }

  if (findings.some((item) => item.status === "FAIL")) return findings;

  findings.push(
    finding(
      "PASS",
      label,
      `TXT SPF único; sintaxis, dependencias include/redirect y presupuesto DNS verificados de forma estática (${context.lookupCount}/${MAX_SPF_DNS_LOOKUPS}).`,
    ),
  );
  if (context.effectivePolicyQualifiers.has("~")) {
    findings.push(
      finding(
        "WARN",
        label,
        "usa softfail (~all); no cambiar a -all sin inventariar primero todos los emisores legítimos.",
      ),
    );
  }

  return findings;
}

async function checkDkim(domain: string, selector: string): Promise<Finding[]> {
  const host = `${selector}._domainkey.${domain}`;
  const records = await txtRecords(host);
  const candidates = records.filter((record) => {
    const tags = parseTagList(record).values;
    return tags.has("p") || tags.get("v")?.toUpperCase() === "DKIM1";
  });
  const label = `DKIM ${selector}`;

  if (candidates.length === 0) {
    return [
      finding("FAIL", label, `no existe una clave DKIM pública en ${host}.`),
    ];
  }
  if (candidates.length > 1) {
    return [
      finding(
        "FAIL",
        label,
        `${host} devuelve más de un registro DKIM candidato.`,
      ),
    ];
  }

  const { values, duplicates } = parseTagList(candidates[0]);
  if (duplicates.length > 0) {
    return [
      finding(
        "FAIL",
        label,
        `el registro repite etiquetas: ${[...new Set(duplicates)].join(", ")}.`,
      ),
    ];
  }
  const version = values.get("v");
  if (version && version.toUpperCase() !== "DKIM1") {
    return [finding("FAIL", label, `versión DKIM no válida: ${version}.`)];
  }
  const keyType = (values.get("k") || "rsa").toLowerCase();
  if (keyType !== "rsa") {
    return [
      finding(
        "FAIL",
        label,
        `la clave usa k=${keyType}; este control exige poder confirmar un módulo RSA de al menos 1024 bits.`,
      ),
    ];
  }

  const publicKey = values.get("p");
  if (!publicKey) {
    return [
      finding(
        "FAIL",
        label,
        "la etiqueta p= falta o está vacía (clave revocada).",
      ),
    ];
  }

  let bits: number;
  try {
    bits = rsaModulusBits(publicKey);
  } catch (error) {
    return [
      finding(
        "FAIL",
        label,
        `no se pudo validar la clave pública RSA: ${errorMessage(error)}.`,
      ),
    ];
  }

  if (bits < 1024) {
    return [
      finding(
        "FAIL",
        label,
        `RSA ${bits} bits; está por debajo del mínimo de 1024 bits.`,
      ),
    ];
  }

  const findings = [
    finding(
      "PASS",
      label,
      `clave RSA pública válida de ${bits} bits (mínimo de 1024 confirmado).`,
    ),
  ];
  if (bits < 2048) {
    findings.push(
      finding(
        "WARN",
        label,
        `RSA ${bits} bits cumple el mínimo del control, pero se recomienda rotar mediante el proveedor a 2048 bits o más.`,
      ),
    );
  }

  return findings;
}

async function checkDmarc(domain: string): Promise<Finding[]> {
  const host = `_dmarc.${domain}`;
  const records = (await txtRecords(host)).filter((record) =>
    /^v=DMARC1(?:\s*;|$)/i.test(record.trim()),
  );
  const label = "DMARC";

  if (records.length === 0) {
    return [
      finding("FAIL", label, `no existe un TXT DMARC público en ${host}.`),
    ];
  }
  if (records.length > 1) {
    return [
      finding(
        "FAIL",
        label,
        `${host} publica ${records.length} registros DMARC; debe existir exactamente uno.`,
      ),
    ];
  }

  const { values, duplicates } = parseTagList(records[0]);
  if (duplicates.length > 0) {
    return [
      finding(
        "FAIL",
        label,
        `el registro repite etiquetas: ${[...new Set(duplicates)].join(", ")}.`,
      ),
    ];
  }
  if (values.get("v")?.toUpperCase() !== "DMARC1") {
    return [finding("FAIL", label, "la versión DMARC no es DMARC1.")];
  }

  const policy = values.get("p")?.toLowerCase();
  if (!policy || !["none", "quarantine", "reject"].includes(policy)) {
    return [
      finding(
        "FAIL",
        label,
        `la política p=${policy || "(ausente)"} no es válida.`,
      ),
    ];
  }

  const findings = [
    finding(
      "PASS",
      label,
      `TXT DMARC único y estructuralmente válido con p=${policy}.`,
    ),
  ];

  if (policy === "none") {
    findings.push(
      finding(
        "WARN",
        label,
        "p=none solo observa y reporta; no poner quarantine/reject sin revisar antes todas las fuentes legítimas y sus reportes.",
      ),
    );
  }

  const rawPercentage = values.get("pct");
  if (rawPercentage !== undefined) {
    const percentage = Number(rawPercentage);
    if (!Number.isInteger(percentage) || percentage < 0 || percentage > 100) {
      findings.push(
        finding(
          "FAIL",
          label,
          `pct=${rawPercentage} no es un porcentaje válido.`,
        ),
      );
    } else if (percentage < 100) {
      findings.push(
        finding(
          "WARN",
          label,
          `pct=${percentage}: la política solo se aplica a una parte del flujo.`,
        ),
      );
    }
  }

  return findings;
}

async function checkMx(domain: string): Promise<Finding[]> {
  let records: Awaited<ReturnType<typeof resolveMx>>;
  try {
    records = await resolveMx(domain);
  } catch (error) {
    if (isNoDnsData(error)) records = [];
    else throw error;
  }

  if (records.length === 0) {
    return [
      finding(
        "FAIL",
        "MX",
        `no existen MX públicos para recibir respuestas en ${domain}.`,
      ),
    ];
  }
  if (records.some((record) => !record.exchange || record.exchange === ".")) {
    return [
      finding(
        "FAIL",
        "MX",
        `${domain} publica un Null MX y no puede recibir respuestas por correo.`,
      ),
    ];
  }

  const ordered = [...records]
    .sort((a, b) => a.priority - b.priority)
    .map((record) => `${record.priority} ${record.exchange}`)
    .join(", ");
  return [finding("PASS", "MX", `${records.length} MX públicos: ${ordered}.`)];
}

async function checkNs(domain: string): Promise<Finding[]> {
  let records: Awaited<ReturnType<typeof resolveNs>>;
  try {
    records = await resolveNs(domain);
  } catch (error) {
    if (isNoDnsData(error)) records = [];
    else throw error;
  }

  if (records.length === 0) {
    return [
      finding("FAIL", "NS", `no existen nameservers públicos para ${domain}.`),
    ];
  }

  const findings = [
    finding(
      "PASS",
      "NS",
      `${records.length} nameserver(s) público(s): ${records.sort().join(", ")}.`,
    ),
  ];
  if (records.length < 2) {
    findings.push(
      finding(
        "WARN",
        "NS",
        "solo se resolvió un nameserver; conviene mantener redundancia autoritativa.",
      ),
    );
  }
  return findings;
}

async function checkDomainAge(domain: string): Promise<Finding[]> {
  const label = "RDAP";
  if (!domain.endsWith(".com")) {
    return [
      finding(
        "WARN",
        label,
        "la consulta de antigüedad usa RDAP de Verisign para .com y no aplica a este TLD.",
      ),
    ];
  }

  try {
    const response = await fetch(
      `${VERISIGN_RDAP_BASE_URL}${encodeURIComponent(domain.toUpperCase())}`,
      {
        headers: { accept: "application/rdap+json" },
        signal: AbortSignal.timeout(10_000),
      },
    );
    if (!response.ok) {
      return [
        finding(
          "WARN",
          label,
          `Verisign RDAP respondió HTTP ${response.status}; no se pudo confirmar la antigüedad.`,
        ),
      ];
    }

    const rdap = (await response.json()) as RdapDomain;
    const events = Array.isArray(rdap.events)
      ? (rdap.events as RdapEvent[])
      : [];
    const registration = events.find(
      (event) => event.eventAction === "registration",
    );
    if (typeof registration?.eventDate !== "string") {
      return [
        finding(
          "WARN",
          label,
          "Verisign RDAP no devolvió una fecha de registro utilizable.",
        ),
      ];
    }

    const registeredAt = new Date(registration.eventDate);
    const registeredAtMs = registeredAt.getTime();
    if (!Number.isFinite(registeredAtMs)) {
      return [
        finding(
          "WARN",
          label,
          `Verisign RDAP devolvió una fecha inválida: ${registration.eventDate}.`,
        ),
      ];
    }

    const ageDays = Math.floor((Date.now() - registeredAtMs) / DAY_IN_MS);
    if (ageDays < 0) {
      return [
        finding(
          "WARN",
          label,
          `la fecha pública de registro está en el futuro (${registeredAt.toISOString()}).`,
        ),
      ];
    }
    if (ageDays < 90) {
      return [
        finding(
          "WARN",
          label,
          `dominio registrado el ${registeredAt.toISOString().slice(0, 10)}: ${ageDays} días de antigüedad (<90), señal reputacional que DNS no corrige por sí solo.`,
        ),
      ];
    }

    return [
      finding(
        "PASS",
        label,
        `dominio registrado el ${registeredAt.toISOString().slice(0, 10)}: ${ageDays} días de antigüedad.`,
      ),
    ];
  } catch (error) {
    return [
      finding(
        "WARN",
        label,
        `no se pudo consultar Verisign RDAP: ${errorMessage(error)}.`,
      ),
    ];
  }
}

async function essentialCheck(
  label: string,
  check: () => Promise<Finding[]>,
): Promise<Finding[]> {
  try {
    return await check();
  } catch (error) {
    return [
      finding(
        "FAIL",
        label,
        `no se pudo verificar mediante DNS público: ${errorMessage(error)}.`,
      ),
    ];
  }
}

async function runSpfSelfTests(): Promise<void> {
  const tenLookups = Array.from(
    { length: MAX_SPF_DNS_LOOKUPS },
    (_, index) => `exists:lookup-${index + 1}.example.test`,
  ).join(" ");
  const elevenLookups = `${tenLookups} exists:lookup-11.example.test`;
  const cases: Array<{
    name: string;
    records: Record<string, string[]>;
    expectFailure: boolean;
    expectedMessage?: RegExp;
  }> = [
    {
      name: "include válido y resoluble",
      records: {
        "example.test": ["v=spf1 include:_spf.example.test -all"],
        "_spf.example.test": ["v=spf1 ip4:192.0.2.0/24 -all"],
      },
      expectFailure: false,
    },
    {
      name: "include sin SPF",
      records: {
        "example.test": ["v=spf1 include:_missing.example.test -all"],
      },
      expectFailure: true,
      expectedMessage:
        /_missing\.example\.test: no publica exactamente un TXT SPF/,
    },
    {
      name: "redirect sin SPF",
      records: {
        "example.test": ["v=spf1 redirect=_missing.example.test"],
      },
      expectFailure: true,
      expectedMessage:
        /_missing\.example\.test: no publica exactamente un TXT SPF/,
    },
    {
      name: "redirect válido con política efectiva",
      records: {
        "example.test": ["v=spf1 redirect=_spf.example.test"],
        "_spf.example.test": ["v=spf1 ip4:192.0.2.0/24 -all"],
      },
      expectFailure: false,
    },
    {
      name: "redirect efectivo con +all inseguro",
      records: {
        "example.test": ["v=spf1 redirect=_spf.example.test"],
        "_spf.example.test": ["v=spf1 +all"],
      },
      expectFailure: true,
      expectedMessage: /la política \+all autoriza a cualquier emisor/,
    },
    {
      name: "IPv4 inválida",
      records: {
        "example.test": ["v=spf1 ip4:999.0.2.1 -all"],
      },
      expectFailure: true,
      expectedMessage: /no contiene una IPv4 válida/,
    },
    {
      name: "sintaxis inválida dentro de include",
      records: {
        "example.test": ["v=spf1 include:_spf.example.test -all"],
        "_spf.example.test": ["v=spf1 mecanismo-inexistente -all"],
      },
      expectFailure: true,
      expectedMessage: /mecanismo o sintaxis SPF no reconocida/,
    },
    {
      name: "ciclo include/redirect",
      records: {
        "example.test": ["v=spf1 include:_spf.example.test -all"],
        "_spf.example.test": ["v=spf1 redirect=example.test"],
      },
      expectFailure: true,
      expectedMessage: /ciclo SPF detectado/,
    },
    {
      name: "presupuesto exacto de 10 términos DNS",
      records: {
        "example.test": [`v=spf1 ${tenLookups} -all`],
      },
      expectFailure: false,
    },
    {
      name: "límite de 10 términos DNS excedido",
      records: {
        "example.test": [`v=spf1 ${elevenLookups} -all`],
      },
      expectFailure: true,
      expectedMessage: /excede el límite SPF de 10/,
    },
    {
      name: "límite excedido a través de include",
      records: {
        "example.test": [
          "v=spf1 exists:one.example.test exists:two.example.test exists:three.example.test exists:four.example.test exists:five.example.test include:_spf.example.test -all",
        ],
        "_spf.example.test": [
          "v=spf1 exists:six.example.test exists:seven.example.test exists:eight.example.test exists:nine.example.test exists:ten.example.test -all",
        ],
      },
      expectFailure: true,
      expectedMessage: /excede el límite SPF de 10/,
    },
    {
      name: "include dinámico no verificable",
      records: {
        "example.test": ["v=spf1 include:%{d}.example.test -all"],
      },
      expectFailure: true,
      expectedMessage: /usa macros; este control estático no puede resolverlas/,
    },
  ];

  for (const testCase of cases) {
    const findings = await checkSpf(
      "example.test",
      "SPF self-test",
      async (host) => testCase.records[host] ?? [],
    );
    const failures = findings.filter((item) => item.status === "FAIL");
    const passes = findings.filter((item) => item.status === "PASS");
    const combinedFailures = failures.map((item) => item.message).join("\n");

    if (testCase.expectFailure && failures.length === 0) {
      throw new Error(
        `Self-test "${testCase.name}": se esperaba FAIL y no ocurrió.`,
      );
    }
    if (!testCase.expectFailure && failures.length > 0) {
      throw new Error(
        `Self-test "${testCase.name}": FAIL inesperado: ${combinedFailures}`,
      );
    }
    if (testCase.expectFailure && passes.length > 0) {
      throw new Error(
        `Self-test "${testCase.name}": no debe emitir PASS junto con FAIL.`,
      );
    }
    if (
      testCase.expectedMessage &&
      !testCase.expectedMessage.test(combinedFailures)
    ) {
      throw new Error(
        `Self-test "${testCase.name}": no apareció el diagnóstico esperado. Recibido: ${combinedFailures}`,
      );
    }

    console.log(`[SELF-TEST PASS] ${testCase.name}`);
  }

  console.log(
    `Self-tests SPF completados: ${cases.length}/${cases.length} escenarios correctos; no se consultó DNS.`,
  );
}

function printHelp(): void {
  console.log(`Uso:
  npm run email:deliverability:check
  npm run email:deliverability:check -- [opciones]

Opciones:
  --domain <dominio>          Dominio From (default: ${DEFAULT_DOMAIN})
  --return-path <dominio>     Host SPF del Return-Path (default: ${DEFAULT_RETURN_PATH})
  --dkim-selector <selector>  Selector DKIM; puede repetirse (default: ${DEFAULT_DKIM_SELECTORS[0]})
  --self-test                 Ejecutar pruebas SPF deterministas sin consultar la red
  --help                      Mostrar esta ayuda

La comprobación solo lee DNS público y RDAP de Verisign. No carga .env,
no usa secretos, no cambia DNS y no envía correos.`);
}

async function main(): Promise<void> {
  const { values } = parseArgs({
    options: {
      domain: { type: "string" },
      "return-path": { type: "string" },
      "dkim-selector": { type: "string", multiple: true },
      "self-test": { type: "boolean", default: false },
      help: { type: "boolean", default: false },
    },
    strict: true,
    allowPositionals: false,
  });

  if (values.help) {
    printHelp();
    return;
  }

  if (values["self-test"]) {
    await runSpfSelfTests();
    return;
  }

  const domain = normalizeDomain(values.domain || DEFAULT_DOMAIN, "--domain");
  const returnPath = normalizeDomain(
    values["return-path"] || DEFAULT_RETURN_PATH,
    "--return-path",
  );
  const selectors = (values["dkim-selector"] || DEFAULT_DKIM_SELECTORS).flatMap(
    (value) => value.split(",").map(normalizeSelector),
  );

  if (selectors.length === 0) {
    throw new Error("Debes indicar al menos un selector DKIM.");
  }

  console.log("Comprobación read-only de entregabilidad de correo");
  console.log(`Dominio From: ${domain}`);
  console.log(`Return-Path SPF: ${returnPath}`);
  console.log(`Selector(es) DKIM: ${selectors.join(", ")}`);
  console.log("");

  const groupedFindings = await Promise.all([
    essentialCheck("SPF raíz", () => checkSpf(domain, "SPF raíz")),
    essentialCheck("SPF Return-Path", () =>
      checkSpf(returnPath, "SPF Return-Path"),
    ),
    ...selectors.map((selector) =>
      essentialCheck(`DKIM ${selector}`, () => checkDkim(domain, selector)),
    ),
    essentialCheck("DMARC", () => checkDmarc(domain)),
    essentialCheck("MX", () => checkMx(domain)),
    essentialCheck("NS", () => checkNs(domain)),
    checkDomainAge(domain),
  ]);
  const findings = groupedFindings.flat();

  for (const item of findings) {
    console.log(`[${item.status}] ${item.check}: ${item.message}`);
  }

  const failures = findings.filter((item) => item.status === "FAIL").length;
  const warnings = findings.filter((item) => item.status === "WARN").length;
  const passes = findings.filter((item) => item.status === "PASS").length;

  console.log("");
  console.log(
    `Resumen: ${passes} OK, ${warnings} advertencia(s), ${failures} falla(s) esencial(es).`,
  );
  console.log(
    "Solo lectura confirmado: no se cargaron secretos/.env, no se cambió DNS y no se envió correo.",
  );
  console.log(
    'Un evento "delivered" confirma aceptación por el servidor receptor, no la carpeta Inbox.',
  );
  console.log(
    "Para diagnosticar el incidente real hace falta el archivo original .eml, conservado de forma privada.",
  );

  process.exitCode = failures > 0 ? 1 : 0;
}

main().catch((error) => {
  console.error(`[ERROR] ${errorMessage(error)}`);
  console.error(
    "Error de uso o ejecución interna; no se realizó ningún cambio.",
  );
  process.exitCode = 2;
});
