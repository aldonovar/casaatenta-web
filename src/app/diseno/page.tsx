"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";
import { WHATSAPP_LINK } from "@/constants/contact";

gsap.registerPlugin(ScrollTrigger);

interface SolutionItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  body: string;
  details: string[];
  imageSrc: string;
  plano: string;
  requirements: string;
}

const solutionsData: SolutionItem[] = [
  {
    id: "iluminacion",
    number: "01",
    title: "Iluminación Circadiana",
    subtitle: "Luz que acompaña tu ritmo biológico",
    body: "El sol dicta nuestro reloj interno. Nuestra iluminación emula el tono y la intensidad del sol a lo largo del día de manera automática: desde luz blanca fría y estimulante a las 11:00 am, hasta luz dorada ultra cálida de 2000K a las 8:00 pm, promoviendo el descanso natural.",
    details: [
      "Luminarias lineales invisibles empotradas en los detalles de juntas arquitectónicas.",
      "Sintonía circadiana de temperatura de color dinámico de 1800K a 6500K.",
      "Controladores de atenuación profunda (hasta 0.1%) para transiciones fluidas sin parpadeos.",
      "Sensores de luminosidad exterior ocultos en fachadas para calibrar la luz interna."
    ],
    imageSrc: "/media/cinematic-walk/luz-03.png",
    plano: "Plano de Techo / Reflected Ceiling Plan",
    requirements: "Plano arquitectónico de techo detallando la junta oculta de yeso de 15mm donde van empotradas las luminarias lineales y los drivers LED invisibles."
  },
  {
    id: "clima",
    number: "02",
    title: "Climatización Invisible",
    subtitle: "Aire que se siente, pero no se ve ni se oye",
    body: "Eliminamos los termostatos plásticos y las rejillas industriales. El flujo de aire fresco o cálido se inyecta y retorna a través de finas ranuras lineales de 12mm integradas en las juntas arquitectónicas, operando de forma imperceptible y en absoluto silencio.",
    details: [
      "Difusores lineales ocultos perimetralmente con sonoridad extrema menor a 18 dB.",
      "Distribución de aire por convección natural pasiva, evitando ráfagas molestas.",
      "Módulos de sensado de temperatura y calidad de aire (CO2/VOC) embebidos bajo el revoque.",
      "Suelo y paredes radiantes en espacios húmedos e interiores de concreto."
    ],
    imageSrc: "/media/creative-lenses/half-render-reality-01.png",
    plano: "Detalle Constructivo Termomecánico",
    requirements: "Plano de detalle a escala 1:5 que muestra el pleno del cielorraso con inyección de aire lineal, la caja de plenitud acústica con aislamiento, y la ranura arquitectónica de 12mm."
  },
  {
    id: "acustica",
    number: "03",
    title: "Acústica de Resonancia",
    subtitle: "Música que emana directamente de los muros",
    body: "Las rejillas de los altavoces son cosa del pasado. Instalamos transductores de panel plano de alta fidelidad que se atornillan a la estructura del panel de yeso o madera y se cubren con el enlucido final. Las paredes del salón se convierten en el propio altavoz envolvente.",
    details: [
      "Transductores de flexión invisibles de 40W/80W montados detrás del yeso.",
      "Sonido envolvente uniforme de 180 grados sin puntos calientes de audio.",
      "Calibración acústica asistida por DSP para compensar la masa del acabado de yeso.",
      "Subwoofers estructurales pasivos ocultos bajo el mobiliario fijo de madera."
    ],
    imageSrc: "/media/creative-lenses/perspectiva-baja-01.png",
    plano: "Elevación de Estructura Acústica",
    requirements: "Dibujo técnico de elevación de pared que muestra el transductor electroacústico fijado entre montantes de acero, con la malla de enlucido y la capa final de yeso de 2mm cubriéndolo."
  },
  {
    id: "seguridad",
    number: "04",
    title: "Seguridad Discreta",
    subtitle: "Protección permanente sin sensación de encierro",
    body: "La seguridad no debe ser intimidante. Sustituimos las cámaras y sensores plásticos por barreras de escaneo térmico invisibles integradas en el paisajismo y en los perfiles de la carpintería exterior, detectando intrusiones antes de que sucedan.",
    details: [
      "Barreras perimetrales térmicas e infrarrojas camufladas en el diseño paisajístico.",
      "Cerraduras electromecánicas integradas internamente dentro de los marcos de las puertas.",
      "Detección volumétrica por radar de ultra-frecuencia oculta detrás del concreto.",
      "Integración con software de análisis de IA para evitar falsas alarmas de mascotas."
    ],
    imageSrc: "/media/cinematic-walk/entrada-01.png",
    plano: "Esquema de Seguridad del Terreno",
    requirements: "Esquema técnico de planta del terreno que muestra el rango de escaneo de los sensores térmicos ocultos en los muros de piedra exterior y los límites perimetrales de seguridad."
  }
];

