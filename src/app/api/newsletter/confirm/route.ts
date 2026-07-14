import {
  newsletterWelcomeEmail,
  sendEmail,
} from "@/lib/server/email";
import { getContactInbox, getSiteUrl } from "@/lib/server/env";
import {
  createUnsubscribeToken,
  getRequestFingerprint,
  hashToken,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/server/supabase";

export const runtime = "nodejs";

const FIRST_RETRY_DELAY_MS = 15 * 60 * 1000;

function redirectTo(path: string) {
  return Response.redirect(new URL(path, getSiteUrl()), 303);
}

function validToken(value: FormDataEntryValue | string | null) {
  return typeof value === "string" && value.length >= 20 && value.length <= 200
    ? value
    : null;
}

function originIsAllowed(request: Request) {
  const expectedOrigin = getSiteUrl().origin;
  for (const header of ["origin", "referer"] as const) {
    const value = request.headers.get(header);
    if (!value) continue;
    try {
      return new URL(value).origin === expectedOrigin;
    } catch {
      return false;
    }
  }
  return false;
}

// Compatibilidad con enlaces de confirmación anteriores: un GET nunca cambia
// el consentimiento; solo lleva a la pantalla con confirmación explícita.
export async function GET(request: Request) {
  const token = validToken(new URL(request.url).searchParams.get("token"));
  if (!token) return redirectTo("/newsletter/enlace-invalido");

  const landingUrl = new URL("/newsletter/confirmar", getSiteUrl());
  landingUrl.searchParams.set("token", token);
  return Response.redirect(landingUrl, 303);
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  if (
    contentLength > 4_096 ||
    !contentType.startsWith("application/x-www-form-urlencoded") ||
    !originIsAllowed(request)
  ) {
    return redirectTo("/newsletter/enlace-invalido");
  }

  let token: string | null = null;
  try {
    token = validToken((await request.formData()).get("token"));
  } catch {
    return redirectTo("/newsletter/enlace-invalido");
  }
  if (!token) return redirectTo("/newsletter/enlace-invalido");

  try {
    const supabase = getSupabaseAdmin();
    const { data: subscriber, error: lookupError } = await supabase
      .from("newsletter_subscribers")
      .select("id, email, name, consent_version")
      .eq("confirmation_token_hash", hashToken(token))
      .eq("status", "pending")
      .gt("confirmation_expires_at", new Date().toISOString())
      .maybeSingle();
    if (lookupError || !subscriber) return redirectTo("/newsletter/enlace-invalido");

    const { data: confirmed, error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmation_token_hash: null,
        confirmation_expires_at: null,
        resend_welcome_id: null,
        email_retry_count: 0,
        email_retry_after: new Date().toISOString(),
        last_email_error: null,
      })
      .eq("id", subscriber.id)
      .eq("status", "pending")
      .select("id, email, name, consent_version")
      .maybeSingle();
    if (updateError) throw updateError;
    if (!confirmed) return redirectTo("/newsletter/enlace-invalido");

    const { error: consentEventError } = await supabase
      .from("newsletter_consent_events")
      .insert({
        subscriber_id: confirmed.id,
        event_type: "confirmed",
        consent_version: confirmed.consent_version,
        request_fingerprint: getRequestFingerprint(request),
      });
    if (consentEventError) {
      console.error(`[newsletter:${confirmed.id}] no se guardó el evento de confirmación.`);
    }

    const unsubscribeToken = createUnsubscribeToken(confirmed.id as string);
    const oneClickUrl = new URL("/api/newsletter/unsubscribe", getSiteUrl());
    oneClickUrl.searchParams.set("token", unsubscribeToken);
    const unsubscribePageUrl = new URL("/newsletter/cancelar", getSiteUrl());
    unsubscribePageUrl.searchParams.set("token", unsubscribeToken);
    const welcome = newsletterWelcomeEmail(
      (confirmed.name as string | null) || null,
      unsubscribePageUrl.href,
    );

    try {
      const welcomeId = await sendEmail(
        {
          to: confirmed.email as string,
          replyTo: getContactInbox(),
          ...welcome,
          tags: [{ name: "category", value: "newsletter-welcome" }],
          headers: {
            "List-Unsubscribe": `<${oneClickUrl.href}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          },
        },
        `newsletter-welcome/${confirmed.id}`,
      );

      const { error: emailUpdateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          resend_welcome_id: welcomeId,
          email_retry_count: 0,
          email_retry_after: null,
          last_email_error: null,
        })
        .eq("id", confirmed.id)
        .eq("status", "confirmed")
        .is("resend_welcome_id", null);
      if (emailUpdateError) {
        console.error(`[newsletter:${confirmed.id}] no se guardó el ID de bienvenida.`);
      }
    } catch (emailError) {
      console.error(`[newsletter:${confirmed.id}] no se envió el correo de bienvenida.`, emailError);
      const { error: retryUpdateError } = await supabase
        .from("newsletter_subscribers")
        .update({
          email_retry_count: 0,
          email_retry_after: new Date(
            Date.now() + FIRST_RETRY_DELAY_MS,
          ).toISOString(),
          last_email_error: "resend_welcome_failed",
        })
        .eq("id", confirmed.id)
        .eq("status", "confirmed")
        .is("resend_welcome_id", null);
      if (retryUpdateError) {
        console.error(
          `[newsletter:${confirmed.id}] no se programó el reintento de bienvenida.`,
          retryUpdateError,
        );
      }
    }

    return redirectTo("/newsletter/confirmado");
  } catch (error) {
    console.error("[newsletter-confirm]", error);
    return redirectTo("/newsletter/enlace-invalido");
  }
}
