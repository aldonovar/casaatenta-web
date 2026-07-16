import { NextResponse } from "next/server";
import { z } from "zod";
import { getLegalConsentPath, getSafeInternalPath } from "@/lib/auth/redirect";
import {
  getRequestFingerprint,
  isAllowedStoreOrigin,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const requestSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  next: z.string().max(500).optional(),
});

const genericMessage =
  "Si el correo pertenece a una cuenta, recibirás un enlace temporal para ingresar.";

function genericResponse() {
  return NextResponse.json(
    { message: genericMessage },
    {
      status: 202,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
        Expires: "0",
        Pragma: "no-cache",
        "Referrer-Policy": "no-referrer",
      },
    },
  );
}

export async function POST(request: Request) {
  if (!isAllowedStoreOrigin(request)) {
    return new NextResponse(null, {
      status: 403,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 8_192) {
    return new NextResponse(null, {
      status: 413,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 8_192) {
    return new NextResponse(null, {
      status: 413,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  }

  let parsed;
  try {
    parsed = requestSchema.safeParse(JSON.parse(rawBody));
  } catch {
    return genericResponse();
  }
  if (!parsed.success) return genericResponse();

  const origin = request.headers.get("origin") || new URL(request.url).origin;
  const next = getSafeInternalPath(parsed.data.next);
  const redirectTo = `${origin}/auth/callback?next=${encodeURIComponent(
    getLegalConsentPath(next),
  )}`;
  let fingerprint = "";
  try {
    fingerprint = getRequestFingerprint(request);
  } catch (caught) {
    console.error(
      "store_magic_link_fingerprint_error",
      caught instanceof Error ? caught.name : "unknown",
    );
  }

  if (!fingerprint) return genericResponse();

  try {
    const { data: withinLimit, error: rateLimitError } =
      await getSupabaseAdmin().rpc("check_submission_rate_limit", {
        p_fingerprint: fingerprint,
        p_scope: "store-magic-link",
        p_limit: 5,
        p_window_seconds: 900,
      });
    if (rateLimitError || withinLimit !== true) {
      if (rateLimitError) {
        console.error("store_magic_link_rate_limit_error", rateLimitError.code);
      }
      return genericResponse();
    }

    // This call must finish before the response so @supabase/ssr can attach the
    // PKCE verifier cookie required by /auth/callback.
    const { error } = await (await createClient()).auth.signInWithOtp({
      email: parsed.data.email,
      options: { shouldCreateUser: false, emailRedirectTo: redirectTo },
    });
    if (error) {
      console.info("store_magic_link_not_dispatched", error.name);
    }
  } catch (caught) {
    console.error(
      "store_magic_link_dispatch_error",
      caught instanceof Error ? caught.name : "unknown",
    );
  }

  return genericResponse();
}
