"use client";

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Check, X } from 'lucide-react';
import { BrandText } from '../../components/BrandText';
import { PremiumPlaceholder } from '../../components/PremiumPlaceholder';

gsap.registerPlugin(ScrollTrigger);

export default function NosotrosPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.reveal-block',
        { opacity: 0, y: 35 },
        { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: '.reveal-trigger', start: 'top 85%' }
        }
      );

      gsap.fromTo('.team-card',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.12,
          scrollTrigger: { trigger: '.team-trigger', start: 'top 80%' }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const principles = [
    { number: '01', title: 'Arquitectura que piensa', body: 'Cada muro, vano y material se diseña con intención climática, acústica y lumínica. La forma no es decoración: es función integrada.' },
    { number: '02', title: 'Tecnología que desaparece', body: 'No colocamos pantallas en tus paredes ni interruptores complejos. Integramos sensores de CO2, luz y presencia bajo el enlucido.' },
    { number: '03', title: 'Control conversacional', body: 'Tu casa responde por WhatsApp de forma natural. Sin aplicaciones dedicadas ni manuales técnicos. Hablas con tu espacio como con un amigo.' },
    { number: '04', title: 'Experiencia circadiana', body: 'Diseñamos atmósferas que acompañan tu rutina. La luz del sol y el clima se adaptan de forma autónoma al ritmo biológico.' }
  ];

  return (
    <div ref={containerRef} className="bg-brand-dark min-h-screen pt-36 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* MANIFIESTO SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-32">
        <div className="mb-20">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase mb-4 block">
            01 / NUESTRO MANIFIESTO
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-sans font-extralight text-brand-light tracking-widest leading-[1.1] mb-8 uppercase">
            <BrandText>No añadimos tecnología,</BrandText> <br />
            <span className="font-light text-brand-gold"><BrandText>la disolvemos</BrandText></span><span className="text-brand-gold">.</span>
          </h2>
          {/* Sparkle divider */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-6">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24">
          {principles.map((p) => (
            <div 
              key={p.number} 
              className="border-t border-white/[0.06] pt-8 flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-4 font-sans text-[9px] tracking-wider text-white/30 uppercase">
                  <span className="text-brand-gold font-semibold">{p.number} /</span>
                  <span>PROP-ID: Cλ-0{p.number}</span>
                </div>
                <h3 className="text-base md:text-lg font-sans font-light text-brand-light tracking-wider mb-3 group-hover:text-brand-gold transition-colors duration-300 uppercase">
                  <BrandText>{p.title}</BrandText>
                </h3>
                <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed">
                  {p.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DIFERENCIAL SECTION */}
      <section className="bg-brand-dark-soft border-t border-b border-white/[0.04] py-28 reveal-trigger">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          
          <div className="max-w-3xl mb-16 space-y-4">
            <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block">
              02 / NUESTRO DIFERENCIAL
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
              <BrandText>El diferencial</BrandText><span className="text-brand-gold">.</span>
            </h2>
            {/* Sparkle divider */}
            <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-4">
              <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
            </div>
            <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-xl">
              Los integradores técnicos instalan gadgets visibles en tus paredes. Nosotros diseñamos la infraestructura antes de construir, ocultando cada elemento técnico para que la arquitectura sea la protagonista.
            </p>
          </div>

          {/* Comparison Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch reveal-block">
            
            {/* Competitors approach */}
            <div className="lg:col-span-6 bg-brand-dark border border-white/[0.03] p-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between text-white/30 text-[9px] font-sans uppercase tracking-widest border-b border-white/[0.04] pb-3">
                  <span>ENFOQUE CONVENCIONAL DE DOMÓTICA</span>
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
                    <span>Altavoces redondos con rejillas plásticas perforando el cielo raso.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>Múltiples aplicaciones móviles complejas que confunden al usuario.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500/60 mt-0.5">▪</span>
                    <span>HVAC integrado a destiempo con rejillas industriales ruidosas.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 text-[8px] font-sans tracking-widest text-white/20 uppercase border-t border-white/[0.04] mt-6">
                <span>Venta de productos y dispositivos</span>
              </div>
            </div>

            {/* Casa Atenta approach */}
            <div className="lg:col-span-6 bg-brand-dark border border-brand-gold/25 p-8 flex flex-col justify-between relative">
              <div className="absolute top-0 right-8 bg-brand-gold/10 border-b border-l border-brand-gold/30 px-3 py-1 font-sans text-[9px] tracking-widest text-brand-gold uppercase">
                <BrandText>DIFERENCIAL CLAVE</BrandText>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between text-brand-gold text-[9px] font-sans uppercase tracking-widest border-b border-brand-gold/15 pb-3">
                  <span>FILOSOFÍA CΛSΛ ΛTENTΛ</span>
                  <Check size={12} className="text-brand-gold" />
                </div>
                <ul className="space-y-4 text-xs font-sans font-light text-brand-light/80">
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Muros continuos sin interrupciones. La casa se opera sola o por voz natural.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Sensores ocultos bajo el enlucido de concreto o travertino.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Audio por transductores de resonancia invisibles detrás del yeso.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>Interacción sin aplicaciones: comunicación simple y fluida por WhatsApp.</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-brand-gold mt-0.5">▪</span>
                    <span>HVAC difuso silencioso en ranura arquitectónica perimetral de 12mm.</span>
                  </li>
                </ul>
              </div>
              <div className="pt-6 text-[8px] font-sans tracking-widest text-brand-gold/60 uppercase border-t border-brand-gold/15 mt-6">
                <span>Diseño de experiencias de habitabilidad</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-28 team-trigger">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div>
            <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-3">
              03 / NUESTRO EQUIPO
            </span>
            <h2 className="text-3xl md:text-4xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
              <BrandText>Fundadores y visión</BrandText><span className="text-brand-gold">.</span>
            </h2>
            {/* Sparkle divider */}
            <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-4">
              <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
            </div>
          </div>
          <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-md">
            Un equipo multidisciplinario que une la rigurosidad arquitectónica del diseño espacial de alta gama con el desarrollo de software y hardware de IoT.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { name: 'Alexis Falcon', role: 'Director de Arquitectura & UX', bio: 'Arquitecto y especialista en diseño de iluminación. Lidera la integración estética y la relación espacial en cada obra.' },
            { name: 'Carlos Mendoza', role: 'Director de Integración IoT', bio: 'Ingeniero de automatización. Especialista en sistemas de control distribuidos, redes y acústica invisible.' },
            { name: 'Diana Valdivia', role: 'Diseño de Interiores & Materialidad', bio: 'Interiorista experta en texturas, acabados y disolución técnica en piedra travertino, concreto y madera.' }
          ].map((member, i) => (
            <div key={i} className="team-card bg-brand-dark-soft border border-white/[0.03] p-6 flex flex-col justify-between space-y-6 hover:border-brand-gold/25 transition-all duration-300">
              <PremiumPlaceholder 
                title={`FOTO: ${member.name.toUpperCase()}`}
                plano="Retrato Editorial"
                requirements={`Retrato fotográfico en blanco y negro, iluminación natural dramática de lado, fundador de Casa Atenta posando con fondo de muro de concreto visto y detalles de travertino.`}
                dimensions="600x600 px"
                aspectRatio="aspect-square"
              />
              <div className="space-y-2 font-sans">
                <h4 className="text-base font-sans font-light text-brand-light uppercase tracking-wider">
                  <BrandText>{member.name}</BrandText>
                </h4>
                <p className="text-[10px] font-sans text-brand-gold uppercase tracking-widest font-medium">{member.role}</p>
                <p className="text-[11px] font-sans font-light text-brand-light/40 leading-relaxed pt-2">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PARTNERS / CERTIFICACIONES SECTION */}
      <section className="bg-brand-dark border-t border-white/[0.04] py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 text-center">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-8">
            MARCAS & TECNOLOGÍAS COMPATIBLES // INTEGRACIÓN GARANTIZADA
          </span>
          <div className="flex flex-wrap items-center justify-center gap-12 lg:gap-20 opacity-40 hover:opacity-60 transition-opacity duration-500">
            {['CRESTRON', 'LUTRON', 'SAVANT', 'CONTROL4', 'SHELLY', 'SONOS'].map((p, i) => (
              <span key={i} className="text-sm md:text-base font-sans tracking-[0.35em] text-brand-light font-bold">
                <BrandText>{p}</BrandText>
              </span>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
