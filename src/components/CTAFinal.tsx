"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WHATSAPP_LINK } from "@/constants/contact";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const CTAFinal: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const bgGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const card = cardRef.current;
    if (!el || !card) return;

    const ctx = gsap.context(() => {
      // Scale-in transition for the main glass card
      gsap.fromTo(
        card,
        { scale: 0.96, opacity: 0, y: 50 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );

      // Pulsing subtle ambient glow
      gsap.to(bgGlowRef.current, {
        scale: 1.15,
        opacity: 0.08,
        duration: 5,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="final"
      className="relative z-20 overflow-hidden bg-ca-bg-deep px-6 py-28 md:px-16 md:py-40 lg:px-28"
    >
      <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

      {/* Subtle Ambient Glow */}
      <div
        ref={bgGlowRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-ca-text opacity-5 blur-[120px] z-0 pointer-events-none"
      />

      <div className="relative z-10 mx-auto max-w-5xl">
        <div
          ref={cardRef}
          className="relative glass-card border border-ca-border rounded-2xl overflow-hidden py-20 px-8 md:py-32 md:px-20 text-center shadow-2xl flex flex-col items-center"
        >
          <div className="relative z-10 max-w-3xl space-y-8">
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ca-text/40 block">
              [ Agendar Consulta ]
            </span>
            
            <h2 className="text-4xl font-display font-light uppercase leading-tight tracking-[0.1em] text-ca-text sm:text-6xl md:text-7xl">
              <BrandText>TRANSFORMA TU ESPACIO</BrandText>
            </h2>

            {/* Small divider line */}
            <div className="w-32 h-[1.5px] bg-ca-text/30 mx-auto my-6" />

            <p className="text-base font-serif italic text-ca-text-secondary/80 md:text-lg max-w-2xl mx-auto leading-relaxed">
              Cuéntanos sobre tu obra. Analizamos planos, orientación solar y viabilidad técnica antes de elaborar cualquier cotización.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-5 justify-center pt-8 w-full sm:w-auto">
              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-btn inline-flex min-h-14 items-center justify-center gap-3 border border-ca-text bg-ca-text px-10 py-4.5 text-[11px] font-mono uppercase tracking-[0.25em] text-ca-bg-deep transition-all duration-300 font-semibold hover:opacity-90 cursor-pointer"
              >
                <BrandText>Agendar consultoría técnica</BrandText>
              </a>
              <a
                href="/contacto"
                className="inline-flex min-h-14 items-center justify-center gap-3 border border-ca-border bg-ca-bg-surface/10 hover:bg-ca-text/10 px-10 py-4.5 text-[11px] font-mono uppercase tracking-[0.25em] text-ca-text transition-all duration-300"
              >
                <BrandText>Formulario de contacto</BrandText>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default CTAFinal;
