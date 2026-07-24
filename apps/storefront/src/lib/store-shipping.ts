export const STORE_SHIPPING = {
  onlineDepartments: ["Lima", "Callao"] as const,
  standardRateMinor: 1_990,
  freeShippingThresholdMinor: 70_000,
} as const;

export type OnlineShippingDepartment =
  (typeof STORE_SHIPPING.onlineDepartments)[number];

export function calculateOnlineShippingMinor(subtotalMinor: number) {
  return subtotalMinor >= STORE_SHIPPING.freeShippingThresholdMinor
    ? 0
    : STORE_SHIPPING.standardRateMinor;
}
