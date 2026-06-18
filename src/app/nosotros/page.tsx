"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, X, Shield, Award, UserCheck } from "lucide-react";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

export default function NosotrosPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Fade blocks staggered
      gsap.fromTo(
        ".reveal-block",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".reveal-trigger",
            start: "top 85%",
          },
        }
      );

      // Stagger team profiles
      gsap.fromTo(
        ".team-card",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: ".team-trigger",
            start: "top 80%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const principles = [
    {
      number: "01",
      title: "Arquitectura que piensa",
      body: "Cada muro, vano y material se diseña con intención climática, acústica y lumínica. La forma no es decoración: es función disuelta.",
    },
    {
      number: "02",
      title: "Tecnología que desaparece",
      body: "No colocamos pantallas plásticas en tus paredes ni interruptores complejos. Integramos sensores de CO2, luz y presencia bajo el enlucido.",
    },
    {
      number: "03",
      title: "Control conversacional",
      body: "Tu casa responde por WhatsApp de forma natural. Sin aplicaciones dedicadas ni manuales técnicos. Hablas con tu espacio de forma natural.",
    },
    {
      number: "04",
      title: "Experiencia circadiana",
      body: "Diseñamos atmósferas que acompañan tu rutina. La luz del sol y el clima se adaptan de forma autónoma al reloj biológico humano.",
    },
  ];

  return (
    <div ref={containerRef} className="bg-ca-bg-deep min-h-screen pt-36 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      {/* MANIFIESTO SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-32 relative z-10">
        <div className="mb-20">
          <SectionHeading
            number="01"
            label="Nosotros"
            title="NO AÑADIMOS TECNOLOGÍA, LA DISOLVEMOS"
            subtitle="Nuestra filosofía concibe la tecnología residencial como una extensión orgánica de la arquitectura."
          />
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24">
          {principles.map((p) => (
            <div
              key={p.number}
              className="border-t border-white/[0.05] pt-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4 font-mono text-[9px] tracking-wider text-brand-light/35 uppercase">
                  <span className="text-brand-gold font-semibold">{p.number} /</span>
                  <span>PRINCIPLE // 0{p.number}</span>
                </div>
                <h3 className="text-base md:text-lg font-display font-light text-brand-light tracking-wide mb-3 group-hover:text-brand-gold transition-colors duration-300 uppercase">
                  <BrandText>{p.title}</BrandText>
                </h3>
                <p className="text-sm font-light text-brand-light/50 leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAL SECTION */}
      <section className="bg-ca-bg-surface border-t border-b border-white/[0.05] py-28 reveal-trigger relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block">
              02 / Diferencial
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-brand-light uppercase tracking-wide leading-tight">
              <BrandText>El Enfoque Metódico</BrandText>
              <span className="text-brand-gold">.</span>
            </h2>
            <p className="text-sm font-light text-brand-light/60 leading-relaxed max-w-xl">
              Los integradores de domótica tradicionales instalan dispositivos visibles que saturan los muros. En Casa Atenta diseñamos la infraestructura oculta antes de construir para que el diseño sea el protagonista.
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch reveal-block">
            {/* Competitors approach */}
            <div className="lg:col-span-6 glass-card p-8 rounded-lg flex flex-col justify-between bg-white/[0.01]">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-white/30 text-[9px] font-mono uppercase tracking-widest border-b border-white/[0.05] pb-3">
                  <span>Enfoque convencional de domótica</span>
                  <X size={12} className="text-red-500/70" />
                </div>
                <ul className="space-y-4 text-xs font-sans font-light text-brand-light/50">
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>Pantallas táctiles gruesas empotradas en los muros principales.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>Termostatos e interruptores plásticos de múltiples marcas a la vista.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>Altavoces redondos con rejillas plásticas perforando los techos.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>Múltiples aplicaciones móviles complejas que confunden al usuario.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>Climatización integrada a destiempo con rejillas ruidosas e industriales.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 text-[8px] font-mono tracking-widest text-brand-light/20 uppercase border-t border-white/[0.04] mt-6">
                <span>Venta de productos y dispositivos sueltos</span>
              </div>
            </div>

            {/* Casa Atenta approach */}
            <div className="lg:col-span-6 glass-card p-8 rounded-lg flex flex-col justify-between border-brand-gold/30 bg-brand-gold/[0.01]">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-brand-gold text-[9px] font-mono uppercase tracking-widest border-b border-brand-gold/20 pb-3">
                  <span>Filosofía Casa Atenta</span>
                  <Check size={12} className="text-brand-gold" />
                </div>
                <ul className="space-y-4 text-xs font-sans font-light text-brand-light/80">
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Muros continuos sin interrupciones. La casa se opera sola o por voz natural.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Sensores capacitivos táctiles ocultos bajo piedra o madera.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Audio por transductores de resonancia invisibles detrás del yeso.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Interacción sin aplicaciones complejas: todo por WhatsApp natural.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Climatización difusa en ranuras de 12mm perimetrales invisibles.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 text-[8px] font-mono tracking-widest text-brand-gold/60 uppercase border-t border-brand-gold/15 mt-6">
                <span>Diseño de experiencias de habitabilidad integrada</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-28 team-trigger relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block mb-3">
              03 / Equipo
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-light text-brand-light uppercase tracking-wide leading-tight">
              <BrandText>Especialidades y Visión</BrandText>
              <span className="text-brand-gold">.</span>
            </h2>
          </div>
          <p className="text-sm font-light text-brand-light/50 leading-relaxed max-w-md">
            Un equipo de ingenieros, arquitectos y diseñadores que unen la rigurosidad espacial del diseño civil con el desarrollo de software y hardware de IoT.
          </p>
        </div>

        {/* Team profiles */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {[
            {
              name: "Jhon Febres",
              role: "Propietario & Gerente General",
              bio: "Lidera la dirección comercial, la viabilidad constructiva en obra civil y la correcta ejecución estructural de terrazas y acabados residenciales.",
              icon: Award,
            },
            {
              name: "Alexis Espíritu",
              role: "Cofundador & Director Técnico Visual",
              bio: "Dirige el modelado de iluminación circadiana, el diseño acústico por transductores invisibles y el desarrollo del ecosistema IoT local.",
              icon: Shield,
            },
          ].map((member, i) => {
            const Icon = member.icon;
            return (
              <div
                key={i}
                className="team-card glass-card p-8 rounded-lg flex flex-col justify-between space-y-6 bg-white/[0.01]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded border border-brand-gold/20 text-brand-gold bg-brand-gold/5">
                  <Icon size={20} />
                </div>
                <div className="space-y-3">
                  <h4 className="text-lg font-display font-light text-brand-light uppercase tracking-wide">
                    <BrandText>{member.name}</BrandText>
                  </h4>
                  <span className="text-[9px] font-mono text-brand-gold uppercase tracking-widest font-semibold block">
                    {member.role}
                  </span>
                  <p className="text-xs font-sans font-light text-brand-light/45 leading-relaxed pt-2 border-t border-white/[0.04]">
                    {member.bio}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CERTIFICATIONS SECTION */}
      <section className="border-t border-white/[0.05] py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
          <span className="text-[9px] font-mono tracking-[0.25em] text-brand-gold uppercase block mb-10">
            Marcas & Tecnologías Integradas bajo Norma Técnica
          </span>
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 opacity-30">
            {["CRESTRON", "LUTRON", "SAVANT", "CONTROL4", "SHELLY", "SONOS"].map((p, i) => (
              <span
                key={i}
                className="text-xs font-mono tracking-[0.3em] text-brand-light font-bold select-none"
              >
                <BrandText>{p}</BrandText>
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
