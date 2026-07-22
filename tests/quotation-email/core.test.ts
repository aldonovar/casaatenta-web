import assert from "node:assert/strict";
import test from "node:test";
import {
  QUOTATION_MAX_PDF_BYTES,
  QuotationValidationError,
  contentDigest,
  createQuotationEmailDataSchema,
  createQuotationIdempotencyKey,
  maskEmail,
  quotationPreheader,
  quotationSubject,
  sanitizeDeliveryError,
  validateQuotationPdf,
  type QuotationEmailData,
} from "../../src/lib/quotation-email/core";
import { quotationDeliveryEmail } from "../../src/lib/server/email";

const validData: QuotationEmailData = {
  treatment: "Dra.",
  clientName: "Elena Vargas",
  quotationNumber: "DEMO-0001",
  project: "Cobertura de terraza",
  location: "Miraflores, Lima",
  total: 5_000,
  recipients: ["internal-one@example.com", "internal-two@example.com"],
  isTest: true,
  productionDocumentConfirmed: false,
};
const quotationEmailDataSchema = createQuotationEmailDataSchema(
  validData.recipients,
);

function pdfInput(
  overrides: Partial<Parameters<typeof validateQuotationPdf>[0]> = {},
) {
  const bytes = new TextEncoder().encode("%PDF-1.4\nquotation-test");
  return {
    name: "quotation.pdf",
    type: "application/pdf",
    size: bytes.byteLength,
    bytes,
    ...overrides,
  };
}

test("usa el tratamiento profesional Dra. en HTML y texto plano", () => {
  const template = quotationDeliveryEmail(validData);
  assert.match(template.html, /Estimada Dra\. Elena Vargas:/u);
  assert.match(
    template.text,
    /^PRUEBA INTERNA[\s\S]*Estimada Dra\. Elena Vargas:/u,
  );
  assert.doesNotMatch(template.text, /Doctora/u);
});

test("construye asunto y preheader exactos para la prueba", () => {
  assert.equal(
    quotationSubject(validData),
    "[PRUEBA INTERNA] Propuesta técnica y render de su proyecto | Casa Atenta",
  );
  assert.equal(
    quotationPreheader(validData),
    "Propuesta técnica N.° DEMO-0001 preparada para su proyecto en Miraflores.",
  );
});

test("la allowlist de prueba rechaza cualquier destinatario adicional", () => {
  const result = quotationEmailDataSchema.safeParse({
    ...validData,
    recipients: [...validData.recipients, "cliente@example.com"],
  });
  assert.equal(result.success, false);
});

test("isTest es obligatorio y producción exige dos confirmaciones explícitas", () => {
  const missingMode = quotationEmailDataSchema.safeParse({
    ...validData,
    isTest: undefined,
  });
  assert.equal(missingMode.success, false);

  const unsafeProduction = quotationEmailDataSchema.safeParse({
    ...validData,
    isTest: false,
    recipients: ["cliente@example.com"],
    productionDocumentConfirmed: false,
  });
  assert.equal(unsafeProduction.success, false);

  const productionDisabled = quotationEmailDataSchema.safeParse({
    ...validData,
    isTest: false,
    recipients: ["client@example.com"],
    productionDocumentConfirmed: true,
    productionConfirmation: "CONFIRMAR ENVIO DEMO-0001",
  });
  assert.equal(productionDisabled.success, false);

  const production = createQuotationEmailDataSchema(
    validData.recipients,
    true,
  ).safeParse({
    ...validData,
    isTest: false,
    recipients: ["client@example.com"],
    productionDocumentConfirmed: true,
    productionConfirmation: `CONFIRMAR ENVIO ${validData.quotationNumber}`,
  });
  assert.equal(production.success, true);
});

test("acepta un PDF con extensión, MIME, tamaño y firma válidos", () => {
  const pdf = validateQuotationPdf(pdfInput());
  assert.equal(pdf.digest.length, 64);
});

test("rechaza un PDF mayor a 4 MiB", () => {
  const bytes = new Uint8Array(QUOTATION_MAX_PDF_BYTES + 1);
  bytes.set(new TextEncoder().encode("%PDF-"));
  assert.throws(
    () => validateQuotationPdf(pdfInput({ bytes, size: bytes.byteLength })),
    (error) =>
      error instanceof QuotationValidationError &&
      error.code === "PDF_TOO_LARGE",
  );
});

test("rechaza MIME y firma binaria inválidos", () => {
  assert.throws(
    () => validateQuotationPdf(pdfInput({ type: "image/png" })),
    (error) =>
      error instanceof QuotationValidationError &&
      error.code === "INVALID_MIME",
  );
  const bytes = new TextEncoder().encode("not-a-pdf");
  assert.throws(
    () => validateQuotationPdf(pdfInput({ bytes, size: bytes.byteLength })),
    (error) =>
      error instanceof QuotationValidationError &&
      error.code === "INVALID_PDF_SIGNATURE",
  );
});

