import { createHash, createHmac } from "node:crypto";
import { z } from "zod";

export const QUOTATION_FROM = "Casa Atenta <info@casa-atenta.com>";
export const QUOTATION_REPLY_TO = "info@casa-atenta.com";
export const QUOTATION_MAX_PDF_BYTES = 4 * 1024 * 1024;
export const QUOTATION_SEND_TIMEOUT_MS = 15_000;
export const QUOTATION_TEMPLATE_VERSION = "quotation-v2-2026-07-28";
export const QUOTATION_PRODUCTION_CONFIRMATION_PREFIX = "CONFIRMAR ENVIO";

const singleLine = (minimum: number, maximum: number) =>
  z
    .string()
    .trim()
    .min(minimum)
    .max(maximum)
    .refine((value) => !/[\r\n\u0000-\u001f\u007f]/u.test(value), {
      message: "Debe ser texto en una sola línea.",
    });

const recipientSchema = z.string().trim().toLowerCase().email().max(254);
const corporateRenderHosts = new Set([
  "casa-atenta.com",
  "www.casa-atenta.com",
]);
const GOOGLE_DRIVE_RENDER_HOST = "drive.google.com";
const renderLinkSchema = z
  .string()
  .trim()
  .max(1000)
  .url({ message: "El enlace del render debe ser una URL válida." })
  .refine(
    (value) => {
      try {
        const url = new URL(value);
        return (
          url.protocol === "https:" &&
          url.username.length === 0 &&
          url.password.length === 0
        );
      } catch {
        return false;
      }
    },
    {
      message:
        "El enlace del render debe usar HTTPS y no puede incluir credenciales.",
    },
  );

const quotationEmailDataBaseSchema = z
  .object({
    treatment: z.enum([
      "Sr.",
      "Sra.",
      "Srta.",
      "Dr.",
      "Dra.",
      "Arq.",
      "Ing.",
      "Lic.",
    ]),
    clientName: singleLine(2, 120),
    quotationNumber: singleLine(3, 40).regex(/^[A-Za-z0-9-]+$/u, {
      message: "Usa únicamente letras, números y guiones.",
    }),
    project: singleLine(3, 240),
    location: singleLine(2, 160),
    total: z.coerce.number().finite().positive().max(10_000_000),
    recipients: z
      .array(recipientSchema)
      .min(1)
      .max(10)
      .transform((recipients) => [...new Set(recipients)]),
    isTest: z.boolean(),
    productionDocumentConfirmed: z.boolean(),
    productionConfirmation: z.string().trim().max(100).optional(),
    renderLink: renderLinkSchema.optional(),
    subject: singleLine(1, 200).optional(),
    deliveryMessage: singleLine(1, 500).optional(),
    closingMessage: singleLine(1, 240).optional(),
  })
  .strict();

export type QuotationEmailData = z.infer<typeof quotationEmailDataBaseSchema>;

export function parseQuotationRecipients(value: string) {
  const recipients = value
    .split(/[\s,;]+/u)
    .map((recipient) => recipient.trim())
    .filter(Boolean);
  return z
    .array(recipientSchema)
    .min(1)
    .max(10)
    .transform((items) => [...new Set(items)])
    .parse(recipients);
}

