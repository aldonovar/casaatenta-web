import { NextResponse } from "next/server";
import {
  constantTimeEqual,
  hashPayload,
  readBasicCredentials,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

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

type StoredEvent = { id: number; processed_at: string | null };
type ApplyResult = { status?: string; payment_id?: string; order_id?: string };

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

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

function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(redactSensitive);
  if (!value || typeof value !== "object") return value;

  const redacted: Record<string, unknown> = {};
  for (const [key, nested] of Object.entries(value)) {
    const normalized = key.toLowerCase();
    if (["cvv", "cvv2", "source_id", "token"].includes(normalized)) {
      redacted[key] = "[redacted]";
    } else if (normalized === "card_number") {
      const digits = String(nested || "").replace(/\D/g, "");
      redacted.last4 = digits.slice(-4) || null;
    } else {
      redacted[key] = redactSensitive(nested);
    }
  }
  return redacted;
}

function safeCardSummary(transaction: NonNullable<OpenpayWebhook["transaction"]>) {
  const card = transaction.card || transaction.payment_method?.card;
  if (!card) return {};
  const digits = String(card.card_number || "").replace(/\D/g, "");
  return {
    brand: card.brand || null,
    last4: digits.slice(-4) || null,
    type: card.type || null,
    bank_name: card.bank_name || null,
  };
}

export async function POST(request: Request) {
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

  let payload: OpenpayWebhook;
  try {
    payload = JSON.parse(rawBody) as OpenpayWebhook;
  } catch {
    return json({ error: "JSON inválido" }, 400);
  }
  const eventType = payload.type?.trim();
  if (!eventType) return json({ error: "Evento inválido" }, 400);

  const admin = getSupabaseAdmin();
  const eventKey = hashPayload(rawBody);
  const transaction = payload.transaction;
  const inserted = await admin
    .from("store_payment_events")
    .insert({
      provider: "openpay",
      event_key: eventKey,
      event_type: eventType,
      external_payment_id: transaction?.id || null,
      payload: redactSensitive(payload),
    })
    .select("id,processed_at")
    .single();

  let event = inserted.data as StoredEvent | null;
  if (inserted.error?.code === "23505") {
    const existing = await admin
      .from("store_payment_events")
      .select("id,processed_at")
      .eq("event_key", eventKey)
      .single();
    if (existing.error || !existing.data) {
      console.error("openpay_webhook_duplicate_lookup_error", existing.error?.message);
      return json({ error: "No pudimos recuperar el evento" }, 503);
    }
    event = existing.data as StoredEvent;
    if (event.processed_at) return json({ received: true, duplicate: true });
  } else if (inserted.error || !event) {
    console.error("openpay_webhook_persist_error", inserted.error?.message);
    return json({ error: "No pudimos registrar el evento" }, 503);
  }

  if (eventType === "verification") {
    const verification = await admin
      .from("store_payment_events")
      .update({ processed_at: new Date().toISOString(), processing_error: null })
      .eq("id", event.id);
    if (verification.error) {
      console.error("openpay_verification_persist_error", verification.error.message);
      return json({ error: "No pudimos verificar el webhook" }, 503);
    }
    return json({
      received: true,
      verification_code: payload.verification_code || null,
    });
  }

  if (!transaction?.id) {
    const rejected = await admin
      .from("store_payment_events")
      .update({
        processed_at: new Date().toISOString(),
        processing_error: "Evento rechazado: falta transaction.id",
      })
      .eq("id", event.id);
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

  const applied = await admin.rpc("apply_openpay_event", {
    p_event_id: event.id,
    p_event_type: eventType,
    p_external_payment_id: transaction.id,
    p_payment_id: paymentAttemptId,
    p_amount_minor: amountMinor,
    p_currency: transaction.currency?.toUpperCase() || null,
    p_authorization: transaction.authorization || null,
    p_card_summary: safeCardSummary(transaction),
    p_failure_message: transaction.error_message || null,
  });

  if (applied.error) {
    const message = applied.error.message.slice(0, 1000);
    await admin
      .from("store_payment_events")
      .update({ processing_error: message })
      .eq("id", event.id);
    console.error("openpay_webhook_processing_error", {
      eventId: event.id,
      error: message,
    });
    return json({ error: "No pudimos procesar el evento" }, 503);
  }

  const result = (applied.data || {}) as ApplyResult;
  if (result.status === "pending_reconciliation") {
    return json({ error: "Pago aún no conciliado" }, 503);
  }
  if (result.status?.startsWith("rejected_") || result.status === "manual_reconciliation") {
    console.error("openpay_webhook_requires_review", {
      eventId: event.id,
      status: result.status,
    });
  }

  return json({ received: true, status: result.status || "processed" });
}
