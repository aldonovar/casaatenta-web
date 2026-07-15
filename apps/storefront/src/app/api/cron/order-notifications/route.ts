import { NextResponse } from "next/server";
import { Resend } from "resend";
import { constantTimeEqual } from "@/lib/server/security";
import { storeConfig } from "@/lib/store-config";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type OutboxEvent = {
  id: number;
  topic: "order.payment_confirmed" | "order.payment_failed" | "order.refunded" | "shipment.updated";
  recipient_email: string;
  payload: Record<string, unknown>;
  idempotency_key: string;
  attempts: number;
};

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatMoney(value: unknown) {
  const amount = Number(value || 0) / 100;
  return new Intl.NumberFormat("es-PE", {
    style: "currency",
    currency: "PEN",
    minimumFractionDigits: 2,
  }).format(amount);
}

function emailFor(event: OutboxEvent) {
  const orderNumber = String(event.payload.order_number || "Pedido Casa Atenta");
  const customerName = String(event.payload.customer_name || "");
  const accountUrl = `${storeConfig.url}/cuenta/pedidos`;
  let title = "Actualización de tu pedido";
  let lead = "Tu pedido tiene una nueva actualización.";
  let detail = "Puedes revisar el estado desde tu cuenta.";

  if (event.topic === "order.payment_confirmed") {
    title = "Pago confirmado";
    lead = `Confirmamos el pago de ${orderNumber}.`;
    detail = `Total: ${escapeHtml(formatMoney(event.payload.total_minor))}. Empezaremos a preparar el equipo y te avisaremos cuando sea despachado.`;
  } else if (event.topic === "order.payment_failed") {
    title = "Pago no aprobado";
    lead = `No pudimos aprobar el pago de ${orderNumber}.`;
    detail = "El pedido fue cancelado y el inventario reservado quedó liberado. Puedes volver a intentarlo desde la tienda.";
  } else if (event.topic === "order.refunded") {
    title = "Reembolso registrado";
    lead = `Registramos el reembolso de ${orderNumber}.`;
    detail = "El tiempo de abono final depende del banco emisor. Conserva este correo como referencia.";
  } else if (event.topic === "shipment.updated") {
    title = "Tu pedido está en movimiento";
    lead = `Actualizamos el despacho de ${orderNumber}.`;
    const carrier = escapeHtml(event.payload.carrier || "Transportista por confirmar");
    const tracking = escapeHtml(event.payload.tracking_number || "Pendiente");
    detail = `Transportista: ${carrier}. Seguimiento: ${tracking}.`;
  }

  const html = `<!doctype html><html lang="es"><body style="margin:0;background:#eef2f4;font-family:Arial,sans-serif;color:#10212b"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#fff;border:1px solid #dce5e9"><tr><td style="padding:26px 30px;background:#071521;color:#fff;border-bottom:4px solid #168bd2"><strong style="font-size:20px;letter-spacing:2px">CASA ATENTA</strong><br><span style="font-size:12px;color:#9fc2d4">TIENDA</span></td></tr><tr><td style="padding:34px 30px"><p style="margin:0 0 8px;color:#5c7380">${customerName ? `Hola ${escapeHtml(customerName)},` : "Hola,"}</p><h1 style="margin:0 0 18px;font-size:30px">${escapeHtml(title)}</h1><p style="font-size:17px;line-height:1.6;margin:0 0 12px">${escapeHtml(lead)}</p><p style="font-size:15px;line-height:1.7;color:#526671;margin:0 0 24px">${escapeHtml(detail)}</p><a href="${escapeHtml(accountUrl)}" style="display:inline-block;padding:13px 20px;background:#168bd2;color:#fff;text-decoration:none;font-weight:700">Ver mis pedidos</a></td></tr><tr><td style="padding:20px 30px;background:#f5f8f9;color:#667b85;font-size:12px;line-height:1.6">Correo transaccional de Casa Atenta Tienda. Para ayuda responde a este mensaje o visita el centro de ayuda.</td></tr></table></td></tr></table></body></html>`;
  const text = `${customerName ? `Hola ${customerName},\n\n` : ""}${title}\n\n${lead}\n${detail}\n\nRevisa tu pedido: ${accountUrl}`;
  return { subject: `${title} · ${orderNumber}`, html, text };
}

function authorized(request: Request) {
  const secret = process.env.CRON_SECRET || "";
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") || "";
  return Boolean(secret && token && constantTimeEqual(secret, token));
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const apiKey = process.env.RESEND_API_KEY || "";
  const from = process.env.RESEND_FROM_EMAIL || "";
  if (!apiKey || !from) {
    return NextResponse.json({ error: "Correo transaccional no configurado" }, { status: 503 });
  }

  const admin = getSupabaseAdmin();
  const claimed = await admin.rpc("claim_store_outbox_events", { p_limit: 20 });
  if (claimed.error) {
    console.error("store_outbox_claim_error", claimed.error.message);
    return NextResponse.json({ error: "No pudimos reclamar la cola" }, { status: 503 });
  }

  const resend = new Resend(apiKey);
  const events = (claimed.data || []) as OutboxEvent[];
  let sent = 0;
  let failed = 0;
  for (const event of events) {
    try {
      const email = emailFor(event);
      const result = await resend.emails.send(
        {
          from,
          to: event.recipient_email,
          replyTo: process.env.STORE_NOTIFICATION_REPLY_TO || storeConfig.supportEmail,
          ...email,
          tags: [{ name: "topic", value: event.topic.replaceAll(".", "-") }],
        },
        { idempotencyKey: event.idempotency_key },
      );
      if (result.error || !result.data?.id) throw new Error(result.error?.message || "Resend no devolvió ID");
      const completed = await admin.rpc("complete_store_outbox_event", {
        p_event_id: event.id,
        p_provider_message_id: result.data.id,
      });
      if (completed.error) throw completed.error;
      sent += 1;
    } catch (caught) {
      failed += 1;
      const message = caught instanceof Error ? caught.message : "Error de envío";
      const retrySeconds = Math.min(3600, 60 * 2 ** Math.min(event.attempts, 6));
      const released = await admin.rpc("fail_store_outbox_event", {
        p_event_id: event.id,
        p_error: message,
        p_retry_seconds: retrySeconds,
      });
      if (released.error) console.error("store_outbox_release_error", released.error.message);
    }
  }

  return NextResponse.json({ claimed: events.length, sent, failed });
}
