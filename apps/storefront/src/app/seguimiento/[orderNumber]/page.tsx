import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  Check,
  CreditCard,
  FileCheck2,
  PackageCheck,
  ShieldCheck,
  Truck,
} from "lucide-react";
import {
  fulfilmentStateLabel,
  formatStoreDateTime,
  orderStateLabel,
  paymentStateLabel,
  safeExternalTrackingUrl,
  shipmentStateLabel,
} from "@/lib/order-presentation";
import {
  GUEST_ORDER_COOKIE,
  readGuestOrderAccessToken,
} from "@/lib/server/guest-order-access";
import { formatMoney } from "@/lib/store-config";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Seguimiento del pedido",
  robots: { index: false, follow: false },
};

type GuestTracking = {
  order: {
    id: string;
    order_number: string;
    order_state: string;
    payment_state: string;
    fulfilment_state: string;
    subtotal_minor: number;
    discount_minor: number;
    shipping_minor: number;
    tax_minor: number;
    total_minor: number;
    invoice_type: "receipt" | "invoice";
    created_at: string;
    paid_at: string | null;
    cancelled_at: string | null;
  };
  items: Array<{
    id: number;
    sku: string;
    name: string;
    quantity: number;
    unit_price_minor: number;
    total_minor: number;
  }>;
  events: Array<{
    id: number;
    event_type: string;
    to_state: string | null;
    public_message: string;
    created_at: string;
  }>;
  shipment: null | {
    carrier: string | null;
    service: string | null;
    tracking_number: string | null;
    tracking_url: string | null;
    state: string;
    estimated_delivery_at: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
  };
};

export default async function GuestTrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber: rawOrderNumber } = await params;
  const orderNumber = rawOrderNumber.toUpperCase();
  if (!/^CA-\d{8}-\d{6}$/.test(orderNumber)) notFound();

  const token = (await cookies()).get(GUEST_ORDER_COOKIE)?.value;
  const access = readGuestOrderAccessToken(token);
  if (!access) {
    redirect(`/seguimiento?pedido=${encodeURIComponent(orderNumber)}&estado=acceso-requerido`);
  }

  const admin = getSupabaseAdmin();
  const result = await admin.rpc("get_store_guest_tracking", {
    p_order_id: access.orderId,
    p_nonce: access.nonce,
  });
  const tracking = result.data as GuestTracking | null;
  if (
    result.error ||
    !tracking?.order ||
    tracking.order.id !== access.orderId ||
    tracking.order.order_number !== orderNumber
  ) {
    redirect(`/seguimiento?pedido=${encodeURIComponent(orderNumber)}&estado=enlace-invalido`);
  }

  const shipmentUrl = safeExternalTrackingUrl(tracking.shipment?.tracking_url);

  return (
    <section className="guest-order-page">
      <div className="store-container guest-order-page__inner">
        <div className="guest-order-head">
          <div>
            <span className="eyebrow">Pedido {tracking.order.order_number}</span>
            <h1>{orderStateLabel(tracking.order.order_state)}</h1>
            <p>
              Recibido el {formatStoreDateTime(tracking.order.created_at)}
            </p>
          </div>
          <span className={`order-state order-state--${tracking.order.order_state}`}>
            {orderStateLabel(tracking.order.order_state)}
          </span>
        </div>

        <div className="guest-order-status-grid">
          <div><CreditCard size={20} /><span>Pago</span><strong>{paymentStateLabel(tracking.order.payment_state)}</strong></div>
          <div><PackageCheck size={20} /><span>Preparación</span><strong>{fulfilmentStateLabel(tracking.order.fulfilment_state)}</strong></div>
          <div><Truck size={20} /><span>Entrega</span><strong>{tracking.shipment ? shipmentStateLabel(tracking.shipment.state) : "Aún sin despacho"}</strong></div>
        </div>

        <div className="guest-order-grid">
          <div>
            <section className="order-panel">
              <h2><PackageCheck size={19} /> Productos</h2>
              <div className="order-items">
                {tracking.items.map((item) => (
                  <div key={item.id}>
                    <span><strong>{item.name}</strong><small>{item.sku} · Cantidad {item.quantity}</small></span>
                    <b>{formatMoney(item.total_minor)}</b>
                  </div>
                ))}
              </div>
              <div className="order-totals">
                <p><span>Subtotal</span><b>{formatMoney(tracking.order.subtotal_minor)}</b></p>
                {tracking.order.discount_minor > 0 && <p><span>Descuento</span><b>-{formatMoney(tracking.order.discount_minor)}</b></p>}
                <p><span>Despacho</span><b>{tracking.order.shipping_minor === 0 ? "Sin costo" : formatMoney(tracking.order.shipping_minor)}</b></p>
                <p><span>Total</span><strong>{formatMoney(tracking.order.total_minor)}</strong></p>
              </div>
            </section>

            <section className="order-panel">
              <h2><Truck size={19} /> Historial visible</h2>
              <div className="order-timeline">
                {tracking.events.map((event) => (
                  <div key={event.id}>
                    <span><Check size={13} /></span>
                    <p><strong>{event.public_message}</strong><time>{formatStoreDateTime(event.created_at)}</time></p>
                  </div>
                ))}
              </div>
              {tracking.shipment?.tracking_number && (
                shipmentUrl ? (
                  <a className="button button--outline" href={shipmentUrl} target="_blank" rel="noreferrer">
                    Rastrear {tracking.shipment.carrier || "envío"}: {tracking.shipment.tracking_number}
                  </a>
                ) : (
                  <p className="guest-order-tracking-code">
                    Código de seguimiento: <strong>{tracking.shipment.tracking_number}</strong>
                  </p>
                )
              )}
            </section>
          </div>

          <aside>
            <section className="order-panel order-panel--compact">
              <h2><FileCheck2 size={18} /> Comprobante</h2>
              <p><span>Tipo solicitado</span><strong>{tracking.order.invoice_type === "invoice" ? "Factura" : "Boleta"}</strong></p>
              <p><span>Emisión tributaria</span><strong>Pendiente de emisión y entrega</strong></p>
            </section>
            <section className="order-panel guest-order-privacy">
              <h2><ShieldCheck size={18} /> Vista protegida</h2>
              <p>Esta página excluye correo, teléfono, documento, dirección, notas internas y datos del medio de pago.</p>
              <Link href="/seguimiento">Solicitar otro enlace</Link>
            </section>
          </aside>
        </div>
      </div>
    </section>
  );
}
