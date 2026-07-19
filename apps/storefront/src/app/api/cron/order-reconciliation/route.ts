import { NextResponse } from "next/server";
import {
  listOpenpayChargesByOrderId,
  safeChargeSnapshot,
  type OpenpayCharge,
} from "@/lib/openpay/server";
import { classifyOpenpayChargeStatus } from "@/lib/openpay/reconciliation";
import { constantTimeEqual, hashPayload } from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { assertLiveCommerceConfig } from "@/lib/server/live-commerce-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type ClaimedReservation = {
  order_id: string;
  order_number: string;
  payment_id: string;
  external_payment_id: string | null;
  amount_minor: number;
  currency: string;
  reservation_expires_at: string;
  lease_token: string;
  reconciliation_attempts: number;
  order_created_at: string;
};

function reply(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET || "";
  const token =
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return Boolean(secret && token && constantTimeEqual(secret, token));
}

function isReviewState(state: string) {
  return state === "needs_review" || state === "already_review";
}

function selectCharge(
  reservation: ClaimedReservation,
  charges: OpenpayCharge[],
) {
  return charges.filter(
    (charge) => charge.order_id === reservation.payment_id,
  );
}

async function deferReservation(
  admin: ReturnType<typeof getSupabaseAdmin>,
  reservation: ClaimedReservation,
  error: string,
  retrySeconds = 300,
  providerObserved = false,
) {
  const result = await admin.rpc("defer_store_order_reservation", {
    p_order_id: reservation.order_id,
    p_payment_id: reservation.payment_id,
    p_lease_token: reservation.lease_token,
    p_retry_seconds: retrySeconds,
    p_error: error.slice(0, 500),
    p_provider_observed: providerObserved,
  });
  if (result.error) throw result.error;
  return String(result.data || "retry");
}

async function persistAndApply(
  admin: ReturnType<typeof getSupabaseAdmin>,
  reservation: ClaimedReservation,
  charge: OpenpayCharge,
  eventType: "charge.succeeded" | "charge.failed" | "charge.pending",
) {
  const snapshot = safeChargeSnapshot(charge);
  const eventKey = hashPayload(
    `reconciliation:${reservation.payment_id}:${charge.id}:${charge.status}:${eventType}`,
  );
  const applied = await admin.rpc("ingest_and_apply_openpay_event", {
    p_event_key: eventKey,
    p_event_type: eventType,
    p_external_payment_id: charge.id,
    p_payment_id: reservation.payment_id,
    p_order_id: reservation.order_id,
    p_payload: snapshot,
    p_amount_minor: Math.round(charge.amount * 100),
    p_currency: charge.currency,
    p_authorization: charge.authorization || null,
    p_card_summary: snapshot.payment_method.card || {},
    p_failure_message:
      eventType === "charge.failed"
        ? `Openpay reportó estado ${charge.status}.`
        : null,
  });
  if (applied.error) throw applied.error;
  const appliedResult = applied.data as {
    status?: string;
    event_id?: number;
  } | null;
  if (appliedResult?.status !== "already_processed") return appliedResult;
  const eventId = Number(appliedResult.event_id);
  if (!Number.isSafeInteger(eventId) || eventId < 1) {
    return { status: "manual_reconciliation" };
  }

  const [eventState, paymentState, orderState] = await Promise.all([
    admin
      .from("store_payment_events")
      .select("event_type,processing_error")
      .eq("id", eventId)
      .single(),
    admin
      .from("store_payments")
      .select("state,external_id")
      .eq("id", reservation.payment_id)
      .single(),
    admin
      .from("store_orders")
      .select("payment_state,order_state,inventory_reserved")
      .eq("id", reservation.order_id)
      .single(),
  ]);
  if (eventState.error || paymentState.error || orderState.error) {
    throw eventState.error || paymentState.error || orderState.error;
  }
  if (
    eventState.data.processing_error ||
    eventState.data.event_type !== eventType
  ) {
    return { status: "manual_reconciliation" };
  }
  if (
    eventType === "charge.succeeded" &&
    paymentState.data.state === "paid" &&
    orderState.data.payment_state === "paid" &&
    !orderState.data.inventory_reserved
  ) {
    return { status: "already_confirmed" };
  }
  if (
    eventType === "charge.failed" &&
    paymentState.data.state === "failed" &&
    orderState.data.payment_state === "failed" &&
    orderState.data.order_state === "cancelled" &&
    !orderState.data.inventory_reserved
  ) {
    return { status: "already_rejected" };
  }
  if (
    eventType === "charge.pending" &&
    paymentState.data.external_id === charge.id &&
    ["pending", "authorized"].includes(paymentState.data.state)
  ) {
    return { status: "already_observed" };
  }
  return { status: "manual_reconciliation" };
}

async function markForReview(
  admin: ReturnType<typeof getSupabaseAdmin>,
  reservation: ClaimedReservation,
  error: string,
) {
  const result = await admin.rpc("mark_store_order_reservation_review", {
    p_order_id: reservation.order_id,
    p_payment_id: reservation.payment_id,
    p_lease_token: reservation.lease_token,
    p_error: error.slice(0, 500),
  });
  if (result.error) throw result.error;
  return String(result.data || "lease_lost");
}

