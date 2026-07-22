import "server-only";

import { cookies } from "next/headers";
import {
  QUOTATION_ADMIN_SESSION_TTL_SECONDS,
  createQuotationAdminSession,
  verifyQuotationAdminSession,
} from "@/lib/quotation-email/admin-session";
import { getQuotationAdminConfig } from "./env";

export const QUOTATION_ADMIN_REQUEST_HEADER = "x-casa-atenta-admin-request";
export const QUOTATION_ADMIN_REQUEST_VALUE = "quotation-email-v1";

export function quotationAdminCookieName() {
  return process.env.NODE_ENV === "production"
    ? "__Host-ca-quotation-admin"
    : "ca-quotation-admin";
}

export function quotationAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: QUOTATION_ADMIN_SESSION_TTL_SECONDS,
  };
}

export function issueQuotationAdminSession() {
  const { sessionSecret } = getQuotationAdminConfig();
  return createQuotationAdminSession(sessionSecret);
}

export async function hasQuotationAdminSession() {
  try {
    const { sessionSecret } = getQuotationAdminConfig();
    const cookieStore = await cookies();
    return verifyQuotationAdminSession(
      cookieStore.get(quotationAdminCookieName())?.value,
      sessionSecret,
    );
  } catch {
    return false;
  }
}

export function assertQuotationAdminRequest(request: Request) {
  const origin = request.headers.get("origin");
  const requestOrigin = new URL(request.url).origin;
  const fetchSite = request.headers.get("sec-fetch-site");
  const requestMarker = request.headers.get(QUOTATION_ADMIN_REQUEST_HEADER);

  if (
    origin !== requestOrigin ||
    (fetchSite && fetchSite !== "same-origin") ||
    requestMarker !== QUOTATION_ADMIN_REQUEST_VALUE
  ) {
    throw new Error("INVALID_ADMIN_REQUEST");
  }
}