export function createQuotationEmailDataSchema(
  testRecipients: readonly string[],
  productionEnabled = false,
) {
  const allowedTestRecipients = new Set(
    testRecipients.map((recipient) => recipientSchema.parse(recipient)),
  );
  if (allowedTestRecipients.size === 0) {
    throw new Error("La allowlist de pruebas no puede estar vacía.");
  }

  return quotationEmailDataBaseSchema.superRefine((data, context) => {
    if (data.isTest) {
      data.recipients.forEach((recipient, index) => {
        if (!allowedTestRecipients.has(recipient)) {
          context.addIssue({
            code: "custom",
            path: ["recipients", index],
            message: "El destinatario no pertenece a la allowlist de pruebas.",
          });
        }
      });
      return;
    }

    if (!productionEnabled) {
      context.addIssue({
        code: "custom",
        path: ["isTest"],
        message: "Los envíos de producción están deshabilitados.",
      });
    }

    if (data.renderLink) {
      const renderUrl = new URL(data.renderLink);
      const renderHost = renderUrl.hostname.toLowerCase();
      const isCorporateRender = corporateRenderHosts.has(renderHost);
      const isGoogleDriveRender =
        renderHost === GOOGLE_DRIVE_RENDER_HOST &&
        (/^\/drive\/folders\/[^/]+/u.test(renderUrl.pathname) ||
          /^\/file\/d\/[^/]+/u.test(renderUrl.pathname));
      if (!isCorporateRender && !isGoogleDriveRender) {
        context.addIssue({
          code: "custom",
          path: ["renderLink"],
          message:
            "Producción solo admite renders alojados en casa-atenta.com o enlaces directos de Google Drive.",
        });
      }
    }

    const expected = productionConfirmationFor(data.quotationNumber);
    if (!data.productionDocumentConfirmed) {
      context.addIssue({
        code: "custom",
        path: ["productionDocumentConfirmed"],
        message:
          "Confirma que revisaste destinatario, alcance, importes y metadatos del PDF.",
      });
    }
    if (data.productionConfirmation !== expected) {
      context.addIssue({
        code: "custom",
        path: ["productionConfirmation"],
        message: `Escribe exactamente: ${expected}`,
      });
    }
  });
}

export type QuotationPdfInput = {
  name: string;
  type: string;
  size: number;
  bytes: Uint8Array;
};

export type ValidatedQuotationPdf = QuotationPdfInput & {
  digest: string;
};

export class QuotationValidationError extends Error {
  constructor(
    message: string,
    readonly code:
      | "EMPTY_PDF"
      | "PDF_TOO_LARGE"
      | "INVALID_EXTENSION"
      | "INVALID_FILENAME"
      | "INVALID_MIME"
      | "INVALID_PDF_SIGNATURE"
      | "INVALID_PDF_SIZE"
      | "DUPLICATE_PDF",
  ) {
    super(message);
    this.name = "QuotationValidationError";
  }
}

export function productionConfirmationFor(quotationNumber: string) {
  return `${QUOTATION_PRODUCTION_CONFIRMATION_PREFIX} ${quotationNumber}`;
}

export function quotationSubject(data: Pick<QuotationEmailData, "subject">) {
  return (
    data.subject || "Propuesta técnica y render de su proyecto | Casa Atenta"
  );
}

export function quotationPreheader(
  data: Pick<QuotationEmailData, "quotationNumber" | "location">,
) {
  const locality = data.location.split(",", 1)[0]?.trim() || data.location;
  return `Propuesta técnica N.° ${data.quotationNumber} preparada para su proyecto en ${locality}.`;
}

export function quotationAttachmentFilename(quotationNumber: string) {
  const safeNumber = quotationNumber.replace(/[^A-Za-z0-9-]/gu, "-");
  return `Casa-Atenta-Cotizacion-${safeNumber}.pdf`;
}

export function quotationDocumentsAuditFilename(quotationNumber: string) {
  const safeNumber = quotationNumber.replace(/[^A-Za-z0-9-]/gu, "-");
  return `Casa-Atenta-Documentos-${safeNumber}.pdf`;
}

