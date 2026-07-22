import { describe, expect, it } from "vitest";
import {
  classifyOpenpayChargeStatus,
  isDefinitiveOpenpayCardRejection,
  isDefinitiveOpenpayNoChargeError,
} from "./reconciliation";

describe("Openpay reconciliation status classifier", () => {
  it.each(["completed", "paid", " COMPLETED "])(
    "confirms %s",
    (status) => expect(classifyOpenpayChargeStatus(status)).toBe("confirm"),
  );

  it.each(["failed", "cancelled", "canceled"])(
    "rejects %s",
    (status) => expect(classifyOpenpayChargeStatus(status)).toBe("reject"),
  );

  it.each(["pending", "in_progress", "charge_pending", "created", "authorized"])(
    "waits for %s",
    (status) => expect(classifyOpenpayChargeStatus(status)).toBe("wait"),
  );

  it("routes an unknown provider status to manual review", () => {
    expect(classifyOpenpayChargeStatus("new-provider-state")).toBe("review");
  });
});

describe("Openpay synchronous rejection classifier", () => {
  it.each([1007, 2010, 3001, 3005, 3011])(
    "accepts documented card rejection code %s only with HTTP 402",
    (code) => {
      expect(isDefinitiveOpenpayCardRejection(402, code)).toBe(true);
      expect(isDefinitiveOpenpayCardRejection(409, code)).toBe(false);
    },
  );

  it("keeps duplicate, throttled and unknown responses in reconciliation", () => {
    expect(isDefinitiveOpenpayCardRejection(409, 1006)).toBe(false);
    expect(isDefinitiveOpenpayCardRejection(429, undefined)).toBe(false);
    expect(isDefinitiveOpenpayCardRejection(402, 9999)).toBe(false);
  });

  it.each([1001, 1003, 1005])(
    "releases safely for request/resource error %s only on a non-creating HTTP status",
    (code) => {
      expect(isDefinitiveOpenpayNoChargeError(400, code)).toBe(true);
      expect(isDefinitiveOpenpayNoChargeError(422, code)).toBe(true);
      expect(isDefinitiveOpenpayNoChargeError(500, code)).toBe(false);
    },
  );

  it("keeps duplicate-order and provider outages in reconciliation", () => {
    expect(isDefinitiveOpenpayNoChargeError(409, 1006)).toBe(false);
    expect(isDefinitiveOpenpayNoChargeError(503, 1004)).toBe(false);
  });
});
