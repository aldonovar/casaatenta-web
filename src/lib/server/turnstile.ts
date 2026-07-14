import "server-only";

import { randomUUID } from "node:crypto";
import { getTurnstileConfig } from "./env";
import { getClientIp } from "./security";

type TurnstileResponse = {
  success: boolean;
  hostname?: string;
  action?: string;
  "error-codes"?: string[];
};

export async function verifyTurnstile(
  token: string,
  request: Request,
  expectedAction: string,
) {
  const { secretKey, allowedHostnames } = getTurnstileConfig();
  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: secretKey,
        response: token,
        remoteip: getClientIp(request),
        idempotency_key: randomUUID(),
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(8_000),
    },
  );

  if (!response.ok) {
    throw new Error(`Turnstile respondió con HTTP ${response.status}.`);
  }

  const result = (await response.json()) as TurnstileResponse;
  const hostname = result.hostname?.toLowerCase();
  const hostnameAllowed =
    process.env.NODE_ENV === "development" && hostname === "localhost"
      ? true
      : Boolean(hostname && allowedHostnames.includes(hostname));

  return {
    valid:
      result.success === true &&
      result.action === expectedAction &&
      hostnameAllowed,
    hostname: result.hostname || null,
    errors: result["error-codes"] || [],
  };
}
