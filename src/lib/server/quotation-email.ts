import "server-only";

import type { CreateEmailRequestOptions } from "resend";
import {
  contentDigest,
  type QuotationEmailData,
  type QuotationPdfInput,
} from "@/lib/quotation-email/core";
import {
  deliverQuotationRecipients,
  type BlockedRecipient,
  type DuplicateDelivery,
  type QuotationProviderPayload,
} from "@/lib/quotation-email/delivery";
import { quotationDeliveryEmail } from "./email";
import { getQuotationAuditSecret, getQuotationResendConfig } from "./env";
import { getResend } from "./email";
import { getSupabaseAdmin } from "./supabase";
import {
  QUOTATION_SEND_TIMEOUT_MS,
  sanitizeDeliveryError,
} from "@/lib/quotation-email/core";

type ResendRequestOptionsWithSignal = CreateEmailRequestOptions & {
  signal: AbortSignal;
};

const BLOCKING_DELIVERY_STATUSES = [
  "bounced",
  "complained",
  "suppressed",
] as const;

function isBlockingDeliveryStatus(
  status: string,
): status is BlockedRecipient["status"] {
  return BLOCKING_DELIVERY_STATUSES.some((candidate) => candidate === status);
}

async function reserveDelivery(input: {
  quotationNumber: string;
  isTest: boolean;
  recipientMasked: string;
  recipientFingerprint: string;
  attachmentFilename: string;
  attachmentBytes: number;
  idempotencyKey: string;
}) {
  const supabase = getSupabaseAdmin();
  const { data: blocked, error: blockedLookupError } = await supabase
    .from("quotation_email_deliveries")
    .select("status")
    .eq("recipient_fingerprint", input.recipientFingerprint)
    .in("status", [...BLOCKING_DELIVERY_STATUSES])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (blockedLookupError) {
    throw new Error(
      "No se pudo comprobar la supresión histórica del destinatario.",
    );
  }
  if (blocked && isBlockingDeliveryStatus(blocked.status)) {
    return {
      kind: "blocked",
      status: blocked.status,
    } satisfies BlockedRecipient;
  }

  const { error } = await supabase.from("quotation_email_deliveries").insert({
    quotation_number: input.quotationNumber,
    is_test: input.isTest,
    recipient_masked: input.recipientMasked,
    recipient_fingerprint: input.recipientFingerprint,
    attachment_filename: input.attachmentFilename,
    attachment_bytes: input.attachmentBytes,
    idempotency_key: input.idempotencyKey,
    status: "pending",
    attempt_count: 1,
  });

  if (!error) return { kind: "reserved" as const };
  if (error.code !== "23505") {
    throw new Error("No se pudo reservar la auditoría del envío.");
  }

  const { data: existing, error: selectError } = await supabase
    .from("quotation_email_deliveries")
    .select("status, resend_email_id")
    .eq("idempotency_key", input.idempotencyKey)
    .maybeSingle();
  if (selectError || !existing) {
    throw new Error("No se pudo verificar la reserva idempotente existente.");
  }

  return {
    kind: "duplicate",
    status: existing.status,
    resendEmailId: existing.resend_email_id,
  } satisfies DuplicateDelivery;
}

async function markDeliverySent(idempotencyKey: string, resendEmailId: string) {
  const { data, error } = await getSupabaseAdmin()
    .from("quotation_email_deliveries")
    .update({
      status: "sent",
      resend_email_id: resendEmailId,
      sanitized_error: null,
      sent_at: new Date().toISOString(),
      last_event_at: new Date().toISOString(),
    })
    .eq("idempotency_key", idempotencyKey)
    .eq("status", "pending")
    .select("id")
    .maybeSingle();
  if (error) {
    throw new Error("No se pudo completar la auditoría del envío aceptado.");
  }
  if (data) return;

  // El webhook puede llegar antes que esta actualización. En ese caso solo
  // aceptamos como éxito un estado ya confirmado con el mismo ID de Resend;
  // cualquier estado de fallo queda visible como revisión manual.
  const { data: existing, error: selectError } = await getSupabaseAdmin()
    .from("quotation_email_deliveries")
    .select("status, resend_email_id")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (
    selectError ||
    !existing ||
    existing.resend_email_id !== resendEmailId ||
    !["sent", "delivered"].includes(existing.status)
  ) {
    throw new Error("No se pudo completar la auditoría del envío aceptado.");
  }
}

async function markDeliveryFailed(
  idempotencyKey: string,
  sanitizedError: string,
) {
  const { error } = await getSupabaseAdmin()
    .from("quotation_email_deliveries")
    .update({
      status: "failed",
      sanitized_error: sanitizeDeliveryError(sanitizedError),
      last_event_at: new Date().toISOString(),
    })
    .eq("idempotency_key", idempotencyKey)
    .eq("status", "pending");
  if (error) throw new Error("No se pudo registrar el fallo del envío.");
}

async function sendThroughResend(
  payload: QuotationProviderPayload,
  options: { idempotencyKey: string; signal: AbortSignal },
) {
  const requestOptions: ResendRequestOptionsWithSignal = {
    idempotencyKey: options.idempotencyKey,
    signal: options.signal,
  };
  const response = await getResend().emails.send(payload, requestOptions);
  return {
    data: response.data,
    error: response.error,
  };
}

export async function sendQuotationEmail(input: {
  data: QuotationEmailData;
  pdf: QuotationPdfInput | readonly QuotationPdfInput[];
}) {
  const sender = getQuotationResendConfig();
  const template = quotationDeliveryEmail(input.data);

  return deliverQuotationRecipients({
    data: input.data,
    pdf: input.pdf,
    content: {
      ...template,
      digest: contentDigest(template),
    },
    dependencies: {
      auditSecret: getQuotationAuditSecret(),
      from: sender.from,
      replyTo: sender.replyTo,
      timeoutMs: QUOTATION_SEND_TIMEOUT_MS,
      reserve: reserveDelivery,
      markSent: markDeliverySent,
      markFailed: markDeliveryFailed,
      send: sendThroughResend,
    },
  });
}
