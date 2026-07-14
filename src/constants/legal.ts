export const LEGAL_PROVIDER = {
  tradeName: "CASA ATENTA",
  holderName: "Jhon Bryan Febres Urbano",
  displayName: "Jhon Febres",
  ruc: "10742914599",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS?.trim() || "",
} as const;

export const LEGAL_PROVIDER_LABEL = `${LEGAL_PROVIDER.holderName}, persona natural con negocio que opera bajo el nombre comercial ${LEGAL_PROVIDER.tradeName}, RUC ${LEGAL_PROVIDER.ruc}`;
