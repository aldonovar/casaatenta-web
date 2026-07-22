import type { Json, TablesUpdate } from "@/types/database.types";
import { sanitizeDeliveryError } from "./core";

export type ResendWebhookEvent = {
  type: string;
  created_at?: string;
  data?: {
    email_id?: string;
    to?: string[];
    tags?: unknown;
    bounce?: Json;
    failed?: Json;
    suppressed?: Json;
    suppression?: Json;
    error?: Json;
  };
};

export type QuotationTransition = {
  allowedStatuses: string[];
  update: TablesUpdate<"quotation_email_deliveries">;
};

export function eventTimestamp(value: string | undefined) {
  if (value) {
    const timestamp = Date.parse(value);
    if (Number.isFinite(timestamp)) return new Date(timestamp).toISOString();
  }
  return new Date().toISOString();
}

function nestedString(value: unknown, fields: string[]) {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  for (const field of fields) {
    const candidate = record[field];
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return null;
}

export function quotationEventError(event: ResendWebhookEvent, fallback: string) {
  const data = event.data;
  const detail =
    nestedString(data?.failed, ["reason", "message"]) ||
    nestedString(data?.bounce, ["message", "reason"]) ||
    nestedString(data?.suppressed, ["message", "reason"]) ||
    nestedString(data?.suppression, ["message", "reason"]) ||
    nestedString(data?.error, ["message", "reason"]);
  return sanitizeDeliveryError(detail ? `${fallback}: ${detail}` : fallback);
}

export function normalizeResendTags(value: unknown) {
  const tags: Record<string, string> = {};
  if (Array.isArray(value)) {
    for (const item of value) {
      if (!item || typeof item !== "object") continue;
      const { name, value: tagValue } = item as Record<string, unknown>;
      if (typeof name === "string" && typeof tagValue === "string") {
        tags[name] = tagValue;
      }
    }
    return tags;
  }
  if (!value || typeof value !== "object") return tags;
  for (const [name, tagValue] of Object.entries(value)) {
    if (typeof tagValue === "string") tags[name] = tagValue;
  }
  return tags;
}

export function isQuotationEvent(event: ResendWebhookEvent) {
  return normalizeResendTags(event.data?.tags).category === "quotation";
}

export function quotationDeliveryKey(event: ResendWebhookEvent) {
  const key = normalizeResendTags(event.data?.tags).delivery;
  return key && /^quotation-[0-9a-f]{64}$/u.test(key) ? key : null;
}

export function minimizedQuotationEventPayload(
  event: ResendWebhookEvent,
): Json {
  const tags = normalizeResendTags(event.data?.tags);
  const safeTags = Object.fromEntries(
    ["category", "quotation", "mode", "delivery"]
      .filter((name) => typeof tags[name] === "string")
      .map((name) => [name, tags[name]]),
  );
  return {
    type: event.type,
    created_at: event.created_at || null,
    email_id: event.data?.email_id || null,
    tags: safeTags,
  };
}

export function quotationTransition(
  event: ResendWebhookEvent,
  occurredAt: string,
): QuotationTransition | null {
  switch (event.type) {
    case "email.sent":
      return {
        allowedStatuses: ["pending", "sent"],
        update: {
          status: "sent",
          sent_at: occurredAt,
          last_event_at: occurredAt,
        },
      };
    case "email.delivery_delayed":
      return {
        allowedStatuses: ["pending", "sent"],
        update: {
          status: "sent",
          sanitized_error: quotationEventError(
            event,
            "Resend reportó una demora temporal de entrega.",
          ),
          last_event_at: occurredAt,
        },
      };
    case "email.delivered":
      return {
        allowedStatuses: ["pending", "sent", "delivered"],
        update: {
          status: "delivered",
          delivered_at: occurredAt,
          sanitized_error: null,
          last_event_at: occurredAt,
        },
      };
    case "email.opened":
    case "email.clicked":
      return {
        allowedStatuses: ["pending", "sent", "delivered"],
        update: {
          last_event_at: occurredAt,
        },
      };
    case "email.bounced":
      return {
        allowedStatuses: ["pending", "sent", "bounced"],
        update: {
          status: "bounced",
          bounced_at: occurredAt,
          sanitized_error: quotationEventError(
            event,
            "Resend reportó un rebote permanente.",
          ),
          last_event_at: occurredAt,
        },
      };
    case "email.complained":
      return {
        allowedStatuses: ["pending", "sent", "delivered", "complained"],
        update: {
          status: "complained",
          complained_at: occurredAt,
          sanitized_error: quotationEventError(
            event,
            "Resend reportó una queja de spam.",
          ),
          last_event_at: occurredAt,
        },
      };
    case "email.suppressed":
      return {
        allowedStatuses: ["pending", "sent", "suppressed"],
        update: {
          status: "suppressed",
          suppressed_at: occurredAt,
          sanitized_error: quotationEventError(
            event,
            "Resend suprimió el envío.",
          ),
          last_event_at: occurredAt,
        },
      };
    case "email.failed":
    case "email.canceled":
      return {
        allowedStatuses: ["pending", "sent", "failed"],
        update: {
          status: "failed",
          failed_at: occurredAt,
          sanitized_error: quotationEventError(
            event,
            event.type === "email.canceled"
              ? "Resend canceló el envío."
              : "Resend reportó un fallo de envío.",
          ),
          last_event_at: occurredAt,
        },
      };
    default:
      return null;
  }
}
