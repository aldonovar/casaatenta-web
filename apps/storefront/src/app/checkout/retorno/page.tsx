import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Validando pago",
  robots: { index: false, follow: false },
};

export default async function CheckoutReturnPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  const reference = order && /^[0-9a-f-]{36}$/i.test(order)
    ? order.slice(-8).toUpperCase()
    : null;

  return (
    <section className="checkout-return">
      <div>
        <span className="checkout-return__icon"><Clock3 size={32} /></span>
        <span className="eyebrow">Validación 3D Secure</span>
        <h1>Estamos confirmando tu pago.</h1>
        <p>
          Openpay notificará el resultado de forma segura. No vuelvas a pagar ni
          cierres un segundo pedido mientras termina la conciliación.
        </p>
        {reference && <small>Referencia técnica: {reference}</small>}
        <div className="checkout-return__actions">
          <Link href="/cuenta/pedidos" className="button button--primary">Ver mis pedidos</Link>
          <Link href="/ayuda" className="button button--outline">Necesito ayuda</Link>
        </div>
        <div className="checkout-return__secure">
          <ShieldCheck size={17} /> El estado final procede del webhook autenticado de Openpay.
        </div>
      </div>
    </section>
  );
}
