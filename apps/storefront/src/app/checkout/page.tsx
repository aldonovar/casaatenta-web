import type { Metadata } from "next";
import { CheckoutClient } from "@/components/CheckoutClient";

export const metadata: Metadata = { title: "Checkout seguro", robots: { index: false, follow: false } };

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ coupon?: string }>;
}) {
  const { coupon } = await searchParams;
  const initialCoupon = coupon && /^[A-Z0-9_-]{3,40}$/i.test(coupon)
    ? coupon.toUpperCase()
    : "";
  return (
    <section className="checkout-page">
      <div className="store-container">
        <div className="checkout-page__title"><span className="eyebrow">Compra segura</span><h1>Finaliza tu pedido</h1><p>Compra como invitado. Podrás crear tu cuenta al terminar.</p></div>
        <CheckoutClient initialCoupon={initialCoupon} />
      </div>
    </section>
  );
}
