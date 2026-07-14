"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface TechItem {
  name: string;
  status: "disponible" | "evaluacion" | "roadmap";
  category: string;
}

const techItems: TechItem[] = [
  { name: "Luces inteligentes (Philips Hue, Yeelight)", status: "disponible", category: "Iluminación" },
  { name: "Escenas de iluminación personalizadas", status: "disponible", category: "Iluminación" },
  { name: "Sensores de movimiento y presencia", status: "disponible", category: "Sensores" },
  { name: "Enchufes inteligentes", status: "disponible", category: "Control" },
  { name: "Control por asistentes de voz (Alexa/Google)", status: "disponible", category: "Control" },
  { name: "Control de luces por WhatsApp", status: "disponible", category: "WhatsApp" },
  { name: "Escenas completas por WhatsApp", status: "disponible", category: "WhatsApp" },
  { name: "Cerraduras inteligentes (biométricas)", status: "evaluacion", category: "Accesos" },
  { name: "Cámaras de seguridad integradas", status: "evaluacion", category: "Seguridad" },
  { name: "Motorización de pérgolas y cortinas", status: "evaluacion", category: "Automatización" },
  { name: "Control de electrodomésticos por WhatsApp", status: "roadmap", category: "WhatsApp" },
  { name: "Análisis de consumo energético", status: "roadmap", category: "Eficiencia" },
];

const statusConfig = {
  disponible: {
    label: "Disponible hoy",
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/30",
    dot: "bg-green-400",
  },
  evaluacion: {
    label: "Bajo evaluación",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
    dot: "bg-amber-400",
  },
  roadmap: {
    label: "Roadmap futuro",
    color: "text-ca-text-secondary",
    bg: "bg-white/[0.03]",
    border: "border-white/[0.08]",
    dot: "bg-ca-text-secondary",
  },
};

export const TecnologiaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        tableRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tableRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ca-section relative" id="tecnologia">
      <div className="ca-container relative z-10">
        <div ref={headingRef} className="mb-12 text-center" style={{ opacity: 0 }}>
          <span className="ca-kicker mb-4 block">Tecnología</span>
          <h2 className="ca-heading mx-auto max-w-3xl mb-6">
            Transparencia{" "}
            <span className="font-serif italic" style={{ color: "var(--ca-gold)" }}>
              tecnológica.
            </span>
          </h2>
          <p className="ca-body mx-auto text-center">
            Queremos que sepas exactamente qué funciona hoy, qué estamos
            evaluando y qué estará disponible en el futuro.
          </p>
        </div>

        {/* Status legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {(["disponible", "evaluacion", "roadmap"] as const).map((status) => {
            const cfg = statusConfig[status];
            return (
              <div key={status} className="flex items-center gap-2 text-xs">
                <span className={`inline-block h-2 w-2 rounded-full ${cfg.dot}`} />
                <span className={`font-mono uppercase tracking-wider ${cfg.color}`}>
                  {cfg.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Table */}
        <div
          ref={tableRef}
          className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-ca-border"
          style={{ opacity: 0 }}
        >
          {techItems.map((item, idx) => {
            const cfg = statusConfig[item.status];
            return (
              <div
                key={idx}
                className={`flex items-center justify-between gap-4 border-b border-ca-border/60 px-5 py-3.5 last:border-b-0 transition-colors duration-200 hover:bg-white/[0.03] ${
                  idx % 2 === 0 ? "bg-white/[0.015]" : ""
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  <span className="text-sm text-ca-text truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-ca-text-secondary hidden sm:inline">
                    {item.category}
                  </span>
                  <span
                    className={`rounded-full border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider ${cfg.color} ${cfg.bg} ${cfg.border}`}
                  >
                    {cfg.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
