import "server-only";

import { randomUUID } from "node:crypto";
import { assertSecretValue } from "@/lib/server/live-commerce-config";
import { getVerifiedClientIp } from "@/lib/server/security";

type TurnstileResponse = {
  success?: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: unknown;
};

export type StoreTurnstileAction =
  | "store_checkout"
  | "store_guest_access";

function allowedHostnames() {
  const configured = (process.env.STORE_TURNSTILE_ALLOWED_HOSTNAMES || "")
    .split(",")
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);
  return new Set(configured.length > 0 ? configured : ["tienda.casa-atenta.com"]);
}

export async function verifyStoreTurnstile(
  token: string,
  request: Request,
  expectedAction: StoreTurnstileAction = "store_checkout",
) {
  if (!token || token.length > 2_048) {
    return { valid: false, hostname: null, errors: ["invalid-token"] };
  }
  const secret = assertSecretValue(
    "STORE_TURNSTILE_SECRET_KEY",
    process.env.STORE_TURNSTILE_SECRET_KEY,
    20,
  );
  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: randomUUID(),
  });
  const clientIp = getVerifiedClientIp(request);
  if (clientIp) body.set("remoteip", clientIp);

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    },
  );
  if (!response.ok) {
    throw new Error(`turnstile_http_${response.status}`);
  }

  const result = (await response.json()) as TurnstileResponse;
  const hostname = result.hostname?.trim().toLowerCase() || null;
  const errors = Array.isArray(result["error-codes"])
    ? result["error-codes"]
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.slice(0, 80))
        .slice(0, 8)
    : [];
  return {
    valid:
      result.success === true &&
      result.action === expectedAction &&
      Boolean(hostname && allowedHostnames().has(hostname)),
    hostname,
    errors,
  };
}
