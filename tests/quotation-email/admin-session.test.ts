import assert from "node:assert/strict";
import test from "node:test";
import {
  createQuotationAdminSession,
  verifyAdminAccessToken,
  verifyQuotationAdminSession,
} from "../../src/lib/quotation-email/admin-session";

const secret = "session-secret-with-more-than-thirty-two-characters";

test("la sesión firmada es válida, expira y detecta alteraciones", () => {
  const now = Date.parse("2026-07-16T12:00:00Z");
  const token = createQuotationAdminSession(secret, now);
  assert.equal(verifyQuotationAdminSession(token, secret, now), true);
  assert.equal(
    verifyQuotationAdminSession(`${token.slice(0, -1)}x`, secret, now),
    false,
  );
  assert.equal(
    verifyQuotationAdminSession(token, secret, now + 5 * 60 * 60 * 1000),
    false,
  );
});

test("la comparación del token no acepta prefijos ni espacios internos", () => {
  const expected = "access-token-with-more-than-thirty-two-characters";
  assert.equal(verifyAdminAccessToken(expected, expected), true);
  assert.equal(verifyAdminAccessToken(expected.slice(0, -1), expected), false);
  assert.equal(verifyAdminAccessToken(`${expected}x`, expected), false);
});
