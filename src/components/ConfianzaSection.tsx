"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Shield, MapPin, Users } from "lucide-react";
import { PremiumIconWrapper } from "./icons/AnimatedIcons";

export const ConfianzaSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      if (cardsRef.current) {
        const cards = cardsRef.current.querySelectorAll(".trust-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: cardsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const trustCards = [
    {
      icon: Shield,
      title: "Garantía de trabajo",
      description:
        "Cada intervención cuenta con garantía sobre materiales y mano de obra. Revisamos y corregimos si algo no cumple el estándar.",
    },
    {
      icon: MapPin,
      title: "Atención en Lima",
      description:
        "Operamos en distritos de Lima Metropolitana: Miraflores, San Isidro, Surco, La Molina, San Borja, Barranco y zonas aledañas.",
    },
    {
      icon: Users,
      title: "Equipo técnico propio",
      description:
        "Jhon Febres y Alexis Espíritu lideran cada proyecto con criterio técnico, supervisión directa y comunicación transparente.",
    },
  ];

  return (
    <section ref={sectionRef} className="ca-section relative" id="confianza">
      <div className="ca-container relative z-10">
        <div className="mb-12 text-center">
          <span className="ca-kicker mb-4 block">Confianza</span>
          <h2 className="ca-heading mx-auto max-w-3xl mb-6">
            Trabajo{" "}
            <span className="font-serif italic" style={{ color: "var(--ca-gold)" }}>
              verificable.
            </span>
          </h2>
        </div>

        <div ref={cardsRef} className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
          {trustCards.map((card) => {
            const Icon = card.icon;
            const getIconClass = (title: string) => {
              if (title.includes("Garantía")) return "transition-transform duration-500 group-hover:rotate-12";
              if (title.includes("Atención")) return "transition-transform duration-500 group-hover:-translate-y-1.5";
              if (title.includes("Equipo")) return "transition-transform duration-500 group-hover:scale-115";
              return "";
            };

            return (
              <div
                key={card.title}
                className="trust-card group glass-card rounded-xl p-6 text-center"
                style={{ opacity: 0 }}
              >
                <PremiumIconWrapper className="mx-auto mb-4 h-12 w-12 !rounded-full">
                  <Icon className={`h-5 w-5 text-brand-gold ${getIconClass(card.title)}`} />
                </PremiumIconWrapper>
                <h3 className="text-sm font-display font-medium text-ca-text tracking-wide uppercase mb-3">
                  {card.title}
                </h3>
                <p className="text-sm text-ca-text-secondary leading-relaxed">
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
