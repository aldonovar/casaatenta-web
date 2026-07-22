import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { isIP } from "node:net";
import { storeConfig } from "@/lib/store-config";
import { assertSecretValue } from "@/lib/server/live-commerce-config";

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function getVerifiedClientIp(request: Request) {
  const candidate = getClientIp(request);
  return isIP(candidate) ? candidate : null;
}

export function getRequestFingerprint(
  request: Request,
  scope = "store-request",
) {
  if (!/^[a-z0-9-]{3,80}$/.test(scope)) {
    throw new Error("El alcance del fingerprint no es válido.");
  }
  const configuredSecret = process.env.RATE_LIMIT_SECRET;
  const secret =
    process.env.NODE_ENV === "production"
      ? assertSecretValue("RATE_LIMIT_SECRET", configuredSecret)
      : configuredSecret?.trim() || "local-development-only";
  return createHmac("sha256", secret || "local-development-only")
    .update(`${scope}:${getClientIp(request)}`)
    .digest("hex");
}

export function hashPayload(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function constantTimeEqual(received: string, expected: string) {
  const receivedBuffer = Buffer.from(received);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    timingSafeEqual(receivedBuffer, expectedBuffer)
  );
}

export function isAllowedStoreOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return process.env.NODE_ENV !== "production";

  const allowed = new Set([new URL(storeConfig.url).origin]);
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
    for (const hostname of [
      process.env.VERCEL_URL,
      process.env.VERCEL_BRANCH_URL,
    ]) {
      if (hostname) allowed.add(`https://${hostname}`);
    }
  }
  if (process.env.NODE_ENV !== "production") {
    allowed.add("http://localhost:3000");
    allowed.add("http://127.0.0.1:3000");
    allowed.add("http://localhost:3001");
    allowed.add("http://127.0.0.1:3001");
  }
  return allowed.has(origin);
}

export function readBasicCredentials(request: Request) {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Basic ")) return null;
  try {
    const decoded = Buffer.from(authorization.slice(6), "base64").toString(
      "utf8",
    );
    const separator = decoded.indexOf(":");
    if (separator < 0) return null;
    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}
