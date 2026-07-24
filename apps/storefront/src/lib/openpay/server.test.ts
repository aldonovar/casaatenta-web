import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  createOpenpayCharge,
  listOpenpayChargesByOrderId,
  OpenpayError,
  safeChargeSnapshot,
} from "./server";

const paymentAttemptId = "f4524087-c76a-4787-b8cf-f3dfae17f5c1";

function chargeInput() {
  return {
    sourceId: "source_12345678",
    deviceSessionId: "device_12345678",
    orderId: "5dd09385-2a99-409f-9207-f03162ea873f",
    paymentAttemptId,
    orderNumber: "CA-20260719-000001",
    amountMinor: 129_900,
    customerIp: "203.0.113.8",
    customer: {
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@example.com",
      phone: "+51999999999",
    },
  };
}

describe("Openpay server boundary", () => {
  beforeEach(() => {
    vi.stubEnv("OPENPAY_MERCHANT_ID", "merchant-test");
    vi.stubEnv("OPENPAY_PRIVATE_KEY", "sk_test");
    vi.stubEnv("OPENPAY_ENVIRONMENT", "sandbox");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("accepts a real 3DS-style pending response without order_id and forwards the buyer IP", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "charge-3ds",
          status: "charge_pending",
          amount: 1299,
          currency: "PEN",
          payment_method: {
            type: "redirect",
            url: "https://sandbox-api.openpay.pe/3d-secure/redirect",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    const charge = await createOpenpayCharge(chargeInput());

    expect(charge.payment_method?.url).toContain("3d-secure");
    const [, init] = fetchMock.mock.calls[0];
    expect(new Headers(init?.headers).get("X-Forwarded-For")).toBe("203.0.113.8");
  });

  it("rejects a mismatched order_id in a direct response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "charge-other",
          status: "completed",
          amount: 1299,
          currency: "PEN",
          order_id: "another-attempt",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(createOpenpayCharge(chargeInput())).rejects.toBeInstanceOf(OpenpayError);
  });

  it("rejects a provider redirect outside the Openpay HTTPS origin", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          id: "charge-redirect",
          status: "charge_pending",
          amount: 1299,
          currency: "PEN",
          payment_method: {
            type: "redirect",
            url: "javascript:alert(document.domain)",
          },
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(createOpenpayCharge(chargeInput())).rejects.toBeInstanceOf(
      OpenpayError,
    );
  });

  it("rejects an invalid buyer IP before contacting Openpay", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch");
    await expect(
      createOpenpayCharge({ ...chargeInput(), customerIp: "127.0.0.1\r\nX-Test: injected" }),
    ).rejects.toBeInstanceOf(OpenpayError);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("fails closed when a list result is malformed or belongs to another attempt", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify([
          {
            id: "charge-other",
            status: "completed",
            amount: 1299,
            currency: "PEN",
            order_id: "another-attempt",
          },
        ]),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(listOpenpayChargesByOrderId(paymentAttemptId)).rejects.toBeInstanceOf(
      OpenpayError,
    );
  });

  it("reads card metadata from the documented top-level card object", () => {
    expect(
      safeChargeSnapshot({
        id: "charge-card",
        status: "completed",
        amount: 1299,
        currency: "PEN",
        order_id: paymentAttemptId,
        card: {
          brand: "visa",
          card_number: "411111XXXXXX1111",
          bank_name: "Banco de prueba",
        },
      }).payment_method.card,
    ).toEqual({
      brand: "visa",
      last4: "1111",
      type: null,
      bank_name: "Banco de prueba",
    });
  });
});
