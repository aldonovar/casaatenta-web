"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const PhilosophySection: React.FC = () => {
  const triggerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const container = containerRef.current;
    if (!trigger || !container) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      // Desktop: Pinned layout for large typography slide-up reveals
      const items = gsap.utils.toArray<HTMLElement>(".philosophy-item");
      const svgs = gsap.utils.toArray<SVGElement>(".philosophy-svg-bg");

      // Set initial states
      gsap.set(items, { opacity: 0.15, y: 50 });
      gsap.set(svgs, { opacity: 0, scale: 0.95 });

      // Animate first item
      gsap.set(items[0], { opacity: 1, y: 0 });
      gsap.set(svgs[0], { opacity: 0.05, scale: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Transition to pillar 2 (Tecnología)
      tl.to(items[0], { opacity: 0.15, y: -30, duration: 1 })
        .to(svgs[0], { opacity: 0, scale: 0.9, duration: 1 }, "-=1")
        .to(items[1], { opacity: 1, y: 0, duration: 1 }, "-=0.3")
        .to(svgs[1], { opacity: 0.06, scale: 1, duration: 1 }, "-=0.8")

      // Transition to pillar 3 (Atmósfera)
      tl.to(items[1], { opacity: 0.15, y: -30, duration: 1 }, "+=0.5")
        .to(svgs[1], { opacity: 0, scale: 0.9, duration: 1 }, "-=1")
        .to(items[2], { opacity: 1, y: 0, duration: 1 }, "-=0.3")
        .to(svgs[2], { opacity: 0.06, scale: 1, duration: 1 }, "-=0.8");
    });

    mm.add("(max-width: 1023px)", () => {
      // Mobile: Simple clean list, no pinning, standard reveals
      const items = gsap.utils.toArray(".philosophy-item");
      gsap.set(items, { opacity: 1, y: 0 });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={triggerRef} id="filosofia" className="relative w-full bg-ca-bg-primary border-t border-ca-border">
      <div
        ref={containerRef}
        className="relative min-h-screen w-full flex flex-col justify-center overflow-hidden py-24 px-6 md:px-16 lg:px-28"
      >
        {/* Simple background grid */}
        <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

        {/* Large abstract SVGs that fade in sync with active text (desktop only) */}
        <div className="absolute inset-0 z-0 pointer-events-none select-none hidden lg:flex items-center justify-end px-12 xl:px-28">
          
          {/* SVG 1: Arte (Bioclimatic slats) */}
          <svg viewBox="0 0 400 400" className="philosophy-svg-bg absolute w-full max-w-[500px] h-auto stroke-ca-text fill-none">
            <rect x="50" y="50" width="300" height="300" strokeWidth="0.5" />
            <line x1="50" y1="100" x2="350" y2="100" strokeWidth="0.5" />
            <line x1="50" y1="150" x2="350" y2="150" strokeWidth="0.5" />
            <line x1="50" y1="200" x2="350" y2="200" strokeWidth="0.5" />
            <line x1="50" y1="250" x2="350" y2="250" strokeWidth="0.5" />
            <line x1="50" y1="300" x2="350" y2="300" strokeWidth="0.5" />
          </svg>

          {/* SVG 2: Tecnología (Concentric radar wave) */}
          <svg viewBox="0 0 400 400" className="philosophy-svg-bg absolute w-full max-w-[500px] h-auto stroke-ca-text fill-none">
            <circle cx="200" cy="200" r="150" strokeWidth="0.5" strokeDasharray="5 5" />
            <circle cx="200" cy="200" r="100" strokeWidth="0.75" />
            <circle cx="200" cy="200" r="50" strokeWidth="1" />
            <line x1="200" y1="50" x2="200" y2="350" strokeWidth="0.5" />
            <line x1="50" y1="200" x2="350" y2="200" strokeWidth="0.5" />
          </svg>

          {/* SVG 3: Atmósfera (Solar path curve) */}
          <svg viewBox="0 0 400 400" className="philosophy-svg-bg absolute w-full max-w-[500px] h-auto stroke-ca-text fill-none">
            <path d="M 50 250 C 150 50, 250 50, 350 250" strokeWidth="0.75" />
            <line x1="50" y1="250" x2="350" y2="250" strokeWidth="0.5" strokeDasharray="3 6" />
            <circle cx="200" cy="115" r="8" fill="currentColor" />
          </svg>

        </div>

        {/* Content layout */}
        <div className="relative z-10 mx-auto w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          
          <div className="lg:col-span-8 space-y-12 lg:space-y-16">
            
            {/* Heading */}
            <div className="space-y-4">
              <SectionHeading
                number="01"
                label="Filosofía"
                title="LA CASA QUE PIENSA"
                subtitle="El espacio habitable no debe ser estático, sino un organismo que responde a tu presencia en sintonía con el entorno."
              />
            </div>

            {/* Scrolling / Stacking pillars */}
            <div ref={textContainerRef} className="space-y-12 lg:space-y-24 max-w-3xl">
              
              {/* Pillar 1: Arte */}
              <div className="philosophy-item space-y-4">
                <span className="text-[10px] font-mono tracking-[0.3em] text-ca-text-secondary block">01 / ARTE Y ESTRUCTURA</span>
                <h3 className="text-2xl md:text-4xl font-display font-light uppercase tracking-wider text-ca-text">
                  <BrandText>Líneas Limpias</BrandText>
                </h3>
                <p className="text-base md:text-lg font-light text-ca-text-secondary leading-relaxed max-w-2xl">
                  Cada detalle tiene intención. Diseñamos pérgolas y acabados superficiales respetando las proporciones nobles y la estructura espacial de tu hogar.
                </p>
              </div>

              {/* Pillar 2: Tecnología */}
              <div className="philosophy-item space-y-4">
                <span className="text-[10px] font-mono tracking-[0.3em] text-ca-text-secondary block">02 / TECNOLOGÍA INVISIBLE</span>
                <h3 className="text-2xl md:text-4xl font-display font-light uppercase tracking-wider text-ca-text">
                  <BrandText>Presencia Oculta</BrandText>
                </h3>
                <p className="text-base md:text-lg font-light text-ca-text-secondary leading-relaxed max-w-2xl">
                  Disolvemos los interruptores convencionales y pantallas plásticas. Sensores ocultos bajo la piedra o madera controlan el entorno de forma autónoma.
                </p>
              </div>

              {/* Pillar 3: Atmósfera */}
              <div className="philosophy-item space-y-4">
                <span className="text-[10px] font-mono tracking-[0.3em] text-ca-text-secondary block">03 / ATMÓSFERA SENSORIAL</span>
                <h3 className="text-2xl md:text-4xl font-display font-light uppercase tracking-wider text-ca-text">
                  <BrandText>Armonía Circadiana</BrandText>
                </h3>
                <p className="text-base md:text-lg font-light text-ca-text-secondary leading-relaxed max-w-2xl">
                  Tu casa cambia contigo. Escenas de iluminación y clima que emulan el ciclo solar natural para asegurar un descanso y confort imperceptibles.
                </p>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
export default PhilosophySection;
