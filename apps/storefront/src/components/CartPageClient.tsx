"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight, Minus, PackageOpen, Plus, ShieldCheck, Trash2, Truck } from "lucide-react";
import { formatMoney } from "@/lib/store-config";
import { calculateOnlineShippingMinor } from "@/lib/store-shipping";
import { ProductVisual } from "./ProductVisual";
import { useCart } from "./CartProvider";

export function CartPageClient() {
  const { lines, subtotalMinor, updateQuantity, removeItem, hydrated } = useCart();
  const estimatedShipping = calculateOnlineShippingMinor(subtotalMinor);
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponQuote, setCouponQuote] = useState<{
    code: string;
    discountMinor: number;
    shippingMinor: number;
    subtotalMinor: number;
  } | null>(null);
  const activeCoupon = couponQuote?.subtotalMinor === subtotalMinor ? couponQuote : null;
  const finalShipping = activeCoupon?.shippingMinor ?? estimatedShipping;
  const discountMinor = activeCoupon?.discountMinor ?? 0;
  const total = subtotalMinor - discountMinor + finalShipping;

  async function applyCoupon(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCouponError("");
    setValidatingCoupon(true);
    try {
      const response = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        code?: string;
        discount_minor?: number;
        shipping_minor?: number;
      };
      if (!response.ok || !result.code) throw new Error(result.error || "No pudimos validar el cupón.");
      setCouponCode(result.code);
      setCouponQuote({
        code: result.code,
        discountMinor: Number(result.discount_minor || 0),
        shippingMinor: Number(result.shipping_minor ?? estimatedShipping),
        subtotalMinor,
      });
    } catch (caught) {
      setCouponQuote(null);
      setCouponError(caught instanceof Error ? caught.message : "No pudimos validar el cupón.");
    } finally {
      setValidatingCoupon(false);
    }
  }

  if (!hydrated) return <div className="cart-page-loading" aria-label="Cargando carrito" />;

  if (lines.length === 0) {
    return (
      <div className="cart-page-empty">
        <span><PackageOpen size={36} /></span>
        <h1>Tu carrito está vacío.</h1>
        <p>Encuentra equipos por categoría o empieza por el trabajo que necesitas resolver.</p>
        <Link href="/catalogo" className="button button--dark">Explorar catálogo <ArrowRight size={17} /></Link>
      </div>
    );
  }

  return (
    <div className="cart-page-grid">
      <section className="cart-page-lines">
        <div className="cart-page-lines__head"><span>Producto</span><span>Cantidad</span><span>Total</span></div>
        {lines.map((line) => (
          <article key={line.productId} className="cart-page-line">
            <ProductVisual product={line.product} size="mini" />
            <div className="cart-page-line__info">
              <span>{line.product.brand} · {line.product.model}</span>
              <Link href={`/producto/${line.product.slug}`}>{line.product.name}</Link>
              <small>{line.product.stockLabel}</small>
            </div>
            <div className="quantity-control quantity-control--large">
              <button onClick={() => updateQuantity(line.productId, line.quantity - 1)} aria-label={`Restar una unidad de ${line.product.shortName}`}><Minus size={15} /></button>
              <span>{line.quantity}</span>
              <button onClick={() => updateQuantity(line.productId, line.quantity + 1)} aria-label={`Sumar una unidad de ${line.product.shortName}`}><Plus size={15} /></button>
            </div>
            <strong className="cart-page-line__total">{formatMoney(line.lineTotalMinor)}</strong>
            <button className="cart-page-line__remove" onClick={() => removeItem(line.productId)} aria-label="Eliminar producto"><Trash2 size={17} /></button>
          </article>
        ))}
        <Link href="/catalogo" className="text-link cart-page-continue">← Seguir comprando</Link>
      </section>

      <aside className="order-summary-card">
        <span className="eyebrow">Resumen</span>
        <h2>Tu pedido</h2>
        <div className="order-summary-card__rows">
          <p><span>Subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></p>
          <p><span>Envío Lima/Callao</span><strong>{finalShipping === 0 ? "Sin costo" : formatMoney(finalShipping)}</strong></p>
          {activeCoupon && discountMinor > 0 && <p className="is-discount"><span>Cupón {activeCoupon.code}</span><strong>−{formatMoney(discountMinor)}</strong></p>}
        </div>
        <form className="coupon-input" onSubmit={applyCoupon}>
          <label htmlFor="coupon-code">Cupón</label>
          <div><input id="coupon-code" value={couponCode} onChange={(event) => setCouponCode(event.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 40))} placeholder="Ej. ATENTA20" required minLength={3} /><button type="submit" disabled={validatingCoupon}>{validatingCoupon ? "Validando…" : "Aplicar"}</button></div>
          {couponError ? <small className="coupon-input__error" role="alert">{couponError}</small> : activeCoupon ? <small className="coupon-input__success">Cupón aplicado. Se volverá a validar antes del cobro.</small> : <small>Los cupones se validan con vigencia, stock y uso por cliente.</small>}
        </form>
        <div className="order-summary-card__total"><span>Total estimado</span><strong>{formatMoney(total)}</strong></div>
        <p className="order-summary-card__tax">Precio final incluye IGV. La tarifa online cubre Lima y Callao; provincias requieren cotización previa.</p>
        <Link href={activeCoupon ? `/checkout?coupon=${encodeURIComponent(activeCoupon.code)}` : "/checkout"} className="button button--primary">Ir al checkout <ArrowRight size={17} /></Link>
        <div className="order-summary-card__trust">
          <span><ShieldCheck size={17} /> Pago protegido con Openpay</span>
          <span><Truck size={17} /> Tarifa visible antes del pago</span>
        </div>
      </aside>
    </div>
  );
}
