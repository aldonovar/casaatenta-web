import { jsonResponse } from "@/lib/server/api";
import { getSiteUrl } from "@/lib/server/env";
import {
  getRequestFingerprint,
  readUnsubscribeToken,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/server/supabase";

export const runtime = "nodejs";

async function unsubscribe(token: string | null, requestFingerprint: string) {
  if (!token || token.length > 200) return false;
  const subscriberId = readUnsubscribeToken(token);
  if (!subscriberId) return false;

  const supabase = getSupabaseAdmin();
  const { data: subscriber, error } = await supabase
    .from("newsletter_subscribers")
    .update({
      status: "unsubscribed",
      unsubscribed_at: new Date().toISOString(),
      suppression_reason: "user_request",
      confirmation_token_hash: null,
      confirmation_expires_at: null,
    })
    .eq("id", subscriberId)
    .select("id, consent_version")
    .maybeSingle();
  if (error) throw error;
  if (!subscriber) return false;

  const { error: consentEventError } = await supabase
    .from("newsletter_consent_events")
    .insert({
      subscriber_id: subscriber.id,
      event_type: "unsubscribed",
      consent_version: subscriber.consent_version,
      request_fingerprint: requestFingerprint,
    });
  if (consentEventError) {
    console.error(`[newsletter:${subscriber.id}] no se guardó el evento de baja.`);
  }
  return true;
}

function redirectTo(path: string) {
  return Response.redirect(new URL(path, getSiteUrl()), 303);
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

// Los escáneres de enlaces suelen hacer GET. Esta ruta nunca da de baja: lleva
// a una pantalla que requiere una confirmación POST de la persona.
export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token || token.length > 200) return redirectTo("/newsletter/enlace-invalido");

  const landingUrl = new URL("/newsletter/cancelar", getSiteUrl());
  landingUrl.searchParams.set("token", token);
  return Response.redirect(landingUrl, 303);
}

export async function POST(request: Request) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get("token");
    const humanConfirmation = url.searchParams.get("redirect") === "1";
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (contentLength > 2_048) {
      return jsonResponse({ error: "Solicitud demasiado grande." }, 413);
    }

    if (humanConfirmation) {
      if (!originIsAllowed(request)) return redirectTo("/newsletter/enlace-invalido");
      const success = await unsubscribe(token, getRequestFingerprint(request));
      return redirectTo(
        success ? "/newsletter/baja-confirmada" : "/newsletter/enlace-invalido",
      );
    }

    const contentType = request.headers.get("content-type")?.toLowerCase() || "";
    if (!contentType.startsWith("application/x-www-form-urlencoded")) {
      return jsonResponse({ error: "Formato no admitido." }, 415);
    }

    const body = await request.text();
    const oneClick = new URLSearchParams(body).get("List-Unsubscribe");
    if (oneClick !== "One-Click") {
      return jsonResponse({ error: "Solicitud de baja inválida." }, 400);
    }

    await unsubscribe(token, getRequestFingerprint(request));
    // RFC 8058 exige una respuesta vacía 200/202 para la baja en un clic.
    return new Response(null, { status: 200, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("[newsletter-unsubscribe]", error);
    return jsonResponse({ error: "No se pudo completar la baja." }, 500);
  }
}
