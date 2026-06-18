"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";

gsap.registerPlugin(ScrollTrigger);

interface TriptychItem {
  title: string;
  plano: string;
  requirements: string;
  imageSrc: string;
}

interface TriptychImages {
  exterior: TriptychItem;
  interior: TriptychItem;
  detail: TriptychItem;
}

interface ProjectCaseStudy {
  id: string;
  title: string;
  category: "residencial" | "pabellones" | "wellness";
  location: string;
  area: string;
  year: string;
  intro: string;
  integrations: string[];
  quote: string;
  triptych: TriptychImages;
}

type ProjectFilter = "todos" | ProjectCaseStudy["category"];

const projectFilters: { label: string; value: ProjectFilter }[] = [
  { label: "Todos los Casos", value: "todos" },
  { label: "Residencial", value: "residencial" },
  { label: "Pabellones", value: "pabellones" },
  { label: "Wellness", value: "wellness" },
];

const projectsData: ProjectCaseStudy[] = [
  {
    id: "pabellon-del-agua",
    title: "Pabellón del Agua",
    category: "pabellones",
    location: "Propuesta Conceptual / Cieneguilla",
    area: "450 m²",
    year: "Integración de Clima y Audio",
    intro: "Una estructura minimalista de concreto visto y vidrio templado. El pabellón se integra al entorno mediante el reflejo en un gran espejo de agua exterior, mientras el interior disuelve todo rastro técnico para priorizar la contemplación silenciosa.",
    integrations: ["Iluminación Circadiana", "Clima Invisible", "Acústica Invisible", "Diseño Estructural"],
    quote: '"Lograr que el sonido y la climatización invisible se fundan en la estructura de concreto visto, liberando los muros de cualquier rejilla o dispositivo técnico."',
    triptych: {
      exterior: {
        title: "PABELLÓN DEL AGUA // FASE 01: EXTERIOR",
        plano: "Elevación Norte - Atardecer",
        requirements: "Pabellón minimalista de concreto visto reflejado en espejo de agua exterior.",
        imageSrc: "/backgrounds/manifesto.png",
      },
      interior: {
        title: "PABELLÓN DEL AGUA // FASE 02: INTERIOR",
        plano: "Perspectiva Salón Comedor",
        requirements: "Mobiliario travertino a medida con cielorraso de concreto continuo libre de rejillas.",
        imageSrc: "/backgrounds/casestudy.png",
      },
      detail: {
        title: "PABELLÓN DEL AGUA // FASE 03: DETALLE TÉCNICO",
        plano: "Junta de Techo Oculta",
        requirements: "Alojamiento para iluminación lineal indirecta y ventilación oculta.",
        imageSrc: "/backgrounds/specialties.png",
      },
    },
  },
  {
    id: "casa-travertino",
    title: "Casa Travertino",
    category: "residencial",
    location: "Estudio de Diseño / La Molina",
    area: "720 m²",
    year: "Iluminación Circadiana y Control",
    intro: "Una residencia familiar esculpida en piedra travertino y concreto. La obra destaca por la continuidad de sus texturas naturales y la total invisibilización de los sistemas mecánicos e interruptores eléctricos convencionales.",
    integrations: ["Iluminación Circadiana", "Clima Invisible", "Seguridad Discreta", "Control Conversacional"],
    quote: '"Programar el ciclo lumínico automatizado al ritmo solar natural, integrando interruptores capacitivos invisibles detrás del propio acabado de mármol."',
    triptych: {
      exterior: {
        title: "CASA TRAVERTINO // FASE 01: EXTERIOR",
        plano: "Elevación Principal - Noche",
        requirements: "Fachada de mármol travertino con iluminación rasante oculta que destaca las vetas de la piedra.",
        imageSrc: "/backgrounds/hero.png",
      },
      interior: {
        title: "CASA TRAVERTINO // FASE 02: INTERIOR",
        plano: "Perspectiva Galería Escalera",
        requirements: "Salón de doble altura con enlucido de concreto y escalera flotante de travertino.",
        imageSrc: "/backgrounds/beforeafter.png",
      },
      detail: {
        title: "CASA TRAVERTINO // FASE 03: DETALLE TÉCNICO",
        plano: "Encofrado de Materiales",
        requirements: "Fresado posterior en la placa de travertino para embutir sensores táctiles invisibles.",
        imageSrc: "/backgrounds/cta.png",
      },
    },
  },
  {
    id: "refugio-wellness",
    title: "Refugio Wellness",
    category: "wellness",
    location: "Concepto de Integración / Cusco",
    area: "310 m²",
    year: "Acústica y Confort Invisible",
    intro: "Un santuario de bienestar diseñado para el descanso profundo y la meditación. La automatización se disuelve por completo en muros de adobe reforzado y piedra volcánica, calibrando la temperatura y purificación de aire sin ruidos.",
    integrations: ["Clima Invisible", "Acústica de Resonancia", "Iluminación Circadiana", "Diseño Estructural"],
    quote: '"Diseñar una experiencia de absoluto silencio y confort térmico, donde la música y el aire emanan de forma imperceptible desde los materiales locales."',
    triptych: {
      exterior: {
        title: "REFUGIO WELLNESS // FASE 01: EXTERIOR",
        plano: "Elevación Paisaje - Mañana",
        requirements: "Pabellón de spa revestido en piedra volcánica local y madera rústica andina.",
        imageSrc: "/backgrounds/circadian.png",
      },
      interior: {
        title: "REFUGIO WELLNESS // FASE 02: INTERIOR",
        plano: "Perspectiva Cámara de Vapor",
        requirements: "Zona de spa húmeda minimalista iluminada por luz indirecta cálida perimetral.",
        imageSrc: "/backgrounds/specialties.png",
      },
      detail: {
        title: "REFUGIO WELLNESS // FASE 03: DETALLE TÉCNICO",
        plano: "Montaje Acústico",
        requirements: "Transductor de flexión de audio invisible cubierto por revoque andino rústico.",
        imageSrc: "/backgrounds/casestudy.png",
      },
    },
  },
];

