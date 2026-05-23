"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sliders, Smartphone, Wind, Volume2, Shield, Palette } from 'lucide-react';
import { BrandText } from '../components/BrandText';
import { PremiumPlaceholder } from '../components/PremiumPlaceholder';

gsap.registerPlugin(ScrollTrigger);

interface CircadianState {
  label: string;
  temp: string;
  lux: string;
  audio: string;
  code: string;
  color: string;
  opacity: number;
  annotation: string;
}

const circadianAtmospheres: CircadianState[] = [
  {
    label: 'Mañana Fresca',
    temp: '21.5°C',
    lux: '520 lx',
    audio: 'Silencio Pasivo',
    code: 'SYS-MORN-01',
    color: 'rgba(210, 230, 255, 0.15)',
    opacity: 0.8,
    annotation: 'Luz circadiana fría (5000K) para estimular el despertar biológico.'
  },
  {
    label: 'Mediodía Solar',
    temp: '22.8°C',
    lux: '780 lx',
    audio: 'Frecuencia Neutra',
    code: 'SYS-MID-02',
    color: 'rgba(255, 253, 240, 0.1)',
    opacity: 0.5,
    annotation: 'Nivel óptimo de iluminación cenital y control de sombreado pasivo activo.'
  },
  {
    label: 'Atardecer Cálido',
    temp: '21.8°C',
    lux: '150 lx',
    audio: 'Acústica Orgánica',
    code: 'SYS-SET-03',
    color: 'rgba(245, 150, 50, 0.18)',
    opacity: 1.0,
    annotation: 'Luz cálida indirecta (2700K). Las persianas se despliegan al 40%.'
  },
  {
    label: 'Modo Cine / Escena',
    temp: '20.5°C',
    lux: '8 lx',
    audio: 'Audio Envolvente / 52dB',
    code: 'SYS-CINE-04',
    color: 'rgba(100, 50, 255, 0.15)',
    opacity: 1.0,
    annotation: 'Audio invisible activo por resonancia en muros. Iluminación al 1.5%.'
  },
  {
    label: 'Modo Nocturno',
    temp: '19.8°C',
    lux: '0.2 lx',
    audio: 'Silencio Absoluto',
    code: 'SYS-NIGH-05',
    color: 'rgba(10, 15, 45, 0.35)',
    opacity: 1.0,
    annotation: 'Barreras térmicas perimetrales activas. Iluminación de cortesía nocturna.'
  }
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const problemSectionRef = useRef<HTMLDivElement>(null);
  const circadianSectionRef = useRef<HTMLDivElement>(null);
  const [circadianStep, setCircadianStep] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // 1. Text reveals in Hero
      const heroTl = gsap.timeline();
      heroTl.fromTo('.hero-reveal-line', 
        { y: 60, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', stagger: 0.12 }
      );
      heroTl.fromTo('.hero-fade-in', 
        { opacity: 0, y: 15 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, 
        '-=0.6'
      );

      // 2. Before / After Crossfade Pin
      const problemTl = gsap.timeline({
        scrollTrigger: {
          trigger: problemSectionRef.current,
          start: 'top top',
          end: '+=120%',
          pin: true,
          scrub: true
        }
      });
      problemTl.to('.before-card', { opacity: 0, ease: 'none', duration: 0.7 }, 0)
               .to('.after-card', { opacity: 1, ease: 'none', duration: 0.7 }, 0)
               .to({}, { duration: 0.3 }); // Spacer to maintain state after fade

      // 3. Counter Animation in Solutions Highlight
      gsap.fromTo('.counter-val', 
        { innerText: 0 },
        {
          innerText: (_i: number, el: HTMLElement) => el.getAttribute('data-target') || '0',
          duration: 2,
          ease: 'power2.out',
          snap: { innerText: 1 },
          scrollTrigger: {
            trigger: '.solutions-counter-trigger',
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // 4. Circadian Experience Pinned Scroll
      let lastActiveIndex = 0;
      ScrollTrigger.create({
        trigger: circadianSectionRef.current,
        start: 'top top',
        end: '+=250%',
        pin: true,
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          let activeIndex = 0;
          if (progress >= 0.18 && progress < 0.42) activeIndex = 1;
          else if (progress >= 0.42 && progress < 0.68) activeIndex = 2;
          else if (progress >= 0.68 && progress < 0.88) activeIndex = 3;
          else if (progress >= 0.88) activeIndex = 4;

          if (activeIndex !== lastActiveIndex) {
            lastActiveIndex = activeIndex;
            setCircadianStep(activeIndex);
          }
        }
      });

      // 5. Stagger fade in for grid cards
      gsap.fromTo('.solution-card-grid',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.solution-card-grid-trigger',
            start: 'top 75%'
          }
        }
      );

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const activeCircadian = circadianAtmospheres[circadianStep];

  return (
    <div ref={containerRef} className="bg-brand-dark min-h-screen relative overflow-hidden">
      
      {/* S1: HERO DE IMPACTO */}
      <section className="relative w-full h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-20 md:pb-28 z-20 max-w-[1400px] mx-auto">
        <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        <div className="max-w-4xl font-light relative z-10">
          <div className="overflow-hidden mb-5">
            <span className="hero-fade-in block text-xs tracking-[0.25em] text-brand-gold uppercase font-sans">
              <BrandText>ARQUITECTURA + AUTOMATIZACIÓN INVISIBLE</BrandText>
            </span>
          </div>

          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[95px] tracking-[0.05em] leading-[1.05] text-brand-light mb-8 select-none font-sans font-extralight uppercase">
            <div className="overflow-hidden py-1">
              <span className="hero-reveal-line block">
                <BrandText>TU HOGAR</BrandText>
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="hero-reveal-line block font-light">
                <BrandText>RESPONDE</BrandText><span className="text-brand-gold">.</span>
              </span>
            </div>
          </h1>

          {/* Elegant gold sparkle line */}
          <div className="h-[1px] w-36 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative mb-8 hero-fade-in">
            <div className="absolute top-[-1px] left-8 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>

          <p className="hero-fade-in text-xs md:text-sm font-light text-brand-light/50 leading-relaxed font-sans max-w-md mb-8">
            Diseñamos residencias de alta gama donde la tecnología se disuelve por completo en la arquitectura. Sin pantallas visibles ni cables; solo atmósferas que respiran y se adaptan a tu ritmo de vida.
          </p>

          <div className="hero-fade-in flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="px-6 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-dark transition-all duration-300"
            >
              <BrandText>Agenda tu Cita</BrandText>
            </Link>
            <Link
              href="/nosotros"
              className="px-6 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-white/20 text-brand-light hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              <BrandText>Explorar Filosofía</BrandText>
            </Link>
          </div>
        </div>

        {/* Floating Technical Blueprint Frame on Hero */}
        <div className="absolute right-6 md:right-12 lg:right-24 bottom-24 hidden xl:block w-[38%] hero-fade-in">
          <PremiumPlaceholder 
            title="CASA ATENTA PORTAL V-01" 
            plano="Perspectiva Axonométrica" 
            requirements="Simulación técnica tridimensional de una residencia minimalista integrada, mostrando el flujo de ventilación invisible en las ranuras y los sensores de luz ocultos."
            dimensions="800x600 px" 
            aspectRatio="aspect-[4/3]"
          />
        </div>
      </section>

      {/* S2: EL PROBLEMA */}
      <section ref={problemSectionRef} className="relative w-full h-screen bg-brand-dark-soft overflow-hidden flex items-center justify-center border-t border-b border-white/[0.04]">
        
        {/* Floating title */}
        <div className="absolute top-12 left-6 md:left-12 lg:left-24 z-20">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-1">
            01 / <BrandText>EL CONFLICTO VISUAL</BrandText>
          </span>
          <h2 className="text-lg md:text-xl font-sans font-light text-brand-light uppercase tracking-[0.2em]">
            <BrandText>El conflicto visual</BrandText><span className="text-brand-gold">.</span>
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full pt-24 pb-16">
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <h3 className="text-3xl md:text-4xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
              <BrandText>La invasión</BrandText> <br />
              <span className="font-light text-brand-gold"><BrandText>tecnológica</BrandText></span><span className="text-brand-gold">.</span>
            </h3>
            
            {/* Sparkle divider */}
            <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-2">
              <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
            </div>

            <p className="text-xs md:text-sm font-sans font-light text-brand-light/50 leading-relaxed max-w-md">
              La automatización convencional llena tus muros de teclados de plástico, pantallas gruesas, sensores visibles y controles remotos perdidos. En Casa Atenta creemos que el verdadero lujo es el silencio visual.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-xs font-sans font-light tracking-[0.2em] text-brand-gold uppercase">
              <span>Desplaza hacia abajo para comparar</span>
              <ArrowRight size={12} className="animate-bounce-horizontal" />
            </div>
          </div>

          {/* Before/After Overlay Stack */}
          <div className="lg:col-span-7 relative w-full h-[60vh] lg:h-[70vh] flex items-center justify-center">
            
            {/* BEFORE FRAME */}
            <div className="before-card absolute inset-0 w-full h-full flex flex-col justify-between">
              <PremiumPlaceholder 
                title="ESPACIO RESIDENCIAL CONVENCIONAL (ANTES)" 
                plano="Elevación Interior Oeste" 
                requirements="Interior de salón contemporáneo invadido por termostatos de plástico en la pared, un intercomunicador de marca visible, tiras LED mal difuminadas que causan destellos directos, e interruptores múltiples desalineados."
                dimensions="1920x1080 px"
                aspectRatio="h-full w-full"
              />
            </div>

            {/* AFTER FRAME */}
            <div className="after-card absolute inset-0 w-full h-full opacity-0 flex flex-col justify-between">
              <PremiumPlaceholder 
                title="INTEGRACIÓN DE CASA ATENTA (DESPUÉS)" 
                plano="Elevación Interior Oeste" 
                requirements="El mismo salón residencial con enlucido continuo. Sin termostatos, sin interruptores; las luminarias empotradas emiten una luz circadiana indirecta y uniforme. Las ranuras perimetrales de 12mm manejan el aire fresco en silencio absoluto."
                dimensions="1920x1080 px"
                aspectRatio="h-full w-full"
              />
            </div>

          </div>
        </div>
      </section>

      {/* S3: LA SOLUCIÓN & COUNTERS */}
      <section className="w-full py-28 px-6 md:px-12 lg:px-24 bg-brand-dark solutions-counter-trigger border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-3">
                02 / NUESTRO ENFOQUE
              </span>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
                <BrandText>Tu hogar</BrandText> <br />
                <span className="font-light text-brand-gold"><BrandText>responde</BrandText></span><span className="text-brand-gold">.</span>
              </h2>
              {/* Sparkle divider */}
              <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
                <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
              </div>
            </div>
            <div className="lg:col-span-4">
              <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed">
                Nuestras patentes de instalación y el trabajo en conjunto con estudios de arquitectura de vanguardia nos permiten ocultar todo lo técnico detrás de materiales nobles: piedra travertino, concreto expuesto, madera y yeso.
              </p>
            </div>
          </div>

          {/* Technical Counters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/[0.06] pt-12">
            {[
              { target: '0', prefix: '', suffix: '', label: 'Pantallas en muros', desc: 'No añadimos polución estética a tus planos verticales. La casa se opera de forma autónoma o conversacional.' },
              { target: '12', prefix: '', suffix: 'mm', label: 'Ranuras invisibles de clima', desc: 'El sistema HVAC se inyecta y retorna aire a través de finas aberturas de 12 milímetros de espesor en el falso techo.' },
              { target: '100', prefix: '', suffix: '%', label: 'Conexión circadiana', desc: 'La iluminación artificial emula el espectro del sol en tiempo real, sintonizando tus ritmos biológicos circadianos.' }
            ].map((c, i) => (
              <div key={i} className="flex flex-col space-y-3 font-sans font-light">
                <span className="text-4xl md:text-5xl font-sans font-extralight text-brand-gold flex items-baseline tracking-wide">
                  {c.prefix}
                  <span className="counter-val" data-target={c.target}>0</span>
                  {c.suffix}
                </span>
                <span className="text-xs tracking-widest text-brand-light uppercase font-semibold">
                  <BrandText>{c.label}</BrandText>
                </span>
                <p className="text-[11px] font-sans font-light text-brand-light/40 leading-relaxed">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* S4: EXPERIENCIA CIRCADIANA */}
      <section ref={circadianSectionRef} className="relative w-full h-screen bg-brand-dark overflow-hidden flex flex-col justify-between">
        
        {/* Floating title block */}
        <div className="absolute top-28 left-6 md:left-12 lg:left-24 z-30 pointer-events-none select-none max-w-xl">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase mb-2 block">
            03 / ESPECTRO CIRCADIANO
          </span>
          <h2 className="text-3xl md:text-5xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-[1.05]">
            <BrandText>La luz reconoce</BrandText> <br />
            <span className="font-light text-brand-gold"><BrandText>el momento</BrandText></span><span className="text-brand-gold">.</span>
          </h2>
          {/* Sparkle divider */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
        </div>

        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-stretch relative">
          
          {/* Visual Container */}
          <div className="lg:col-span-7 relative h-1/2 lg:h-full w-full bg-brand-dark-soft overflow-hidden flex items-end p-6 md:p-10 border-b lg:border-b-0 border-white/[0.04]">
            
            <div className="absolute inset-0 z-0 flex items-center justify-center p-6 md:p-12 lg:p-16">
              
              {/* Dynamic lighting blend color overlay based on scroll */}
              <div 
                className="absolute inset-0 mix-blend-color-burn transition-all duration-700 ease-out pointer-events-none z-10"
                style={{ 
                  backgroundColor: activeCircadian.color,
                  opacity: activeCircadian.opacity
                }}
              />
              <div className="absolute inset-0 bg-brand-dark/40 z-10 pointer-events-none" />

              <PremiumPlaceholder 
                title={`ATMÓSFERA: ${activeCircadian.label}`} 
                plano="Perspectiva 1:1 desde Comedor" 
                requirements={`Espacio residencial minimalista de concreto y travertino. Luces indirectas lineales en cielorraso que cambian de temperatura y calidez según el scroll. ${activeCircadian.annotation}`}
                dimensions="1920x1080 px"
                aspectRatio="h-full w-full"
                frames={`Frame ${circadianStep + 1} de 5`}
              />
            </div>

            <div className="relative z-20 font-sans text-xs tracking-[0.2em] text-white/35 flex items-center space-x-2 select-none uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
              <span><BrandText>SIMULACIÓN LUMÍNICA EN TIEMPO REAL</BrandText></span>
            </div>
          </div>

          {/* Telemetry & Controls Feed */}
          <div className="lg:col-span-5 relative h-1/2 lg:h-full w-full bg-brand-dark flex flex-col justify-end p-6 md:p-12 lg:p-16 border-l border-white/[0.04]">
            <div className="w-full max-w-[420px] mx-auto h-full flex flex-col justify-between pt-28 lg:pt-32 pb-4">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4 select-none">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-none border border-brand-gold/30 flex items-center justify-center bg-brand-dark-soft text-brand-gold font-sans text-xs font-bold">
                    Cλ
                  </div>
                  <div>
                    <h4 className="text-xs font-sans tracking-widest text-brand-light uppercase">
                      <BrandText>CASA ATENTA // IoT</BrandText>
                    </h4>
                    <p className="text-[9px] font-sans text-brand-gold/60 uppercase tracking-wider">
                      Sistema Autónomo de Clima y Atmósfera
                    </p>
                  </div>
                </div>
                <span className="font-sans text-[9px] text-white/25 uppercase tracking-widest animate-pulse">
                  <BrandText>CONECTADO</BrandText>
                </span>
              </div>

              {/* Technical description */}
              <div className="space-y-4 my-auto">
                <h4 className="text-base font-sans font-light uppercase text-brand-light tracking-wider">
                  Atmósfera Activa: <span className="text-brand-gold"><BrandText>{activeCircadian.label}</BrandText></span>
                </h4>
                <p className="text-xs font-sans font-light text-brand-light/50 leading-relaxed">
                  {activeCircadian.annotation} El sistema ajusta de manera imperceptible la temperatura del clima, la intensidad lumínica y la ecualización acústica de forma constante.
                </p>
              </div>

              {/* Telemetry stats block */}
              <div className="space-y-4">
                <div className="bg-brand-dark-soft border border-white/[0.05] p-5 font-sans text-xs text-brand-light/65 tracking-wider space-y-2.5">
                  <div className="flex justify-between items-center text-brand-gold border-b border-white/[0.05] pb-2 font-sans tracking-[0.15em] uppercase">
                    <span>LECTURA DE TELEMETRÍA</span>
                    <span>{activeCircadian.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TEMPERATURA INTERNA:</span>
                    <span className="text-brand-light font-semibold">{activeCircadian.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ILUMINACIÓN AMBIENTE:</span>
                    <span className="text-brand-light font-semibold">{activeCircadian.lux}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RETORNO Y DIFUSIÓN DE AUDIO:</span>
                    <span className="text-brand-light font-semibold uppercase">{activeCircadian.audio}</span>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="font-sans text-[10px] text-white/20 tracking-wider flex justify-between items-center pt-2">
                  <span>DESPLAZAR SCROLL PARA AVANZAR DÍA: {(circadianStep * 25)}%</span>
                  <span>FASE {circadianStep + 1}/5</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* S5: SERVICIOS HIGHLIGHT */}
      <section className="w-full py-28 px-6 md:px-12 lg:px-24 bg-brand-dark-soft border-t border-b border-white/[0.04] solution-card-grid-trigger">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-3">
                04 / NUESTRAS INTEGRACIONES
              </span>
              <h2 className="text-3xl md:text-4xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
                <BrandText>Especialidades</BrandText> <br />
                <span className="font-light text-brand-gold"><BrandText>integradas</BrandText></span><span className="text-brand-gold">.</span>
              </h2>
              {/* Sparkle divider */}
              <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-4">
                <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
              </div>
            </div>
            <Link
              href="/soluciones"
              className="px-6 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 self-start"
            >
              <BrandText>Ver Soluciones Detalladas</BrandText>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: <Sliders size={18} className="text-brand-gold" />, title: 'Iluminación', desc: 'Control lumínico dinámico que emula el ritmo solar. Luminarias empotradas ocultas que cuidan el plano visual.' },
              { icon: <Wind size={18} className="text-brand-gold" />, title: 'Clima', desc: 'Climatización oculta de bajísima velocidad y sonoridad inferior a 18 decibelios por ranuras lineales de yeso.' },
              { icon: <Volume2 size={18} className="text-brand-gold" />, title: 'Acústica', desc: 'Sistemas de sonido de panel plano que resuenan dentro del tabique de yeso. Sonido envolvente de alta fidelidad sin altavoces.' },
              { icon: <Shield size={18} className="text-brand-gold" />, title: 'Seguridad', desc: 'Protección perimetral térmica y control de acceso discreto integrado en marcos estructurales y pavimentos.' },
              { icon: <Smartphone size={18} className="text-brand-gold" />, title: 'Automatización', desc: 'Control integral autónomo sin menús complejos. Una interfaz conversacional natural a través de WhatsApp.' },
              { icon: <Palette size={18} className="text-brand-gold" />, title: 'Diseño', desc: 'Planificación de infraestructura en planos y supervisión técnica en obra para garantizar la limpieza total del espacio.' }
            ].map((s, i) => (
              <div 
                key={i} 
                className="solution-card-grid bg-brand-dark border border-white/[0.04] p-8 flex flex-col justify-between min-h-[220px] transition-all duration-400 hover:border-brand-gold/35 group"
              >
                <div className="space-y-4">
                  <div className="w-9 h-9 border border-brand-gold/20 flex items-center justify-center bg-brand-dark-soft group-hover:border-brand-gold/50 transition-colors duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-sm font-sans tracking-widest text-brand-light uppercase group-hover:text-brand-gold transition-colors duration-300">
                    <BrandText>{s.title}</BrandText>
                  </h3>
                  <p className="text-[11px] font-sans font-light text-brand-light/45 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center text-[9px] font-sans tracking-widest text-brand-gold/0 group-hover:text-brand-gold/80 transition-all duration-300 uppercase">
                  <span>INTEGRACIÓN 0{i+1}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* S6: PROYECTO DESTACADO */}
      <section className="w-full py-28 px-6 md:px-12 lg:px-24 bg-brand-dark">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-3">
                05 / CASO DE ESTUDIO DESTACADO
              </span>
              <h2 className="text-3xl md:text-5xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
                <BrandText>Pabellón del agua</BrandText><span className="text-brand-gold">.</span>
              </h2>
              {/* Sparkle divider */}
              <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
                <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
              </div>
              
              <p className="text-xs md:text-sm font-sans font-light text-brand-light/50 leading-relaxed">
                Residencia de descanso minimalista de 450m² construida en las afueras de Lima. La iluminación, el aire difuso y el audio se integran de manera invisible bajo las placas de concreto visto y listones de cedro, logrando una sintonía absoluta con el entorno natural.
              </p>
              
              <div className="pt-4">
                <Link
                  href="/proyectos"
                  className="px-8 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-400 inline-block"
                >
                  <BrandText>Ver Todos los Proyectos</BrandText>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <PremiumPlaceholder 
                title="PABELLÓN DEL AGUA (CASA ATENTA PORTFOLIO)" 
                plano="Elevación General Exterior" 
                requirements="Pabellón minimalista de concreto expuesto, madera de cedro fina y vidrios templados de piso a techo, integrado con iluminación exterior oculta, reflejando sobre espejo de agua en el atardecer."
                dimensions="1920x1080 px"
                aspectRatio="aspect-video"
              />
            </div>
          </div>

        </div>
      </section>

      {/* S7: CTA FINAL */}
      <section className="w-full py-32 px-6 md:px-12 lg:px-24 bg-brand-dark-soft border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block">
            CΛSΛ ΛTENTΛ // PROYECTA TU ESPACIO
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-tight">
            <BrandText>Diseñemos juntos</BrandText> <br />
            <span className="font-light text-brand-gold"><BrandText>el habitar invisible</BrandText></span><span className="text-brand-gold">.</span>
          </h2>
          {/* Sparkle divider */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-6 mx-auto">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
          
          <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-lg mx-auto">
            Agenda una sesión de consulta privada en nuestras oficinas o de forma virtual. Analizamos los planos de tu obra y diseñamos una propuesta de integración técnica invisible a tu medida.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a
              href="https://wa.me/51908550942?text=Hola%20Casa%20Atenta,%20deseo%20agendar%20una%20reunion%20de%20consulta%20para%20un%20proyecto."
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-dark transition-all duration-300 w-full sm:w-auto"
            >
              <BrandText>Agenda por WhatsApp</BrandText>
            </a>
            <Link
              href="/contacto"
              className="px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase border border-white/20 text-brand-light hover:border-brand-gold hover:text-brand-gold transition-all duration-300 w-full sm:w-auto"
            >
              <BrandText>Formulario de Contacto</BrandText>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