test("sanitiza correos, secretos, rutas y contenido largo de los errores", () => {
  const secret = `re_${"a".repeat(40)}`;
  const raw = `Falló cliente@example.com con ${secret} en /home/persona/private.pdf ${"A".repeat(100)}`;
  const sanitized = sanitizeDeliveryError(new Error(raw));
  assert.doesNotMatch(
    sanitized,
    /cliente@example\.com|re_aaaa|\/home\/persona/u,
  );
  assert.match(sanitized, /correo oculto|secreto oculto|ruta local oculta/u);
});

test("escapa nombre y ubicación con markup antes de construir el HTML", () => {
  const maliciousData = quotationEmailDataSchema.parse({
    ...validData,
    clientName: '<img src=x onerror="alert(1)">',
    location: "<script>alert(2)</script>, Lima",
  });
  const template = quotationDeliveryEmail(maliciousData);

  assert.doesNotMatch(template.html, /<img src=x onerror=/u);
  assert.doesNotMatch(template.html, /<script>alert\(2\)<\/script>/u);
  assert.match(
    template.html,
    /Estimada Dra\. &lt;img src=x onerror=&quot;alert\(1\)&quot;&gt;:/u,
  );
  assert.match(
    template.html,
    /proyecto en &lt;script&gt;alert\(2\)&lt;\/script&gt;\./u,
  );
});

test("rechaza números de cotización con CRLF o markup", () => {
  for (const quotationNumber of [
    "DEMO-0001\r\nBcc: attacker@example.com",
    "<script>alert(1)</script>",
  ]) {
    const result = quotationEmailDataSchema.safeParse({
      ...validData,
      quotationNumber,
    });
    assert.equal(result.success, false);
  }
});

test("la alternativa de texto plano contiene contenido y firma corporativa", () => {
  const template = quotationDeliveryEmail(validData);
  assert.match(template.text, /Tal como conversamos/u);
  assert.match(template.text, /alcance del proyecto/u);
  assert.match(template.text, /Reciba un cordial saludo\./u);
  assert.match(template.text, /Equipo Casa Atenta/u);
  assert.match(template.text, /info@casa-atenta\.com/u);
  assert.match(template.text, /\+51 908 550 942/u);
  assert.match(template.text, /www\.casa-atenta\.com/u);
});

test("la idempotencia es estable y cambia por destinatario o contenido", () => {
  const template = quotationDeliveryEmail(validData);
  const base = {
    quotationNumber: validData.quotationNumber,
    recipient: validData.recipients[0],
    isTest: true,
    attachmentDigest: "a".repeat(64),
    contentDigest: contentDigest(template),
  };
  const first = createQuotationIdempotencyKey(base);
  assert.equal(first, createQuotationIdempotencyKey(base));
  assert.notEqual(
    first,
    createQuotationIdempotencyKey({
      ...base,
      recipient: validData.recipients[1],
    }),
  );
  assert.notEqual(
    first,
    createQuotationIdempotencyKey({ ...base, contentDigest: "b".repeat(64) }),
  );
  assert.ok(first.length <= 256);
});

test("el enmascarado no expone la dirección completa", () => {
  const masked = maskEmail("internal-one@example.com");
  assert.equal(masked, "in***@e***.com");
  assert.doesNotMatch(masked, /internal-one|example/u);
});

test("incluye el enlace del render si está presente en los datos", () => {
  const dataWithLink = {
    ...validData,
    renderLink: "https://drive.google.com/drive/folders/1c6s7DunZcUW5x7Lgrnu99OEe_i5YGDEE?usp=sharing",
  };
  const template = quotationDeliveryEmail(dataWithLink);

  assert.match(
    template.html,
    /href="https:\/\/drive\.google\.com\/drive\/folders\/1c6s7DunZcUW5x7Lgrnu99OEe_i5YGDEE\?usp=sharing"/u,
  );
  assert.match(template.html, /render referencial correspondiente/u);
  assert.match(template.html, /Ver render referencial/u);

  assert.match(
    template.text,
    /render referencial correspondiente: https:\/\/drive\.google\.com\/drive\/folders\/1c6s7DunZcUW5x7Lgrnu99OEe_i5YGDEE\?usp=sharing/u,
  );
});

test("utiliza un asunto personalizado si está presente", () => {
  const dataWithSubject = {
    ...validData,
    subject: "Cotización proyecto Barranco",
  };
  const template = quotationDeliveryEmail(dataWithSubject);
  assert.equal(template.subject, "[PRUEBA INTERNA] Cotización proyecto Barranco");
});
