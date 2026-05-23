"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sliders, Smartphone, Wind, Volume2, Shield, Palette, Calendar, Check } from 'lucide-react';
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
    color: '#d2e6ff',
    opacity: 0.8,
    annotation: 'Luz circadiana fría (5000K) que penetra por los tragaluces para estimular el despertar biológico.'
  },
  {
    label: 'Mediodía Solar',
    temp: '22.8°C',
    lux: '780 lx',
    audio: 'Frecuencia Neutra',
    code: 'SYS-MID-02',
    color: '#fffdc8',
    opacity: 0.5,
    annotation: 'Nivel óptimo de iluminación cenital. Las celosías mecánicas se adaptan de forma autónoma.'
  },
  {
    label: 'Atardecer Cálido',
    temp: '21.8°C',
    lux: '150 lx',
    audio: 'Acústica Orgánica',
    code: 'SYS-SET-03',
    color: '#f59632',
    opacity: 1.0,
    annotation: 'Luz cálida indirecta (2700K). Las persianas perimetrales de aluminio se despliegan al 40%.'
  },
  {
    label: 'Modo Cine / Escena',
    temp: '20.5°C',
    lux: '8 lx',
    audio: 'Audio Envolvente / 52dB',
    code: 'SYS-CINE-04',
    color: '#6432ff',
    opacity: 1.0,
    annotation: 'Audio invisible activo por resonancia en muros de yeso. Iluminación al 1.5%.'
  },
  {
    label: 'Modo Nocturno',
    temp: '19.8°C',
    lux: '0.2 lx',
    audio: 'Silencio Absoluto',
    code: 'SYS-NIGH-05',
    color: '#c5a880',
    opacity: 1.0,
    annotation: 'Barreras térmicas perimetrales activas. Iluminación de cortesía nocturna en pavimentos.'
  }
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const problemSectionRef = useRef<HTMLDivElement>(null);
  const circadianSectionRef = useRef<HTMLDivElement>(null);
  const casesSectionRef = useRef<HTMLDivElement>(null);
  
  const [activeSlide, setActiveSlide] = useState(0);

  const proposalSlides = [
    { title: '01 / PROPUESTA TÉCNICA' },
    { title: '02 / VISIÓN DEL PROYECTO' },
    { title: '03 / MATERIALIDAD' },
    { title: '04 / DETALLE DE COTIZACIÓN' },
    { title: '05 / CRONOGRAMA' },
    { title: '06 / RENDER CONSTRUCTIVO' }
  ];

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

      // 2. Manifesto scroll effect
      gsap.fromTo('.manifesto-img-panel',
        { scale: 1.05, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: manifestoRef.current,
            start: 'top 75%'
          }
        }
      );

      // 3. Before / After Crossfade Pin
      const problemTl = gsap.timeline({
        scrollTrigger: {
          trigger: problemSectionRef.current,
          start: 'top top',
          end: '+=150%',
          pin: true,
          scrub: true
        }
      });
      problemTl.to('.before-card', { opacity: 0, ease: 'none', duration: 0.7 }, 0)
               .to('.after-card', { opacity: 1, ease: 'none', duration: 0.7 }, 0)
               .to({}, { duration: 0.3 }); // Spacer

      // 4. Circadian Experience Pinned Scroll & Layer Transition Timeline
      const circadianTl = gsap.timeline({
        scrollTrigger: {
          trigger: circadianSectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.5,
        }
      });
      circadianTl.to('.circadian-layer-0', { opacity: 0, duration: 1 })
                 .to('.circadian-layer-1', { opacity: 1, duration: 1 }, '<')
                 .to('.circadian-layer-1', { opacity: 0, duration: 1 })
                 .to('.circadian-layer-2', { opacity: 1, duration: 1 }, '<')
                 .to('.circadian-layer-2', { opacity: 0, duration: 1 })
                 .to('.circadian-layer-3', { opacity: 1, duration: 1 }, '<')
                 .to('.circadian-layer-3', { opacity: 0, duration: 1 })
                 .to('.circadian-layer-4', { opacity: 1, duration: 1 }, '<');

      // Query telemetry DOM elements once to prevent layout thrashing on scroll
      const container = containerRef.current;
      const labelEl = container?.querySelector('.telemetry-label');
      const tempEl = container?.querySelector('.telemetry-temp');
      const luxEl = container?.querySelector('.telemetry-lux');
      const audioEl = container?.querySelector('.telemetry-audio');
      const codeEl = container?.querySelector('.telemetry-code');
      const descEl = container?.querySelector('.telemetry-desc');
      const percentageEl = container?.querySelector('.telemetry-percentage');
      const phaseEl = container?.querySelector('.telemetry-phase');

      // Direct DOM update of Telemetry values to bypass React render cycle during scroll
      ScrollTrigger.create({
        trigger: circadianSectionRef.current,
        start: 'top top',
        end: '+=250%',
        scrub: 0.5,
        onUpdate: (self) => {
          const progress = self.progress;
          let activeIndex = 0;
          if (progress >= 0.18 && progress < 0.42) activeIndex = 1;
          else if (progress >= 0.42 && progress < 0.68) activeIndex = 2;
          else if (progress >= 0.68 && progress < 0.88) activeIndex = 3;
          else if (progress >= 0.88) activeIndex = 4;

          const data = circadianAtmospheres[activeIndex];
          if (labelEl) labelEl.textContent = data.label;
          if (tempEl) tempEl.textContent = data.temp;
          if (luxEl) luxEl.textContent = data.lux;
          if (audioEl) audioEl.textContent = data.audio;
          if (codeEl) codeEl.textContent = data.code;
          if (descEl) descEl.textContent = data.annotation;
          if (percentageEl) percentageEl.textContent = `AVANZAR DÍA: ${Math.round(progress * 100)}%`;
          if (phaseEl) phaseEl.textContent = `FASE ${activeIndex + 1}/5`;
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

  return (
    <div ref={containerRef} className="bg-brand-dark min-h-screen relative overflow-hidden">
      
      {/* S1: HERO EDITORIAL */}
      <section className="relative w-full h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-20 md:pb-28 z-20">
        
        {/* Background Mesh Gradient (Zero Images) */}
        <div className="absolute inset-0 z-0 bg-brand-dark" style={{
          background: 'radial-gradient(circle at 75% 30%, #171512 0%, #0d0d0d 70%)'
        }} />

        {/* Dynamic Architectural Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        <div className="relative z-25 max-w-7xl mx-auto w-full grid grid-cols-1 xl:grid-cols-12 gap-12 items-end">
          
          <div className="xl:col-span-7 font-light text-left">
            {/* Logo SVG Wordmark */}
            <div className="hero-fade-in mb-8 flex justify-start">
              <svg
                viewBox="0 0 2400 760"
                className="h-14 sm:h-18 md:h-20 w-auto fill-none stroke-current text-brand-light"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="CASA ATENTA"
              >
                <g strokeLinecap="round" strokeLinejoin="round">
                  <g id="sensor-icon">
                    <circle cx="280" cy="380" r="165" strokeWidth="24" />
                    <circle cx="280" cy="380" r="120" strokeWidth="7" />
                    <path d="M 221 362 L 280 329 L 339 362" strokeWidth="15" />
                    <path d="M 280 395 L 280 447" strokeWidth="15" />
                  </g>
                  <g id="wordmark" strokeWidth="7.5">
                    <path d="M 704.40 318.90 C 651.30 318.90 615.90 354.30 615.90 395.60 C 615.90 436.90 651.30 472.30 704.40 472.30" />
                    <path d="M 776.00 472.30 L 826.74 318.90 L 877.48 472.30" />
                    <path d="M 1042.30 334.24 C 1015.16 315.36 963.24 316.54 957.34 357.84 C 951.44 395.60 1042.30 383.80 1038.76 429.82 C 1035.22 477.02 978.58 479.38 947.90 454.60" />
                    <path d="M 1113.90 472.30 L 1164.64 318.90 L 1215.38 472.30" />
                    <path d="M 1380.80 472.30 L 1431.54 318.90 L 1482.28 472.30" />
                    <path d="M 1546.80 318.90 L 1658.90 318.90 M 1602.85 318.90 L 1602.85 472.30" />
                    <path d="M 1815.46 318.90 L 1724.60 318.90 L 1724.60 472.30 L 1817.82 472.30 M 1724.60 395.60 L 1801.30 395.60" />
                    <path d="M 1890.60 472.30 L 1890.60 318.90 L 1990.90 472.30 L 1990.90 318.90" />
                    <path d="M 2056.60 318.90 L 2168.70 318.90 M 2112.65 318.90 L 2112.65 472.30" />
                    <path d="M 2234.40 472.30 L 2285.14 318.90 L 2335.88 472.30" />
                  </g>
                </g>
              </svg>
            </div>

            <div className="overflow-hidden mb-5">
              <span className="hero-fade-in block text-xs md:text-sm tracking-[0.35em] text-brand-gold uppercase font-mono">
                ARQUITECTURA + AUTOMATIZACIÓN INVISIBLE
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl md:text-7xl font-display font-light text-brand-light leading-[1.1] mb-8 uppercase tracking-[0.05em]">
              <div className="overflow-hidden py-1">
                <span className="hero-reveal-line block font-extralight">
                  TU HOGAR
                </span>
              </div>
              <div className="overflow-hidden py-1">
                <span className="hero-reveal-line block text-brand-gold font-light">
                  RESPONDE<span className="text-brand-light">.</span>
                </span>
              </div>
            </h1>

            {/* Elegant gold line */}
            <div className="h-[1px] w-48 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative mb-8 hero-fade-in">
              <div className="absolute top-[-1px] left-8 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
            </div>

            <p className="hero-fade-in text-xs md:text-sm font-sans font-light text-brand-light/60 leading-relaxed max-w-lg mb-10">
              Diseñamos residencias de alta gama donde la tecnología se disuelve por completo en la arquitectura. Sin termostatos ni cables visibles; solo atmósferas que respiran y se adaptan a tu ritmo de vida.
            </p>

            <div className="hero-fade-in flex flex-wrap gap-4 select-none">
              <a
                href="https://wa.me/51908550942?text=Hola%20Casa%20Atenta,%20quiero%20agendar%20una%20visita%20t%C3%A9cnica%20para%20evaluar%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase bg-brand-gold text-brand-dark border border-brand-gold hover:bg-brand-gold-dark hover:border-brand-gold-dark transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <BrandText>Agendar Visita Técnica</BrandText>
              </a>
              <Link
                href="/soluciones"
                className="px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase border border-white/20 text-brand-light hover:border-brand-gold hover:text-brand-gold transition-all duration-300 active:scale-95"
              >
                <BrandText>Explorar Soluciones</BrandText>
              </Link>
            </div>
          </div>

          {/* Self-drawing isometric SketchUp-style render on the right */}
          <div className="xl:col-span-5 w-full hero-fade-in hidden xl:block">
            <PremiumPlaceholder 
              scene="hero" 
              title="CASA ATENTA PORTAL V-01" 
              plano="Perspectiva Axonométrica" 
              requirements="Diseño modular en aluminio reforzado anodizado para soporte aéreo con conductos de inyección y retorno integrados en las uniones estructurales."
              dimensions="1600x1200 px"
              aspectRatio="aspect-[4/3]"
              className="w-full shadow-2xl"
            />
          </div>

        </div>

        {/* Elegant bottom caption and indicator */}
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-24 right-6 md:right-12 lg:right-24 flex justify-between items-center text-[10px] font-mono text-white/30 tracking-widest uppercase">
          <span>LIMA MODERNA // SANTIAGO DE SURCO</span>
          <span className="animate-pulse">CAPÍTULO I // DESPLAZA PARA EXPLORAR</span>
        </div>
      </section>

      {/* S2: EL MANIFIESTO */}
      <section ref={manifestoRef} className="w-full py-32 px-6 md:px-12 lg:px-24 bg-brand-dark-soft border-t border-b border-white/[0.04] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left column: SketchUp-style rendering of light vault opening */}
          <div className="lg:col-span-5 relative manifesto-img-panel w-full aspect-[4/5] bg-brand-dark shadow-2xl">
            <PremiumPlaceholder 
              scene="manifiesto"
              title="ESPACIO DISUELTO"
              plano="Corte de Tragaluz Cenital"
              requirements="Estudio de la luz solar rasante en encofrados de hormigón. La tecnología se disuelve por completo detrás del yeso continuo."
              dimensions="1200x1500 px"
              aspectRatio="h-full w-full"
            />
          </div>

          {/* Right column: Editorial Storytelling */}
          <div className="lg:col-span-7 space-y-8">
            <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase block">
              CAPÍTULO II // EL SILENCIO VISUAL
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-light text-brand-light uppercase tracking-widest leading-tight">
              <BrandText>La disolución de</BrandText> <br />
              <span className="font-light text-brand-gold italic font-serif lowercase tracking-normal">lo innecesario</span><span className="text-brand-gold">.</span>
            </h2>
            
            {/* Divider line */}
            <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/40 to-transparent" />

            <div className="space-y-6 text-sm font-sans font-light text-brand-light/50 leading-relaxed max-w-xl">
              <p className="text-base text-brand-light/75 font-serif italic">
                "El verdadero lujo contemporáneo reside en el silencio. No solo acústico, sino visual. Llenar los muros de teclados de plástico, pantallas y sensores es una invasión a la arquitectura."
              </p>
              <p>
                En Casa Atenta colaboramos con prestigiosos estudios de arquitectura y constructoras desde la fase de planos. Ocultamos las rejillas de clima en ranuras de 12mm de yeso, hacemos vibrar las paredes de madera para difundir audio de alta fidelidad y emulamos la iluminación natural en sintonía con tu reloj biológico.
              </p>
              <p>
                El resultado es una residencia que responde de forma autónoma a tu habitar, sin interfaces complejas. Puedes gestionar tu entorno completo mediante simples comandos de voz o a través de una pasarela conversacional directa en WhatsApp.
              </p>
            </div>

            <div className="pt-4 select-none">
              <Link 
                href="/nosotros" 
                className="inline-flex items-center space-x-3 text-xs tracking-[0.25em] font-sans font-light text-brand-gold uppercase group hover:text-brand-gold-light transition-colors duration-300"
              >
                <span><BrandText>Nuestra Filosofía</BrandText></span>
                <ArrowRight size={14} className="transform transition-transform duration-300 group-hover:translate-x-1.5" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* S3: EL CONFLICTO CONSTRUCTIVO */}
      <section ref={problemSectionRef} className="relative w-full h-screen bg-brand-dark overflow-hidden flex items-center justify-center">
        
        {/* Floating title block */}
        <div className="absolute top-12 left-6 md:left-12 lg:left-24 z-30 select-none">
          <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-1">
            CAPÍTULO III // LA COMPATIBILIDAD ESTÉTICA
          </span>
          <h2 className="text-lg md:text-xl font-sans font-light text-brand-light uppercase tracking-[0.2em]">
            <BrandText>Transformación Arquitectónica</BrandText><span className="text-brand-gold">.</span>
          </h2>
        </div>

        <div className="relative max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full pt-24 pb-16">
          
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 z-25">
            <h3 className="text-2xl md:text-4xl font-display font-light text-brand-light uppercase tracking-widest leading-tight">
              Diseño atento a <br />
              <span className="font-light text-brand-gold italic font-serif lowercase tracking-normal">cada detalle</span><span className="text-brand-gold">.</span>
            </h3>
            
            <div className="h-[1px] w-20 bg-brand-gold/45" />

            <p className="text-xs md:text-sm font-sans font-light text-brand-light/50 leading-relaxed max-w-md">
              Despliega el scroll para visualizar la transición de un ático convencional a la propuesta de integración de Casa Atenta. Reemplazamos estructuras pesadas por perfiles de aluminio estructural reforzado anodizado y sistemas de iluminación inteligente de baja carga visual.
            </p>
            <div className="flex items-center space-x-2 pt-2 text-xs font-mono tracking-[0.2em] text-brand-gold uppercase animate-pulse">
              <span>Desplaza hacia abajo para transicionar</span>
              <ArrowRight size={12} />
            </div>
          </div>

          {/* Before/After Overlay Stack (Vector blueprints) */}
          <div className="lg:col-span-7 relative w-full h-[55vh] lg:h-[70vh] flex items-center justify-center border border-white/[0.04] bg-brand-dark-soft shadow-2xl overflow-hidden">
            
            {/* BEFORE FRAME */}
            <div className="before-card absolute inset-0 w-full h-full">
              <PremiumPlaceholder 
                scene="before"
                title="ESTUDIO PRELIMINAR: MURO CONVENCIONAL"
                plano="Elevación Interior Oeste (Antes)"
                requirements="Presencia de teclados múltiples en muro, cableado visible de TV, difusor de aire convencional y sensores expuestos en esquinas."
                dimensions="1920x1080 px"
                aspectRatio="h-full w-full"
              />
            </div>

            {/* AFTER FRAME */}
            <div className="after-card absolute inset-0 w-full h-full opacity-0">
              <PremiumPlaceholder 
                scene="after"
                title="DISEÑO TERMINADO: INTEGRACIÓN INVISIBLE"
                plano="Elevación Interior Oeste (Después)"
                requirements="Muro de yeso continuo. Sin termostatos, sin cables. Difusión de clima por ranura lineal superior de 12mm y audio por resonancia invisible."
                dimensions="1920x1080 px"
                aspectRatio="h-full w-full"
              />
            </div>

          </div>
        </div>
      </section>

      {/* S4: COBERTURA Y TARIFAS (tresmarescapital.com style) */}
      <section className="w-full py-28 px-6 md:px-12 lg:px-24 bg-brand-dark-soft border-t border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-20">
            <div className="lg:col-span-8">
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
                PLANIFICACIÓN E INVERSIONES
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-light text-brand-light uppercase tracking-widest leading-tight">
                <BrandText>Transparencia</BrandText> <br />
                <span className="font-light text-brand-gold italic font-serif lowercase tracking-normal">comercial y cobertura</span><span className="text-brand-gold">.</span>
              </h2>
            </div>
            <div className="lg:col-span-4">
              <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed">
                Establecemos un marco de inversión referencial y tiempos de respuesta ágiles para los distritos más emblemáticos de Lima moderna, asegurando visitas de inspección técnica en menos de 24 horas.
              </p>
            </div>
          </div>

          {/* Clean table layout */}
          <div className="overflow-x-auto w-full border-t border-white/[0.08] select-none">
            <table className="w-full text-left font-sans text-xs tracking-wider border-collapse">
              <thead>
                <tr className="border-b border-white/[0.08] text-brand-gold text-[10px] uppercase font-mono tracking-[0.2em]">
                  <th className="py-6 pr-4 font-bold">Zona de Cobertura</th>
                  <th className="py-6 px-4 font-bold">Tasa Referencial de Entrada</th>
                  <th className="py-6 px-4 font-bold">Visita Técnica de Diagnóstico</th>
                  <th className="py-6 pl-4 font-bold text-right">Estatus del Servicio</th>
                </tr>
              </thead>
              <tbody className="text-brand-light/60 font-light divide-y divide-white/[0.04]">
                {[
                  { dist: 'San Borja', ticket: 'Desde S/ 8,000 o S/ 340/m²', visit: 'Agendado en menos de 24 horas', status: 'Activo' },
                  { dist: 'Santiago de Surco', ticket: 'Desde S/ 8,000 o S/ 340/m²', visit: 'Agendado en menos de 24 horas', status: 'Activo' },
                  { dist: 'Miraflores', ticket: 'Desde S/ 8,000 o S/ 340/m²', visit: 'Agendado en menos de 24 horas', status: 'Activo' },
                  { dist: 'La Molina', ticket: 'Desde S/ 8,000 o S/ 340/m²', visit: 'Agendado en menos de 24 horas', status: 'Activo' },
                  { dist: 'San Isidro', ticket: 'Desde S/ 8,000 o S/ 340/m²', visit: 'Agendado en menos de 24 horas', status: 'Activo' },
                  { dist: 'Barranco / Pueblo Libre', ticket: 'Desde S/ 8,000 o S/ 340/m²', visit: 'Agendado en menos de 24 horas', status: 'Activo' }
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.01] transition-colors duration-200">
                    <td className="py-5 pr-4 font-sans font-light uppercase tracking-widest text-brand-light text-xs">{row.dist}</td>
                    <td className="py-5 px-4 font-mono text-brand-gold">{row.ticket}</td>
                    <td className="py-5 px-4 font-sans">{row.visit}</td>
                    <td className="py-5 pl-4 text-right font-mono text-[9px] uppercase text-emerald-400 font-bold tracking-widest">
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 mr-2 animate-pulse" />
                      {row.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-[10px] font-mono text-white/30 tracking-widest uppercase">
            <span>* Los presupuestos finales se calculan de acuerdo a planos y especificaciones del proyecto.</span>
            <Link href="/contacto" className="text-brand-gold hover:underline flex items-center space-x-2">
              <span>SOLICITAR DIAGNÓSTICO PREVIO</span>
              <ArrowRight size={10} />
            </Link>
          </div>

        </div>
      </section>

      {/* S5: EXPERIENCIA CIRCADIANA (100% Vectorized with GPU transitions) */}
      <section ref={circadianSectionRef} className="relative w-full h-screen bg-brand-dark overflow-hidden flex flex-col justify-between">
        
        {/* Floating title block */}
        <div className="absolute top-24 left-6 md:left-12 lg:left-24 z-30 pointer-events-none select-none max-w-xl">
          <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase mb-2 block">
            CAPÍTULO IV // EL ESPECTRO CIRCADIANO
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-light text-brand-light uppercase tracking-widest leading-[1.05]">
            La luz reconoce <br />
            <span className="font-light text-brand-gold italic font-serif lowercase tracking-normal">el transcurrir del tiempo</span><span className="text-brand-gold">.</span>
          </h2>
        </div>

        <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-stretch relative">
          
          {/* Visual Container (Opacity transition of clean vector layers) */}
          <div className="lg:col-span-7 relative h-1/2 lg:h-full w-full bg-brand-dark-soft overflow-hidden flex items-end p-6 md:p-10 border-b lg:border-b-0 border-white/[0.04]">
            
            <div className="absolute inset-0 z-0 flex items-center justify-center p-6 md:p-12 lg:p-16">
              
              {/* Layer 0: Morning */}
              <div className="circadian-layer-0 absolute inset-0 w-full h-full p-6 md:p-12 lg:p-16">
                <PremiumPlaceholder 
                  title="DORMITORIO CELESTINA // ATMÓSFERA: MAÑANA FRESCA" 
                  plano="Perspectiva 1:1" 
                  requirements="Luz fría (5000K) que penetra por los tragaluces para el despertar biológico." 
                  scene="circadian" 
                  circadianColor="#d2e6ff" 
                  aspectRatio="h-full w-full"
                />
              </div>

              {/* Layer 1: Solar */}
              <div className="circadian-layer-1 absolute inset-0 w-full h-full opacity-0 p-6 md:p-12 lg:p-16">
                <PremiumPlaceholder 
                  title="DORMITORIO CELESTINA // ATMÓSFERA: MEDIODÍA SOLAR" 
                  plano="Perspectiva 1:1" 
                  requirements="Nivel óptimo de iluminación cenital y control de celosías mecánicas." 
                  scene="circadian" 
                  circadianColor="#fffdc8" 
                  aspectRatio="h-full w-full"
                />
              </div>

              {/* Layer 2: Sunset */}
              <div className="circadian-layer-2 absolute inset-0 w-full h-full opacity-0 p-6 md:p-12 lg:p-16">
                <PremiumPlaceholder 
                  title="DORMITORIO CELESTINA // ATMÓSFERA: ATARDECER CÁLIDO" 
                  plano="Perspectiva 1:1" 
                  requirements="Luz cálida indirecta (2700K). Persianas al 40%." 
                  scene="circadian" 
                  circadianColor="#f59632" 
                  aspectRatio="h-full w-full"
                />
              </div>

              {/* Layer 3: Cinema */}
              <div className="circadian-layer-3 absolute inset-0 w-full h-full opacity-0 p-6 md:p-12 lg:p-16">
                <PremiumPlaceholder 
                  title="DORMITORIO CELESTINA // ATMÓSFERA: MODO CINE" 
                  plano="Perspectiva 1:1" 
                  requirements="Luz al 1.5%. Audio invisible activo por resonancia en muros de yeso." 
                  scene="circadian" 
                  circadianColor="#6432ff" 
                  aspectRatio="h-full w-full"
                />
              </div>

              {/* Layer 4: Night */}
              <div className="circadian-layer-4 absolute inset-0 w-full h-full opacity-0 p-6 md:p-12 lg:p-16">
                <PremiumPlaceholder 
                  title="DORMITORIO CELESTINA // ATMÓSFERA: MODO NOCTURNO" 
                  plano="Perspectiva 1:1" 
                  requirements="Luz de cortesía nocturna en pavimentos. Silencio absoluto." 
                  scene="circadian" 
                  circadianColor="#c5a880" 
                  aspectRatio="h-full w-full"
                />
              </div>

            </div>

            <div className="relative z-20 font-mono text-[9px] text-white/40 flex items-center space-x-2 select-none uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
              <span>SIMULACIÓN VECTORIAL EN TIEMPO REAL</span>
            </div>
          </div>

          {/* Telemetry & Controls Feed */}
          <div className="lg:col-span-5 relative h-1/2 lg:h-full w-full bg-brand-dark flex flex-col justify-end p-6 md:p-12 lg:p-16 border-l border-white/[0.04]">
            <div className="w-full max-w-[420px] mx-auto h-full flex flex-col justify-between pt-24 lg:pt-32 pb-4">
              
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4 mb-4 select-none">
                <div className="flex items-center space-x-3.5">
                  <div className="w-8 h-8 rounded-none border border-brand-gold/30 flex items-center justify-center bg-brand-dark-soft text-brand-gold font-mono text-xs font-bold">
                    CΛ
                  </div>
                  <div>
                    <h4 className="text-xs font-mono tracking-widest text-brand-light uppercase">
                      CASA ATENTA // TELEMETRÍA
                    </h4>
                    <p className="text-[9px] font-sans text-brand-gold/60 uppercase tracking-wider">
                      Sistema Autónomo de Clima y Atmósfera
                    </p>
                  </div>
                </div>
                <span className="font-mono text-[8px] text-emerald-400 uppercase tracking-widest animate-pulse font-bold">
                  SINCRO
                </span>
              </div>

              {/* Technical description */}
              <div className="space-y-4 my-auto">
                <h4 className="text-base font-sans font-light uppercase text-brand-light tracking-wider">
                  Escena Activa: <span className="text-brand-gold font-medium telemetry-label">Mañana Fresca</span>
                </h4>
                <p className="text-xs font-sans font-light text-brand-light/50 leading-relaxed telemetry-desc">
                  Luz circadiana fría (5000K) que penetra por los tragaluces para estimular el despertar biológico.
                </p>
              </div>

              {/* Telemetry stats block */}
              <div className="space-y-4">
                <div className="bg-brand-dark-soft border border-white/[0.05] p-5 font-mono text-[10px] text-brand-light/65 tracking-wider space-y-2.5">
                  <div className="flex justify-between items-center text-brand-gold border-b border-white/[0.05] pb-2 font-sans tracking-[0.15em] uppercase font-bold">
                    <span>LECTURA DE TELEMETRÍA</span>
                    <span className="telemetry-code">SYS-MORN-01</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TEMPERATURA INTERNA:</span>
                    <span className="text-brand-light font-semibold telemetry-temp">21.5°C</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ILUMINACIÓN DE DETALLE:</span>
                    <span className="text-brand-light font-semibold telemetry-lux">520 lx</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RETORNO Y DIFUSIÓN ACÚSTICA:</span>
                    <span className="text-brand-light font-semibold uppercase telemetry-audio">Silencio Pasivo</span>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="font-mono text-[9px] text-white/20 tracking-wider flex justify-between items-center pt-2">
                  <span className="telemetry-percentage">AVANZAR DÍA: 0%</span>
                  <span className="telemetry-phase font-bold text-brand-gold">FASE 1/5</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* S6: LAS ESPECIALIDADES */}
      <section className="w-full py-28 px-6 md:px-12 lg:px-24 bg-brand-dark border-t border-b border-white/[0.04] solution-card-grid-trigger">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
            <div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
                CAPÍTULO V // LAS ESPECIALIDADES
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-light text-brand-light uppercase tracking-widest leading-tight">
                <BrandText>Ingeniería invisible</BrandText> <br />
                <span className="font-light text-brand-gold italic font-serif lowercase tracking-normal">en la estructura</span><span className="text-brand-gold">.</span>
              </h2>
            </div>
            <Link
              href="/soluciones"
              className="px-6 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold/30 text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 self-start"
            >
              <BrandText>Ver Catálogo Técnico</BrandText>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {[
              { icon: <Sliders size={18} className="text-brand-gold" />, title: 'Iluminación', desc: 'Control circadiano lineal que sigue el ciclo solar. Embutido en juntas de dilatación o yeso, sin focos visibles.' },
              { icon: <Wind size={18} className="text-brand-gold" />, title: 'Clima', desc: 'Climatización oculta silenciosa por ranuras arquitectónicas de yeso. Sonoridad extrema inferior a 18 decibelios.' },
              { icon: <Volume2 size={18} className="text-brand-gold" />, title: 'Acústica', desc: 'Transductores de resonancia planos ocultos en paneles de yeso. Sonido uniforme de 180° sin altavoces visibles.' },
              { icon: <Shield size={18} className="text-brand-gold" />, title: 'Seguridad', desc: 'Barreras térmicas perimetrales e infrarrojas discretas en paisajismo y carpintería, sin sensación de encierro.' },
              { icon: <Smartphone size={18} className="text-brand-gold" />, title: 'Automatización', desc: 'Servidor local autónomo con control inteligente. Operación intuitiva conversacional mediante WhatsApp.' },
              { icon: <Palette size={18} className="text-brand-gold" />, title: 'Diseño Obra', desc: 'Supervisión técnica de encofrados, ductos y canalizaciones en planos civiles coordinados con constructores.' }
            ].map((s, i) => (
              <div 
                key={i} 
                className="solution-card-grid bg-brand-dark-soft border border-white/[0.04] p-8 flex flex-col justify-between min-h-[220px] transition-all duration-400 hover:border-brand-gold/35 group"
              >
                <div className="space-y-4">
                  <div className="w-9 h-9 border border-brand-gold/20 flex items-center justify-center bg-brand-dark group-hover:border-brand-gold/50 transition-colors duration-300">
                    {s.icon}
                  </div>
                  <h3 className="text-sm font-sans tracking-widest text-brand-light uppercase group-hover:text-brand-gold transition-colors duration-300">
                    <BrandText>{s.title}</BrandText>
                  </h3>
                  <p className="text-[11px] font-sans font-light text-brand-light/45 leading-relaxed">
                    {s.desc}
                  </p>
                </div>
                <div className="pt-4 flex items-center justify-between text-[9px] font-mono tracking-widest text-white/20 group-hover:text-brand-gold/80 transition-all duration-300 uppercase">
                  <span>INTEGRACIÓN 0{i+1}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-bold">DETALLE</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* S7: CASO DE ESTUDIO INTERACTIVO (100% Vectorial, Slide HTML puro sin imágenes) */}
      <section ref={casesSectionRef} className="w-full py-32 px-6 md:px-12 lg:px-24 bg-brand-dark border-b border-white/[0.04]">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            <div className="lg:col-span-5 space-y-6">
              <span className="text-[10px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
                CAPÍTULO VI // CASO DE ESTUDIO TÉCNICO
              </span>
              <h2 className="text-3xl md:text-5xl font-display font-light text-brand-light uppercase tracking-widest leading-tight">
                Castellana 503<span className="text-brand-gold">.</span>
              </h2>
              
              <div className="h-[1px] w-24 bg-brand-gold/45" />
              
              <p className="text-xs md:text-sm font-sans font-light text-brand-light/50 leading-relaxed">
                Navega por las fichas técnicas de la propuesta de remodelación para la terraza del departamento Castellana 503 en Santiago de Surco. Proyecto diseñado modularmente para alivianar la carga estructural sobre la losa del quinto nivel.
              </p>

              {/* Case study micro stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.06] py-5 my-4 font-mono text-[10px] text-brand-light/50 tracking-wider">
                <div>
                  <span>PRESUPUESTO DE OBRA:</span>
                  <span className="block text-brand-gold font-bold text-sm mt-1">S/ 11,210.00</span>
                </div>
                <div>
                  <span>TIEMPO DE EJECUCIÓN:</span>
                  <span className="block text-brand-light font-bold text-sm mt-1">5-7 DÍAS HÁBILES</span>
                </div>
              </div>
              
              {/* Accordion Navigation */}
              <div className="space-y-2 pt-2">
                {proposalSlides.map((slide, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlide(idx)}
                    className={`w-full py-2.5 px-4 text-left text-[10px] tracking-wider uppercase font-mono border transition-all duration-300 flex justify-between items-center cursor-pointer ${
                      activeSlide === idx 
                        ? 'border-brand-gold text-brand-gold bg-brand-dark-soft' 
                        : 'border-white/[0.04] text-white/40 hover:border-white/10 hover:text-brand-light'
                    }`}
                  >
                    <span>{slide.title}</span>
                    {activeSlide === idx && <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Pure HTML Slide visualizer */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase block select-none">
                EXPEDIENTE REAL // FICHA PRESENTADA AL CLIENTE
              </span>
              
              <div className="relative w-full aspect-[16/10] border border-white/[0.06] overflow-hidden bg-brand-dark-soft shadow-2xl p-6 md:p-10 flex flex-col justify-between select-none">
                {/* Background Grid */}
                <div className="absolute inset-0 z-0 opacity-15 pointer-events-none" style={{
                  backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
                
                {/* SLIDE 01 */}
                {activeSlide === 0 && (
                  <div className="relative z-10 flex flex-col justify-between h-full text-left font-sans animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold">MEMORIA CONSTRUCTIVA</span>
                        <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wider text-brand-light mt-1">CASTELLANA 503</h3>
                      </div>
                      <span className="text-[9px] font-mono text-white/35 border border-white/[0.08] px-2 py-0.5 font-bold">SLIDE 01 / 06</span>
                    </div>
                    <div className="my-auto max-w-xl space-y-3">
                      <p className="text-xs md:text-sm text-brand-light/70 font-light leading-relaxed">
                        Propuesta de remodelación arquitectónica del quinto nivel en Santiago de Surco. Plan enfocado en ligereza estructural, durabilidad climática y diseño contemporáneo.
                      </p>
                      <div className="text-[9px] font-mono text-brand-gold/60">
                        CLIENTE: Sonia & Flor // UBICACIÓN: Av. Castellana 456
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/20">
                      <span>CASA ATENTA // CÓD: CA-2026-0019</span>
                      <span>SANTIAGO DE SURCO, LIMA</span>
                    </div>
                  </div>
                )}
                
                {/* SLIDE 02 */}
                {activeSlide === 1 && (
                  <div className="relative z-10 flex flex-col justify-between h-full text-left font-sans animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold">PROJECT VISION</span>
                        <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wider text-brand-light mt-1">VISIÓN DEL PROYECTO</h3>
                      </div>
                      <span className="text-[9px] font-mono text-white/35 border border-white/[0.08] px-2 py-0.5 font-bold">SLIDE 02 / 06</span>
                    </div>
                    <div className="my-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                      <p className="text-xs text-brand-light/70 font-light leading-relaxed">
                        La propuesta equilibra diseño, confort térmico y menor peso sobre la losa mediante un sistema de aluminio reforzado, cielorraso acústico tipo madera y celosías perimetrales.
                      </p>
                      <div className="border-l border-brand-gold/20 pl-4 space-y-2.5 font-mono text-[9px] text-brand-gold">
                        <div>▪ REDUCIR CARGA ESTRUCTURAL (ALUMINIO)</div>
                        <div>▪ CONFORT TÉRMICO (PVC ACÚSTICO)</div>
                        <div>▪ CONTROL AMBIENTAL (CELOSÍAS)</div>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/20">
                      <span>CASA ATENTA // ENFOQUE PREMIUM</span>
                      <span>VALIDEZ: 07 DÍAS CALENDARIO</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 03 */}
                {activeSlide === 2 && (
                  <div className="relative z-10 flex flex-col justify-between h-full text-left font-sans animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold">MATERIALIDAD</span>
                        <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wider text-brand-light mt-1">MATERIALES PREMIUM</h3>
                      </div>
                      <span className="text-[9px] font-mono text-white/35 border border-white/[0.08] px-2 py-0.5 font-bold">SLIDE 03 / 06</span>
                    </div>
                    <div className="my-auto grid grid-cols-3 gap-4">
                      <div className="border border-white/[0.04] p-4 bg-brand-dark/20 flex flex-col justify-between min-h-[90px]">
                        <span className="text-brand-gold font-mono text-[9px] font-bold block">ALUMINIO ANODIZADO</span>
                        <p className="text-[9px] text-brand-light/50 font-light mt-1.5 leading-normal">Perfilería estructural reforzada liviana 6063-T5.</p>
                      </div>
                      <div className="border border-white/[0.04] p-4 bg-brand-dark/20 flex flex-col justify-between min-h-[90px]">
                        <span className="text-brand-gold font-mono text-[9px] font-bold block">PVC MULTICÁMARAS</span>
                        <p className="text-[9px] text-brand-light/50 font-light mt-1.5 leading-normal">Cielo raso Wood-Finish acústico de libre mantención.</p>
                      </div>
                      <div className="border border-white/[0.04] p-4 bg-brand-dark/20 flex flex-col justify-between min-h-[90px]">
                        <span className="text-brand-gold font-mono text-[9px] font-bold block">ACERO INOXIDABLE</span>
                        <p className="text-[9px] text-brand-light/50 font-light mt-1.5 leading-normal">Herrajes anticorrosión de alta durabilidad.</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/20">
                      <span>ESPECIFICACIONES CONSTRUCTIVAS</span>
                      <span>LIMA METROPOLITANA</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 04 */}
                {activeSlide === 3 && (
                  <div className="relative z-10 flex flex-col justify-between h-full text-left font-sans animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold">COTIZACIÓN</span>
                        <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wider text-brand-light mt-1">DIAGNÓSTICO DE COSTOS</h3>
                      </div>
                      <span className="text-[9px] font-mono text-white/35 border border-white/[0.08] px-2 py-0.5 font-bold">SLIDE 04 / 06</span>
                    </div>
                    <div className="my-auto overflow-x-auto">
                      <table className="w-full text-left text-[10px] text-brand-light/50">
                        <thead>
                          <tr className="border-b border-white/[0.06] text-brand-gold font-mono text-[9px] uppercase tracking-wider font-bold">
                            <th className="pb-1">Concepto</th>
                            <th className="pb-1">Descripción</th>
                            <th className="pb-1 text-right">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.03]">
                          <tr>
                            <td className="py-1 text-brand-light">Preliminares</td>
                            <td className="py-1">Desmontaje de pérgola existente y limpieza</td>
                            <td className="py-1 text-right font-mono text-brand-gold">S/ 600.00</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-brand-light">Estructura</td>
                            <td className="py-1">Aluminio reforzado anodizado (21 m²)</td>
                            <td className="py-1 text-right font-mono text-brand-gold">S/ 5,250.00</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-brand-light">Cobertura</td>
                            <td className="py-1">Cielo raso PVC acabado madera (21 m²)</td>
                            <td className="py-1 text-right font-mono text-brand-gold">S/ 1,260.00</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-brand-light">Cerramiento</td>
                            <td className="py-1">Celosía de aluminio con policarbonato (12 m²)</td>
                            <td className="py-1 text-right font-mono text-brand-gold">S/ 3,000.00</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/20">
                      <span>VALOR PROPUESTA: S/ 11,210.00 // PAGO: 50% / 20% / 30%</span>
                      <span>SANTIAGO DE SURCO</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 05 */}
                {activeSlide === 4 && (
                  <div className="relative z-10 flex flex-col justify-between h-full text-left font-sans animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold">TIMELINE</span>
                        <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wider text-brand-light mt-1">CRONOGRAMA DE EJECUCIÓN</h3>
                      </div>
                      <span className="text-[9px] font-mono text-white/35 border border-white/[0.08] px-2 py-0.5 font-bold">SLIDE 05 / 06</span>
                    </div>
                    <div className="my-auto flex justify-between items-center relative py-6 select-none">
                      <div className="absolute top-[37px] left-0 right-0 h-[1px] bg-white/[0.08] z-0" />
                      {[
                        { day: 'Día 01', name: 'Preparación', desc: 'Desmontaje de pérgola' },
                        { day: 'Día 02-03', name: 'Estructura', desc: 'Montaje de aluminio' },
                        { day: 'Día 04-05', name: 'Instalación', desc: 'Cielo raso y celosías' },
                        { day: 'Día 06-07', name: 'Entrega', desc: 'Sellado y limpieza' }
                      ].map((step, idx) => (
                        <div key={idx} className="relative z-10 bg-brand-dark-soft px-2.5 text-center flex flex-col items-center">
                          <span className="text-brand-gold block font-mono text-[9px] font-bold">{step.day}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold my-2" />
                          <span className="text-[9px] text-brand-light font-bold block">{step.name}</span>
                          <span className="text-[7.5px] text-brand-light/35 font-light block leading-none mt-1">{step.desc}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/20">
                      <span>PLAZO DE ENTREGA: 05-07 DÍAS HÁBILES</span>
                      <span>MONTAJE EN SECCIÓN ORDENADA</span>
                    </div>
                  </div>
                )}

                {/* SLIDE 06 */}
                {activeSlide === 5 && (
                  <div className="relative z-10 flex flex-col justify-between h-full text-left font-sans animate-fade-in">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-brand-gold font-bold">RENDER CONSTRUCTIVO</span>
                        <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wider text-brand-light mt-1">PROPUESTA FINAL</h3>
                      </div>
                      <span className="text-[9px] font-mono text-white/35 border border-white/[0.08] px-2 py-0.5 font-bold">SLIDE 06 / 06</span>
                    </div>
                    <div className="my-auto w-full h-[52%] flex items-center justify-center">
                      <PremiumPlaceholder 
                        scene="pergola" 
                        title="TERRAZA CASTELLANA 503" 
                        plano="Isometría de Remodelación" 
                        requirements="Detalle estructural de pérgola liviana acoplada a muro." 
                        aspectRatio="h-full w-full" 
                      />
                    </div>
                    <div className="flex justify-between items-center text-[8px] font-mono text-white/20">
                      <span>GARANTÍA POST-VENTA: 6 MESES</span>
                      <span>SANTIAGO DE SURCO</span>
                    </div>
                  </div>
                )}

              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
                <span>ESTATUS COMERCIAL: PROPUESTA APROBADA</span>
                <span>PÁG {activeSlide + 1} DE {proposalSlides.length}</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* S8: CTA FINAL Y COMERCIAL */}
      <section className="w-full py-32 px-6 md:px-12 lg:px-24 bg-brand-dark-soft border-t border-white/[0.04] text-center relative overflow-hidden z-20">
        <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        <div className="max-w-3xl mx-auto space-y-8 relative z-10">
          <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block">
            CAPÍTULO VII // COMPROMISO COGNITIVO
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-light text-brand-light uppercase tracking-widest leading-tight">
            Diseñemos juntos el <br />
            <span className="font-light text-brand-gold italic font-serif lowercase tracking-normal">habitar invisible</span><span className="text-brand-gold">.</span>
          </h2>
          
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-6 mx-auto">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
          
          <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-lg mx-auto">
            Agenda una sesión presencial o virtual. Analizamos los planos de tu obra y desarrollamos un proyecto a tu medida con integraciones técnicas invisibles.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4 select-none">
            <a
              href="https://wa.me/51908550942?text=Hola%20Casa%20Atenta,%20quiero%20agendar%20una%20visita%20t%C3%A9cnica%20para%20evaluar%20un%20proyecto."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase bg-brand-gold text-brand-dark hover:bg-brand-gold-dark transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer shadow-lg"
            >
              <span>Agendar por WhatsApp</span>
              <ArrowRight size={12} />
            </a>
            <Link
              href="/contacto"
              className="w-full sm:w-auto px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase border border-white/20 text-brand-light hover:border-brand-gold hover:text-brand-gold transition-all duration-300"
            >
              <BrandText>Formulario de Consulta</BrandText>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
