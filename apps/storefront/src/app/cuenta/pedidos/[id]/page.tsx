import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, CreditCard, MapPin, PackageCheck, Truck } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";
import { formatMoney } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Detalle del pedido",
  robots: { index: false, follow: false },
};

type OrderDetailProps = { params: Promise<{ id: string }> };

const stateLabels: Record<string, string> = {
  payment_pending: "Pago pendiente",
  confirmed: "Pedido confirmado",
  processing: "En preparación",
  ready_to_ship: "Listo para despacho",
  shipped: "En camino",
  delivered: "Entregado",
  cancelled: "Cancelado",
};

export default async function OrderDetailPage({ params }: OrderDetailProps) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  await requireUser(`/cuenta/pedidos/${id}`);
  const supabase = await createClient();
  const [orderResult, itemsResult, addressResult, eventsResult, shipmentResult] = await Promise.all([
    supabase.from("store_orders").select("id,order_number,email,phone,order_state,payment_state,fulfilment_state,subtotal_minor,discount_minor,shipping_minor,tax_minor,total_minor,invoice_type,created_at,paid_at").eq("id", id).single(),
    supabase.from("store_order_items").select("id,sku,name,quantity,unit_price_minor,total_minor,product_snapshot").eq("order_id", id).order("id"),
    supabase.from("store_order_addresses").select("recipient_name,phone,address_line_1,address_line_2,department,province,district,postal_code,reference").eq("order_id", id).eq("kind", "shipping").maybeSingle(),
    supabase.from("store_order_events").select("id,event_type,to_state,public_message,created_at").eq("order_id", id).not("public_message", "is", null).order("created_at"),
    supabase.from("store_shipments").select("carrier,service,tracking_number,tracking_url,state,estimated_delivery_at,shipped_at,delivered_at").eq("order_id", id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);
  if (orderResult.error || !orderResult.data) notFound();
  const order = orderResult.data;
  const items = itemsResult.data || [];
  const address = addressResult.data;
  const events = eventsResult.data || [];
  const shipment = shipmentResult.data;

  return (
    <div className="order-detail">
      <Link href="/cuenta/pedidos" className="order-detail__back"><ArrowLeft size={16} /> Mis pedidos</Link>
      <div className="order-detail__head">
        <div><span className="eyebrow">Pedido {order.order_number}</span><h1>{stateLabels[order.order_state] || order.order_state}</h1><p>Creado el {new Date(order.created_at).toLocaleDateString("es-PE", { dateStyle: "long" })}</p></div>
        <span className={`order-state order-state--${order.order_state}`}>{stateLabels[order.order_state] || order.order_state}</span>
      </div>

      <div className="order-detail__grid">
        <div>
          <section className="order-panel">
            <h2><PackageCheck size={19} /> Productos</h2>
            <div className="order-items">{items.map((item) => <div key={item.id}><span><strong>{item.name}</strong><small>{item.sku} · Cantidad {item.quantity}</small></span><b>{formatMoney(item.total_minor)}</b></div>)}</div>
            <div className="order-totals"><p><span>Subtotal</span><b>{formatMoney(order.subtotal_minor)}</b></p>{order.discount_minor > 0 && <p><span>Descuento</span><b>-{formatMoney(order.discount_minor)}</b></p>}<p><span>Despacho</span><b>{order.shipping_minor === 0 ? "Sin costo" : formatMoney(order.shipping_minor)}</b></p><p><span>Total</span><strong>{formatMoney(order.total_minor)}</strong></p></div>
          </section>
          <section className="order-panel">
            <h2><Truck size={19} /> Seguimiento</h2>
            <div className="order-timeline">{events.map((event) => <div key={event.id}><span><Check size={13} /></span><p><strong>{event.public_message}</strong><time>{new Date(event.created_at).toLocaleString("es-PE", { dateStyle: "medium", timeStyle: "short" })}</time></p></div>)}</div>
            {shipment?.tracking_number && <a className="button button--outline" href={shipment.tracking_url || "#"} target={shipment.tracking_url ? "_blank" : undefined} rel="noreferrer">Rastrear {shipment.carrier || "envío"}: {shipment.tracking_number}</a>}
          </section>
        </div>
        <aside>
          <section className="order-panel order-panel--compact"><h2><CreditCard size={18} /> Pago</h2><p><span>Estado</span><strong>{order.payment_state}</strong></p><p><span>Comprobante</span><strong>{order.invoice_type === "invoice" ? "Factura" : "Boleta"}</strong></p></section>
          {address && <section className="order-panel order-panel--compact"><h2><MapPin size={18} /> Entrega</h2><address><strong>{address.recipient_name}</strong><span>{address.address_line_1}{address.address_line_2 ? `, ${address.address_line_2}` : ""}</span><span>{address.district}, {address.department}</span>{address.reference && <small>Ref.: {address.reference}</small>}</address></section>}
        </aside>
      </div>
    </div>
  );
}