export function validateQuotationPdf(
  input: QuotationPdfInput,
): ValidatedQuotationPdf {
  const normalizedName = input.name.normalize("NFC").trim();
  if (
    !Number.isSafeInteger(input.size) ||
    input.size <= 0 ||
    input.bytes.length === 0
  ) {
    throw new QuotationValidationError("El PDF está vacío.", "EMPTY_PDF");
  }
  if (
    normalizedName.length < 5 ||
    normalizedName.length > 255 ||
    /[\\/\r\n\u0000-\u001f\u007f]/u.test(normalizedName)
  ) {
    throw new QuotationValidationError(
      "El nombre del archivo PDF no es válido.",
      "INVALID_FILENAME",
    );
  }
  if (input.size > QUOTATION_MAX_PDF_BYTES) {
    throw new QuotationValidationError(
      "El PDF supera el límite de 4 MiB.",
      "PDF_TOO_LARGE",
    );
  }
  if (input.size !== input.bytes.byteLength) {
    throw new QuotationValidationError(
      "El tamaño declarado no coincide con el archivo recibido.",
      "INVALID_PDF_SIZE",
    );
  }
  if (!normalizedName.toLowerCase().endsWith(".pdf")) {
    throw new QuotationValidationError(
      "El archivo debe usar la extensión .pdf.",
      "INVALID_EXTENSION",
    );
  }
  if (input.type.toLowerCase() !== "application/pdf") {
    throw new QuotationValidationError(
      "El archivo debe declarar el MIME application/pdf.",
      "INVALID_MIME",
    );
  }

  const signature = [0x25, 0x50, 0x44, 0x46, 0x2d];
  if (signature.some((byte, index) => input.bytes[index] !== byte)) {
    throw new QuotationValidationError(
      "La firma binaria no corresponde a un PDF.",
      "INVALID_PDF_SIGNATURE",
    );
  }

  return {
    ...input,
    name: normalizedName,
    digest: createHash("sha256").update(input.bytes).digest("hex"),
  };
}

export function normalizeRecipient(recipient: string) {
  return recipient.trim().toLowerCase();
}

export function maskEmail(recipient: string) {
  const normalized = normalizeRecipient(recipient);
  const [local = "", domain = ""] = normalized.split("@");
  const domainParts = domain.split(".");
  const domainName = domainParts.shift() || "";
  const suffix = domainParts.length > 0 ? `.${domainParts.join(".")}` : "";
  const visibleLocal = local.slice(0, Math.min(2, local.length));
  const visibleDomain = domainName.slice(0, 1);
  return `${visibleLocal}***@${visibleDomain}***${suffix}`;
}

export function recipientFingerprint(recipient: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`quotation-recipient:v1:${normalizeRecipient(recipient)}`)
    .digest("hex");
}

export function sanitizeTagValue(value: string) {
  const sanitized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/gu, "")
    .replace(/[^A-Za-z0-9_-]+/gu, "-")
    .replace(/^-+|-+$/gu, "")
    .slice(0, 256);
  return sanitized || "unknown";
}

export function quotationTags(
  data: Pick<QuotationEmailData, "quotationNumber" | "isTest">,
) {
  return [
    { name: "category", value: "quotation" },
    { name: "quotation", value: sanitizeTagValue(data.quotationNumber) },
    { name: "mode", value: data.isTest ? "test" : "production" },
  ];
}

export function createQuotationIdempotencyKey(input: {
  quotationNumber: string;
  recipient: string;
  isTest: boolean;
  attachmentDigest: string;
  contentDigest: string;
}) {
  const digest = createHash("sha256")
    .update(
      [
        QUOTATION_TEMPLATE_VERSION,
        input.quotationNumber.trim().toLowerCase(),
        normalizeRecipient(input.recipient),
        input.isTest ? "test" : "production",
        input.attachmentDigest,
        input.contentDigest,
      ].join(":"),
    )
    .digest("hex");
  return `quotation-${digest}`;
}

export function contentDigest(content: {
  subject: string;
  html: string;
  text: string;
}) {
  return createHash("sha256")
    .update(`${content.subject}\n${content.html}\n${content.text}`)
    .digest("hex");
}

export function sanitizeDeliveryError(error: unknown) {
  const raw =
    error instanceof Error
      ? error.message
      : String(error ?? "Error desconocido");
  return raw
    .normalize("NFC")
    .replace(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/gu, "[correo oculto]")
    .replace(
      /\b(?:re_|sb_secret_|sbp_)[A-Za-z0-9_-]{8,}\b/gu,
      "[secreto oculto]",
    )
    .replace(/\bBearer\s+[A-Za-z0-9._~-]+/giu, "Bearer [secreto oculto]")
    .replace(/\/(?:home|Users)\/[^\s]+/gu, "[ruta local oculta]")
    .replace(/[A-Za-z0-9+/=_-]{80,}/gu, "[contenido oculto]")
    .replace(/[\u0000-\u001f\u007f]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, 300);
}
