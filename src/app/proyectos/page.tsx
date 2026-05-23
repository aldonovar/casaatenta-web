"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandText } from '../../components/BrandText';

gsap.registerPlugin(ScrollTrigger);

interface TriptychItem {
  title: string;
  plano: string;
  requirements: string;
  src: string;
}

interface TriptychImages {
  exterior: TriptychItem;
  interior: TriptychItem;
  detail: TriptychItem;
}

interface ProjectCaseStudy {
  id: string;
  title: string;
  category: 'residencial' | 'pabellones' | 'wellness';
  location: string;
  area: string;
  year: string;
  intro: string;
  integrations: string[];
  quote: string;
  triptych: TriptychImages;
}

const projectsData: ProjectCaseStudy[] = [
  {
    id: 'pabellon-del-agua',
    title: 'Pabellón del Agua',
    category: 'pabellones',
    location: 'Cieneguilla, Lima',
    area: '450 m²',
    year: '2025',
    intro: 'Una estructura minimalista de concreto visto y vidrio templado. El pabellón se integra al entorno mediante el reflejo en un gran espejo de agua exterior, mientras el interior disuelve todo rastro técnico para priorizar la contemplación silenciosa.',
    integrations: ['Iluminación Circadiana', 'Clima Invisible', 'Acústica Invisible', 'Diseño Estructural'],
    quote: '"El sonido y el aire simplemente existen. No hay parlantes ni termostatos en ningún muro. La casa se siente completamente natural, viva y en calma."',
    triptych: {
      exterior: {
        title: 'PABELLÓN DEL AGUA // FASE 01: EXTERIOR',
        plano: 'Elevación Norte - Atardecer',
        requirements: 'Pabellón minimalista de concreto visto reflejado en espejo de agua exterior.',
        src: '/images/ChatGPT Image 14 may 2026, 02_52_23 p.m.png'
      },
      interior: {
        title: 'PABELLÓN DEL AGUA // FASE 02: INTERIOR',
        plano: 'Perspectiva Salón Comedor',
        requirements: 'Mobiliario travertino a medida con cielorraso de concreto continuo libre de rejillas.',
        src: '/images/ChatGPT Image 13 may 2026, 05_43_19 p.m. (5).png'
      },
      detail: {
        title: 'PABELLÓN DEL AGUA // FASE 03: DETALLE TÉCNICO',
        plano: 'Junta de Techo Oculta',
        requirements: 'Alojamiento para iluminación lineal indirecta y ventilación oculta.',
        src: '/images/i.png'
      }
    }
  },
  {
    id: 'casa-travertino',
    title: 'Casa Travertino',
    category: 'residencial',
    location: 'La Molina, Lima',
    area: '720 m²',
    year: '2024',
    intro: 'Una residencia familiar esculpida en piedra travertino y concreto. La obra destaca por la continuidad de sus texturas naturales y la total invisibilización de los sistemas mecánicos e interruptores eléctricos convencionales.',
    integrations: ['Iluminación Circadiana', 'Clima Invisible', 'Seguridad Discreta', 'Control Conversacional'],
    quote: '"La casa sabe qué hacer según la hora. Al anochecer, las luces se atenúan y el clima se calienta de forma autónoma. No tocamos un solo botón."',
    triptych: {
      exterior: {
        title: 'CASA TRAVERTINO // FASE 01: EXTERIOR',
        plano: 'Elevación Principal - Noche',
        requirements: 'Fachada escultórica de mármol travertino con iluminación rasante oculta.',
        src: '/images/ChatGPT Image 14 may 2026, 02_52_28 p.m.png'
      },
      interior: {
        title: 'CASA TRAVERTINO // FASE 02: INTERIOR',
        plano: 'Perspectiva Galería Escalera',
        requirements: 'Salón de doble altura con enlucido de concreto y escalera flotante de travertino.',
        src: '/images/ChatGPT Image 13 may 2026, 05_43_19 p.m. (3).png'
      },
      detail: {
        title: 'CASA TRAVERTINO // FASE 03: DETALLE TÉCNICO',
        plano: 'Encofrado de Materiales',
        requirements: 'Fresado posterior en la placa de travertino para embutir sensores táctiles.',
        src: '/images/vi.png'
      }
    }
  },
  {
    id: 'refugio-wellness',
    title: 'Refugio Wellness',
    category: 'wellness',
    location: 'Valle Sagrado, Cusco',
    area: '310 m²',
    year: '2025',
    intro: 'Un santuario de bienestar diseñado para el descanso profundo y la meditación. La automatización se disuelve por completo en muros de adobe reforzado y piedra volcánica, calibrando la temperatura y purificación de aire sin ruidos.',
    integrations: ['Clima Invisible', 'Acústica de Resonancia', 'Iluminación Circadiana', 'Diseño Estructural'],
    quote: '"El aire siempre es fresco y limpio en silencio absoluto. La música ambiental parece flotar desde los propios muros de piedra. Un refugio místico."',
    triptych: {
      exterior: {
        title: 'REFUGIO WELLNESS // FASE 01: EXTERIOR',
        plano: 'Elevación Paisaje - Mañana',
        requirements: 'Pabellón de spa revestido en piedra volcánica local y madera rústica oscura.',
        src: '/images/ChatGPT Image 14 may 2026, 02_52_32 p.m.png'
      },
      interior: {
        title: 'REFUGIO WELLNESS // FASE 02: INTERIOR',
        plano: 'Perspectiva Cámara de Vapor',
        requirements: 'Zona de spa húmeda iluminada por luz indirecta cálida perimetral circadiana.',
        src: '/images/ChatGPT Image 13 may 2026, 05_43_19 p.m. (4).png'
      },
      detail: {
        title: 'REFUGIO WELLNESS // FASE 03: DETALLE TÉCNICO',
        plano: 'Montaje Acústico',
        requirements: 'Transductor de flexión de audio invisible cubierto por revoque andino rústico.',
        src: '/images/v.png'
      }
    }
  }
];

