import "server-only";

const placeholderPattern =
  /(?:REPLACE|YOUR_|CHANGEME|PLACEHOLDER|example|dummy|sk_test|pk_test)/i;

export function assertSecretValue(
  name: string,
  value: string | undefined,
  minimumBytes = 32,
) {
  const normalized = value?.trim() || "";
  if (
    Buffer.byteLength(normalized, "utf8") < minimumBytes ||
    placeholderPattern.test(normalized)
  ) {
    throw new Error(`${name} no contiene un secreto productivo válido.`);
  }
  return normalized;
}

function assertConfiguredValue(
  name: string,
  value: string | undefined,
  minimumLength = 4,
) {
  const normalized = value?.trim() || "";
  if (
    normalized.length < minimumLength ||
    normalized.length > 512 ||
    placeholderPattern.test(normalized)
  ) {
    throw new Error(`${name} no contiene una configuración productiva válida.`);
  }
  return normalized;
}

function assertHttpsUrl(name: string, value: string | undefined, host: string) {
  try {
    const url = new URL(value || "");
    if (
      url.protocol !== "https:" ||
      url.hostname !== host ||
      url.port ||
      url.username ||
      url.password ||
      (url.pathname !== "/" && url.pathname !== "") ||
      url.search ||
      url.hash
    ) {
      throw new Error("invalid_url");
    }
  } catch {
    throw new Error(`${name} no contiene la URL HTTPS canónica.`);
  }
}

function assertHttpsOrigin(name: string, value: string | undefined) {
  try {
    const url = new URL(value || "");
    if (
      url.protocol !== "https:" ||
      url.username ||
      url.password ||
      url.port ||
      (url.pathname !== "/" && url.pathname !== "") ||
      url.search ||
      url.hash ||
      placeholderPattern.test(url.hostname)
    ) {
      throw new Error("invalid_origin");
    }
    return url.origin;
  } catch {
    throw new Error(`${name} no contiene un origen HTTPS válido.`);
  }
}

export function assertLiveCommerceConfig() {
  const serverMode = process.env.STORE_MODE || "preview";
  const publicMode = process.env.NEXT_PUBLIC_STORE_MODE || "preview";
  if (serverMode !== "live" || publicMode !== "live") {
    throw new Error(
      "STORE_MODE y NEXT_PUBLIC_STORE_MODE deben estar ambos en live para ejecutar comercio.",
    );
  }
  if (
    process.env.OPENPAY_ENVIRONMENT !== "production" ||
    process.env.NEXT_PUBLIC_OPENPAY_ENVIRONMENT !== "production"
  ) {
    throw new Error("Una tienda live exige Openpay production en cliente y servidor.");
  }

  assertHttpsUrl(
    "NEXT_PUBLIC_STORE_URL",
    process.env.NEXT_PUBLIC_STORE_URL,
    "tienda.casa-atenta.com",
  );
  const publicSupabaseOrigin = assertHttpsOrigin(
    "NEXT_PUBLIC_SUPABASE_URL",
    process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  const serverSupabaseOrigin = assertHttpsOrigin(
    "SUPABASE_URL",
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  );
  if (publicSupabaseOrigin !== serverSupabaseOrigin) {
    throw new Error("Supabase público y servidor deben apuntar al mismo proyecto.");
  }

  const publicMerchantId = assertConfiguredValue(
    "NEXT_PUBLIC_OPENPAY_MERCHANT_ID",
    process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID,
    8,
  );
  const privateMerchantId = assertConfiguredValue(
    "OPENPAY_MERCHANT_ID",
    process.env.OPENPAY_MERCHANT_ID,
    8,
  );
  if (publicMerchantId !== privateMerchantId) {
    throw new Error("El merchant ID público y privado de Openpay no coincide.");
  }
  assertConfiguredValue(
    "NEXT_PUBLIC_OPENPAY_PUBLIC_KEY",
    process.env.NEXT_PUBLIC_OPENPAY_PUBLIC_KEY,
    12,
  );
  const turnstileHosts = new Set(
    (process.env.STORE_TURNSTILE_ALLOWED_HOSTNAMES || "")
      .split(",")
      .map((hostname) => hostname.trim().toLowerCase())
      .filter(Boolean),
  );
  if (
    turnstileHosts.size !== 1 ||
    !turnstileHosts.has("tienda.casa-atenta.com")
  ) {
    throw new Error("STORE_TURNSTILE_ALLOWED_HOSTNAMES debe contener solo el host canónico de la tienda.");
  }
  assertConfiguredValue(
    "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    20,
  );
  const storeTurnstileSiteKey = assertConfiguredValue(
    "NEXT_PUBLIC_STORE_TURNSTILE_SITE_KEY",
    process.env.NEXT_PUBLIC_STORE_TURNSTILE_SITE_KEY,
    10,
  );
  if (/^[123]x0{12,}/i.test(storeTurnstileSiteKey)) {
    throw new Error("La tienda live no admite claves de prueba de Turnstile.");
  }
  assertConfiguredValue(
    "OPENPAY_WEBHOOK_USERNAME",
    process.env.OPENPAY_WEBHOOK_USERNAME,
    12,
  );
  assertConfiguredValue(
    "STORE_RESEND_FROM_EMAIL",
    process.env.STORE_RESEND_FROM_EMAIL,
    8,
  );
  assertConfiguredValue(
    "STORE_NOTIFICATION_REPLY_TO",
    process.env.STORE_NOTIFICATION_REPLY_TO,
    6,
  );

  const storeTurnstileSecret = assertSecretValue(
    "STORE_TURNSTILE_SECRET_KEY",
    process.env.STORE_TURNSTILE_SECRET_KEY,
    20,
  );
  if (/^[123]x0{12,}/i.test(storeTurnstileSecret)) {
    throw new Error("La tienda live no admite el secret de prueba de Turnstile.");
  }
  const secrets = [
    assertSecretValue("SUPABASE_SECRET_KEY", process.env.SUPABASE_SECRET_KEY, 24),
    assertSecretValue("OPENPAY_PRIVATE_KEY", process.env.OPENPAY_PRIVATE_KEY, 16),
    assertSecretValue("OPENPAY_WEBHOOK_PASSWORD", process.env.OPENPAY_WEBHOOK_PASSWORD),
    assertSecretValue("STORE_GUEST_TRACKING_SECRET", process.env.STORE_GUEST_TRACKING_SECRET),
    assertSecretValue("RATE_LIMIT_SECRET", process.env.RATE_LIMIT_SECRET),
    assertSecretValue("CRON_SECRET", process.env.CRON_SECRET),
    assertSecretValue("RESEND_API_KEY", process.env.RESEND_API_KEY, 16),
    storeTurnstileSecret,
  ];
  if (new Set(secrets).size !== secrets.length) {
    throw new Error("Los secretos productivos de comercio deben ser independientes.");
  }

  for (const privateName of [
    "NEXT_PUBLIC_OPENPAY_PRIVATE_KEY",
    "NEXT_PUBLIC_SUPABASE_SECRET_KEY",
    "NEXT_PUBLIC_STORE_GUEST_TRACKING_SECRET",
    "NEXT_PUBLIC_CRON_SECRET",
    "NEXT_PUBLIC_RATE_LIMIT_SECRET",
    "NEXT_PUBLIC_TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_STORE_TURNSTILE_SECRET_KEY",
    "NEXT_PUBLIC_OPENPAY_WEBHOOK_PASSWORD",
  ]) {
    if (process.env[privateName]) {
      throw new Error(`${privateName} expone un secreto privado al navegador.`);
    }
  }
}