export async function POST(request: Request) {
  if (!authorized(request)) return reply({ error: "No autorizado" }, 401);
  try {
    assertLiveCommerceConfig();
  } catch {
    console.error("store_reconciliation_configuration_invalid");
    return reply({ error: "Comercio no configurado" }, 503);
  }

  const admin = getSupabaseAdmin();
  const claimed = await admin.rpc("claim_expired_store_reservations", {
    // Two sequential provider lookups fit inside the 55 s pg_net budget even
    // when each request reaches its 20 s timeout.
    p_limit: 2,
  });
  if (claimed.error) {
    console.error("store_reconciliation_claim_error", claimed.error.message);
    return reply({ error: "No pudimos reclamar las conciliaciones" }, 503);
  }

  const reservations = (claimed.data || []) as ClaimedReservation[];
  const summary = {
    claimed: reservations.length,
    confirmed: 0,
    rejected: 0,
    expired: 0,
    waiting: 0,
    review: 0,
    errors: 0,
  };

  for (const reservation of reservations) {
    try {
      const charges = await listOpenpayChargesByOrderId(reservation.payment_id);
      const matching = selectCharge(reservation, charges);

      if (matching.length === 0) {
        const expired = await admin.rpc("expire_store_order_reservation", {
          p_order_id: reservation.order_id,
          p_payment_id: reservation.payment_id,
          p_lease_token: reservation.lease_token,
          p_reason: "provider_not_found_after_grace",
        });
        if (expired.error) throw expired.error;
        if (expired.data === "expired") summary.expired += 1;
        else if (expired.data === "needs_review") summary.review += 1;
        else if (expired.data === "grace_required") summary.waiting += 1;
        else if (!["lease_lost", "already_released", "order_already_resolved"].includes(String(expired.data))) {
          await deferReservation(
            admin,
            reservation,
            `No se liberó la reserva: ${String(expired.data || "estado desconocido")}`,
          );
          summary.waiting += 1;
        }
        continue;
      }

      if (matching.length > 1) {
        for (const charge of matching) {
          await persistAndApply(admin, reservation, charge, "charge.pending");
        }
        const state = await markForReview(
          admin,
          reservation,
          "Openpay devolvió más de un cargo para el mismo intento.",
        );
        summary[isReviewState(state) ? "review" : "waiting"] += 1;
        continue;
      }

      if (
        reservation.external_payment_id &&
        matching[0].id !== reservation.external_payment_id
      ) {
        await persistAndApply(
          admin,
          reservation,
          matching[0],
          "charge.pending",
        );
        const state = await markForReview(
          admin,
          reservation,
          "Openpay devolvió un cargo distinto del external ID ya enlazado.",
        );
        summary[isReviewState(state) ? "review" : "waiting"] += 1;
        continue;
      }

      const charge = matching[0];
      const action = classifyOpenpayChargeStatus(charge.status);
      if (action === "wait") {
        const observed = await persistAndApply(
          admin,
          reservation,
          charge,
          "charge.pending",
        );
        const observedStatus = String(observed?.status || "");
        if (["manual_reconciliation", "rejected_mismatch", "rejected_amount_or_currency"].includes(observedStatus)) {
          const state = await markForReview(
            admin,
            reservation,
            `La evidencia pendiente devolvió ${observedStatus}.`,
          );
          summary[isReviewState(state) ? "review" : "waiting"] += 1;
          continue;
        }
        const state = await deferReservation(
          admin,
          reservation,
          `Openpay mantiene el cargo en estado ${charge.status}.`,
          300,
          true,
        );
        summary[isReviewState(state) ? "review" : "waiting"] += 1;
        continue;
      }
      if (action === "review") {
        await persistAndApply(
          admin,
          reservation,
          charge,
          "charge.pending",
        );
        const state = await markForReview(
          admin,
          reservation,
          `Estado Openpay no automatizable: ${charge.status}.`,
        );
        summary[isReviewState(state) ? "review" : "waiting"] += 1;
        continue;
      }

      const result = await persistAndApply(
        admin,
        reservation,
        charge,
        action === "confirm" ? "charge.succeeded" : "charge.failed",
      );
      const appliedStatus = String(result?.status || "");
      if (
        ["manual_reconciliation", "rejected_mismatch", "rejected_amount_or_currency"].includes(
          appliedStatus,
        )
      ) {
        const state = await markForReview(
          admin,
          reservation,
          `La máquina de estados devolvió ${appliedStatus}.`,
        );
        summary[isReviewState(state) ? "review" : "waiting"] += 1;
      } else if (action === "confirm") summary.confirmed += 1;
      else summary.rejected += 1;
    } catch (caught) {
      summary.errors += 1;
      const message =
        caught instanceof Error ? caught.message : "Error de conciliación";
      console.error("store_reconciliation_item_error", {
        orderId: reservation.order_id,
        paymentId: reservation.payment_id,
        error: message,
      });
      try {
        const state = await deferReservation(
          admin,
          reservation,
          message,
        );
        if (isReviewState(state)) summary.review += 1;
      } catch (deferError) {
        console.error("store_reconciliation_defer_error", {
          orderId: reservation.order_id,
          error:
            deferError instanceof Error ? deferError.message : "Error al liberar lock",
        });
      }
    }
  }

  return reply(summary, summary.errors > 0 ? 503 : 200);
}
