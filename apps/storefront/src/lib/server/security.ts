import "server-only";

import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { storeConfig } from "@/lib/store-config";

export function getClientIp(request: Request) {
  return (
    request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function getRequestFingerprint(request: Request) {
  const secret =
    process.env.RATE_LIMIT_SECRET || process.env.OPENPAY_PRIVATE_KEY || "";
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("Falta configurar RATE_LIMIT_SECRET.");
  }
  return createHmac("sha256", secret || "local-development-only")
    .update(`store-checkout:${getClientIp(request)}`)
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
