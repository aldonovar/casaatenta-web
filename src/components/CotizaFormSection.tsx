"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, ArrowUpRight } from "lucide-react";
import { createWhatsAppLink } from "@/constants/contact";

const serviceOptions = [
  { value: "", label: "Selecciona un servicio" },
  { value: "techos-sol-y-sombra", label: "Techos Sol y Sombra" },
  { value: "diseno-terrazas", label: "Diseño de Terrazas" },
  { value: "iluminacion-inteligente", label: "Iluminación Inteligente" },
  { value: "smart-homes", label: "Smart Homes" },
  { value: "mantenimiento-general", label: "Mantenimiento General" },
  { value: "otro", label: "Otro / No estoy seguro" },
];

const budgetOptions = [
  { value: "", label: "Selecciona un rango" },
  { value: "menos-2000", label: "Menos de S/ 2,000" },
  { value: "2000-5000", label: "S/ 2,000 – S/ 5,000" },
  { value: "5000-10000", label: "S/ 5,000 – S/ 10,000" },
  { value: "10000-20000", label: "S/ 10,000 – S/ 20,000" },
  { value: "mas-20000", label: "Más de S/ 20,000" },
  { value: "no-seguro", label: "Aún no tengo presupuesto definido" },
];

export const CotizaFormSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const [nombre, setNombre] = useState("");
  const [servicio, setServicio] = useState("");
  const [presupuesto, setPresupuesto] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [medidas, setMedidas] = useState("");

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: formRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const serviceName =
      serviceOptions.find((s) => s.value === servicio)?.label || servicio;
    const budgetName =
      budgetOptions.find((b) => b.value === presupuesto)?.label || presupuesto;

    let message = `Hola Casa Atenta, quiero cotizar un proyecto.\n\n`;
    if (nombre) message += `👤 Nombre: ${nombre}\n`;
    if (serviceName) message += `🏠 Servicio: ${serviceName}\n`;
    if (budgetName) message += `💰 Presupuesto: ${budgetName}\n`;
    if (medidas) message += `📐 Medidas: ${medidas}\n`;
    if (descripcion) message += `📝 Descripción: ${descripcion}\n`;

    const link = createWhatsAppLink(message);
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const inputClass =
    "w-full rounded-lg border border-ca-border bg-white/[0.04] px-4 py-3 text-sm text-ca-text placeholder:text-ca-text-secondary/50 focus:border-brand-gold/50 focus:outline-none focus:ring-1 focus:ring-brand-gold/30 transition-colors duration-200";

  const labelClass =
    "block text-xs font-mono uppercase tracking-widest text-ca-text-secondary mb-2";

  return (
    <section ref={sectionRef} className="ca-section relative" id="cotiza">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 70% 50%, rgba(216, 179, 106, 0.05), transparent 50%)",
        }}
      />

      <div className="ca-container relative z-10">
        <div className="mb-12 text-center">
          <span className="ca-kicker mb-4 block">Cotiza tu proyecto</span>
          <h2 className="ca-heading mx-auto max-w-3xl mb-6">
            Cuéntanos tu idea.
            <br />
            <span className="font-serif italic" style={{ color: "var(--ca-gold)" }}>
              Respondemos por WhatsApp.
            </span>
          </h2>
          <p className="ca-body mx-auto text-center">
            Completa el formulario y te contactaremos por WhatsApp con una
            propuesta personalizada.
          </p>
        </div>

        <div
          ref={formRef}
          className="mx-auto max-w-xl"
          style={{ opacity: 0 }}
        >
          <form
            onSubmit={handleSubmit}
            className="glass-panel rounded-2xl p-8 space-y-6"
          >
            {/* Nombre */}
            <div>
              <label htmlFor="cotiza-nombre" className={labelClass}>
                Tu nombre
              </label>
              <input
                id="cotiza-nombre"
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="¿Cómo te llamas?"
                className={inputClass}
              />
            </div>

            {/* Servicio */}
            <div>
              <label htmlFor="cotiza-servicio" className={labelClass}>
                ¿Qué necesitas?
              </label>
              <select
                id="cotiza-servicio"
                value={servicio}
                onChange={(e) => setServicio(e.target.value)}
                className={inputClass}
              >
                {serviceOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Presupuesto */}
            <div>
              <label htmlFor="cotiza-presupuesto" className={labelClass}>
                Presupuesto estimado
              </label>
              <select
                id="cotiza-presupuesto"
                value={presupuesto}
                onChange={(e) => setPresupuesto(e.target.value)}
                className={inputClass}
              >
                {budgetOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Medidas */}
            <div>
              <label htmlFor="cotiza-medidas" className={labelClass}>
                Medidas aproximadas (opcional)
              </label>
              <input
                id="cotiza-medidas"
                type="text"
                value={medidas}
                onChange={(e) => setMedidas(e.target.value)}
                placeholder="Ej: 4m x 3m, terraza segundo piso"
                className={inputClass}
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="cotiza-descripcion" className={labelClass}>
                Cuéntanos más sobre tu proyecto
              </label>
              <textarea
                id="cotiza-descripcion"
                rows={4}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Describe brevemente lo que necesitas: ubicación, estado actual, ideas, urgencia..."
                className={`${inputClass} resize-none`}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="ca-button w-full flex items-center justify-center gap-2.5 rounded-lg"
            >
              <MessageCircle className="h-4 w-4" />
              <span>Enviar por WhatsApp</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>

            <p className="text-center text-[11px] text-ca-text-secondary/60">
              Al enviar, se abrirá WhatsApp con un mensaje prellenado con tus datos.
              No almacenamos información personal sin tu consentimiento.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};
