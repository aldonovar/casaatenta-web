import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { getNewsletterTokenSecret, getRateLimitSecret } from "./env";
import { getSupabaseAdmin } from "./supabase";

export function getClientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  );
}

export function getRequestFingerprint(request: Request) {
  return getValueFingerprint("ip", getClientIp(request));
}

export function getValueFingerprint(namespace: string, value: string) {
  return createHmac("sha256", getRateLimitSecret())
    .update(`${namespace}:${value.trim().toLowerCase()}`)
    .digest("hex");
}

export function createOpaqueToken() {
  return randomBytes(32).toString("base64url");
}

export function createNewsletterConfirmationToken(
  subscriberId: string,
  expiresAt: string | Date,
) {
  const normalizedExpiry = new Date(expiresAt).toISOString();
  const signature = createHmac("sha256", getNewsletterTokenSecret())
    .update(`newsletter-confirmation:v1:${subscriberId}:${normalizedExpiry}`)
    .digest("base64url");

  return `v1.${signature}`;
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createUnsubscribeToken(subscriberId: string) {
  const signature = createHmac("sha256", getNewsletterTokenSecret())
    .update(`unsubscribe:${subscriberId}`)
    .digest("base64url");
  return `${subscriberId}.${signature}`;
}

export function readUnsubscribeToken(token: string) {
  const separator = token.lastIndexOf(".");
  if (separator < 1) return null;

  const subscriberId = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  const expected = createHmac("sha256", getNewsletterTokenSecret())
    .update(`unsubscribe:${subscriberId}`)
    .digest("base64url");
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return null;
  }

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    subscriberId,
  )
    ? subscriberId
    : null;
}

export async function checkRateLimit(
  fingerprint: string,
  scope: string,
  limit: number,
  windowSeconds: number,
) {
  const { data, error } = await getSupabaseAdmin().rpc(
    "check_submission_rate_limit",
    {
      p_fingerprint: fingerprint,
      p_scope: scope,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    },
  );

  if (error) throw error;
  return data === true;
}

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
