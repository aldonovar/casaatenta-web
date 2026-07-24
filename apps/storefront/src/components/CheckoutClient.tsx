"use client";

import Script from "next/script";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  MapPin,
  PackageOpen,
  ShieldCheck,
  Truck,
  UserRound,
} from "lucide-react";
import { formatMoney, storeConfig } from "@/lib/store-config";
import { STORE_LEGAL_PATHS, STORE_LEGAL_VERSIONS } from "@/lib/store-legal";
import { calculateOnlineShippingMinor } from "@/lib/store-shipping";
import { ProductVisual } from "./ProductVisual";
import { StoreTurnstileWidget } from "./StoreTurnstileWidget";
import { useCart } from "./CartProvider";

type OpenpayResponse = { data?: { id?: string; description?: string }; message?: string };
type OpenpayCard = {
  card_number: string;
  holder_name: string;
  expiration_year: string;
  expiration_month: string;
  cvv2: string;
};

declare global {
  interface Window {
    OpenPay?: {
      setId: (id: string) => void;
      setApiKey: (key: string) => void;
      setSandboxMode: (sandbox: boolean) => void;
      deviceData: { setup: (formId?: string, fieldName?: string) => string };
      token: {
        create: (
          card: OpenpayCard,
          success: (response: OpenpayResponse) => void,
          error: (response: OpenpayResponse) => void,
        ) => void;
      };
    };
  }
}

const merchantId = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID || "";
const publicKey = process.env.NEXT_PUBLIC_OPENPAY_PUBLIC_KEY || "";
const openpayEnvironment = process.env.NEXT_PUBLIC_OPENPAY_ENVIRONMENT || "sandbox";
const provinceQuoteUrl = `${storeConfig.whatsapp.replace(/\?.*$/, "")}?text=${encodeURIComponent(
  "Hola Casa Atenta, quisiera cotizar un envío a provincia antes de comprar.",
)}`;

function tokenizeCard(card: OpenpayCard) {
  return new Promise<string>((resolve, reject) => {
    if (!window.OpenPay) return reject(new Error("Openpay todavía no está disponible."));
    window.OpenPay.token.create(
      card,
      (response) => {
        const token = response.data?.id;
        if (!token) return reject(new Error("Openpay no devolvió un token de pago."));
        resolve(token);
      },
      (response) => reject(new Error(response.data?.description || response.message || "No pudimos validar la tarjeta.")),
    );
  });
}

