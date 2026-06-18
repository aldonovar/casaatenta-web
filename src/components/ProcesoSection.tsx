"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const steps = [
  {
    number: "01",
    title: "Diagnóstico",
    text: "Visitamos tu espacio, medimos, revisamos estructura, orientación y uso actual.",
  },
  {
    number: "02",
    title: "Propuesta visual",
    text: "Traducimos tus necesidades en una propuesta clara con materiales, distribución y acabados.",
  },
  {
    number: "03",
    title: "Cotización transparente",
    text: "Desglose completo de costos: materiales, mano de obra, instalación. Sin sorpresas.",
  },
  {
    number: "04",
    title: "Ejecución cuidada",
    text: "Instalamos, pintamos, cableamos o configuramos con protección y orden.",
  },
  {
    number: "05",
    title: "Configuración inteligente",
    text: "Escenas, rutinas, sensores y control desde tu celular o WhatsApp.",
  },
  {
    number: "06",
    title: "Entrega y acompañamiento",
    text: "Verificamos funcionamiento, te capacitamos y dejamos recomendaciones de uso.",
  },
];

export const ProcesoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

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

      if (stepsRef.current) {
        const items = stepsRef.current.querySelectorAll(".step-item");
        gsap.fromTo(
          items,
          { opacity: 0, x: -24 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ca-section relative" id="proceso">
      <div className="absolute inset-0 architectural-grid opacity-30 pointer-events-none" />

      <div className="ca-container relative z-10">
        <div ref={headingRef} className="mb-14 text-center" style={{ opacity: 0 }}>
          <span className="ca-kicker mb-4 block">Método de trabajo</span>
          <h2 className="ca-heading mx-auto max-w-3xl mb-6">
            Del diagnóstico
            <br />
            <span className="font-serif italic" style={{ color: "var(--ca-gold)" }}>
              a la escena.
            </span>
          </h2>
          <p className="ca-body mx-auto text-center">
            Cada proyecto pasa por un proceso claro que empieza con una visita
            técnica y termina con un espacio que funciona mejor.
          </p>
        </div>

        <div ref={stepsRef} className="mx-auto max-w-2xl">
          {steps.map((step, idx) => (
            <div
              key={step.number}
              className="step-item group relative flex gap-6 pb-10"
              style={{ opacity: 0 }}
            >
              {/* Timeline line */}
              {idx < steps.length - 1 && (
                <div
                  className="absolute left-[19px] top-10 w-px"
                  style={{
                    height: "calc(100% - 2rem)",
                    background:
                      "linear-gradient(180deg, var(--ca-gold), rgba(216, 179, 106, 0.15))",
                  }}
                />
              )}

              {/* Number circle */}
              <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brand-gold/40 bg-ca-bg-deep text-xs font-mono text-brand-gold transition-all duration-300 group-hover:bg-brand-gold/10 group-hover:border-brand-gold">
                {step.number}
              </div>

              {/* Content */}
              <div className="pt-1">
                <h3 className="text-sm font-display font-medium text-ca-text tracking-wide uppercase mb-1.5">
                  {step.title}
                </h3>
                <p className="text-sm text-ca-text-secondary leading-relaxed">
                  {step.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
