import { NextResponse } from "next/server";
import { z } from "zod";
import {
  getRequestFingerprint,
  isAllowedStoreOrigin,
} from "@/lib/server/security";
import { verifyStoreTurnstile } from "@/lib/server/turnstile";
import { assertLiveCommerceConfig } from "@/lib/server/live-commerce-config";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^CA-\d{8}-\d{6}$/),
  email: z.string().trim().toLowerCase().email().max(254),
  turnstileToken: z.string().trim().min(1).max(2_048),
});

const genericMessage =
  "Si los datos coinciden con una compra invitada, enviaremos un enlace nuevo al correo registrado.";

function reply(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function POST(request: Request) {
  try {
    assertLiveCommerceConfig();
  } catch {
    return reply({ error: "La tienda aún no habilita operaciones comerciales." }, 503);
  }
  if (!isAllowedStoreOrigin(request)) {
    return reply({ error: "Origen no permitido." }, 403);
  }
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  ) {
    return reply({ error: "Formato no permitido." }, 415);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 8_192) {
    return reply({ error: "Solicitud demasiado grande." }, 413);
  }

  let input: unknown;
  try {
    input = JSON.parse(rawBody);
  } catch {
    return reply({ error: "JSON inválido." }, 400);
  }
  const parsed = requestSchema.safeParse(input);
  if (!parsed.success) {
    return reply({ error: "Revisa el número de pedido y el correo." }, 400);
  }

  try {
    const turnstile = await verifyStoreTurnstile(
      parsed.data.turnstileToken,
      request,
      "store_guest_access",
    );
    if (!turnstile.valid) {
      console.warn("guest_access_turnstile_rejected", {
        hostname: turnstile.hostname,
        errors: turnstile.errors,
      });
      return reply({ error: "No pudimos completar la verificación de seguridad." }, 403);
    }
  } catch (caught) {
    console.error(
      "guest_access_turnstile_unavailable",
      caught instanceof Error ? caught.message : "verification_failed",
    );
    return reply({ error: "La verificación de seguridad no está disponible." }, 503);
  }

  try {
    const admin = getSupabaseAdmin();
    const rateLimit = await admin.rpc("check_submission_rate_limit", {
      p_fingerprint: getRequestFingerprint(request, "store-guest-access"),
      p_scope: "store-guest-access",
      p_limit: 6,
      p_window_seconds: 900,
    });
    if (rateLimit.error) {
      console.error("guest_access_rate_limit_error", rateLimit.error.message);
      return reply({ message: genericMessage }, 202);
    }
    if (rateLimit.data !== true) {
      return reply({ error: "Demasiados intentos. Espera unos minutos." }, 429);
    }

    const queued = await admin.rpc("queue_store_guest_access_reissue", {
      p_order_number: parsed.data.orderNumber,
      p_email: parsed.data.email,
    });
    if (queued.error) {
      console.error("guest_access_reissue_error", queued.error.message);
    }
  } catch (caught) {
    console.error(
      "guest_access_request_error",
      caught instanceof Error ? caught.message : "Error de recuperación",
    );
  }

  return reply({ message: genericMessage }, 202);
}
