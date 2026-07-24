import { NextResponse } from "next/server";
import { z } from "zod";
import {
  constantTimeEqual,
  hashPayload,
  readBasicCredentials,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { assertLiveCommerceConfig } from "@/lib/server/live-commerce-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OpenpayCard = {
  brand?: string;
  card_number?: string;
  type?: string;
  bank_name?: string;
};

type OpenpayWebhook = {
  type?: string;
  event_date?: string;
  verification_code?: string;
  transaction?: {
    id?: string;
    order_id?: string;
    status?: string;
    authorization?: string;
    error_message?: string;
    amount?: number;
    currency?: string;
    card?: OpenpayCard;
    payment_method?: { type?: string; card?: OpenpayCard };
  };
};

type ApplyResult = {
  status?: string;
  event_id?: number;
  payment_id?: string;
  order_id?: string;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const providerEventPattern = /^[A-Za-z0-9][A-Za-z0-9._:-]{0,79}$/;
const MAX_STORE_TOTAL_MINOR = 100_000_000;
const unknownRecordSchema = z.record(z.string(), z.unknown());

function safeText(value: unknown, maximum: number) {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maximum) : null;
}

function recordOf(value: unknown) {
  const parsed = unknownRecordSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function normalizeCard(value: unknown): OpenpayCard | undefined {
  const card = recordOf(value);
  if (!card) return undefined;
  return {
    brand: typeof card.brand === "string" ? card.brand : undefined,
    card_number:
      typeof card.card_number === "string" ? card.card_number : undefined,
    type: typeof card.type === "string" ? card.type : undefined,
    bank_name:
      typeof card.bank_name === "string" ? card.bank_name : undefined,
  };
}

function normalizeWebhook(value: unknown): OpenpayWebhook | null {
  const envelope = recordOf(value);
  if (!envelope) return null;
  const transaction = recordOf(envelope.transaction);
  const paymentMethod = transaction
    ? recordOf(transaction.payment_method)
    : null;
  return {
    type: typeof envelope.type === "string" ? envelope.type : undefined,
    event_date:
      typeof envelope.event_date === "string" ? envelope.event_date : undefined,
    verification_code:
      typeof envelope.verification_code === "string"
        ? envelope.verification_code
        : undefined,
    transaction: transaction
      ? {
          id: typeof transaction.id === "string" ? transaction.id : undefined,
          order_id:
            typeof transaction.order_id === "string"
              ? transaction.order_id
              : undefined,
          status:
            typeof transaction.status === "string"
              ? transaction.status
              : undefined,
          authorization:
            typeof transaction.authorization === "string"
              ? transaction.authorization
              : undefined,
          error_message:
            typeof transaction.error_message === "string"
              ? transaction.error_message
              : undefined,
          amount:
            typeof transaction.amount === "number"
              ? transaction.amount
              : undefined,
          currency:
            typeof transaction.currency === "string"
              ? transaction.currency
              : undefined,
          card: normalizeCard(transaction.card),
          payment_method: paymentMethod
            ? {
                type:
                  typeof paymentMethod.type === "string"
                    ? paymentMethod.type
                    : undefined,
                card: normalizeCard(paymentMethod.card),
              }
            : undefined,
        }
      : undefined,
  };
}

async function persistMalformedWebhook(
  admin: ReturnType<typeof getSupabaseAdmin>,
  eventKey: string,
  reason: string,
  receivedKind: string,
) {
  return admin.from("store_payment_events").upsert(
    {
      provider: "openpay",
      event_key: eventKey,
      event_type: "provider_payload.invalid",
      external_payment_id: null,
      payload: { shape_valid: false, received_kind: receivedKind.slice(0, 40) },
      processed_at: new Date().toISOString(),
      processing_error: reason.slice(0, 500),
    },
    { onConflict: "event_key", ignoreDuplicates: true },
  );
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function authorized(request: Request) {
  const expectedUsername = process.env.OPENPAY_WEBHOOK_USERNAME || "";
  const expectedPassword = process.env.OPENPAY_WEBHOOK_PASSWORD || "";
  if (!expectedUsername || !expectedPassword) return null;
  const received = readBasicCredentials(request);
  return Boolean(
    received &&
      constantTimeEqual(received.username, expectedUsername) &&
      constantTimeEqual(received.password, expectedPassword),
  );
}

function safeCardSummary(transaction: NonNullable<OpenpayWebhook["transaction"]>) {
  const card = transaction.card || transaction.payment_method?.card;
  if (!card) return {};
  const digits = String(card.card_number || "").replace(/\D/g, "");
  return {
    brand: safeText(card.brand, 80),
    last4: digits.slice(-4) || null,
    type: safeText(card.type, 40),
    bank_name: safeText(card.bank_name, 120),
  };
}

function safeWebhookSnapshot(
  payload: OpenpayWebhook,
  transaction: NonNullable<OpenpayWebhook["transaction"]>,
) {
  return {
    type: safeText(payload.type, 80),
    event_date: safeText(payload.event_date, 80),
    transaction: {
      id: safeText(transaction.id, 255),
      order_id: safeText(transaction.order_id, 80),
      status: safeText(transaction.status, 80),
      amount:
        typeof transaction.amount === "number" &&
        Number.isFinite(transaction.amount) &&
        Math.abs(transaction.amount) <= MAX_STORE_TOTAL_MINOR / 100
          ? transaction.amount
          : null,
      currency: safeText(transaction.currency, 3),
      has_authorization: Boolean(transaction.authorization),
      payment_method_type: transaction.payment_method?.type || null,
      card: safeCardSummary(transaction),
    },
  };
}

export async function POST(request: Request) {
  try {
    assertLiveCommerceConfig();
  } catch {
    console.error("openpay_webhook_configuration_invalid");
    return json({ error: "Webhook no configurado" }, 503);
  }
  const authState = authorized(request);
  if (authState === null) {
    console.error("openpay_webhook_credentials_missing");
    return json({ error: "Webhook no configurado" }, 503);
  }
  if (!authState) {
    return new NextResponse(null, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Casa Atenta Openpay"',
        "Cache-Control": "no-store",
      },
    });
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 1_048_576) return json({ error: "Payload demasiado grande" }, 413);
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 1_048_576) {
    return json({ error: "Payload demasiado grande" }, 413);
  }

  const admin = getSupabaseAdmin();
  const eventKey = hashPayload(rawBody);
  let decoded: unknown;
  try {
    decoded = JSON.parse(rawBody) as unknown;
  } catch {
    const malformed = await persistMalformedWebhook(
      admin,
      eventKey,
      "Evento rechazado: JSON inválido",
      "invalid_json",
    );
    if (malformed.error) {
      return json({ error: "No pudimos registrar el rechazo" }, 503);
    }
    return json({ received: true, rejected: true });
  }
  const payload = normalizeWebhook(decoded);
  if (!payload) {
    const malformed = await persistMalformedWebhook(
      admin,
      eventKey,
      "Evento rechazado: el payload no es un objeto",
      decoded === null ? "null" : typeof decoded,
    );
    if (malformed.error) {
      return json({ error: "No pudimos registrar el rechazo" }, 503);
    }
    return json({ received: true, rejected: true });
  }
  const eventType = safeText(payload.type, 160);
  const transaction = payload.transaction;

  if (eventType === "verification") {
    const verificationCode = safeText(payload.verification_code, 255);
    if (!verificationCode) {
      const malformed = await persistMalformedWebhook(
        admin,
        eventKey,
        "Evento de verificación rechazado: falta verification_code",
        "verification",
      );
      if (malformed.error) {
        return json({ error: "No pudimos registrar el rechazo" }, 503);
      }
      return json({ received: true, rejected: true });
    }
    const verification = await admin
      .from("store_payment_events")
      .upsert(
        {
          provider: "openpay",
          event_key: eventKey,
          event_type: eventType,
          external_payment_id: null,
          payload: {
            type: "verification",
            event_date: payload.event_date || null,
            has_verification_code: Boolean(payload.verification_code),
          },
          processed_at: new Date().toISOString(),
          processing_error: null,
        },
        { onConflict: "event_key", ignoreDuplicates: true },
      );
    if (verification.error) {
      console.error("openpay_verification_persist_error", verification.error.code);
      return json({ error: "No pudimos verificar el webhook" }, 503);
    }
    return json({
      received: true,
      verification_code: verificationCode,
    });
  }

  if (
    !transaction ||
    typeof transaction.id !== "string" ||
    transaction.id.trim().length < 1 ||
    transaction.id.trim().length > 255
  ) {
    const rejected = await admin
      .from("store_payment_events")
      .upsert(
        {
          provider: "openpay",
          event_key: eventKey,
          event_type: "provider_payload.invalid",
          external_payment_id: null,
          payload: {
            reported_type: safeText(eventType, 80),
            event_date: safeText(payload.event_date, 80),
            has_transaction: Boolean(transaction),
          },
          processed_at: new Date().toISOString(),
          processing_error: "Evento rechazado: falta transaction.id",
        },
        { onConflict: "event_key", ignoreDuplicates: true },
      );
    if (rejected.error) return json({ error: "No pudimos registrar el rechazo" }, 503);
    return json({ received: true, rejected: true });
  }

  const amountMinor =
    typeof transaction.amount === "number" && Number.isFinite(transaction.amount)
      ? Math.round(transaction.amount * 100)
      : null;
  const paymentAttemptId =
    transaction.order_id && uuidPattern.test(transaction.order_id)
      ? transaction.order_id
      : null;
  const currency = transaction.currency?.trim().toUpperCase() || null;
  const currencyIsValid = currency === null || currency === "PEN";
  const authorization = safeText(transaction.authorization, 240);
  const payloadIsValid =
    Boolean(eventType && providerEventPattern.test(eventType)) &&
    paymentAttemptId !== null &&
    amountMinor !== null &&
    Number.isSafeInteger(amountMinor) &&
    amountMinor > 0 &&
    amountMinor <= MAX_STORE_TOTAL_MINOR &&
    currencyIsValid;

  if (!payloadIsValid) {
    const quarantined = await admin.rpc("ingest_and_apply_openpay_event", {
      p_event_key: eventKey,
      p_event_type: "provider_payload.invalid",
      p_external_payment_id: transaction.id.trim(),
      p_payment_id: paymentAttemptId,
      p_order_id: null,
      p_payload: {
        ...safeWebhookSnapshot(payload, transaction),
        validation: {
          event_type_valid: Boolean(eventType && providerEventPattern.test(eventType)),
          payment_attempt_valid: paymentAttemptId !== null,
          amount_valid:
            amountMinor !== null &&
            Number.isSafeInteger(amountMinor) &&
            amountMinor > 0 &&
            amountMinor <= MAX_STORE_TOTAL_MINOR,
          currency_valid: currencyIsValid,
          currency_reported: currency !== null,
        },
      },
      p_amount_minor: null,
      p_currency: null,
      p_authorization: null,
      p_card_summary: {},
      p_failure_message: null,
    });
    if (quarantined.error) {
      console.error("openpay_webhook_quarantine_error", {
        code: quarantined.error.code || "rpc_error",
      });
      return json({ error: "No pudimos registrar el evento" }, 503);
    }
    console.error("openpay_webhook_payload_quarantined", {
      eventType: safeText(eventType, 80),
      status: (quarantined.data as ApplyResult | null)?.status || "recorded",
    });
    return json({ received: true, review: true });
  }

  const applied = await admin.rpc("ingest_and_apply_openpay_event", {
    p_event_key: eventKey,
    p_event_type: eventType!,
    p_external_payment_id: transaction.id.trim(),
    p_payment_id: paymentAttemptId,
    p_order_id: null,
    p_payload: safeWebhookSnapshot(payload, transaction),
    p_amount_minor: amountMinor,
    p_currency: currency,
    p_authorization: authorization,
    p_card_summary: safeCardSummary(transaction),
    p_failure_message:
      eventType === "charge.failed" || eventType === "charge.cancelled"
        ? `Openpay reportó evento ${eventType}.`
        : null,
  });

  if (applied.error) {
    console.error("openpay_webhook_processing_error", {
      code: applied.error.code || "rpc_error",
      eventType,
    });
    return json({ error: "No pudimos procesar el evento" }, 503);
  }

  const result = (applied.data || {}) as ApplyResult;
  if (result.status === "already_processed") {
    return json({ received: true, duplicate: true });
  }
  if (result.status === "pending_reconciliation") {
    console.error("openpay_webhook_pending_reconciliation", {
      eventId: result.event_id || null,
    });
    // The provider evidence is already durable. Acknowledge delivery so
    // Openpay does not retry forever; the reservation reconciler owns recovery.
    return json({
      received: true,
      review: true,
      status: "pending_reconciliation",
    });
  }
  if (
    result.status?.startsWith("rejected_") ||
    result.status === "manual_reconciliation" ||
    (result.status === "event_recorded_no_state_change" &&
      eventType !== "charge.pending")
  ) {
    console.error("openpay_webhook_requires_review", {
      eventId: result.event_id || null,
      status: result.status,
    });
  }

  return json({ received: true, status: result.status || "processed" });
}
