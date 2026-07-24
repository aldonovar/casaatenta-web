import "server-only";

import {
  signGuestOrderToken,
  verifyGuestOrderToken,
  type GuestOrderTokenPayload,
} from "@/lib/guest-order-token";
import { assertSecretValue } from "@/lib/server/live-commerce-config";

export const GUEST_ORDER_COOKIE = "ca_store_guest_order";

function guestTrackingSecret() {
  return assertSecretValue(
    "STORE_GUEST_TRACKING_SECRET",
    process.env.STORE_GUEST_TRACKING_SECRET,
  );
}

export function assertGuestOrderTrackingConfigured() {
  guestTrackingSecret();
}

export function createGuestOrderAccessToken(input: {
  orderId: string;
  nonce: string;
  expiresAt: string | Date;
}) {
  const expiresAt = Math.floor(new Date(input.expiresAt).getTime() / 1000);
  return signGuestOrderToken(
    { orderId: input.orderId, nonce: input.nonce, expiresAt },
    guestTrackingSecret(),
  );
}

export function readGuestOrderAccessToken(
  token: string | undefined | null,
): GuestOrderTokenPayload | null {
  if (!token) return null;
  try {
    return verifyGuestOrderToken(token, guestTrackingSecret());
  } catch {
    return null;
  }
}

export function guestOrderCookieMaxAge(expiresAt: number) {
  return Math.max(0, Math.min(60 * 60 * 24 * 30, expiresAt - Math.floor(Date.now() / 1000)));
}