export default function ProyectosPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<ProjectFilter>("todos");
  
  // Lightbox Modal State
  const [activeModalImage, setActiveModalImage] = useState<{
    src: string;
    title: string;
    plano: string;
    requirements: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Fade and slide projects grid stagger
      gsap.fromTo(
        ".project-case-study",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
        }
      );
    }, el);

    return () => ctx.revert();
  }, [filter]);

  // Modal open animation
  useEffect(() => {
    if (activeModalImage && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }
      );
    }
  }, [activeModalImage]);

  const filteredProjects =
    filter === "todos"
      ? projectsData
      : projectsData.filter((p) => p.category === filter);

  return (
    <div ref={containerRef} className="bg-ca-bg-deep min-h-screen pt-36 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Header */}
        <div className="mb-16 space-y-4">
          <SectionHeading
            number="03"
            label="Propuestas"
            title="CONCEPTOS Y ESTUDIOS DE INTEGRACIÓN"
            subtitle="Estudios de concepto y simulaciones tridimensionales que demuestran el estándar de calidad, la precisión constructiva y la ingeniería invisible que diseñamos para tu hogar."
          />
        </div>

        {/* Filters pills */}
        <div className="flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-widest border-b border-ca-border pb-6 mb-16 select-none">
          {projectFilters.map((item) => (
            <button
              key={item.value}
              onClick={() => setFilter(item.value)}
              className={`px-4 py-2 rounded transition-all duration-300 cursor-pointer ${
                filter === item.value
                  ? "bg-brand-gold text-brand-dark font-semibold shadow-lg"
                  : "bg-ca-bg-surface/50 text-ca-text-secondary border border-ca-border hover:text-ca-text hover:border-brand-gold/30"
              }`}
            >
              <BrandText>{item.label}</BrandText>
            </button>
          ))}
        </div>

        {/* Projects list */}
        <div className="space-y-32">
          {filteredProjects.map((project, i) => (
            <div
              key={project.id}
              className="project-case-study space-y-12 border-b border-ca-border pb-24 last:border-b-0 last:pb-0"
            >
              {/* Info grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-brand-gold uppercase">
                    <span>CASO 0{i + 1} /</span>
                    <span>{project.category}</span>
                  </div>
                  <h2 className="text-2xl md:text-3.5xl font-display font-light text-ca-text uppercase tracking-wide">
                    <BrandText>{project.title}</BrandText>
                    <span className="text-brand-gold">.</span>
                  </h2>
                  <p className="text-sm font-light leading-relaxed text-ca-text-secondary">
                    {project.intro}
                  </p>
                </div>

                {/* Specs list */}
                <div className="lg:col-span-3 font-mono text-[10px] text-ca-text-secondary tracking-wider space-y-3 border-l border-ca-border pl-6 py-1">
                  <p>
                    PROPUESTA: <span className="text-ca-text font-normal">{project.location}</span>
                  </p>
                  <p>
                    SUPERFICIE: <span className="text-ca-text font-normal">{project.area}</span>
                  </p>
                  <p>
                    ESTUDIO: <span className="text-ca-text font-normal">{project.year}</span>
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.integrations.map((tag) => (
                      <span
                        key={tag}
                        className="bg-brand-gold/10 text-brand-gold border border-brand-gold/25 px-2 py-0.5 text-[8.5px] uppercase font-bold tracking-widest"
                      >
                        <BrandText>{tag}</BrandText>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Testimonial block */}
                <div className="lg:col-span-4 glass-card p-6 rounded-lg flex flex-col justify-center border border-ca-border bg-ca-bg-surface/20">
                  <p className="font-serif font-light text-sm text-ca-text-secondary leading-relaxed italic">
                    {project.quote}
                  </p>
                  <span className="text-[9px] font-mono tracking-widest text-brand-gold/60 uppercase mt-4 block font-semibold">
                    — PROMESA DE EXPERIENCIA
                  </span>
                </div>
              </div>

              {/* Triptych Image Cards */}
              <div className="space-y-4">
                <span className="text-[9px] font-mono tracking-[0.25em] text-ca-text-muted uppercase block select-none">
                  TRÍPTICO DE DETALLE CONSTRUCTIVO // CLICK PARA AMPLIAR PLANO
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {[project.triptych.exterior, project.triptych.interior, project.triptych.detail].map((phase, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveModalImage({
                        src: phase.imageSrc,
                        title: project.title,
                        plano: phase.plano,
                        requirements: phase.requirements
                      })}
                      className="group border border-ca-border bg-ca-bg-surface/40 hover:border-brand-gold/45 p-4 rounded-lg flex flex-col justify-between cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                    >
                      <div className="relative aspect-[4/3] w-full rounded overflow-hidden border border-ca-border mb-4">
                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                          style={{ backgroundImage: `url(${phase.imageSrc})` }}
                        />
                        {/* Overlay magnifier */}
                        <div className="absolute inset-0 bg-ca-bg-deep/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <span className="text-[10px] font-mono tracking-widest text-brand-gold border border-brand-gold/40 px-3 py-1 bg-ca-bg-deep/90 rounded">
                            EXPANDIR PLANO
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-[10px] font-mono text-brand-gold uppercase tracking-wider mb-2">
                          <span>{phase.plano}</span>
                          <span className="text-ca-text-muted/50">0{idx + 1}</span>
                        </div>
                        <p className="text-[11px] font-sans text-ca-text-secondary leading-relaxed font-light">
                          {phase.requirements}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive technical blueprint details Lightbox Modal */}
      {activeModalImage && (
        <div
          ref={modalRef}
          className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10"
        >
          {/* Backdrop */}
          <div
            onClick={() => setActiveModalImage(null)}
            className="absolute inset-0 bg-ca-bg-deep/90 backdrop-blur-md cursor-pointer"
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-5xl glass-panel border border-ca-border rounded-xl overflow-hidden shadow-2xl bg-ca-bg-surface flex flex-col md:flex-row items-stretch">
            {/* Close button */}
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full border border-ca-border bg-ca-bg-deep/80 text-ca-text hover:text-brand-gold hover:border-brand-gold/50 transition-all cursor-pointer"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Visualizer Frame */}
            <div className="w-full md:w-3/5 relative aspect-[4/3] md:aspect-auto md:min-h-[55vh] flex items-center justify-center bg-black/40 border-b md:border-b-0 md:border-r border-ca-border overflow-hidden">
              {/* CAD coordinate rulers */}
              <div className="absolute left-6 right-6 top-6 h-[1px] cad-ruler-x opacity-10 pointer-events-none" />
              <div className="absolute left-6 top-6 bottom-6 w-[1px] cad-ruler-y opacity-10 pointer-events-none" />

              {/* Corner crosshairs (+) */}
              <span className="absolute top-6 left-6 -translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
              <span className="absolute top-6 right-6 translate-x-1/2 -translate-y-1/2 text-[9px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
              <span className="absolute bottom-6 left-6 -translate-x-1/2 translate-y-1/2 text-[9px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
              <span className="absolute bottom-6 right-6 translate-x-1/2 translate-y-1/2 text-[9px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>

              <div className="absolute top-8 left-8 font-mono text-[7px] text-brand-gold/50 tracking-widest uppercase hidden md:block">
                [ DIAGNOSTIC_MODE // SCALE: 1:20 ]
              </div>

              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat p-8 opacity-90"
                style={{ backgroundImage: `url(${activeModalImage.src})` }}
              />
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-brand-gold/75 tracking-wider bg-ca-bg-deep/85 px-3 py-1.5 rounded border border-ca-border uppercase">
                <span>PLANO TÉCNICO // DETALLE</span>
              </div>
            </div>

            {/* Information Side */}
            <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between space-y-6 bg-ca-bg-deep/20">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block">
                  {activeModalImage.title}
                </span>
                <h3 className="text-xl md:text-2.5xl font-display font-light text-ca-text uppercase tracking-wide">
                  <BrandText>{activeModalImage.plano}</BrandText>
                </h3>
                <div className="h-[1px] w-16 bg-brand-gold/40" />
                <p className="text-xs md:text-sm font-sans text-ca-text-secondary leading-relaxed font-light">
                  {activeModalImage.requirements}
                </p>
              </div>

              <div className="pt-4 border-t border-ca-border flex items-center justify-between text-[9px] font-mono text-ca-text-muted uppercase">
                <span>CASA ATENTA // INGENIERÍA INVISIBLE</span>
                <button
                  onClick={() => setActiveModalImage(null)}
                  className="text-brand-gold hover:text-ca-text transition-colors duration-300 font-semibold"
                >
                  [ VOLVER ]
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
