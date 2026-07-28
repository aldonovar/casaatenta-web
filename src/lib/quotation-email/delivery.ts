import { createHash } from "node:crypto";
import type { Attachment } from "resend";
import {
  QUOTATION_MAX_PDF_BYTES,
  QuotationValidationError,
  createQuotationIdempotencyKey,
  maskEmail,
  normalizeRecipient,
  quotationAttachmentFilename,
  quotationDocumentsAuditFilename,
  quotationTags,
  recipientFingerprint,
  sanitizeDeliveryError,
  validateQuotationPdf,
  type QuotationEmailData,
  type QuotationPdfInput,
} from "./core";

export type QuotationEmailContent = {
  subject: string;
  html: string;
  text: string;
  digest: string;
};

export type QuotationProviderPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo: string;
  tags: Array<{ name: string; value: string }>;
  attachments: Attachment[];
};

export type QuotationProviderResponse = {
  data: { id?: string | null } | null;
  error: {
    message?: string | null;
    name?: string | null;
    statusCode?: number | null;
  } | null;
};

export type QuotationProviderSend = (
  payload: QuotationProviderPayload,
  options: { idempotencyKey: string; signal: AbortSignal },
) => Promise<QuotationProviderResponse>;

export type ReservedDelivery = {
  kind: "reserved";
};

export type DuplicateDelivery = {
  kind: "duplicate";
  status: string;
  resendEmailId: string | null;
};

export type BlockedRecipient = {
  kind: "blocked";
  status: "bounced" | "complained" | "suppressed";
};

export type QuotationDeliveryDependencies = {
  auditSecret: string;
  from: string;
  replyTo: string;
  timeoutMs: number;
  reserve: (input: {
    quotationNumber: string;
    isTest: boolean;
    recipientMasked: string;
    recipientFingerprint: string;
    attachmentFilename: string;
    attachmentBytes: number;
    idempotencyKey: string;
  }) => Promise<ReservedDelivery | DuplicateDelivery | BlockedRecipient>;
  markSent: (idempotencyKey: string, resendEmailId: string) => Promise<void>;
  markFailed: (idempotencyKey: string, sanitizedError: string) => Promise<void>;
  send: QuotationProviderSend;
};

export type QuotationDeliveryResult = {
  recipientIndex: number;
  recipientMasked: string;
  status:
    "sent" | "duplicate" | "blocked" | "failed" | "accepted_audit_pending";
  resendEmailId: string | null;
  existingStatus: string | null;
  requiresReview: boolean;
  message: string;
  idempotencyKey: string;
};

export class QuotationProviderError extends Error {
  constructor(
    message: string,
    readonly code:
      "PROVIDER_REJECTED" | "PROVIDER_UNCERTAIN" | "MISSING_ID" | "TIMEOUT",
  ) {
    super(message);
    this.name = "QuotationProviderError";
  }
}

