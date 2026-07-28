import assert from "node:assert/strict";
import test from "node:test";
import {
  buildQuotationIncidentAlert,
  isQuotationAlertEvent,
} from "../../src/lib/quotation-email/alert";

const input = {
  svixId: "msg_alert_123",
  eventType: "email.bounced" as const,
  quotationNumber: "COT-2026-001",
  recipientMasked: "c***@e***.com",
  isTest: false,
  reason: "Rebote permanente",
  occurredAt: "2026-07-26T18:30:00.000Z",
};

test("reconoce únicamente incidentes de entrega que requieren alerta", () => {
  assert.equal(isQuotationAlertEvent("email.bounced"), true);
  assert.equal(isQuotationAlertEvent("email.complained"), true);
  assert.equal(isQuotationAlertEvent("email.opened"), false);
  assert.equal(isQuotationAlertEvent("email.clicked"), false);
  assert.equal(isQuotationAlertEvent("__proto__"), false);
});

test("la alerta es estable por evento y no permite inyección de cabeceras o HTML", () => {
  const alert = buildQuotationIncidentAlert({
    ...input,
    quotationNumber: "COT-1\r\nBcc: attacker@example.com",
    recipientMasked: "c***@e***.com<script>",
    reason: "<img src=x onerror=alert(1)>",
  });
  const repeated = buildQuotationIncidentAlert({
    ...input,
    quotationNumber: "COT-1\r\nBcc: attacker@example.com",
    recipientMasked: "c***@e***.com<script>",
    reason: "<img src=x onerror=alert(1)>",
  });

  assert.equal(alert.idempotencyKey, repeated.idempotencyKey);
  assert.doesNotMatch(alert.subject, /[\r\n]/u);
  assert.doesNotMatch(alert.html, /<script>|<img/u);
  assert.match(alert.html, /&lt;script&gt;/u);
  assert.match(alert.html, /&lt;img src=x onerror=alert\(1\)&gt;/u);
});

test("cada evento firmado obtiene una clave de alerta diferente", () => {
  const first = buildQuotationIncidentAlert(input);
  const second = buildQuotationIncidentAlert({
    ...input,
    svixId: "msg_alert_456",
  });

  assert.notEqual(first.idempotencyKey, second.idempotencyKey);
  assert.match(first.idempotencyKey, /^quotation-alert-[0-9a-f]{64}$/u);
});
