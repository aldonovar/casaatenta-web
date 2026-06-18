export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "51908550942";

export const DEFAULT_WHATSAPP_MESSAGE =
  "Hola Casa Atenta, quiero agendar una visita técnica para evaluar un espacio de mi casa.";

export function createWhatsAppLink(message = DEFAULT_WHATSAPP_MESSAGE) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export const WHATSAPP_LINK = createWhatsAppLink();
