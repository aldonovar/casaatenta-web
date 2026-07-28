import {
  isQuotationAlertEvent,
  QUOTATION_ALERT_LABELS,
} from "@/lib/quotation-email/alert";
import { sanitizeDeliveryError } from "@/lib/quotation-email/core";
import { jsonResponse } from "@/lib/server/api";
import { getResend } from "@/lib/server/email";
import { getResendWebhookSecret } from "@/lib/server/env";
import { processQuotationIncidentAlert } from "@/lib/server/quotation-alert";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import {
  eventTimestamp,
  isQuotationEvent,
  minimizedQuotationEventPayload,
  quotationDeliveryKey,
  quotationEventError,
  quotationTransition,
  type ResendWebhookEvent,
} from "@/lib/quotation-email/webhook";
import type { Json } from "@/types/database.types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 256_000) {
    return jsonResponse({ error: "Payload demasiado grande." }, 413);
  }

  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");
  if (!svixId || !svixTimestamp || !svixSignature) {
    return jsonResponse({ error: "Firma ausente." }, 400);
  }

  const payload = await request.text();
  if (new TextEncoder().encode(payload).byteLength > 256_000) {
    return jsonResponse({ error: "Payload demasiado grande." }, 413);
  }

  let event: ResendWebhookEvent;
  try {
    event = getResend().webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: getResendWebhookSecret(),
    }) as ResendWebhookEvent;
  } catch {
    return jsonResponse({ error: "Webhook inválido." }, 400);
  }

  try {
    const recipients = Array.isArray(event.data?.to)
      ? event.data.to.map((email) => email.toLowerCase())
      : [];
    const quotationEvent = isQuotationEvent(event);
    const alertEventType = isQuotationAlertEvent(event.type)
      ? event.type
      : null;
    const quotationAlert = quotationEvent && alertEventType !== null;
    const supabase = getSupabaseAdmin();
    const receivedAt = new Date().toISOString();
    const { data: insertedEvent, error: insertError } = await supabase
      .from("email_events")
      .insert({
        svix_id: svixId,
        event_type: event.type,
        email_id: event.data?.email_id || null,
        recipient_email: quotationEvent ? null : recipients[0] || null,
        payload: quotationEvent
          ? minimizedQuotationEventPayload(event)
          : (event as unknown as Json),
        event_created_at: event.created_at || null,
        alert_status: quotationAlert ? "pending" : null,
        alert_detail:
          quotationAlert && alertEventType
            ? quotationEventError(event, QUOTATION_ALERT_LABELS[alertEventType])
            : null,
        alert_retry_after: quotationAlert ? receivedAt : null,
      })
      .select("id, alert_status")
      .maybeSingle();

    let storedEvent = insertedEvent;
    // Un reintento firmado debe continuar los efectos secundarios pendientes,
    // pero una alerta ya marcada como enviada no vuelve a emitirse.
    if (insertError?.code === "23505") {
      const { data: existingEvent, error: existingEventError } = await supabase
        .from("email_events")
        .select("id, alert_status")
        .eq("svix_id", svixId)
        .maybeSingle();
      if (existingEventError || !existingEvent) {
        throw (
          existingEventError ||
          new Error("No se encontró el evento idempotente existente.")
        );
      }
      storedEvent = existingEvent;
    } else if (insertError) {
      throw insertError;
    }
    if (!storedEvent) {
      throw new Error("No se pudo conservar el evento recibido.");
    }

    const rawResendEmailId = event.data?.email_id?.trim();
    const resendEmailId =
      rawResendEmailId && rawResendEmailId.length <= 200
        ? rawResendEmailId
        : null;
    const transition = quotationTransition(
      event,
      eventTimestamp(event.created_at),
    );
    if (quotationEvent && transition) {
      const idempotencyKey = quotationDeliveryKey(event);
      let delivery: {
        id: string;
        status: string;
        resend_email_id: string | null;
      } | null = null;

      if (resendEmailId) {
        const { data, error } = await supabase
          .from("quotation_email_deliveries")
          .select("id, status, resend_email_id")
          .eq("resend_email_id", resendEmailId)
          .maybeSingle();
        if (error) throw error;
        delivery = data;
      }
      if (!delivery && idempotencyKey) {
        const { data, error } = await supabase
          .from("quotation_email_deliveries")
          .select("id, status, resend_email_id")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();
        if (error) throw error;
        delivery = data;
      }

      if (!delivery || !resendEmailId) {
        return jsonResponse(
          { error: "Evento de cotización pendiente de correlación." },
          503,
        );
      }
      let currentDelivery = delivery;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        if (
          currentDelivery.resend_email_id &&
          currentDelivery.resend_email_id !== resendEmailId
        ) {
          throw new Error("El evento no coincide con el ID de auditoría.");
        }
        if (!transition.allowedStatuses.includes(currentDelivery.status)) {
          break;
        }

        const { data: updated, error: deliveryUpdateError } = await supabase
          .from("quotation_email_deliveries")
          .update({
            ...transition.update,
            resend_email_id: resendEmailId,
          })
          .eq("id", currentDelivery.id)
          .eq("status", currentDelivery.status)
          .select("id")
          .maybeSingle();
        if (deliveryUpdateError) throw deliveryUpdateError;
        if (updated) break;

        // Otro evento pudo ganar el compare-and-swap. Releemos el estado y
        // reintentamos solo si esta transición sigue siendo válida; así un
        // evento terminal no se pierde ni un evento tardío degrada el estado.
        const { data: refreshed, error: refreshError } = await supabase
          .from("quotation_email_deliveries")
          .select("id, status, resend_email_id")
          .eq("id", currentDelivery.id)
          .maybeSingle();
        if (refreshError || !refreshed) {
          throw (
            refreshError || new Error("La auditoría dejó de estar disponible.")
          );
        }
        currentDelivery = refreshed;
        if (attempt === 4) {
          throw new Error(
            "La auditoría recibió demasiados eventos concurrentes.",
          );
        }
      }
    }

    if (
      recipients.length > 0 &&
      (event.type === "email.bounced" ||
        event.type === "email.complained" ||
        event.type === "email.suppressed")
    ) {
      const { data: suppressed, error: suppressError } = await supabase
        .from("newsletter_subscribers")
        .update({
          status: "suppressed",
          suppression_reason:
            event.type === "email.bounced"
              ? "hard_bounce"
              : event.type === "email.complained"
                ? "spam_complaint"
                : "provider_suppression",
          confirmation_token_hash: null,
          confirmation_expires_at: null,
        })
        .in("email", recipients)
        .select("id, consent_version");
      if (suppressError) throw suppressError;

      if (suppressed && suppressed.length > 0) {
        const { error: consentEventError } = await supabase
          .from("newsletter_consent_events")
          .insert(
            suppressed.map((subscriber) => ({
              subscriber_id: subscriber.id,
              event_type: "suppressed",
              consent_version: subscriber.consent_version,
              source_event_id: svixId,
            })),
          );
        if (consentEventError && consentEventError.code !== "23505") {
          throw consentEventError;
        }
      }
    }

    if (
      quotationAlert &&
      storedEvent.alert_status !== null &&
      storedEvent.alert_status !== "sent"
    ) {
      await processQuotationIncidentAlert({
        emailEventId: storedEvent.id,
        svixId,
        eventType: event.type,
        resendEmailId,
        occurredAt: event.created_at || null,
      });
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`[resend-webhook] ${sanitizeDeliveryError(error)}`);
    return jsonResponse({ error: "No se pudo procesar el webhook." }, 503);
  }
}
