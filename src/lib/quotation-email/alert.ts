import { createHash } from "node:crypto";

export const QUOTATION_ALERT_LABELS = {
  "email.delivery_delayed": "Entrega demorada",
  "email.bounced": "Rebote permanente",
  "email.complained": "Queja de spam",
  "email.suppressed": "Destinatario suprimido",
  "email.failed": "Fallo de entrega",
  "email.canceled": "Envío cancelado",
} as const;

export type QuotationAlertEventType = keyof typeof QUOTATION_ALERT_LABELS;

export type QuotationIncidentAlertInput = {
  svixId: string;
  eventType: QuotationAlertEventType;
  quotationNumber: string;
  recipientMasked: string;
  isTest: boolean;
  reason: string;
  occurredAt: string | null;
};

function inlineText(value: unknown, maximum: number) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]+/gu, " ")
    .replace(/\s+/gu, " ")
    .trim()
    .slice(0, maximum);
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/gu,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      })[character] || character,
  );
}

function formatOccurredAt(value: string | null) {
  const parsed = value ? new Date(value) : new Date();
  const safeDate = Number.isFinite(parsed.getTime()) ? parsed : new Date();
  return safeDate.toLocaleString("es-PE", { timeZone: "America/Lima" });
}

export function isQuotationAlertEvent(
  eventType: string,
): eventType is QuotationAlertEventType {
  return Object.hasOwn(QUOTATION_ALERT_LABELS, eventType);
}

export function buildQuotationIncidentAlert(
  input: QuotationIncidentAlertInput,
) {
  const mode = input.isTest ? "PRUEBA" : "PRODUCCIÓN";
  const label = QUOTATION_ALERT_LABELS[input.eventType];
  const quotationNumber = inlineText(input.quotationNumber, 40);
  const recipientMasked = inlineText(input.recipientMasked, 254);
  const reason = inlineText(input.reason || label, 300);
  const occurredAt = formatOccurredAt(input.occurredAt);
  const alertHash = createHash("sha256")
    .update(`quotation-alert:v2:${input.svixId}`)
    .digest("hex");

  return {
    subject: `[${mode}] Cotización ${quotationNumber}: ${label}`,
    html: `
      <div style="font-family:sans-serif;padding:20px;color:#273445;background-color:#f4f0e8;border:1px solid #ff4d4f;border-left:4px solid #ff4d4f;">
        <h2 style="color:#a41313;margin-top:0;">${escapeHtml(label)}</h2>
        <p>Cotización: <strong>${escapeHtml(quotationNumber)}</strong></p>
        <p>Destinatario: <strong>${escapeHtml(recipientMasked)}</strong></p>
        <p>Detalle: <strong>${escapeHtml(reason)}</strong></p>
        <p>Fecha/hora: ${escapeHtml(occurredAt)} (Lima)</p>
      </div>
    `,
    text: `${label}. Cotización ${quotationNumber}; destinatario ${recipientMasked}; detalle: ${reason}; fecha/hora: ${occurredAt} (Lima).`,
    tags: [
      { name: "category", value: "quotation_alert" },
      { name: "event", value: input.eventType.replace(/^email\./u, "") },
    ],
    idempotencyKey: `quotation-alert-${alertHash}`,
  };
}
