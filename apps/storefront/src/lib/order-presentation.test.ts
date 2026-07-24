import { describe, expect, it } from "vitest";
import {
  fulfilmentStateLabel,
  formatStoreDateTime,
  orderStateLabel,
  paymentStateLabel,
  safeExternalTrackingUrl,
  shipmentStateLabel,
} from "./order-presentation";

describe("order presentation", () => {
  it("maps known commerce states and degrades safely for unknown values", () => {
    expect(orderStateLabel("confirmed")).toBe("Pedido confirmado");
    expect(paymentStateLabel("paid")).toBe("Pagado");
    expect(fulfilmentStateLabel("preparing")).toBe("En preparación");
    expect(shipmentStateLabel("in_transit")).toBe("En tránsito");
    expect(orderStateLabel("future_state")).toBe("Estado en revisión");
  });

  it("formats server dates in Lima instead of the runtime timezone", () => {
    const formatted = formatStoreDateTime("2026-07-19T02:30:00.000Z");
    expect(formatted).toMatch(/18 jul\.? 2026/);
    expect(formatted).toMatch(/9:30|21:30/);
  });

  it("allows only absolute HTTPS tracking URLs", () => {
    expect(safeExternalTrackingUrl("https://carrier.example/track?id=1")).toBe(
      "https://carrier.example/track?id=1",
    );
    expect(safeExternalTrackingUrl("http://carrier.example/track")).toBeNull();
    expect(safeExternalTrackingUrl("javascript:alert(1)")).toBeNull();
    expect(safeExternalTrackingUrl("/relative/path")).toBeNull();
    expect(safeExternalTrackingUrl(null)).toBeNull();
  });
});