export function CheckoutClient({ initialCoupon = "" }: { initialCoupon?: string }) {
  const { lines, subtotalMinor, clearCart, hydrated } = useCart();
  const [scriptsReady, setScriptsReady] = useState(false);
  const deviceSessionId = useRef("");
  const idempotencyKey = useRef("");
  const [businessInvoice, setBusinessInvoice] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const errorRef = useRef<HTMLDivElement>(null);
  const [successOrder, setSuccessOrder] = useState("");
  const [successTrackingUrl, setSuccessTrackingUrl] = useState("");
  const [recoveryTrackingUrl, setRecoveryTrackingUrl] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const successHeadingRef = useRef<HTMLHeadingElement>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(Boolean(initialCoupon));
  const [couponError, setCouponError] = useState("");
  const [couponQuote, setCouponQuote] = useState<{
    code: string;
    subtotalMinor: number;
    discountMinor: number;
    shippingMinor: number;
  } | null>(null);
  const estimatedShipping = calculateOnlineShippingMinor(subtotalMinor);
  const activeCoupon = couponQuote?.subtotalMinor === subtotalMinor ? couponQuote : null;
  const finalShipping = activeCoupon?.shippingMinor ?? estimatedShipping;
  const discountMinor = activeCoupon?.discountMinor ?? 0;
  const total = subtotalMinor - discountMinor + finalShipping;

  useEffect(() => {
    if (!error) return;
    const frame = requestAnimationFrame(() => {
      errorRef.current?.focus({ preventScroll: true });
      errorRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [error]);

  useEffect(() => {
    if (!scriptsReady || !merchantId || !publicKey || !window.OpenPay) return;
    window.OpenPay.setId(merchantId);
    window.OpenPay.setApiKey(publicKey);
    window.OpenPay.setSandboxMode(openpayEnvironment !== "production");
    deviceSessionId.current = window.OpenPay.deviceData.setup(
      "checkout-form",
      "device_session_id",
    );
  }, [scriptsReady]);

  useEffect(() => {
    if (!initialCoupon || !hydrated || lines.length === 0) return;
    const controller = new AbortController();
    async function validateCoupon() {
      try {
        const response = await fetch("/api/coupons/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code: initialCoupon,
            items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
          }),
          signal: controller.signal,
        });
        const result = (await response.json()) as {
          error?: string;
          code?: string;
          discount_minor?: number;
          shipping_minor?: number;
        };
        if (!response.ok || !result.code) throw new Error(result.error || "El cupón no es válido.");
        setCouponQuote({
          code: result.code,
          subtotalMinor,
          discountMinor: Number(result.discount_minor || 0),
          shippingMinor: Number(result.shipping_minor ?? estimatedShipping),
        });
        setCouponError("");
      } catch (caught) {
        if (controller.signal.aborted) return;
        setCouponQuote(null);
        setCouponError(caught instanceof Error ? caught.message : "El cupón no es válido.");
      } finally {
        if (!controller.signal.aborted) setValidatingCoupon(false);
      }
    }
    void validateCoupon();
    return () => controller.abort();
  }, [estimatedShipping, hydrated, initialCoupon, lines, subtotalMinor]);

  useEffect(() => {
    if (successOrder) successHeadingRef.current?.focus();
  }, [successOrder]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setRecoveryTrackingUrl("");

    if (storeConfig.preview) {
      setError("El checkout está en modo precomercial. Valida catálogo, credenciales y políticas antes de activar cobros.");
      return;
    }
    if (!merchantId || !publicKey || !window.OpenPay) {
      setError("Falta configurar Openpay en este entorno.");
      return;
    }
    if (!turnstileToken) {
      setError("Completa la verificación de seguridad antes de pagar.");
      return;
    }

    setProcessing(true);
    try {
      if (!deviceSessionId.current) {
        throw new Error("No pudimos iniciar la protección antifraude de Openpay.");
      }
      if (!idempotencyKey.current) idempotencyKey.current = crypto.randomUUID();
      const form = new FormData(event.currentTarget);
      const sourceId = await tokenizeCard({
        card_number: String(form.get("card_number") || "").replace(/\s+/g, ""),
        holder_name: String(form.get("holder_name") || ""),
        expiration_month: String(form.get("expiration_month") || ""),
        expiration_year: String(form.get("expiration_year") || ""),
        cvv2: String(form.get("cvv2") || ""),
      });

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKey.current,
        },
        body: JSON.stringify({
          turnstileToken,
          sourceId,
          deviceSessionId: deviceSessionId.current,
          items: lines.map((line) => ({ productId: line.productId, quantity: line.quantity })),
          customer: {
            email: form.get("email"),
            firstName: form.get("first_name"),
            lastName: form.get("last_name"),
            phone: form.get("phone"),
            documentType: form.get("document_type"),
            documentNumber: form.get("document_number"),
          },
          shipping: {
            addressLine1: form.get("address_line_1"),
            addressLine2: form.get("address_line_2"),
            department: form.get("department"),
            district: form.get("district"),
            reference: form.get("reference"),
            method: form.get("shipping_method"),
          },
          invoice: businessInvoice
            ? { type: "invoice", businessName: form.get("business_name"), ruc: form.get("ruc") }
            : { type: "receipt" },
          couponCode: activeCoupon?.code || undefined,
          expectedTotalMinor: total,
          legalAcceptance: {
            accepted: form.get("legal_acceptance") === "yes",
            privacyVersion: STORE_LEGAL_VERSIONS.privacy,
            purchaseTermsVersion: STORE_LEGAL_VERSIONS.purchaseTerms,
            fulfilmentVersion: STORE_LEGAL_VERSIONS.fulfilment,
          },
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        code?: string;
        orderNumber?: string;
        redirectUrl?: string;
        trackingUrl?: string;
      };
      if (!response.ok) {
        if (result.trackingUrl) setRecoveryTrackingUrl(result.trackingUrl);
        const requestError = new Error(result.error || "No pudimos procesar el pedido.") as Error & {
          status?: number;
          code?: string;
        };
        requestError.status = response.status;
        requestError.code = result.code;
        throw requestError;
      }
      if (result.redirectUrl) {
        window.location.assign(result.redirectUrl);
        return;
      }
      setSuccessOrder(result.orderNumber || "Pedido creado");
      setSuccessTrackingUrl(result.trackingUrl || "");
      clearCart();
    } catch (caught) {
      const requestError = caught as Error & { status?: number; code?: string };
      if (requestError?.status === 402 || requestError?.code === "attempt_failed") {
        idempotencyKey.current = "";
      }
      setError(caught instanceof Error ? caught.message : "No pudimos completar el pago.");
    } finally {
      setTurnstileResetKey((key) => key + 1);
      setProcessing(false);
    }
  }

  if (!hydrated) return <div className="checkout-loading" role="status" aria-live="polite"><span className="sr-only">Cargando el resumen del pedido…</span></div>;
  if (successOrder) {
    return (
      <div className="checkout-success" role="status">
        <span><Check size={34} /></span><h1 ref={successHeadingRef} tabIndex={-1}>Recibimos tu pedido.</h1>
        <p>Orden <strong>{successOrder}</strong>. Te enviaremos la confirmación y el seguimiento por correo.</p>
        <Link href={successTrackingUrl || "/cuenta/pedidos"} className="button button--dark">
          {successTrackingUrl ? "Seguir mi pedido" : "Ver mis pedidos"}
        </Link>
      </div>
    );
  }
  if (lines.length === 0) {
    return (
      <div className="checkout-empty"><PackageOpen size={38} /><h1>No hay productos para comprar.</h1><Link href="/catalogo" className="button button--dark">Volver al catálogo</Link></div>
    );
  }

  return (
    <>
      {!storeConfig.preview && (
        <>
          <Script src="https://js.openpay.pe/openpay.v1.min.js" strategy="afterInteractive" onLoad={() => setScriptsReady(Boolean(window.OpenPay?.deviceData))} />
          <Script src="https://js.openpay.pe/openpay-data.v1.min.js" strategy="afterInteractive" onLoad={() => setScriptsReady(Boolean(window.OpenPay))} />
        </>
      )}
      <form id="checkout-form" className="checkout-grid" onSubmit={submit}>
        <input type="hidden" name="device_session_id" defaultValue="" />
        <div className="checkout-forms">
          <section className="checkout-card">
            <div className="checkout-card__head"><span>01</span><div><UserRound size={19} /><h2>Contacto</h2></div><Link href="/auth/ingresar">¿Ya tienes cuenta? Ingresa</Link></div>
            <div className="form-grid">
              <label className="field field--full"><span>Correo electrónico</span><input name="email" type="email" autoComplete="email" required placeholder="nombre@correo.com" /></label>
              <label className="field"><span>Nombres</span><input name="first_name" autoComplete="given-name" required /></label>
              <label className="field"><span>Apellidos</span><input name="last_name" autoComplete="family-name" required /></label>
              <label className="field"><span>Teléfono</span><input name="phone" inputMode="tel" autoComplete="tel" required placeholder="999 999 999" /></label>
              <label className="field"><span>Documento</span><div className="field-combo"><select name="document_type"><option>DNI</option><option>CE</option></select><input name="document_number" inputMode="numeric" required /></div></label>
            </div>
          </section>

          <section className="checkout-card">
            <div className="checkout-card__head"><span>02</span><div><MapPin size={19} /><h2>Entrega</h2></div></div>
            <div className="form-grid">
              <label className="field field--full"><span>Dirección</span><input name="address_line_1" autoComplete="street-address" required placeholder="Avenida, calle y número" /></label>
              <label className="field field--full"><span>Departamento / interior (opcional)</span><input name="address_line_2" /></label>
              <label className="field"><span>Departamento</span><select name="department" required defaultValue="Lima"><option>Lima</option><option>Callao</option></select><ChevronDown size={15} /></label>
              <label className="field"><span>Distrito</span><input name="district" required /></label>
              <label className="field field--full"><span>Referencia para la entrega</span><input name="reference" placeholder="Color de puerta, acceso, contacto en obra…" /></label>
            </div>
            <div className="shipping-options">
              <label><input type="radio" name="shipping_method" value="delivery" defaultChecked /><i><Truck size={19} /></i><span><strong>Despacho en Lima y Callao</strong><small>Tarifa plana mostrada antes del pago. Para provincias, solicita una cotización.</small></span><b>{finalShipping === 0 ? "Sin costo" : formatMoney(finalShipping)}</b></label>
            </div>
            <p className="payment-security-note">
              <Truck size={17} /> Ventana estimada: {storeConfig.deliveryWindow}. Para otros departamentos, <a href={provinceQuoteUrl} target="_blank" rel="noreferrer">cotiza el envío por WhatsApp</a> antes de pagar.
            </p>
          </section>

          <section className="checkout-card">
            <div className="checkout-card__head"><span>03</span><div><CreditCard size={19} /><h2>Pago</h2></div><small><LockKeyhole size={13} /> Seguro</small></div>
            <div className="payment-brand-row"><strong>Tarjeta de crédito o débito</strong><span>VISA</span><span>MC</span><span>AMEX</span></div>
            <div className="form-grid">
              <label className="field field--full"><span>Número de tarjeta</span><input name="card_number" inputMode="numeric" autoComplete="cc-number" required placeholder="0000 0000 0000 0000" /></label>
              <label className="field field--full"><span>Nombre en la tarjeta</span><input name="holder_name" autoComplete="cc-name" required /></label>
              <label className="field"><span>Vencimiento</span><div className="field-combo"><input name="expiration_month" inputMode="numeric" autoComplete="cc-exp-month" required placeholder="MM" maxLength={2} /><input name="expiration_year" inputMode="numeric" autoComplete="cc-exp-year" required placeholder="AA" maxLength={2} /></div></label>
              <label className="field"><span>CVV</span><input name="cvv2" type="password" inputMode="numeric" autoComplete="cc-csc" required maxLength={4} placeholder="•••" /></label>
            </div>
            <p className="payment-security-note"><ShieldCheck size={17} /> Los datos de tarjeta se tokenizan directamente con Openpay. Casa Atenta no recibe ni almacena el número o CVV.</p>
          </section>

          <section className="checkout-card checkout-card--compact">
            <p className="payment-security-note"><MapPin size={17} /> La dirección de entrega se usará también para el comprobante.</p>
            <label className="toggle-row"><input type="checkbox" checked={businessInvoice} onChange={(event) => setBusinessInvoice(event.target.checked)} /><i /><span>Necesito factura para empresa</span></label>
            {businessInvoice && <div className="form-grid form-grid--invoice"><label className="field"><span>RUC</span><input name="ruc" inputMode="numeric" required /></label><label className="field"><span>Razón social</span><input name="business_name" required /></label></div>}
          </section>
        </div>

        <aside className="checkout-summary">
          <h2>Resumen del pedido</h2>
          <div className="checkout-summary__lines">
            {lines.map((line) => <div key={line.productId}><ProductVisual product={line.product} size="mini" /><p><strong>{line.product.shortName}</strong><span>{line.product.model} · Cant. {line.quantity}</span></p><b>{formatMoney(line.lineTotalMinor)}</b></div>)}
          </div>
          <div className="checkout-summary__numbers"><p><span>Subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></p><p><span>Envío Lima/Callao</span><strong>{finalShipping === 0 ? "Sin costo" : formatMoney(finalShipping)}</strong></p>{activeCoupon && discountMinor > 0 && <p className="is-discount"><span>Cupón {activeCoupon.code}</span><strong>−{formatMoney(discountMinor)}</strong></p>}</div>
          <div className="checkout-summary__total"><span>Total</span><strong>{formatMoney(total)}</strong></div>
          {validatingCoupon && <div className="coupon-status">Validando cupón…</div>}
          {couponError && <div className="form-error" role="alert">{couponError} Continuaremos sin aplicarlo.</div>}
          {error && <div ref={errorRef} className="form-error" role="alert" tabIndex={-1}>{error}</div>}
          {recoveryTrackingUrl && (
            <Link href={recoveryTrackingUrl} className="button button--outline">
              Abrir seguimiento seguro
            </Link>
          )}
          <label className="checkout-summary__consent">
            <input type="checkbox" name="legal_acceptance" value="yes" required />
            <span>
              He leído y acepto los <Link href={STORE_LEGAL_PATHS.purchaseTerms} target="_blank">términos de compra</Link>, la <Link href={STORE_LEGAL_PATHS.privacy} target="_blank">política de privacidad</Link> y las <Link href={STORE_LEGAL_PATHS.fulfilment} target="_blank">condiciones de entrega, cambios y garantía</Link>.
            </span>
          </label>
          {!storeConfig.preview && (
            <StoreTurnstileWidget
              onToken={setTurnstileToken}
              resetKey={turnstileResetKey}
            />
          )}
          <button className="button button--primary" type="submit" disabled={processing || validatingCoupon || (!storeConfig.preview && !turnstileToken)}>{processing ? "Procesando…" : validatingCoupon ? "Validando cupón…" : storeConfig.preview ? "Checkout en preparación" : "Pagar de forma segura"}<ArrowRight size={17} /></button>
          <p className="checkout-summary__legal">La aceptación queda vinculada al pedido con la versión vigente de cada documento.</p>
          <div className="checkout-summary__openpay"><LockKeyhole size={16} /><span>Pago procesado por <strong>Openpay</strong></span></div>
        </aside>
      </form>
    </>
  );
}
