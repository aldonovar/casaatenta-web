"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { createWhatsAppLink } from "@/constants/contact";
import { BrandText } from "./BrandText";
import { TurnstileWidget } from "./TurnstileWidget";

const services = [
  "Automatización del hogar",
  "Iluminación inteligente",
  "Techo Sol y Sombra",
  "Diseño de terraza",
  "Mantenimiento y acabados",
  "Aún no lo tengo definido",
];
const field =
  "w-full rounded-sm border border-ca-border bg-ca-bg-deep/70 px-4 py-3.5 text-sm text-ca-text outline-none transition placeholder:text-ca-text-secondary/75 focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/35";

type FormState = {
  name: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  measures: string;
  detail: string;
  privacyConsent: boolean;
  website: string;
};

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  service: services[0],
  location: "",
  measures: "",
  detail: "",
  privacyConsent: false,
  website: "",
};

type CotizaFormSectionProps = {
  source?: "contact" | "quote";
};

export function CotizaFormSection({ source = "contact" }: CotizaFormSectionProps) {
  const [form, setForm] = useState(initialForm);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const whatsappLink = useMemo(
    () =>
      createWhatsAppLink(
        [
          "Hola Casa Atenta, acabo de registrar una solicitud en su web.",
          `Nombre: ${form.name}`,
          `Servicio: ${form.service}`,
          form.location && `Distrito o ubicación: ${form.location}`,
          form.measures && `Medidas o zonas aproximadas: ${form.measures}`,
          `Necesidad o funciones esperadas: ${form.detail}`,
          "Puedo adjuntar fotos o videos en este chat.",
        ]
          .filter(Boolean)
          .join("\n"),
      ),
    [form],
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!turnstileToken) {
      setStatus("error");
      setMessage("Completa la verificación de seguridad antes de enviar.");
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source,
          name: form.name,
          email: form.email,
          phone: form.phone,
          service: form.service,
          location: form.location,
          measures: form.measures,
          message: form.detail,
          projectData: {},
          privacyConsent: form.privacyConsent,
          website: form.website,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error || "No pudimos registrar la solicitud.");

      setStatus("success");
      setMessage("Solicitud registrada. Te enviaremos una copia a tu correo.");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "No pudimos registrar la solicitud.");
      setTurnstileResetKey((key) => key + 1);
    }
  }

  return (
    <section id="cotiza" className="relative border-t border-ca-border bg-ca-bg-surface/75 px-6 py-24 text-ca-text backdrop-blur-xl md:py-32 lg:px-10">
      <div className="architectural-grid absolute inset-0 opacity-[.04]" />
      <div className="relative mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="mb-5 block font-mono text-[10px] uppercase tracking-[.28em] text-brand-gold">Evaluación inicial</span>
          <h2 className="font-display text-4xl font-light uppercase leading-[1.02] md:text-6xl"><BrandText>Cuéntanos qué debe responder.</BrandText></h2>
          <p className="mt-7 max-w-lg text-sm leading-7 text-ca-text-secondary">Indica las funciones, ambientes o problemas actuales. Para exteriores, añade medidas y fotos de apoyos. Para automatización, incluye equipos, red y zonas prioritarias.</p>
          <div className="mt-10 border-t border-ca-border pt-6 text-xs leading-6 text-ca-text-secondary"><p>La solicitud se almacena de forma segura y queda protegida contra envíos automatizados.</p></div>
        </div>

        <form onSubmit={submit} className="glass-panel grid gap-5 p-6 md:grid-cols-2 md:p-8 lg:col-span-7" aria-label="Solicitud de evaluación">
          <div className="absolute -left-[10000px]" aria-hidden="true">
            <label>Tu sitio web<input tabIndex={-1} autoComplete="off" value={form.website} onChange={(event) => update("website", event.target.value)} /></label>
          </div>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60">Nombre<input required autoComplete="name" value={form.name} onChange={(event) => update("name", event.target.value)} className={field} placeholder="Nombre y apellido" /></label>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60">Correo<input required type="email" autoComplete="email" value={form.email} onChange={(event) => update("email", event.target.value)} className={field} placeholder="nombre@correo.com" /></label>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60">WhatsApp o teléfono<input required type="tel" autoComplete="tel" value={form.phone} onChange={(event) => update("phone", event.target.value)} className={field} placeholder="+51 999 999 999" /></label>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60">Servicio<select value={form.service} onChange={(event) => update("service", event.target.value)} className={field}>{services.map((item) => <option key={item} value={item}>{item}</option>)}</select></label>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60">Distrito o ubicación<input autoComplete="address-level2" value={form.location} onChange={(event) => update("location", event.target.value)} className={field} placeholder="Ej. La Victoria, Lima" /></label>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60">Medidas o zonas<input value={form.measures} onChange={(event) => update("measures", event.target.value)} className={field} placeholder="Ej. sala y acceso / 4.20 m × 3.60 m" /></label>
          <label className="grid gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text/60 md:col-span-2">Necesidad, estado actual o funciones esperadas<textarea required rows={5} maxLength={4000} value={form.detail} onChange={(event) => update("detail", event.target.value)} className={`${field} resize-y`} placeholder="Ej. Encender luces por presencia, revisar acceso principal o cubrir una terraza con sistema motorizado." /></label>
          <label className="flex items-start gap-3 text-xs leading-5 text-ca-text-secondary md:col-span-2">
            <input required type="checkbox" checked={form.privacyConsent} onChange={(event) => update("privacyConsent", event.target.checked)} className="mt-1 accent-brand-gold" />
            <span>Acepto el tratamiento de mis datos para responder esta solicitud según la <Link href="/privacidad" className="text-brand-gold underline">Política de Privacidad</Link>.</span>
          </label>
          <div className="md:col-span-2"><TurnstileWidget action="contact_form" onToken={setTurnstileToken} resetKey={turnstileResetKey} /></div>
          <button disabled={status === "sending"} type="submit" className="min-h-14 bg-brand-gold px-6 font-mono text-[10px] font-semibold uppercase tracking-[.22em] text-[#07111d] transition hover:bg-brand-gold-light focus:outline-none focus:ring-2 focus:ring-brand-gold/50 disabled:cursor-wait disabled:opacity-60 md:col-span-2">
            {status === "sending" ? "Registrando…" : "Enviar solicitud segura"}
          </button>
          {message && <p className={`text-xs leading-5 md:col-span-2 ${status === "success" ? "text-emerald-300" : "text-red-300"}`} role="status">{message}</p>}
          {status === "success" && <a href={whatsappLink} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center border border-brand-gold px-5 font-mono text-[10px] uppercase tracking-[.18em] text-brand-gold md:col-span-2">Añadir fotos por WhatsApp ↗</a>}
        </form>
      </div>
    </section>
  );
}

export default CotizaFormSection;
