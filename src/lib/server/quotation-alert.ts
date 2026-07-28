import "server-only";

import {
  buildQuotationIncidentAlert,
  isQuotationAlertEvent,
} from "@/lib/quotation-email/alert";
import { sanitizeDeliveryError } from "@/lib/quotation-email/core";
import { sendEmail } from "@/lib/server/email";
import { getQuotationAlertRecipients } from "@/lib/server/env";
import { getSupabaseAdmin } from "@/lib/server/supabase";

export const MAX_QUOTATION_ALERT_ATTEMPTS = 5;
export const QUOTATION_ALERT_CLAIM_LEASE_MS = 10 * 60 * 1000;

type ProcessQuotationIncidentAlertInput = {
  emailEventId: string;
  svixId: string;
  eventType: string;
  resendEmailId: string | null;
  occurredAt: string | null;
};

function retryAfter(attemptCount: number) {
  const delayMinutes = Math.min(24 * 60, 15 * 2 ** (attemptCount - 1));
  return new Date(Date.now() + delayMinutes * 60_000).toISOString();
}

function claimIsStale(claimedAt: string | null) {
  if (!claimedAt) return true;
  const claimedAtMs = new Date(claimedAt).getTime();
  return (
    !Number.isFinite(claimedAtMs) ||
    claimedAtMs <= Date.now() - QUOTATION_ALERT_CLAIM_LEASE_MS
  );
}

export async function processQuotationIncidentAlert(
  input: ProcessQuotationIncidentAlertInput,
) {
  const supabase = getSupabaseAdmin();
  const { data: emailEvent, error: eventError } = await supabase
    .from("email_events")
    .select("alert_status, alert_attempt_count, alert_claimed_at, alert_detail")
    .eq("id", input.emailEventId)
    .maybeSingle();
  if (eventError || !emailEvent) {
    throw (
      eventError ||
      new Error("No se encontró el evento de alerta que debe procesarse.")
    );
  }
  if (emailEvent.alert_status === "sent") {
    return { status: "already_sent" as const };
  }
  if (emailEvent.alert_attempt_count >= MAX_QUOTATION_ALERT_ATTEMPTS) {
    return { status: "exhausted" as const };
  }
  if (
    emailEvent.alert_status === "processing" &&
    !claimIsStale(emailEvent.alert_claimed_at)
  ) {
    return { status: "busy" as const };
  }
  if (
    !emailEvent.alert_status ||
    !["pending", "failed", "processing"].includes(emailEvent.alert_status)
  ) {
    return { status: "not_pending" as const };
  }
  if (!isQuotationAlertEvent(input.eventType)) {
    throw new Error("El evento no corresponde a una alerta de cotización.");
  }

  const claimTimestamp = new Date().toISOString();
  const nextAttempt = emailEvent.alert_attempt_count + 1;
  const claimBase = supabase
    .from("email_events")
    .update({
      alert_status: "processing",
      alert_claimed_at: claimTimestamp,
      alert_retry_after: null,
      alert_last_error: null,
    })
    .eq("id", input.emailEventId)
    .eq("alert_status", emailEvent.alert_status)
    .eq("alert_attempt_count", emailEvent.alert_attempt_count);
  const claimQuery = emailEvent.alert_claimed_at
    ? claimBase.eq("alert_claimed_at", emailEvent.alert_claimed_at)
    : claimBase.is("alert_claimed_at", null);
  const { data: claimed, error: claimError } = await claimQuery
    .select("alert_detail")
    .maybeSingle();
  if (claimError) throw claimError;
  if (!claimed) {
    return { status: "busy" as const };
  }

  try {
    if (!input.resendEmailId) {
      throw new Error("La alerta no tiene un ID de correo correlacionable.");
    }

    const { data: delivery, error: deliveryError } = await supabase
      .from("quotation_email_deliveries")
      .select("quotation_number, recipient_masked, is_test")
      .eq("resend_email_id", input.resendEmailId)
      .maybeSingle();
    if (deliveryError || !delivery) {
      throw (
        deliveryError ||
        new Error("No se encontró la entrega asociada con la alerta.")
      );
    }

    const alert = buildQuotationIncidentAlert({
      svixId: input.svixId,
      eventType: input.eventType,
      quotationNumber: delivery.quotation_number,
      recipientMasked: delivery.recipient_masked,
      isTest: delivery.is_test,
      reason:
        claimed.alert_detail ||
        "Resend reportó un incidente que requiere revisión.",
      occurredAt: input.occurredAt,
    });
    const alertEmailId = await sendEmail(
      {
        to: getQuotationAlertRecipients(),
        subject: alert.subject,
        html: alert.html,
        text: alert.text,
        replyTo: "info@casa-atenta.com",
        tags: alert.tags,
        headers: { "Auto-Submitted": "auto-generated" },
      },
      alert.idempotencyKey,
    );
    const { data: markedSent, error: markSentError } = await supabase
      .from("email_events")
      .update({
        alert_status: "sent",
        alert_attempt_count: nextAttempt,
        alert_claimed_at: null,
        alert_retry_after: null,
        alert_resend_email_id: alertEmailId,
        alert_last_error: null,
        alert_sent_at: new Date().toISOString(),
      })
      .eq("id", input.emailEventId)
      .eq("alert_status", "processing")
      .eq("alert_attempt_count", emailEvent.alert_attempt_count)
      .eq("alert_claimed_at", claimTimestamp)
      .select("id")
      .maybeSingle();
    if (markSentError) throw markSentError;
    if (!markedSent) {
      return { status: "superseded" as const };
    }

    return { status: "sent" as const, alertEmailId };
  } catch (error) {
    const sanitizedError = sanitizeDeliveryError(error);
    const { error: markFailedError } = await supabase
      .from("email_events")
      .update({
        alert_status: "failed",
        alert_attempt_count: nextAttempt,
        alert_claimed_at: null,
        alert_retry_after: retryAfter(nextAttempt),
        alert_last_error: sanitizedError,
      })
      .eq("id", input.emailEventId)
      .eq("alert_status", "processing")
      .eq("alert_attempt_count", emailEvent.alert_attempt_count)
      .eq("alert_claimed_at", claimTimestamp);
    if (markFailedError) {
      console.error(
        `[quotation-alert-state] ${sanitizeDeliveryError(markFailedError)}`,
      );
    }
    throw new Error(
      "No se pudo completar la alerta interna del incidente; quedó pendiente de reintento.",
    );
  }
}
