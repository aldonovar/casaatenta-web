import { jsonResponse } from "@/lib/server/api";
import { getResend } from "@/lib/server/email";
import { getResendWebhookSecret } from "@/lib/server/env";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import { sanitizeDeliveryError } from "@/lib/quotation-email/core";
import {
  eventTimestamp,
  isQuotationEvent,
  minimizedQuotationEventPayload,
  quotationDeliveryKey,
  quotationTransition,
  quotationEventError,
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
    const supabase = getSupabaseAdmin();
    const { error: insertError } = await supabase.from("email_events").insert({
      svix_id: svixId,
      event_type: event.type,
      email_id: event.data?.email_id || null,
      recipient_email: quotationEvent ? null : recipients[0] || null,
      payload: quotationEvent
        ? minimizedQuotationEventPayload(event)
        : (event as unknown as Json),
      event_created_at: event.created_at || null,
    });

    // Si un intento previo guardó el evento pero falló al aplicar la
    // supresión, el reintento debe continuar con el efecto secundario.
    if (insertError && insertError.code !== "23505") throw insertError;

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

    if (quotationEvent && ["email.opened", "email.clicked", "email.bounced"].includes(event.type)) {
      const rawResendEmailId = event.data?.email_id?.trim();
      if (rawResendEmailId) {
        const { data: delivery, error: fetchErr } = await supabase
          .from("quotation_email_deliveries")
          .select("quotation_number, recipient_masked, is_test")
          .eq("resend_email_id", rawResendEmailId)
          .maybeSingle();

        if (delivery && !fetchErr) {
          const isTestStr = delivery.is_test ? "[PRUEBA]" : "[PRODUCCIÓN]";
          const quotNum = delivery.quotation_number;
          const clientEmail = delivery.recipient_masked;

          let subject = "";
          let html = "";
          let text = "";

          const occurredAt = event.created_at
            ? new Date(event.created_at).toLocaleString("es-PE", { timeZone: "America/Lima" })
            : new Date().toLocaleString("es-PE", { timeZone: "America/Lima" });

          if (event.type === "email.opened") {
            subject = `🔔 ${isTestStr} Cotización ${quotNum} Abierta por el Cliente`;
            html = `
              <div style="font-family: sans-serif; padding: 20px; color: #273445; background-color: #f4f0e8; border-radius: 8px; border: 1px solid #d8b36a;">
                <h2 style="color: #07111d; border-bottom: 2px solid #d8b36a; padding-bottom: 8px; margin-top: 0;">Alerta de Apertura</h2>
                <p>El cliente con correo <strong>${clientEmail}</strong> ha abierto el correo de la cotización N.° <strong>${quotNum}</strong>.</p>
                <p><strong>Fecha/Hora del evento:</strong> ${occurredAt} (Hora de Lima)</p>
                <hr style="border: 0; border-top: 1px solid #d8b36a; margin: 20px 0;" />
                <p style="font-size: 11px; color: #596878; margin-bottom: 0;">Este es un mensaje automático de seguimiento de Casa Atenta.</p>
              </div>
            `;
            text = `Alerta de Apertura: El cliente con correo ${clientEmail} ha abierto la cotización N.° ${quotNum} el ${occurredAt}.`;
          } else if (event.type === "email.clicked") {
            const clickedUrl = (event.data as Record<string, unknown> & { click?: { url?: string } })?.click?.url || "enlace desconocido";
            subject = `🔗 ${isTestStr} Cotización ${quotNum} - Clic en Enlace`;
            html = `
              <div style="font-family: sans-serif; padding: 20px; color: #273445; background-color: #f4f0e8; border-radius: 8px; border: 1px solid #d8b36a;">
                <h2 style="color: #07111d; border-bottom: 2px solid #d8b36a; padding-bottom: 8px; margin-top: 0;">Alerta de Interacción</h2>
                <p>El cliente con correo <strong>${clientEmail}</strong> ha hecho clic en un enlace de la cotización N.° <strong>${quotNum}</strong>.</p>
                <p><strong>Enlace visitado:</strong> <a href="${clickedUrl}" style="color: #d8b36a; text-decoration: underline;">${clickedUrl}</a></p>
                <p><strong>Fecha/Hora del evento:</strong> ${occurredAt} (Hora de Lima)</p>
                <hr style="border: 0; border-top: 1px solid #d8b36a; margin: 20px 0;" />
                <p style="font-size: 11px; color: #596878; margin-bottom: 0;">Este es un mensaje automático de seguimiento de Casa Atenta.</p>
              </div>
            `;
            text = `Alerta de Interacción: El cliente con correo ${clientEmail} ha hecho clic en el enlace (${clickedUrl}) de la cotización N.° ${quotNum} el ${occurredAt}.`;
          } else if (event.type === "email.bounced") {
            const reason = quotationEventError(event, "Rebote permanente");
            subject = `⚠️ ${isTestStr} ERROR: Cotización ${quotNum} Rebotó (No Entregado)`;
            html = `
              <div style="font-family: sans-serif; padding: 20px; color: #273445; background-color: #f4f0e8; border-radius: 8px; border: 1px solid #ff4d4f; border-left: 4px solid #ff4d4f;">
                <h2 style="color: #ff4d4f; border-bottom: 2px solid #ff4d4f; padding-bottom: 8px; margin-top: 0;">Alerta de Rebote (Error de Entrega)</h2>
                <p>El correo enviado a <strong>${clientEmail}</strong> para la cotización N.° <strong>${quotNum}</strong> rebotó y no pudo ser entregado.</p>
                <p><strong>Razón del error:</strong> <span style="color: #ff4d4f;">${reason}</span></p>
                <p><strong>Fecha/Hora del evento:</strong> ${occurredAt} (Hora de Lima)</p>
                <hr style="border: 0; border-top: 1px solid #ff4d4f; margin: 20px 0;" />
                <p style="font-size: 11px; color: #596878; margin-bottom: 0;">Este es un mensaje de alerta crítico del sistema de correo de Casa Atenta.</p>
              </div>
            `;
            text = `CRÍTICO: El correo de cotización N.° ${quotNum} para ${clientEmail} rebotó. Razón: ${reason} el ${occurredAt}.`;
          }

          try {
            await getResend().emails.send({
              from: "Casa Atenta <info@casa-atenta.com>",
              to: ["steamdusk@gmail.com", "febjon19@gmail.com"],
              subject,
              html,
              text,
              replyTo: "info@casa-atenta.com"
            });
          } catch (sendErr) {
            console.error(`[resend-webhook-notify] ${sanitizeDeliveryError(sendErr)}`);
          }
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

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error(`[resend-webhook] ${sanitizeDeliveryError(error)}`);
    return jsonResponse({ error: "No se pudo procesar el webhook." }, 503);
  }
}
