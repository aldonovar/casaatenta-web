import { randomUUID } from "node:crypto";
import { jsonResponse, routeError } from "@/lib/server/api";
import { PRIVACY_CONSENT_VERSION } from "@/lib/server/consent";
import {
  newsletterConfirmationEmail,
  sendEmail,
} from "@/lib/server/email";
import { getContactInbox } from "@/lib/server/env";
import {
  checkRateLimit,
  createNewsletterConfirmationToken,
  getRequestFingerprint,
  getValueFingerprint,
  hashToken,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import { verifyTurnstile } from "@/lib/server/turnstile";
import {
  newsletterSubscriptionSchema,
  readJsonBody,
} from "@/lib/server/validation";

export const runtime = "nodejs";

const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;
const CONFIRMATION_EXPIRY_BUCKET_MS = 5 * 60 * 1000;
const FIRST_RETRY_DELAY_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const rawBody = await readJsonBody(request);
    if (
      rawBody &&
      typeof rawBody === "object" &&
      "website" in rawBody &&
      rawBody.website
    ) {
      return jsonResponse({ success: true });
    }

    const subscription = newsletterSubscriptionSchema.parse(rawBody);
    const turnstile = await verifyTurnstile(
      subscription.turnstileToken,
      request,
      "newsletter_subscription",
    );
    if (!turnstile.valid) {
      return jsonResponse({ error: "No se completó la verificación de seguridad." }, 400);
    }

    const fingerprint = getRequestFingerprint(request);
    const withinLimit = await checkRateLimit(
      fingerprint,
      "newsletter_subscription",
      4,
      60 * 60,
    );
    if (!withinLimit) {
      return jsonResponse(
        { error: "Alcanzaste el límite temporal. Intenta más tarde." },
        429,
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await supabase
      .from("newsletter_subscribers")
      .select("id, status, updated_at")
      .eq("email", subscription.email)
      .maybeSingle();
    if (lookupError) throw lookupError;

    // No revelamos si una dirección ya está registrada o suprimida.
    if (existing?.status === "confirmed" || existing?.status === "suppressed") {
      return jsonResponse({ success: true, confirmationRequired: true }, 202);
    }

    if (
      existing?.status === "pending" &&
      Date.now() - new Date(existing.updated_at as string).getTime() < 15 * 60_000
    ) {
      return jsonResponse({ success: true, confirmationRequired: true }, 202);
    }

    const recipientWithinLimit = await checkRateLimit(
      getValueFingerprint("email", subscription.email),
      "newsletter_recipient",
      2,
      24 * 60 * 60,
    );
    if (!recipientWithinLimit) {
      // Respuesta genérica para no revelar el límite ni el estado del correo.
      return jsonResponse({ success: true, confirmationRequired: true }, 202);
    }

    const now = new Date();
    // El vencimiento agrupado hace que dos solicitudes concurrentes para el
    // mismo suscriptor produzcan el mismo token y la misma clave idempotente.
    const expiresAt = new Date(
      Math.ceil(
        (now.getTime() + CONFIRMATION_TTL_MS) /
          CONFIRMATION_EXPIRY_BUCKET_MS,
      ) * CONFIRMATION_EXPIRY_BUCKET_MS,
    );
    const subscriberId =
      (existing?.id as string | undefined) ?? randomUUID();
    const token = createNewsletterConfirmationToken(subscriberId, expiresAt);
    const tokenHash = hashToken(token);
    const subscriberData = {
      email: subscription.email,
      name: subscription.name,
      source: subscription.source,
      status: "pending",
      consent_at: now.toISOString(),
      consent_version: PRIVACY_CONSENT_VERSION,
      confirmed_at: null,
      unsubscribed_at: null,
      confirmation_token_hash: tokenHash,
      confirmation_expires_at: expiresAt.toISOString(),
      suppression_reason: null,
      resend_confirmation_id: null,
      resend_welcome_id: null,
      email_retry_count: 0,
      email_retry_after: now.toISOString(),
      last_email_error: null,
    };

    const stored = existing
      ? await supabase
          .from("newsletter_subscribers")
          .update(subscriberData)
          .eq("id", existing.id)
          .select("id")
          .single()
      : await supabase
          .from("newsletter_subscribers")
          .insert({ id: subscriberId, ...subscriberData })
          .select("id")
          .single();

    if (stored.error || !stored.data) {
      // Una solicitud paralela puede haber creado el mismo email; la respuesta
      // sigue siendo genérica para evitar enumeración de direcciones.
      if (stored.error?.code === "23505") {
        return jsonResponse({ success: true, confirmationRequired: true }, 202);
      }
      throw stored.error || new Error("No se guardó la suscripción.");
    }

    const { error: consentEventError } = await supabase
      .from("newsletter_consent_events")
      .insert({
        subscriber_id: stored.data.id,
        event_type: "requested",
        consent_version: PRIVACY_CONSENT_VERSION,
        request_fingerprint: fingerprint,
      });
    if (consentEventError) throw consentEventError;

    const confirmation = newsletterConfirmationEmail(subscription.name, token);
    let emailId: string;
    try {
      emailId = await sendEmail(
        {
          to: subscription.email,
          replyTo: getContactInbox(),
          ...confirmation,
          tags: [{ name: "category", value: "newsletter-confirmation" }],
        },
        `newsletter-confirmation/${stored.data.id}/${tokenHash.slice(0, 12)}`,
      );
    } catch (emailError) {
      console.error(
        `[newsletter:${stored.data.id}] no se envió la confirmación; quedó programada para reintento.`,
        emailError,
      );
      const { error: retryUpdateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          email_retry_count: 0,
          email_retry_after: new Date(
            Date.now() + FIRST_RETRY_DELAY_MS,
          ).toISOString(),
          last_email_error: "resend_confirmation_failed",
        })
        .eq("id", stored.data.id)
        .eq("status", "pending")
        .eq("confirmation_token_hash", tokenHash)
        .is("resend_confirmation_id", null);
      if (retryUpdateError) {
        // El valor inicial de email_retry_after sigue dejando el registro
        // elegible para el cron aunque falle esta actualización secundaria.
        console.error(
          `[newsletter:${stored.data.id}] no se guardó la programación del reintento.`,
          retryUpdateError,
        );
      }

      return jsonResponse({ success: true, confirmationRequired: true }, 202);
    }

    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        resend_confirmation_id: emailId,
        email_retry_count: 0,
        email_retry_after: null,
        last_email_error: null,
      })
      .eq("id", stored.data.id)
      .eq("status", "pending")
      .eq("confirmation_token_hash", tokenHash);
    if (updateError) {
      console.error(`[newsletter:${stored.data.id}] no se guardó el ID de Resend.`);
    }

    return jsonResponse({ success: true, confirmationRequired: true }, 202);
  } catch (error) {
    return routeError(error, "newsletter-subscribe");
  }
}
