export const ORDER_STATE_LABELS: Record<string, string> = {
  payment_pending: "Pago pendiente",
  confirmed: "Pedido confirmado",
  processing: "En preparación",
  ready_to_ship: "Listo para despacho",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export const PAYMENT_STATE_LABELS: Record<string, string> = {
  pending: "Pendiente de confirmación",
  authorized: "Autorizado",
  paid: "Pagado",
  failed: "No aprobado",
  refunded: "Reembolsado",
  partially_refunded: "Reembolso parcial",
  chargeback: "En contracargo",
};

export const FULFILMENT_STATE_LABELS: Record<string, string> = {
  unfulfilled: "Aún no iniciado",
  preparing: "En preparación",
  ready: "Listo para despacho",
  shipped: "Despachado",
  delivered: "Entregado",
  returned: "Devuelto",
};

export const SHIPMENT_STATE_LABELS: Record<string, string> = {
  preparing: "Preparando envío",
  ready: "Listo para despacho",
  in_transit: "En tránsito",
  delivered: "Entregado",
  exception: "Incidencia logística",
  returned: "Devuelto",
};

export function orderStateLabel(value: string) {
  return ORDER_STATE_LABELS[value] || "Estado en revisión";
}

export function paymentStateLabel(value: string) {
  return PAYMENT_STATE_LABELS[value] || "Estado en revisión";
}

export function fulfilmentStateLabel(value: string) {
  return FULFILMENT_STATE_LABELS[value] || "Estado en revisión";
}

export function shipmentStateLabel(value: string) {
  return SHIPMENT_STATE_LABELS[value] || "Estado en revisión";
}

export function safeExternalTrackingUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

export function formatStoreDate(
  value: string | number | Date,
  dateStyle: "short" | "medium" | "long" = "medium",
) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle,
    timeZone: "America/Lima",
  }).format(new Date(value));
}

export function formatStoreDateTime(value: string | number | Date) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(value));
}
