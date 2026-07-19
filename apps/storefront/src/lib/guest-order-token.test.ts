import { describe, expect, it } from "vitest";
import { signGuestOrderToken, verifyGuestOrderToken } from "./guest-order-token";

const secret = "a-secure-independent-store-secret-123456789";
const orderId = "bb9d8f2e-73b9-4e7a-8a65-cdb8d9635e92";
const nonce = "63339c8f-cbc2-4ec6-b288-7144ee25a6fd";
const now = 1_800_000_000;

describe("guest order access tokens", () => {
  it("round-trips a signed, unexpired payload", () => {
    const token = signGuestOrderToken(
      { orderId, nonce, expiresAt: now + 900 },
      secret,
      now,
    );

    expect(verifyGuestOrderToken(token, secret, now)).toEqual({
      version: 1,
      orderId,
      nonce,
      expiresAt: now + 900,
    });
  });

  it("rejects signature tampering", () => {
    const token = signGuestOrderToken(
      { orderId, nonce, expiresAt: now + 900 },
      secret,
      now,
    );
    const tampered = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;

    expect(verifyGuestOrderToken(tampered, secret, now)).toBeNull();
  });

  it("rejects expired tokens at the exact expiry boundary", () => {
    const token = signGuestOrderToken(
      { orderId, nonce, expiresAt: now + 1 },
      secret,
      now,
    );

    expect(verifyGuestOrderToken(token, secret, now + 1)).toBeNull();
  });

  it("refuses weak secrets and invalid identifiers", () => {
    expect(() =>
      signGuestOrderToken(
        { orderId, nonce, expiresAt: now + 900 },
        "too-short",
        now,
      ),
    ).toThrow(/32 bytes/);
    expect(() =>
      signGuestOrderToken(
        { orderId: "not-a-uuid", nonce, expiresAt: now + 900 },
        secret,
        now,
      ),
    ).toThrow(/identificadores inválidos/);
  });
});
