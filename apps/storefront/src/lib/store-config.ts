const publicStoreMode = process.env.NEXT_PUBLIC_STORE_MODE || "preview";
const supportPhone =
  process.env.NEXT_PUBLIC_STORE_PHONE?.trim() || "+51 908 550 942";
const supportEmail =
  process.env.NEXT_PUBLIC_STORE_EMAIL?.trim() || "tienda@casa-atenta.com";
const whatsapp =
  process.env.NEXT_PUBLIC_STORE_WHATSAPP?.trim() ||
  "https://wa.me/51908550942";
const legalAddress = process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() || "";
const deliveryWindow =
  process.env.NEXT_PUBLIC_STORE_DELIVERY_WINDOW?.trim() ||
  "Pendiente de aprobación comercial";
const pendingLegalAddress =
  "Pendiente de validación para el lanzamiento comercial";

const publicLiveSettings = {
  NEXT_PUBLIC_STORE_URL: process.env.NEXT_PUBLIC_STORE_URL,
  NEXT_PUBLIC_MARKETING_URL: process.env.NEXT_PUBLIC_MARKETING_URL,
  NEXT_PUBLIC_STORE_PHONE: process.env.NEXT_PUBLIC_STORE_PHONE,
  NEXT_PUBLIC_STORE_EMAIL: process.env.NEXT_PUBLIC_STORE_EMAIL,
  NEXT_PUBLIC_STORE_WHATSAPP: process.env.NEXT_PUBLIC_STORE_WHATSAPP,
  NEXT_PUBLIC_STORE_DELIVERY_WINDOW:
    process.env.NEXT_PUBLIC_STORE_DELIVERY_WINDOW,
  NEXT_PUBLIC_LEGAL_ADDRESS: process.env.NEXT_PUBLIC_LEGAL_ADDRESS,
};

if (publicStoreMode === "live") {
  const invalid = Object.entries(publicLiveSettings)
    .filter(([, value]) =>
      !value?.trim() || /REPLACE|YOUR_|999[\s-]?999|example/i.test(value),
    )
    .map(([name]) => name);
  if (invalid.length > 0) {
    throw new Error(
      `La tienda no puede compilar en modo live: configura ${invalid.join(", ")}.`,
    );
  }
}

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
  preview: publicStoreMode !== "live",
  supportPhone,
  supportEmail,
  whatsapp,
  deliveryWindow,
  legal: {
    tradeName: "CASA ATENTA",
    holderName: "Jhon Bryan Febres Urbano",
    ruc: "10742914599",
    address: legalAddress,
    privacyEmail: supportEmail,
  },
} as const;

export type StoreLegalProviderSnapshot = {
  holder_name: string;
  trade_name: string;
  ruc: string;
  address: string;
  email: string;
  phone: string;
};

export function getStoreLegalProviderSnapshot(): StoreLegalProviderSnapshot {
  return {
    holder_name: storeConfig.legal.holderName,
    trade_name: storeConfig.legal.tradeName,
    ruc: storeConfig.legal.ruc,
    address: storeConfig.legal.address || pendingLegalAddress,
    email: storeConfig.legal.privacyEmail,
    phone: storeConfig.supportPhone,
  };
}

export function formatMoney(amountMinor: number | null) {
  if (amountMinor === null) return "Cotizar";

  return new Intl.NumberFormat(storeConfig.locale, {
    style: "currency",
    currency: storeConfig.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}

export function absoluteStoreUrl(path = "/") {
  return new URL(path, storeConfig.url).toString();
}
