import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { verifyStoreTurnstile } from "./turnstile";

const secret = "turnstile-store-secret-1234567890";

function request() {
  return new Request("https://tienda.casa-atenta.com/api/checkout", {
    headers: { "x-vercel-forwarded-for": "203.0.113.18" },
  });
}

describe("store Turnstile verification", () => {
  beforeEach(() => {
    vi.stubEnv("STORE_TURNSTILE_SECRET_KEY", secret);
    vi.stubEnv(
      "STORE_TURNSTILE_ALLOWED_HOSTNAMES",
      "tienda.casa-atenta.com",
    );
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

  it("accepts the exact checkout action and canonical hostname", async () => {
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: "store_checkout",
          hostname: "tienda.casa-atenta.com",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(
      verifyStoreTurnstile("single-use-token", request()),
    ).resolves.toMatchObject({ valid: true });

    const [, init] = fetchMock.mock.calls[0];
    const body = init?.body as URLSearchParams;
    expect(body.get("secret")).toBe(secret);
    expect(body.get("response")).toBe("single-use-token");
    expect(body.get("remoteip")).toBe("203.0.113.18");
    expect(body.get("idempotency_key")).toMatch(
      /^[0-9a-f]{8}-[0-9a-f-]{27}$/,
    );
  });

  it("rejects a token issued for another store action", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: "store_checkout",
          hostname: "tienda.casa-atenta.com",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(
      verifyStoreTurnstile(
        "single-use-token",
        request(),
        "store_guest_access",
      ),
    ).resolves.toMatchObject({ valid: false });
  });

  it("rejects a successful token from a non-store hostname", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(
        JSON.stringify({
          success: true,
          action: "store_guest_access",
          hostname: "www.casa-atenta.com",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );

    await expect(
      verifyStoreTurnstile(
        "single-use-token",
        request(),
        "store_guest_access",
      ),
    ).resolves.toMatchObject({ valid: false });
  });
});
