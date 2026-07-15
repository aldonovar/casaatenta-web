import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Headphones, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import { storeConfig } from "@/lib/store-config";

export const metadata: Metadata = {
  title: "Ayuda, entregas y posventa",
  description: "Información de compra, despacho, cambios, garantía y asesoría técnica de Casa Atenta Tienda.",
};

const faqs = [
  ["¿Cómo sé qué modelo necesito?", "Cuéntanos el material, diámetro, frecuencia de uso y alimentación disponible. Contrastaremos potencia, encastre, autonomía y consumibles antes de recomendar."],
  ["¿El equipo incluye batería y cargador?", "Depende del sufijo y la configuración del kit. La ficha y el checkout indicarán exactamente cada pieza; si el lote aún no está aprobado, el producto no podrá cobrarse."],
  ["¿Puedo pedir factura?", "Sí. En el checkout selecciona factura e ingresa razón social y RUC de 11 dígitos."],
  ["¿Cómo sigo mi pedido?", "Cada cuenta muestra por separado confirmación de pago, preparación y entrega. Cuando exista una guía, verás transportista y enlace de seguimiento."],
];

export default function HelpPage() {
  return (
    <>
      <section className="help-hero"><div className="store-container"><span className="eyebrow">Centro de ayuda</span><h1>Compra técnica, sin adivinar.</h1><p>Condiciones claras antes del pago y acompañamiento después de la entrega.</p><a href={storeConfig.whatsapp} target="_blank" rel="noreferrer" className="button button--primary">Hablar con un asesor <ArrowRight size={17} /></a></div></section>
      <section className="store-container help-grid">
        <article id="asesoria"><span><Headphones size={24} /></span><h2>Asesoría técnica</h2><p>Validamos aplicación, potencia, accesorios, plataforma de batería y configuración exacta del kit.</p></article>
        <article id="envios"><span><Truck size={24} /></span><h2>Despacho y recojo</h2><p>La cobertura, tarifa y fecha se confirman según distrito, peso y dimensiones. Para provincias se informa agencia y condiciones de recepción.</p></article>
        <article id="cambios"><span><RefreshCcw size={24} /></span><h2>Cambios y devoluciones</h2><p>Conserva empaque, accesorios, serial y comprobante. La evaluación considera estado, motivo y normativa peruana aplicable.</p></article>
        <article id="garantia"><span><ShieldCheck size={24} /></span><h2>Garantía y servicio</h2><p>Registramos modelo y serial. Cobertura, plazo, exclusiones y red técnica se mostrarán por lote antes de habilitar la venta.</p></article>
      </section>
      <section className="store-container help-process"><div><span className="eyebrow">Después de comprar</span><h2>Un pedido que siempre explica qué sigue.</h2></div><ol><li><b>01</b><span><strong>Pago confirmado</strong><small>Openpay y el webhook actualizan el pedido.</small></span></li><li><b>02</b><span><strong>Preparación</strong><small>Validamos modelo, lote, contenido y serial.</small></span></li><li><b>03</b><span><strong>Despacho</strong><small>Publicamos transportista y seguimiento.</small></span></li><li><b>04</b><span><strong>Posventa</strong><small>Pedido y garantía quedan vinculados a tu cuenta.</small></span></li></ol></section>
      <section className="store-container help-faq"><span className="eyebrow">Preguntas frecuentes</span><h2>Respuestas rápidas</h2><div>{faqs.map(([question, answer]) => <details key={question}><summary>{question}<span>+</span></summary><p>{answer}</p></details>)}</div><p className="help-faq__more">¿Necesitas una condición comercial específica? <Link href="/catalogo">Revisa el catálogo</Link> o escribe a <a href={`mailto:${storeConfig.supportEmail}`}>{storeConfig.supportEmail}</a>.</p></section>
    </>
  );
}