const projectsData = [
  {
    id: "propuesta-cocina",
    title: "Propuesta Cocina Integrada",
    category: "interiores",
    location: "Diseño Conceptual / Lima",
    area: "45 m²",
    year: "2026",
    intro: "Estudio tridimensional de una cocina moderna con automatización de iluminación lineal, encendido regulado por presencia y transiciones de escena. La propuesta demuestra cómo el espacio cambia de una zona técnica y de trabajo a un ambiente cálido de convivencia nocturna.",
    integrations: ["Iluminación Circadiana", "Clima Invisible", "Acústica de Resonancia"],
    quote: '"El flujo de luz se ajusta solo cuando la cocina se convierte en un área de descanso social, permitiendo que la arquitectura tome el protagonismo."',
    imageSrc: "/media/cases/cocina-renovada/after.png",
    plano: "Detalle Constructivo Lumínico",
    requirements: "Sección constructiva que detalla los perfiles de aluminio para LED de 15mm empotrados al ras en los reposteros de madera."
  },
  {
    id: "propuesta-acceso",
    title: "Propuesta Fachada y Acceso",
    category: "residencial",
    location: "Diseño Conceptual / Lima",
    area: "120 m²",
    year: "2026",
    intro: "Estudio de conectividad exterior que integra accesos biométricos y control perimetral pasivo con un sistema de iluminación de cortesía. Las luminarias rasantes destacan la textura natural de los acabados de piedra mientras guían el recorrido del habitante de forma autónoma.",
    integrations: ["Iluminación Circadiana", "Seguridad Discreta"],
    quote: '"El acceso de la casa te reconoce al aproximarte y activa una iluminación rasante sutil sobre la piedra travertino, eliminando interruptores mecánicos."',
    imageSrc: "/media/cases/fachada-acceso/after.png",
    plano: "Detalle de Conectividad y Accesos",
    requirements: "Plano de elevación del portón exterior integrando la cerradura electromecánica en el interior del perfil metálico estructural."
  }
];

