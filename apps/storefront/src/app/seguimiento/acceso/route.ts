import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  GUEST_ORDER_COOKIE,
  guestOrderCookieMaxAge,
  readGuestOrderAccessToken,
} from "@/lib/server/guest-order-access";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url), {
    status: 303,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function GET(request: NextRequest) {
  const queryToken = request.nextUrl.searchParams.get("token") || "";
  const cookieToken = request.cookies.get(GUEST_ORDER_COOKIE)?.value || "";
  const candidates = [queryToken, cookieToken]
    .filter((token, index, tokens) => token && tokens.indexOf(token) === index)
    .map((token) => ({ token, payload: readGuestOrderAccessToken(token) }))
    .filter(
      (candidate): candidate is {
        token: string;
        payload: NonNullable<ReturnType<typeof readGuestOrderAccessToken>>;
      } => Boolean(candidate.payload),
    );

  if (candidates.length === 0) {
    const response = redirectTo(request, "/seguimiento?estado=enlace-invalido");
    response.cookies.delete(GUEST_ORDER_COOKIE);
    return response;
  }

  try {
    const admin = getSupabaseAdmin();
    for (const { token, payload } of candidates) {
      const tracking = await admin.rpc("get_store_guest_tracking", {
        p_order_id: payload.orderId,
        p_nonce: payload.nonce,
      });
      if (tracking.error) throw tracking.error;
      const order = (tracking.data as { order?: { order_number?: string } } | null)
        ?.order;
      if (!order?.order_number) continue;

      const response = redirectTo(
        request,
        `/seguimiento/${encodeURIComponent(order.order_number)}`,
      );
      response.cookies.set(GUEST_ORDER_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: guestOrderCookieMaxAge(payload.expiresAt),
      });
      return response;
    }

    const response = redirectTo(request, "/seguimiento?estado=enlace-invalido");
    response.cookies.delete(GUEST_ORDER_COOKIE);
    return response;
  } catch (caught) {
    console.error(
      "guest_tracking_access_error",
      caught instanceof Error ? caught.message : "Error de acceso",
    );
    // Preserve a valid cookie during a transient database outage. Deleting it
    // would force an unnecessary recovery email and turn downtime into logout.
    return redirectTo(request, "/seguimiento?estado=no-disponible");
  }
}
