import assert from "node:assert/strict";
import test from "node:test";
import {
  isQuotationEvent,
  minimizedQuotationEventPayload,
  normalizeResendTags,
  quotationDeliveryKey,
  quotationTransition,
  type ResendWebhookEvent,
} from "../../src/lib/quotation-email/webhook";

const deliveryKey = `quotation-${"a".repeat(64)}`;
const occurredAt = "2026-07-16T15:30:00.000Z";

function quotationEvent(
  overrides: Partial<ResendWebhookEvent> = {},
): ResendWebhookEvent {
  return {
    type: "email.delivered",
    created_at: occurredAt,
    data: {
      email_id: "email_quotation_123",
      to: ["private-recipient@example.com"],
      tags: {
        category: "quotation",
        quotation: "DEMO-0001",
        mode: "test",
        delivery: deliveryKey,
      },
    },
    ...overrides,
  };
}

test("normaliza tags de Resend y reconoce solo eventos de cotización", () => {
  assert.deepEqual(
    normalizeResendTags([
      { name: "category", value: "quotation" },
      { name: "delivery", value: deliveryKey },
      { name: "ignored", value: 42 },
    ]),
    { category: "quotation", delivery: deliveryKey },
  );
  assert.equal(isQuotationEvent(quotationEvent()), true);
  assert.equal(
    isQuotationEvent({
      type: "email.delivered",
      data: { tags: { category: "newsletter" } },
    }),
    false,
  );
});

test("acepta únicamente una clave de entrega con formato idempotente válido", () => {
  assert.equal(quotationDeliveryKey(quotationEvent()), deliveryKey);
  assert.equal(
    quotationDeliveryKey(
      quotationEvent({
        data: {
          email_id: "email_quotation_123",
          tags: { category: "quotation", delivery: "quotation-invalid" },
        },
      }),
    ),
    null,
  );
});

test("minimiza el webhook de cotización sin destinatario ni detalle del proveedor", () => {
  const event = quotationEvent({
    type: "email.bounced",
    data: {
      email_id: "email_quotation_123",
      to: ["private-recipient@example.com"],
      tags: {
        category: "quotation",
        quotation: "DEMO-0001",
        mode: "test",
        delivery: deliveryKey,
        private: "must-not-persist",
      },
      bounce: {
        message: "Mailbox rejected private-recipient@example.com",
        reason: "hard bounce",
      },
    },
  });
  const serialized = JSON.stringify(minimizedQuotationEventPayload(event));

  assert.doesNotMatch(
    serialized,
    /private-recipient|must-not-persist|Mailbox/u,
  );
  assert.match(serialized, /email_quotation_123/u);
  assert.match(serialized, /DEMO-0001/u);
  assert.match(serialized, new RegExp(deliveryKey, "u"));
});

test("la transición delivered no puede degradarse por sent y limpia errores previos", () => {
  const delivered = quotationTransition(quotationEvent(), occurredAt);
  assert.equal(delivered?.update.status, "delivered");
  assert.equal(delivered?.update.delivered_at, occurredAt);
  assert.equal(delivered?.update.sanitized_error, null);

  const sent = quotationTransition(
    quotationEvent({ type: "email.sent" }),
    occurredAt,
  );
  assert.equal(sent?.allowedStatuses.includes("delivered"), false);
});

test("sanitiza el detalle de fallo antes de persistir la transición", () => {
  const failed = quotationTransition(
    quotationEvent({
      type: "email.failed",
      data: {
        email_id: "email_quotation_123",
        tags: { category: "quotation", delivery: deliveryKey },
        failed: { reason: "Rejected for private-recipient@example.com" },
      },
    }),
    occurredAt,
  );

  assert.equal(failed?.update.status, "failed");
  assert.match(failed?.update.sanitized_error || "", /correo oculto/u);
  assert.doesNotMatch(
    failed?.update.sanitized_error || "",
    /private-recipient@example\.com/u,
  );
});

test("las transiciones email.opened y email.clicked actualizan last_event_at sin modificar status", () => {
  const opened = quotationTransition(
    quotationEvent({ type: "email.opened" }),
    occurredAt,
  );
  assert.ok(opened);
  assert.equal(opened.update.status, undefined);
  assert.equal(opened.update.last_event_at, occurredAt);
  assert.deepEqual(opened.allowedStatuses, ["pending", "sent", "delivered"]);

  const clicked = quotationTransition(
    quotationEvent({ type: "email.clicked" }),
    occurredAt,
  );
  assert.ok(clicked);
  assert.equal(clicked.update.status, undefined);
  assert.equal(clicked.update.last_event_at, occurredAt);
  assert.deepEqual(clicked.allowedStatuses, ["pending", "sent", "delivered"]);
});