export async function sendQuotationWithTimeout(
  send: QuotationProviderSend,
  payload: QuotationProviderPayload,
  idempotencyKey: string,
  timeoutMs: number,
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await send(payload, {
      idempotencyKey,
      signal: controller.signal,
    });
    if (controller.signal.aborted) {
      throw new QuotationProviderError(
        "Resend no respondió dentro del tiempo permitido.",
        "TIMEOUT",
      );
    }
    if (response.error) {
      const statusCode = response.error.statusCode;
      const definitiveClientRejection =
        typeof statusCode === "number" &&
        statusCode >= 400 &&
        statusCode < 500 &&
        ![408, 409, 425, 429].includes(statusCode);
      throw new QuotationProviderError(
        sanitizeDeliveryError(
          response.error.message || "Resend rechazó el envío.",
        ),
        definitiveClientRejection ? "PROVIDER_REJECTED" : "PROVIDER_UNCERTAIN",
      );
    }
    if (!response.data?.id) {
      throw new QuotationProviderError(
        "Resend no devolvió un identificador.",
        "MISSING_ID",
      );
    }
    return response.data.id;
  } catch (error) {
    if (controller.signal.aborted) {
      throw new QuotationProviderError(
        "Resend no respondió dentro del tiempo permitido.",
        "TIMEOUT",
      );
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliverQuotationRecipients(input: {
  data: QuotationEmailData;
  pdf: QuotationPdfInput | readonly QuotationPdfInput[];
  content: QuotationEmailContent;
  dependencies: QuotationDeliveryDependencies;
}): Promise<QuotationDeliveryResult[]> {
  const pdfInputs: readonly QuotationPdfInput[] = Array.isArray(input.pdf)
    ? input.pdf
    : [input.pdf as QuotationPdfInput];
  if (pdfInputs.length < 1 || pdfInputs.length > 2) {
    throw new QuotationValidationError(
      "Selecciona uno o dos documentos PDF.",
      "INVALID_PDF_SIZE",
    );
  }
  const pdfs = pdfInputs.map(validateQuotationPdf);
  if (
    new Set(pdfs.map((pdf) => pdf.name.toLowerCase())).size !== pdfs.length ||
    new Set(pdfs.map((pdf) => pdf.digest)).size !== pdfs.length
  ) {
    throw new QuotationValidationError(
      "Los documentos PDF deben ser distintos.",
      "DUPLICATE_PDF",
    );
  }
  const attachmentBytes = pdfs.reduce((total, pdf) => total + pdf.size, 0);
  if (attachmentBytes > QUOTATION_MAX_PDF_BYTES) {
    throw new QuotationValidationError(
      "Los documentos PDF superan en conjunto el límite de 4 MiB.",
      "PDF_TOO_LARGE",
    );
  }
  const attachmentDigest =
    pdfs.length === 1
      ? pdfs[0].digest
      : createHash("sha256")
          .update(
            [...pdfs]
              .sort((left, right) => {
                const leftKey = `${left.name.toLowerCase()}\u0000${left.digest}`;
                const rightKey = `${right.name.toLowerCase()}\u0000${right.digest}`;
                return leftKey < rightKey ? -1 : leftKey > rightKey ? 1 : 0;
              })
              .map((pdf) => `${pdf.name.toLowerCase()}\u0000${pdf.digest}`)
              .join("\u0000"),
          )
          .digest("hex");
  const attachmentFilename =
    pdfs.length === 1
      ? quotationAttachmentFilename(input.data.quotationNumber)
      : quotationDocumentsAuditFilename(input.data.quotationNumber);
  const results: QuotationDeliveryResult[] = [];

  for (const [
    recipientIndex,
    rawRecipient,
  ] of input.data.recipients.entries()) {
    const recipient = normalizeRecipient(rawRecipient);
    const recipientMasked = maskEmail(recipient);
    const idempotencyKey = createQuotationIdempotencyKey({
      quotationNumber: input.data.quotationNumber,
      recipient,
      isTest: input.data.isTest,
      attachmentDigest,
      contentDigest: input.content.digest,
    });

    let reservation: ReservedDelivery | DuplicateDelivery | BlockedRecipient;
    try {
      reservation = await input.dependencies.reserve({
        quotationNumber: input.data.quotationNumber,
        isTest: input.data.isTest,
        recipientMasked,
        recipientFingerprint: recipientFingerprint(
          recipient,
          input.dependencies.auditSecret,
        ),
        attachmentFilename,
        attachmentBytes,
        idempotencyKey,
      });
    } catch (error) {
      results.push({
        recipientIndex,
        recipientMasked,
        status: "failed",
        resendEmailId: null,
        existingStatus: null,
        requiresReview: true,
        message: sanitizeDeliveryError(error),
        idempotencyKey,
      });
      continue;
    }

    if (reservation.kind === "blocked") {
      results.push({
        recipientIndex,
        recipientMasked,
        status: "blocked",
        resendEmailId: null,
        existingStatus: reservation.status,
        requiresReview: true,
        message:
          "Destinatario bloqueado: existe un rebote, una queja de spam o una supresión anterior. No se intentó el envío; requiere revisión manual.",
        idempotencyKey,
      });
      continue;
    }

    if (reservation.kind === "duplicate") {
      const safelyAccepted =
        reservation.resendEmailId !== null &&
        ["sent", "delivered"].includes(reservation.status);
      results.push({
        recipientIndex,
        recipientMasked,
        status: "duplicate",
        resendEmailId: reservation.resendEmailId,
        existingStatus: reservation.status,
        requiresReview: !safelyAccepted,
        message: safelyAccepted
          ? `Duplicado bloqueado: el envío anterior ya fue aceptado (estado: ${reservation.status}).`
          : `Duplicado bloqueado con estado ${reservation.status}. Revisa Resend y Supabase antes de cualquier reintento.`,
        idempotencyKey,
      });
      continue;
    }

    try {
      const resendEmailId = await sendQuotationWithTimeout(
        input.dependencies.send,
        {
          from: input.dependencies.from,
          to: recipient,
          subject: input.content.subject,
          html: input.content.html,
          text: input.content.text,
          replyTo: input.dependencies.replyTo,
          tags: [
            ...quotationTags(input.data),
            { name: "delivery", value: idempotencyKey },
          ],
          attachments: pdfs.map((pdf) => ({
            content: Buffer.from(pdf.bytes),
            filename: pdfs.length === 1 ? attachmentFilename : pdf.name,
            contentType: "application/pdf",
          })),
        },
        idempotencyKey,
        input.dependencies.timeoutMs,
      );

      try {
        await input.dependencies.markSent(idempotencyKey, resendEmailId);
        results.push({
          recipientIndex,
          recipientMasked,
          status: "sent",
          resendEmailId,
          existingStatus: null,
          requiresReview: false,
          message: "Resend aceptó el mensaje y la auditoría quedó actualizada.",
          idempotencyKey,
        });
      } catch {
        results.push({
          recipientIndex,
          recipientMasked,
          status: "accepted_audit_pending",
          resendEmailId,
          existingStatus: null,
          requiresReview: true,
          message:
            "Resend aceptó el mensaje, pero la actualización final de auditoría quedó pendiente. No reintentar.",
          idempotencyKey,
        });
      }
    } catch (error) {
      const sanitizedError = sanitizeDeliveryError(error);
      const definitivelyRejected =
        error instanceof QuotationProviderError &&
        error.code === "PROVIDER_REJECTED";
      if (definitivelyRejected) {
        try {
          await input.dependencies.markFailed(idempotencyKey, sanitizedError);
        } catch {
          // La reserva sigue bloqueando cualquier duplicado. No se adjunta el
          // error de persistencia para evitar filtrar infraestructura.
        }
      }
      results.push({
        recipientIndex,
        recipientMasked,
        status: "failed",
        resendEmailId: null,
        existingStatus: null,
        requiresReview: true,
        message: definitivelyRejected
          ? sanitizedError
          : `${sanitizedError} Estado de entrega incierto; revisa Resend y Supabase antes de reintentar.`,
        idempotencyKey,
      });
    }
  }

  return results;
}
