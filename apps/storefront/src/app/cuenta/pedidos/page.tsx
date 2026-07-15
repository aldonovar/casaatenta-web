import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, PackageSearch } from "lucide-react";
import { requireUser } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Mis pedidos", robots: { index: false, follow: false } };

export default async function OrdersPage() {
  let orders: Array<{ id: string; order_number: string; order_state: string; payment_state: string; fulfilment_state: string; total_minor: number; created_at: string }> = [];
  if (isSupabaseConfigured()) {
    await requireUser("/cuenta/pedidos");
    const supabase = await createClient();
    const { data } = await supabase.from("store_orders").select("id,order_number,order_state,payment_state,fulfilment_state,total_minor,created_at").order("created_at", { ascending: false }).limit(50);
    orders = (data || []) as typeof orders;
  }
  const stateLabels: Record<string, string> = { payment_pending: "Pago pendiente", confirmed: "Confirmado", processing: "En preparación", ready_to_ship: "Listo para despacho", shipped: "En camino", delivered: "Entregado", cancelled: "Cancelado" };
  return (
    <><div className="account-page-title"><span className="eyebrow">Historial</span><h1>Mis pedidos</h1><p>El estado comercial, pago y entrega se actualizan por separado para evitar confusiones.</p></div>{orders.length === 0 ? <div className="account-empty"><span><PackageSearch size={30} /></span><h2>Aún no tienes pedidos</h2><p>Cuando compres, aquí verás preparación, despacho, seguimiento y comprobantes.</p><Link href="/catalogo" className="button button--dark">Explorar catálogo <ArrowRight size={17} /></Link></div> : <div className="orders-list">{orders.map((order) => <Link href={`/cuenta/pedidos/${order.id}`} key={order.id}><span><b>{order.order_number}</b><small>Pago: {order.payment_state}</small></span><strong>{stateLabels[order.order_state] || order.order_state}</strong><time>{new Date(order.created_at).toLocaleDateString("es-PE")}</time><ArrowRight size={17} /></Link>)}</div>}</>
  );
}
