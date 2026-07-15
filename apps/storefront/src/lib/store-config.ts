export const storeConfig = {
  name: "Casa Atenta Tienda",
  shortName: "Casa Atenta",
  description:
    "Herramientas y maquinaria profesional con asesoría técnica, despacho y posventa en Perú.",
  url: process.env.NEXT_PUBLIC_STORE_URL || "https://tienda.casa-atenta.com",
  marketingUrl:
    process.env.NEXT_PUBLIC_MARKETING_URL || "https://www.casa-atenta.com",
  currency: "PEN",
  locale: "es-PE",
  preview: process.env.NEXT_PUBLIC_STORE_MODE !== "live",
  supportPhone: process.env.NEXT_PUBLIC_STORE_PHONE || "+51 999 999 999",
  supportEmail:
    process.env.NEXT_PUBLIC_STORE_EMAIL || "tienda@casa-atenta.com",
  whatsapp:
    process.env.NEXT_PUBLIC_STORE_WHATSAPP ||
    "https://wa.me/51999999999?text=Hola%20Casa%20Atenta%2C%20necesito%20asesor%C3%ADa%20para%20elegir%20una%20herramienta.",
} as const;

export function formatMoney(amountMinor: number | null) {
  if (amountMinor === null) return "Cotizar";

  return new Intl.NumberFormat(storeConfig.locale, {
    style: "currency",
    currency: storeConfig.currency,
    maximumFractionDigits: 0,
  }).format(amountMinor / 100);
}

export function absoluteStoreUrl(path = "/") {
  return new URL(path, storeConfig.url).toString();
}
