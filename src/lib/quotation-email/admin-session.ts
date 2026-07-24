import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";

export const QUOTATION_ADMIN_SESSION_TTL_SECONDS = 4 * 60 * 60;

function signatureFor(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    timingSafeEqual(leftBuffer, rightBuffer)
  );
}

export function verifyAdminAccessToken(received: string, expected: string) {
  return safeEqual(received.trim(), expected);
}

export function createQuotationAdminSession(secret: string, now = Date.now()) {
  const expiresAt =
    Math.floor(now / 1000) + QUOTATION_ADMIN_SESSION_TTL_SECONDS;
  const nonce = randomBytes(24).toString("base64url");
  const payload = `v1.${expiresAt}.${nonce}`;
  return `${payload}.${signatureFor(payload, secret)}`;
}

export function verifyQuotationAdminSession(
  token: string | undefined,
  secret: string,
  now = Date.now(),
) {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 4) return false;
  const [version, rawExpiresAt, nonce, receivedSignature] = parts;
  if (
    version !== "v1" ||
    !/^\d{10}$/u.test(rawExpiresAt) ||
    !/^[A-Za-z0-9_-]{24,64}$/u.test(nonce) ||
    !/^[A-Za-z0-9_-]{32,64}$/u.test(receivedSignature)
  ) {
    return false;
  }

  const expiresAt = Number(rawExpiresAt);
  const currentTime = Math.floor(now / 1000);
  if (
    !Number.isSafeInteger(expiresAt) ||
    expiresAt <= currentTime ||
    expiresAt > currentTime + QUOTATION_ADMIN_SESSION_TTL_SECONDS + 60
  ) {
    return false;
  }

  const payload = `${version}.${rawExpiresAt}.${nonce}`;
  return safeEqual(receivedSignature, signatureFor(payload, secret));
}