export default function ProyectosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<'todos' | 'residencial' | 'pabellones' | 'wellness'>('todos');

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Stagger animation for projects
      gsap.fromTo('.project-case-study',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.projects-grid-trigger',
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [filter]);

  const filteredProjects = filter === 'todos' 
    ? projectsData 
    : projectsData.filter(p => p.category === filter);

  return (
    <div ref={containerRef} className="bg-brand-dark min-h-screen pt-36 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Page Header */}
        <div className="mb-16 space-y-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block">
            03 / PORTFOLIO DE CASOS DE ESTUDIO
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-[1.1]">
            <BrandText>Proyectos</BrandText> <br />
            <span className="font-light text-brand-gold"><BrandText>integrados</BrandText></span><span className="text-brand-gold">.</span>
          </h1>
          {/* Sparkle divider */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
          <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-md pt-2">
            Casos reales y conceptuales donde hemos colaborado para disolver la tecnología en espacios residenciales de lujo, logrando un balance estético perfecto.
          </p>
        </div>

        {/* Filters bar */}
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-xs sm:text-sm font-sans uppercase tracking-[0.15em] border-b border-white/[0.06] pb-5 mb-16 select-none">
          {[
            { label: 'Todos los Casos', value: 'todos' },
            { label: 'Residencial', value: 'residencial' },
            { label: 'Pabellones', value: 'pabellones' },
            { label: 'Wellness', value: 'wellness' }
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value as any)}
              className={`hover:text-brand-gold cursor-pointer transition-colors duration-300 ${
                filter === item.value ? 'text-brand-gold font-bold' : 'text-brand-light/40'
              }`}
            >
              <BrandText>{item.label}</BrandText>
            </button>
          ))}
        </div>

        {/* Projects Stack (Trípticos) */}
        <div className="space-y-32 projects-grid-trigger">
          {filteredProjects.map((project, i) => (
            <div 
              key={project.id} 
              className="project-case-study space-y-12 border-b border-white/[0.04] pb-24 last:border-b-0 last:pb-0"
            >
              
              {/* Project Title Block & Specifications */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] font-sans tracking-widest text-brand-gold uppercase">
                    <span>CASO 0{i + 1} /</span>
                    <span>{project.category}</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-sans font-light text-brand-light uppercase tracking-[0.1em]">
                    <BrandText>{project.title}</BrandText><span className="text-brand-gold">.</span>
                  </h2>
                  {/* Sparkle divider */}
                  <div className="h-[1px] w-20 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-3">
                    <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
                  </div>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-light/55 leading-relaxed pt-2">
                    {project.intro}
                  </p>
                </div>

                {/* Specs metadata */}
                <div className="lg:col-span-3 font-sans text-[10px] text-brand-light/50 tracking-wider space-y-2.5 border-l border-white/[0.06] pl-6 py-2">
                  <p>UBICACIÓN: <span className="text-brand-light font-semibold">{project.location}</span></p>
                  <p>SUPERFICIE: <span className="text-brand-light font-semibold">{project.area}</span></p>
                  <p>AÑO OBRA: <span className="text-brand-light font-semibold">{project.year}</span></p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.integrations.map((tag, tIdx) => (
                      <span key={tIdx} className="bg-brand-gold/10 text-brand-gold border border-brand-gold/20 px-2 py-0.5 text-[8.5px] uppercase font-bold tracking-widest">
                        <BrandText>{tag}</BrandText>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Client Quote */}
                <div className="lg:col-span-4 bg-brand-dark-soft border border-white/[0.04] p-6 flex flex-col justify-center">
                  <p className="font-sans font-light text-xs md:text-sm text-brand-gold/80 leading-relaxed italic">
                    {project.quote}
                  </p>
                  <span className="text-[9px] font-sans tracking-widest text-white/20 uppercase mt-3 block font-bold">
                    — TESTIMONIO DE PROPIETARIO
                  </span>
                </div>
              </div>

              {/* Architectural Triptych Container (Exterior -> Interior -> Detail) */}
              <div className="space-y-4">
                <span className="text-[9px] font-sans tracking-[0.25em] text-white/30 uppercase block select-none">
                  TRÍPTICO DE DISEÑO CONSTRUCTIVO // EXTERIOR → INTERIOR → DETALLE CONSTRUCTIVO
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {/* Phase 1: Exterior */}
                  <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.04] bg-brand-dark-soft group/img">
                    <div className="absolute inset-0 bg-brand-dark/25 group-hover/img:bg-brand-dark/15 transition-colors duration-300 z-10" />
                    <img 
                      src={project.triptych.exterior.src} 
                      alt={project.triptych.exterior.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                    />
                    <div className="absolute bottom-3.5 left-3.5 z-20 font-mono text-[8px] text-brand-light/85 bg-brand-dark/80 px-2.5 py-1 border border-white/[0.05] tracking-widest uppercase">
                      <span>{project.triptych.exterior.plano}</span>
                    </div>
                  </div>

                  {/* Phase 2: Interior */}
                  <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.04] bg-brand-dark-soft group/img">
                    <div className="absolute inset-0 bg-brand-dark/25 group-hover/img:bg-brand-dark/15 transition-colors duration-300 z-10" />
                    <img 
                      src={project.triptych.interior.src} 
                      alt={project.triptych.interior.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                    />
                    <div className="absolute bottom-3.5 left-3.5 z-20 font-mono text-[8px] text-brand-light/85 bg-brand-dark/80 px-2.5 py-1 border border-white/[0.05] tracking-widest uppercase">
                      <span>{project.triptych.interior.plano}</span>
                    </div>
                  </div>

                  {/* Phase 3: Detail */}
                  <div className="relative aspect-[4/3] overflow-hidden border border-white/[0.04] bg-brand-dark-soft group/img">
                    <div className="absolute inset-0 bg-brand-dark/25 group-hover/img:bg-brand-dark/15 transition-colors duration-300 z-10" />
                    <img 
                      src={project.triptych.detail.src} 
                      alt={project.triptych.detail.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105" 
                    />
                    <div className="absolute bottom-3.5 left-3.5 z-20 font-mono text-[8px] text-brand-light/85 bg-brand-dark/80 px-2.5 py-1 border border-white/[0.05] tracking-widest uppercase">
                      <span>{project.triptych.detail.plano}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
