import { jsonResponse } from "@/lib/server/api";
import { getResend } from "@/lib/server/email";
import { getResendWebhookSecret } from "@/lib/server/env";
import { getSupabaseAdmin } from "@/lib/server/supabase";

export const runtime = "nodejs";

type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
  };
};

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

  try {
    const payload = await request.text();
    if (new TextEncoder().encode(payload).byteLength > 256_000) {
      return jsonResponse({ error: "Payload demasiado grande." }, 413);
    }

    const event = getResend().webhooks.verify({
      payload,
      headers: {
        id: svixId,
        timestamp: svixTimestamp,
        signature: svixSignature,
      },
      webhookSecret: getResendWebhookSecret(),
    }) as ResendWebhookEvent;
    const recipients = Array.isArray(event.data?.to)
      ? event.data.to.map((email) => email.toLowerCase())
      : [];
    const supabase = getSupabaseAdmin();
    const { error: insertError } = await supabase.from("email_events").insert({
      svix_id: svixId,
      event_type: event.type,
      email_id: event.data?.email_id || null,
      recipient_email: recipients[0] || null,
      payload: event,
      event_created_at: event.created_at || null,
    });

    // Si un intento previo guardó el evento pero falló al aplicar la
    // supresión, el reintento debe continuar con el efecto secundario.
    if (insertError && insertError.code !== "23505") throw insertError;

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
    console.error("[resend-webhook]", error);
    return jsonResponse({ error: "Webhook inválido." }, 400);
  }
}
