import { NextResponse } from "next/server";
import { verifyAdminAccessToken } from "@/lib/quotation-email/admin-session";
import {
  issueQuotationAdminSession,
  quotationAdminCookieName,
  quotationAdminCookieOptions,
} from "@/lib/server/quotation-admin-auth";
import { getQuotationAdminConfig } from "@/lib/server/env";
import { checkRateLimit, getRequestFingerprint } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function redirectTo(request: Request, query = "") {
  const response = NextResponse.redirect(
    new URL(`/admin/cotizaciones${query}`, request.url),
    303,
  );
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  return response;
}

function hasSameOrigin(request: Request) {
  return request.headers.get("origin") === new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) {
    return new Response(null, { status: 403 });
  }

  const logout = new URL(request.url).searchParams.get("logout") === "1";
  if (logout) {
    const response = redirectTo(request);
    response.cookies.set(quotationAdminCookieName(), "", {
      ...quotationAdminCookieOptions(),
      maxAge: 0,
    });
    return response;
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 4_096) {
    return redirectTo(request, "?error=invalid");
  }

  try {
    const allowed = await checkRateLimit(
      getRequestFingerprint(request),
      "quotation-admin-login",
      5,
      15 * 60,
    );
    if (!allowed) return redirectTo(request, "?error=rate");

    const formData = await request.formData();
    const receivedToken = formData.get("accessToken");
    const { accessToken } = getQuotationAdminConfig();
    if (
      typeof receivedToken !== "string" ||
      !verifyAdminAccessToken(receivedToken, accessToken)
    ) {
      return redirectTo(request, "?error=invalid");
    }

    const response = redirectTo(request);
    response.cookies.set(
      quotationAdminCookieName(),
      issueQuotationAdminSession(),
      quotationAdminCookieOptions(),
    );
    return response;
  } catch {
    return redirectTo(request, "?error=unavailable");
  }
}
