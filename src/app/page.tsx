"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sliders, Smartphone, Wind, Volume2, Shield, Palette, FileText, Calendar, Check, Compass } from 'lucide-react';
import { BrandText } from '../components/BrandText';

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
  image: string;
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
    annotation: 'Luz circadiana fría (5000K) que penetra por los tragaluces para estimular el despertar biológico.',
    image: '/images/ChatGPT Image 15 may 2026, 03_33_37 p.m. (3).png'
  },
  {
    label: 'Mediodía Solar',
    temp: '22.8°C',
    lux: '780 lx',
    audio: 'Frecuencia Neutra',
    code: 'SYS-MID-02',
    color: 'rgba(255, 253, 240, 0.1)',
    opacity: 0.5,
    annotation: 'Nivel óptimo de iluminación cenital. Las celosías mecánicas se adaptan de forma autónoma.',
    image: '/images/ChatGPT Image 15 may 2026, 03_33_37 p.m. (5).png'
  },
  {
    label: 'Atardecer Cálido',
    temp: '21.8°C',
    lux: '150 lx',
    audio: 'Acústica Orgánica',
    code: 'SYS-SET-03',
    color: 'rgba(245, 150, 50, 0.18)',
    opacity: 1.0,
    annotation: 'Luz cálida indirecta (2700K). Las persianas perimetrales de aluminio se despliegan al 40%.',
    image: '/images/ChatGPT Image 15 may 2026, 03_33_37 p.m. (7).png'
  },
  {
    label: 'Modo Cine / Escena',
    temp: '20.5°C',
    lux: '8 lx',
    audio: 'Audio Envolvente / 52dB',
    code: 'SYS-CINE-04',
    color: 'rgba(100, 50, 255, 0.15)',
    opacity: 1.0,
    annotation: 'Audio invisible activo por resonancia en muros de yeso. Iluminación al 1.5%.',
    image: '/images/ChatGPT Image 15 may 2026, 03_33_37 p.m. (8).png'
  },
  {
    label: 'Modo Nocturno',
    temp: '19.8°C',
    lux: '0.2 lx',
    audio: 'Silencio Absoluto',
    code: 'SYS-NIGH-05',
    color: 'rgba(10, 15, 45, 0.35)',
    opacity: 1.0,
    annotation: 'Barreras térmicas perimetrales activas. Iluminación de cortesía nocturna en pavimentos.',
    image: '/images/ChatGPT Image 15 may 2026, 03_33_37 p.m. (10).png'
  }
];

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const manifestoRef = useRef<HTMLDivElement>(null);
  const problemSectionRef = useRef<HTMLDivElement>(null);
  const circadianSectionRef = useRef<HTMLDivElement>(null);
  const casesSectionRef = useRef<HTMLDivElement>(null);
  
  const [circadianStep, setCircadianStep] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);

  const proposalSlides = [
    {
      title: '01 / PROPUESTA CASTELLANA 503',
      subtitle: 'Remodelación de terraza en Surco (Quinto Nivel)',
      desc: 'Proyecto real de integración estructural de aluminio 6063-T5, cielo raso PVC Wood-finish y control inteligente para un ático de alta gama.',
      image: '/images/1.png'
    },
    {
      title: '02 / VISIÓN DEL PROYECTO',
      subtitle: 'Transformación integral silenciosa',
      desc: 'El proyecto equilibra diseño, ligereza estructural, durabilidad y ventilación cruzada con celosías perimetrales a 45 grados.',
      image: '/images/2.png'
    },
    {
      title: '04 / ALCANCE TÉCNICO',
      subtitle: 'Ingeniería y Materiales Nobles',
      desc: 'Estructura modular reforzada de bajo peso específico, herrajes de acero inoxidable resistentes al ambiente de Lima y cielo raso acústico.',
      image: '/images/4.png'
    },
    {
      title: '05 / MATERIALIDAD',
      subtitle: 'Estética contemporánea libre de mantenimiento',
      desc: 'Aluminio anodizado, PVC de cámaras múltiples Wood-finish y herrajes premium resistentes a la corrosión marina.',
      image: '/images/5.png'
    },
    {
      title: '06 / TIMELINE DE OBRA',
      subtitle: 'Instalación rápida en 7 días hables',
      desc: 'Planificación en secuencia ordenada desde la preparación de anclajes (Día 1) hasta el sellado termo-acústico y entrega final (Día 7).',
      image: '/images/6.png'
    },
    {
      title: '07 / PROPUESTA VISUAL',
      subtitle: 'Render del ático terminado',
      desc: 'Simulación tridimensional de la iluminación inteligente y cerramiento de 2.40m con rodamientos para máxima versatilidad.',
      image: '/images/7.png'
    }
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
               .to({}, { duration: 0.3 }); // Spacer to maintain state after fade

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
      
      {/* S1: HERO EDITORIAL INMERSIVO */}
      <section className="relative w-full h-screen flex flex-col justify-end px-6 md:px-12 lg:px-24 pb-20 md:pb-28 z-20">
        
        {/* Background Image of high-end kitchen/dining */}
        <div className="absolute inset-0 z-0 select-none">
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-brand-dark/40 to-brand-dark/20 z-10" />
          <div className="absolute inset-0 bg-brand-dark/30 z-10" />
          <img 
            src="/images/ChatGPT Image 13 may 2026, 05_43_19 p.m. (5).png" 
            alt="CASA ATENTA Residencia"
            className="w-full h-full object-cover opacity-60 scale-105 animate-[pulse_6s_ease-in-out_infinite]"
            style={{ animationDuration: '20s' }}
          />
        </div>

        {/* Dynamic Architectural Grid Overlay */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none" style={{
          backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        <div className="relative z-25 max-w-5xl font-light">
          
          {/* Logo SVG Wordmark embedded directly */}
          <div className="hero-fade-in mb-8 flex justify-start">
            <svg
              viewBox="0 0 2400 760"
              className="h-16 sm:h-20 md:h-24 w-auto fill-none stroke-current text-brand-light"
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
                HOGARES QUE
              </span>
            </div>
            <div className="overflow-hidden py-1">
              <span className="hero-reveal-line block text-brand-gold font-light">
                RESPONDEN<span className="text-brand-light">.</span>
              </span>
            </div>
          </h1>

          {/* Elegant gold line */}
          <div className="h-[1px] w-48 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative mb-8 hero-fade-in">
            <div className="absolute top-[-1px] left-8 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>

          <p className="hero-fade-in text-xs md:text-sm font-sans font-light text-brand-light/60 leading-relaxed max-w-lg mb-10">
            Diseñamos residencias de alta gama donde la tecnología se disuelve por completo en los planos constructivos. Sin pantallas, sin termostatos de plástico ni cables visibles; solo atmósferas vivas que cuidan de ti.
          </p>

          <div className="hero-fade-in flex flex-wrap gap-4 select-none">
            <Link
              href="/contacto"
              className="px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase bg-brand-gold text-brand-dark border border-brand-gold hover:bg-brand-gold-dark hover:border-brand-gold-dark transition-all duration-300 active:scale-95"
            >
              <BrandText>Agendar Visita Técnica</BrandText>
            </Link>
            <Link
              href="/soluciones"
              className="px-8 py-4 text-xs tracking-[0.25em] font-sans font-light uppercase border border-white/20 text-brand-light hover:border-brand-gold hover:text-brand-gold transition-all duration-300 active:scale-95"
            >
              <BrandText>Explorar Soluciones</BrandText>
            </Link>
          </div>
        </div>

        {/* Elegant bottom caption and indicator */}
        <div className="absolute bottom-10 left-6 md:left-12 lg:left-24 right-6 md:right-12 lg:right-24 flex justify-between items-center text-[10px] font-mono text-white/30 tracking-widest uppercase">
          <span>SANTIAGO DE SURCO, LIMA</span>
          <span className="animate-pulse">CAPÍTULO I // DESPLAZA PARA EXPLORAR</span>
        </div>
      </section>

      {/* S2: EL MANIFIESTO (Inspirado en collabcapitolium.fr) */}
      <section ref={manifestoRef} className="w-full py-32 px-6 md:px-12 lg:px-24 bg-brand-dark-soft border-t border-b border-white/[0.04] relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left column: poetic vertical image (hand touching concrete wall) */}
          <div className="lg:col-span-5 relative manifesto-img-panel overflow-hidden border border-white/[0.05] aspect-[4/5] bg-brand-dark shadow-2xl">
            <div className="absolute inset-0 bg-brand-dark/25 z-10" />
            <img 
              src="/images/i.png" 
              alt="Materialidad táctil Casa Atenta" 
              className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
            />
            {/* Fine architectural caption overlay */}
            <div className="absolute bottom-6 left-6 z-20 font-mono text-[9px] text-brand-light/75 bg-brand-dark/80 backdrop-blur-md px-3 py-1.5 border border-white/[0.05] tracking-widest uppercase">
              <span>MANIFIESTO // SENSACIÓN TÁCTIL</span>
            </div>
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

            <div className="pt-4">
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

      {/* S3: EL CONFLICTO CONSTRUCTIVO (Before/After con Renders reales) */}
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

          {/* Before/After Overlay Stack (Renders reales del proyecto Castellana 503) */}
          <div className="lg:col-span-7 relative w-full h-[55vh] lg:h-[70vh] flex items-center justify-center border border-white/[0.04] bg-brand-dark-soft shadow-2xl overflow-hidden">
            
            {/* BEFORE FRAME (Estudio preliminar/Render crudo de iluminación) */}
            <div className="before-card absolute inset-0 w-full h-full">
              <div className="absolute inset-0 bg-brand-dark/20 z-10" />
              <img 
                src="/images/ChatGPT Image 14 may 2026, 02_52_37 p.m.png" 
                alt="Propuesta de Iluminación Inicial" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 z-20 font-mono text-[9px] text-white/50 bg-brand-dark/80 border border-white/[0.08] px-3 py-1.5 tracking-widest uppercase">
                <span>ESTUDIO PRELIMINAR DE LUMINARIAS</span>
              </div>
            </div>

            {/* AFTER FRAME (Render terminado y limpio del ático) */}
            <div className="after-card absolute inset-0 w-full h-full opacity-0">
              <div className="absolute inset-0 bg-brand-dark/10 z-10" />
              <img 
                src="/images/ChatGPT Image 14 may 2026, 02_52_32 p.m.png" 
                alt="Propuesta de Terraza Terminada" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-6 right-6 z-20 font-mono text-[9px] text-brand-gold bg-brand-dark/85 border border-brand-gold/30 px-3 py-1.5 tracking-widest uppercase">
                <span>REMODELACIÓN DE TERRAZA COMPLETA</span>
              </div>
            </div>

            {/* Scale indicator overlay */}
            <div className="absolute top-6 right-6 z-20 font-mono text-[9px] text-white/25 uppercase tracking-widest">
              <span>ESCALA DE PROPUESTA 1:20</span>
            </div>

          </div>
        </div>
      </section>

      {/* S4: COBERTURA Y TARIFAS (Inspirado en la pulcritud de tresmarescapital.com) */}
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

          {/* Clean table layout inspired by tresmarescapital.com */}
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

      {/* S5: EXPERIENCIA CIRCADIANA (Inspirado en collabcapitolium.fr y aircenter.space) */}
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
          
          {/* Visual Container (Fades de fotos circadianas reales) */}
          <div className="lg:col-span-7 relative h-1/2 lg:h-full w-full bg-brand-dark-soft overflow-hidden flex items-end p-6 md:p-10 border-b lg:border-b-0 border-white/[0.04]">
            
            <div className="absolute inset-0 z-0 flex items-center justify-center">
              
              {/* Dynamic lighting blend color overlay based on scroll */}
              <div 
                className="absolute inset-0 mix-blend-color-burn transition-all duration-700 ease-out pointer-events-none z-10"
                style={{ 
                  backgroundColor: activeCircadian.color,
                  opacity: activeCircadian.opacity
                }}
              />
              <div className="absolute inset-0 bg-brand-dark/30 z-10 pointer-events-none" />

              {/* Circadian image renders */}
              {circadianAtmospheres.map((atm, i) => (
                <img
                  key={atm.code}
                  src={atm.image}
                  alt={atm.label}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                  style={{ 
                    opacity: circadianStep === i ? 0.75 : 0,
                    zIndex: circadianStep === i ? 1 : 0
                  }}
                />
              ))}

            </div>

            <div className="relative z-20 font-mono text-[9px] text-white/40 flex items-center space-x-2 select-none uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
              <span>SIMULACIÓN LUMÍNICA CIRCADIANA</span>
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
                  Escena Activa: <span className="text-brand-gold font-medium"><BrandText>{activeCircadian.label}</BrandText></span>
                </h4>
                <p className="text-xs font-sans font-light text-brand-light/50 leading-relaxed">
                  {activeCircadian.annotation} El sistema modula la temperatura, filtra el aire por ranuras invisibles y ajusta la sonoridad ambiental de forma autónoma.
                </p>
              </div>

              {/* Telemetry stats block */}
              <div className="space-y-4">
                <div className="bg-brand-dark-soft border border-white/[0.05] p-5 font-mono text-[10px] text-brand-light/65 tracking-wider space-y-2.5">
                  <div className="flex justify-between items-center text-brand-gold border-b border-white/[0.05] pb-2 font-sans tracking-[0.15em] uppercase font-bold">
                    <span>LECTURA DE TELEMETRÍA</span>
                    <span>{activeCircadian.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>TEMPERATURA INTERNA:</span>
                    <span className="text-brand-light font-semibold">{activeCircadian.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ILUMINACIÓN DE DETALLE:</span>
                    <span className="text-brand-light font-semibold">{activeCircadian.lux}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>RETORNO Y DIFUSIÓN ACÚSTICA:</span>
                    <span className="text-brand-light font-semibold uppercase">{activeCircadian.audio}</span>
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="font-mono text-[9px] text-white/20 tracking-wider flex justify-between items-center pt-2">
                  <span>DESPLAZAR SCROLL PARA TRANSICIÓN</span>
                  <span>FASE {circadianStep + 1}/5</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* S6: LAS ESPECIALIDADES (Inspirado en la sencillez de floema.com/en) */}
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
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">DETALLE</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* S7: CASO DE ESTUDIO INTERACTIVO (Slides reales de la propuesta Castellana 503) */}
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
                Navega por las fichas técnicas reales de la propuesta de remodelación para el ático Castellana 503 en Santiago de Surco. La obra involucró el desmontaje de una estructura pesada existente para implementar una terraza de aluminio anodizado reforzado y celosías modulares.
              </p>

              {/* Case study micro stats */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-white/[0.06] py-5 my-4 font-mono text-[10px] text-brand-light/50 tracking-wider">
                <div>
                  <span>PRESUPUESTO EJECUTADO:</span>
                  <span className="block text-brand-gold font-bold text-sm mt-1">S/ 11,210.00</span>
                </div>
                <div>
                  <span>TIEMPO DE EJECUCIÓN:</span>
                  <span className="block text-brand-light font-bold text-sm mt-1">5-7 DÍAS HÁBILES</span>
                </div>
              </div>
              
              {/* Custom Accordion Navigation for slides */}
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

            {/* Slider frame */}
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[9px] font-mono tracking-[0.25em] text-white/30 uppercase block select-none">
                EXPEDIENTE REAL // FICHA PRESENTADA AL CLIENTE
              </span>
              
              <div className="relative w-full aspect-[3/1] md:aspect-[3/1] border border-white/[0.06] overflow-hidden bg-brand-dark-soft shadow-2xl group/slide">
                {/* Background rendering of active slide */}
                <div className="absolute inset-0 z-0">
                  <img 
                    src={proposalSlides[activeSlide].image} 
                    alt={proposalSlides[activeSlide].title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/slide:scale-[1.01]"
                  />
                  <div className="absolute inset-0 bg-brand-dark/20 z-10" />
                </div>
              </div>

              {/* Active slide text box */}
              <div className="bg-brand-dark-soft border border-white/[0.04] p-6 space-y-3 font-sans">
                <span className="text-[10px] font-mono tracking-widest text-brand-gold uppercase font-bold">
                  {proposalSlides[activeSlide].subtitle}
                </span>
                <p className="text-xs md:text-sm font-light text-brand-light/60 leading-relaxed">
                  {proposalSlides[activeSlide].desc}
                </p>
              </div>

              <div className="flex justify-between items-center text-[10px] font-mono text-white/20 uppercase tracking-widest">
                <span>ESTATUS COMERCIAL: APROBADA</span>
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
