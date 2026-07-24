export type ReconciliationAction =
  | "confirm"
  | "reject"
  | "wait"
  | "review";

const DEFINITIVE_CARD_REJECTION_CODES = new Set([
  1007,
  2010,
  3001,
  3002,
  3003,
  3004,
  3005,
  3006,
  3007,
  3008,
  3009,
  3010,
  3011,
]);
const DEFINITIVE_NO_CHARGE_CODES = new Set([1001, 1003, 1005]);

export function isDefinitiveOpenpayCardRejection(
  status: number,
  code: number | undefined,
) {
  return status === 402 && code !== undefined && DEFINITIVE_CARD_REJECTION_CODES.has(code);
}

export function isDefinitiveOpenpayNoChargeError(
  status: number,
  code: number | undefined,
) {
  return (
    [400, 404, 422].includes(status) &&
    code !== undefined &&
    DEFINITIVE_NO_CHARGE_CODES.has(code)
  );
}

export function classifyOpenpayChargeStatus(status: string): ReconciliationAction {
  const normalized = status.trim().toLowerCase();
  if (["completed", "paid"].includes(normalized)) return "confirm";
  if (["failed", "cancelled", "canceled"].includes(normalized)) return "reject";
  if (
    [
      "pending",
      "in_progress",
      "charge_pending",
      "created",
      "authorized",
    ].includes(normalized)
  ) {
    return "wait";
  }
  return "review";
}