export default function DisenoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSolution, setActiveSolution] = useState(0);
  const [activeModalImage, setActiveModalImage] = useState<{
    src: string;
    title: string;
    plano: string;
    requirements: string;
  } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Syncing left visualizer to active scrolled section
      solutionsData.forEach((sol, i) => {
        ScrollTrigger.create({
          trigger: `#sol-section-${sol.id}`,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveSolution(i),
          onEnterBack: () => setActiveSolution(i),
        });
      });

      // Fade-in animations for section items
      gsap.fromTo(
        ".diseno-fade",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.0,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".diseno-trigger",
            start: "top 80%",
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-ca-bg-deep min-h-screen pt-36 relative">
      <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

      {/* Intro Heading Section (Cinematic Large scale) */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 mb-24 lg:mb-36 space-y-6">
        <SectionHeading
          number="02"
          label="Diseño Residencial"
          title="ARTE Y FUSIÓN TÉCNICA"
          subtitle="Diseñamos experiencias residenciales donde la ingeniería se disuelve en los acabados. Menos ruido, más espacio."
        />
      </div>

      {/* SECTION 1: DETAILED INTEGRATION AREAS */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 items-stretch border-t border-ca-border relative">
        
        {/* Sticky Visualizer (Left Column, Desktop only) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 h-screen sticky top-0 bg-ca-bg-deep overflow-hidden border-r border-ca-border p-16 xl:p-24 flex-col justify-between">
          <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

          <div className="relative z-10">
            <span className="text-[10px] font-mono tracking-[0.3em] text-ca-text/40 uppercase block mb-1">
              [ Áreas de Intervención ]
            </span>
            <h2 className="text-2xl font-display font-light text-ca-text uppercase tracking-widest">
              <BrandText>Ingeniería Invisible</BrandText>
            </h2>
            <div className="h-[1px] w-24 bg-ca-text/30 my-4" />
          </div>

          {/* Visual Canvas */}
          <div className="relative w-full h-[50vh] flex items-center justify-center">
            {solutionsData.map((sol, i) => (
              <div
                key={sol.id}
                className="absolute inset-0 w-full h-full transition-all duration-700 ease-out flex flex-col justify-between"
                style={{
                  opacity: activeSolution === i ? 1 : 0,
                  transform: activeSolution === i ? "scale(1)" : "scale(0.96) translateY(20px)",
                  pointerEvents: activeSolution === i ? "auto" : "none",
                }}
              >
                {/* Large visual frame */}
                <div className="relative w-full h-[78%] rounded-lg overflow-hidden border border-ca-border bg-ca-bg-surface shadow-2xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url(${sol.imageSrc})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-transparent to-transparent opacity-50" />
                </div>

                {/* Spec details */}
                <div className="h-[18%] p-5 rounded border border-ca-border bg-ca-bg-surface flex flex-col justify-center">
                  <span className="text-[9px] font-mono text-ca-text tracking-widest uppercase mb-1 block">
                    {sol.plano}
                  </span>
                  <p className="text-[10px] text-ca-text-secondary leading-relaxed font-light line-clamp-2">
                    {sol.requirements}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-ca-text-secondary/40 uppercase tracking-widest select-none">
            <span>CASA ATENTA // INTEGRACIÓN DE DISEÑO</span>
            <span>0{activeSolution + 1} DE 04</span>
          </div>
        </div>

        {/* Scrolling Solutions Details (Right Column) */}
        <div className="lg:col-span-6 xl:col-span-5 px-6 md:px-12 lg:px-16 pt-16 lg:pt-28 pb-32 space-y-28 lg:space-y-44">
          {solutionsData.map((sol) => (
            <section
              key={sol.id}
              id={`sol-section-${sol.id}`}
              className="space-y-8 border-t border-ca-border/40 pt-16 first:border-t-0 first:pt-0"
            >
              {/* Mobile visual block */}
              <div className="block lg:hidden w-full space-y-4">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-ca-border bg-ca-bg-surface shadow-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-70"
                    style={{ backgroundImage: `url(${sol.imageSrc})` }}
                  />
                </div>
                <div className="p-4 rounded border border-ca-border bg-ca-bg-surface">
                  <span className="text-[9px] font-mono text-ca-text tracking-widest uppercase mb-1 block">
                    {sol.plano}
                  </span>
                  <p className="text-[10px] text-ca-text-secondary leading-relaxed font-light">
                    {sol.requirements}
                  </p>
                </div>
              </div>

              {/* Title & info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-ca-text/40 uppercase">
                  <span>{sol.number} //</span>
                  <span>Solución Habitable</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-display font-light text-ca-text uppercase tracking-wide">
                  <BrandText>{sol.title}</BrandText>
                </h2>
                <h4 className="text-xs font-serif italic text-ca-text-secondary">
                  {sol.subtitle}
                </h4>
              </div>

              <p className="text-sm md:text-base font-light leading-relaxed text-ca-text-secondary">
                {sol.body}
              </p>

              {/* Specifications block */}
              <div className="space-y-4 pt-4">
                <h5 className="text-[10px] font-mono tracking-widest text-ca-text uppercase border-b border-ca-border pb-2 font-semibold">
                  Criterios de Integración
                </h5>
                <ul className="space-y-4">
                  {sol.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-3 text-[11px] md:text-xs font-sans font-light text-ca-text-secondary/80 leading-normal"
                    >
                      <span className="text-ca-text mt-1.5 h-1.5 w-1.5 rounded-full bg-ca-text" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>

      {/* SECTION 2: PORTFOLIO CASOS DE ESTUDIO (Cinematic Bento layout) */}
      <section className="bg-ca-bg-surface border-t border-ca-border py-28 md:py-36 relative z-10 diseno-trigger">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
          
          <div className="mb-20 space-y-4 max-w-3xl diseno-fade">
            <span className="text-[10px] font-mono tracking-[0.25em] text-ca-text/50 uppercase block">
              [ Selección de Casos ]
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-light text-ca-text uppercase tracking-wide">
              <BrandText>Escenarios de Integración</BrandText>
            </h2>
            <p className="text-sm md:text-base font-light text-ca-text-secondary leading-relaxed">
              Propuestas de integración y escenarios de concepto técnico creados para visualizar la automatización e iluminación antes de la obra final.
            </p>
          </div>

          {/* Cases grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 diseno-fade">
            {projectsData.map((project) => (
              <div
                key={project.id}
                className="group border border-ca-border bg-ca-bg-deep/40 hover:border-ca-text/40 rounded-xl p-6 md:p-8 flex flex-col justify-between cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-1.5"
                onClick={() => setActiveModalImage({
                  src: project.imageSrc,
                  title: project.title,
                  plano: project.plano,
                  requirements: project.requirements
                })}
              >
                <div className="space-y-6">
                  {/* Aspect image frame */}
                  <div className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border border-ca-border bg-ca-bg-deep mb-6">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-103 opacity-70"
                      style={{ backgroundImage: `url(${project.imageSrc})` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep/80 via-transparent to-transparent" />
                    
                    <div className="absolute inset-0 bg-ca-bg-deep/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-[10px] font-mono tracking-widest text-ca-text border border-ca-text/40 px-4 py-2 bg-ca-bg-deep/90 rounded">
                        REVISAR DETALLE CONSTRUCTIVO
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-mono text-ca-text/60 uppercase">
                    <span>{project.location}</span>
                    <span>{project.year}</span>
                  </div>

                  <h3 className="text-2xl font-display font-light text-ca-text uppercase tracking-wide group-hover:underline">
                    <BrandText>{project.title}</BrandText>
                  </h3>

                  <p className="text-sm font-light text-ca-text-secondary leading-relaxed line-clamp-3">
                    {project.intro}
                  </p>
                </div>

                <div className="border-t border-ca-border/40 pt-6 mt-6 flex justify-between items-center text-[9px] font-mono text-ca-text-secondary/60 uppercase">
                  <div className="flex flex-wrap gap-2">
                    {project.integrations.map((t) => (
                      <span key={t} className="border border-ca-border px-2 py-0.5 rounded text-[8px] bg-ca-bg-deep/60">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span>{project.area}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-24 text-center diseno-fade">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn inline-flex min-h-12 items-center justify-center border border-ca-text bg-ca-text px-10 py-4 text-[10px] font-mono uppercase tracking-widest text-ca-bg-deep font-semibold hover:bg-transparent hover:text-ca-text transition-all duration-300"
            >
              <BrandText>Consultar cotización de diseño</BrandText>
            </a>
          </div>

        </div>
      </section>

      {/* Blueprint details Lightbox Modal */}
      {activeModalImage && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 md:p-10">
          <div
            onClick={() => setActiveModalImage(null)}
            className="absolute inset-0 bg-ca-bg-deep/90 backdrop-blur-md cursor-pointer"
          />

          <div className="relative z-10 w-full max-w-5xl glass-panel border border-ca-border rounded-xl overflow-hidden shadow-2xl bg-ca-bg-surface flex flex-col md:flex-row items-stretch">
            {/* Close button */}
            <button
              onClick={() => setActiveModalImage(null)}
              className="absolute top-4 right-4 z-20 h-9 w-9 flex items-center justify-center rounded-full border border-ca-border bg-ca-bg-deep/80 text-ca-text hover:border-ca-text/50 transition-all cursor-pointer"
              aria-label="Cerrar"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Visualizer Frame */}
            <div className="w-full md:w-3/5 relative aspect-[4/3] md:aspect-auto md:min-h-[55vh] flex items-center justify-center bg-black/40 border-b md:border-b-0 md:border-r border-ca-border overflow-hidden">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat p-8 opacity-90"
                style={{ backgroundImage: `url(${activeModalImage.src})` }}
              />
              <div className="absolute bottom-4 left-4 font-mono text-[9px] text-ca-text/75 tracking-wider bg-ca-bg-deep/85 px-3 py-1.5 rounded border border-ca-border uppercase">
                <span>PLANO TÉCNICO // DETALLE</span>
              </div>
            </div>

            {/* Information Side */}
            <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-between space-y-6 bg-ca-bg-deep/20">
              <div className="space-y-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-ca-text/40 uppercase block">
                  {activeModalImage.title}
                </span>
                <h3 className="text-xl md:text-2.5xl font-display font-light text-ca-text uppercase tracking-wide">
                  <BrandText>{activeModalImage.plano}</BrandText>
                </h3>
                <div className="h-[1px] w-16 bg-ca-text/30" />
                <p className="text-xs md:text-sm font-sans text-ca-text-secondary leading-relaxed font-light">
                  {activeModalImage.requirements}
                </p>
              </div>

              <div className="pt-4 border-t border-ca-border flex items-center justify-between text-[9px] font-mono text-ca-text-secondary uppercase">
                <span>CASA ATENTA // INGENIERÍA INVISIBLE</span>
                <button
                  onClick={() => setActiveModalImage(null)}
                  className="text-ca-text hover:underline transition-colors duration-300 font-semibold cursor-pointer"
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
