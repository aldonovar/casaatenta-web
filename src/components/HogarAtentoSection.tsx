"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { WhatsAppMockup } from "./WhatsAppMockup";
import {
  BuenosDiasIcon,
  HoraCenaIcon,
  BuenasNochesIcon,
  SalirCasaIcon,
} from "./icons/AnimatedIcons";

export const HogarAtentoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        titleRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        mockupRef.current,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: mockupRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (stepsRef.current) {
        const items = stepsRef.current.querySelectorAll(".hogar-step");
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: {
              trigger: stepsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  const routines = [
    {
      icon: <BuenosDiasIcon size={24} />,
      title: "Buenos días",
      description:
        "Las cortinas se abren, la luz sube gradualmente y la cafetera se activa.",
    },
    {
      icon: <HoraCenaIcon size={24} />,
      title: "Hora de cena",
      description:
        "Iluminación cálida al 60%, música ambiental y terraza lista para servir.",
    },
    {
      icon: <BuenasNochesIcon size={24} />,
      title: "Buenas noches",
      description:
        "Luces apagadas, accesos bloqueados, sensores activos y noche tranquila.",
    },
    {
      icon: <SalirCasaIcon size={24} />,
      title: "Salir de casa",
      description:
        "Todo se apaga, la seguridad se activa y recibes confirmación en tu chat.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="ca-section relative overflow-hidden"
      id="hogar-atento"
    >
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 30% 50%, rgba(216, 179, 106, 0.06), transparent 60%)",
        }}
      />

      <div className="ca-container relative z-10">
        {/* Title block */}
        <div ref={titleRef} className="mb-16 max-w-2xl" style={{ opacity: 0 }}>
          <span className="ca-kicker mb-4 block">El Hogar Atento</span>
          <h2 className="ca-heading mb-6">
            Tu casa responde
            <br />
            <span className="font-serif italic" style={{ color: "var(--ca-gold)" }}>
              desde WhatsApp.
            </span>
          </h2>
          <p className="ca-body">
            Imagina controlar luces, escenas y rutinas desde el canal que ya usas
            todos los días. Sin apps adicionales, sin complicaciones. Solo tú y tu
            hogar, conectados.
          </p>
        </div>

        {/* Two-column layout: routines + mockup */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Routines list */}
          <div ref={stepsRef} className="flex flex-col gap-6">
            {routines.map((r, idx) => (
              <div
                key={idx}
                className="hogar-step group flex items-start gap-4 rounded-lg border border-ca-border/60 bg-white/[0.03] p-5 transition-all duration-300 hover:border-brand-gold/30 hover:bg-white/[0.06]"
                style={{ opacity: 0 }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-brand-gold/20 bg-ca-bg-deep/80 p-2 backdrop-blur-sm transition-all duration-300 group-hover:border-brand-gold/50">
                  {r.icon}
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ca-text mb-1 font-display tracking-wide uppercase">
                    {r.title}
                  </h3>
                  <p className="text-sm text-ca-text-secondary leading-relaxed">
                    {r.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* WhatsApp Mockup */}
          <div ref={mockupRef} style={{ opacity: 0 }}>
            <WhatsAppMockup />
          </div>
        </div>
      </div>
    </section>
  );
};
