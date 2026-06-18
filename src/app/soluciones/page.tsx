"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";

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
    imageSrc: "/backgrounds/circadian.png",
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
    imageSrc: "/backgrounds/beforeafter.png",
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
    imageSrc: "/backgrounds/casestudy.png",
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
    imageSrc: "/backgrounds/cta.png",
    plano: "Esquema de Seguridad del Terreno",
    requirements: "Esquema técnico de planta del terreno que muestra el rango de escaneo de los sensores térmicos ocultos en los muros de piedra exterior y los límites perimetrales de seguridad."
  },
  {
    id: "automatizacion",
    number: "05",
    title: "Control Conversacional",
    subtitle: "La casa responde a tu voz natural o a un mensaje",
    body: "Creemos que las aplicaciones móviles llenas de botones son un error de diseño. Casa Atenta automatiza rutinas y responde de forma conversacional: un simple mensaje de WhatsApp o un comando de voz natural modula tu entorno entero de forma fluida.",
    details: [
      "Pasarela de comunicación bidireccional integrada directamente con WhatsApp.",
      "Rutinas autónomas que cruzan datos de clima, presencia, sol y hábitos del usuario.",
      "Sin requerir descargas de aplicaciones propietarias ni capacitaciones técnicas.",
      "Procesamiento local de datos para garantizar la total privacidad de tu vida diaria."
    ],
    imageSrc: "/backgrounds/specialties.png",
    plano: "Diagrama de Flujo de Red IoT",
    requirements: "Diagrama de bloques de comunicación de baja latencia local. Flujo de datos desde sensores a actuadores locales mediante servidor de automatización seguro con cifrado."
  },
  {
    id: "diseno",
    number: "06",
    title: "Planificación de Obra",
    subtitle: "Garantía estética desde el primer bosquejo",
    body: "El éxito de la integración invisible reside en planificarla antes de verter el primer camión de concreto. Colaboramos con tu estudio de arquitectura y constructora desde la etapa de planos, supervisando cada ducto y pasarela técnica en obra.",
    details: [
      "Planificación de canalizaciones ocultas en planos de estructuras y encofrados.",
      "Modelado BIM completo (Revit) integrando climatización, audio e iluminación.",
      "Supervisión y control técnico de instaladores en obra semanalmente.",
      "Garantía final de limpieza visual de muros y techos tras la entrega."
    ],
    imageSrc: "/backgrounds/manifesto.png",
    plano: "Coordinación BIM Multidisciplinaria",
    requirements: "Corte transversal del edificio mostrando la compatibilidad y cruce de tuberías de climatización, mangueras eléctricas, y soportes de audio en el encofrado estructural de concreto."
  }
];

export default function SolucionesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Syncing left visualizer to active scrolled section
      solutionsData.forEach((sol, i) => {
        ScrollTrigger.create({
          trigger: `#sol-section-${sol.id}`,
          start: "top 45%",
          end: "bottom 45%",
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-ca-bg-deep min-h-screen pt-24 relative">
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-stretch relative z-10">
        
        {/* LEFT COLUMN: Pinned Technical Visualizer (Fixed Position Desktop only) */}
        <div className="hidden lg:flex lg:col-span-6 xl:col-span-7 h-screen sticky top-0 bg-ca-bg-deep overflow-hidden border-r border-ca-border p-12 xl:p-20 flex-col justify-between">
          <div className="absolute inset-0 z-0 opacity-15 architectural-grid pointer-events-none" />

          {/* Sticky Header block */}
          <div className="relative z-10 select-none">
            <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block mb-1">
              02 / Soluciones Disueltas
            </span>
            <h2 className="text-xl md:text-2xl font-display font-light text-ca-text uppercase tracking-widest">
              <BrandText>Ingeniería Invisible</BrandText>
              <span className="text-brand-gold">.</span>
            </h2>
            <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-3" />
          </div>

          {/* Technical Visual Container with architectural overlays */}
          <div className="relative w-full h-[55vh] flex items-center justify-center my-auto">
            {solutionsData.map((sol, i) => (
              <div
                key={sol.id}
                className="absolute inset-0 w-full h-full transition-all duration-700 ease-out flex flex-col justify-between"
                style={{
                  opacity: activeIndex === i ? 1 : 0,
                  transform: activeIndex === i ? "scale(1) translateY(0)" : "scale(0.98) translateY(10px)",
                  pointerEvents: activeIndex === i ? "auto" : "none",
                }}
              >
                {/* Image frame */}
                <div className="relative w-full h-[75%] rounded-lg overflow-hidden border border-white/[0.08] shadow-2xl">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${sol.imageSrc})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-transparent to-transparent opacity-40" />
                </div>

                {/* Technical blueprint specifications label */}
                <div className="h-[20%] mt-4 p-4 rounded border border-ca-border bg-ca-bg-surface flex flex-col justify-center">
                  <span className="text-[9px] font-mono text-brand-gold tracking-widest uppercase mb-1">
                    {sol.plano}
                  </span>
                  <p className="text-[10px] font-sans text-ca-text-secondary leading-relaxed font-light line-clamp-2">
                    {sol.requirements}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky footer info */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-ca-text-secondary/40 uppercase tracking-widest select-none">
            <span>CASA ATENTA // INFORME TÉCNICO</span>
            <span>INTEGRACIÓN 0{activeIndex + 1} DE 06</span>
          </div>
        </div>

        {/* RIGHT COLUMN: Scrolling Description Content */}
        <div className="lg:col-span-6 xl:col-span-5 px-6 md:px-12 lg:px-16 pt-16 lg:pt-28 pb-32 space-y-24 lg:space-y-40">
          
          {/* Page Intro heading */}
          <div className="space-y-4">
            <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block">
              Catálogo de experiencias
            </span>
            <h1 className="text-4xl md:text-5.5xl font-display font-light text-ca-text uppercase tracking-widest leading-[1.1]">
              <BrandText>Nuestras 6</BrandText> <br />
              <span className="font-light text-brand-gold">
                <BrandText>integraciones</BrandText>
              </span>
              <span className="text-brand-gold">.</span>
            </h1>
            <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5" />
            <p className="text-xs md:text-sm font-sans font-light text-ca-text-secondary leading-relaxed max-w-md">
              Explora las áreas funcionales que Casa Atenta coordina e integra para transformar una obra residencial tradicional en un ecosistema habitable inteligente y silencioso.
            </p>
          </div>

          {/* Description Section cards */}
          {solutionsData.map((sol, index) => (
            <section
              key={sol.id}
              id={`sol-section-${sol.id}`}
              className="space-y-8 border-t border-white/[0.06] pt-12 first:border-t-0 first:pt-0"
            >
              {/* Mobile visualizer (Only visible on screens < 1024px) */}
              <div className="block lg:hidden w-full space-y-4">
                <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-white/[0.08] shadow-lg">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${sol.imageSrc})` }}
                  />
                </div>
                <div className="p-4 rounded border border-ca-border bg-ca-bg-surface">
                  <span className="text-[9px] font-mono text-brand-gold tracking-widest uppercase mb-1 block">
                    {sol.plano}
                  </span>
                  <p className="text-[10px] font-sans text-ca-text-secondary leading-relaxed font-light">
                    {sol.requirements}
                  </p>
                </div>
              </div>

              {/* Title & Metadata */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-brand-gold uppercase font-semibold">
                  <span>{sol.number} /</span>
                  <span>Integración Técnica</span>
                </div>
                <h2 className="text-2xl md:text-3.5xl font-display font-light text-ca-text uppercase tracking-wide">
                  <BrandText>{sol.title}</BrandText>
                </h2>
                <h4 className="text-xs font-mono text-brand-gold/60 uppercase tracking-widest font-semibold">
                  {sol.subtitle}
                </h4>
              </div>

              {/* Body Text */}
              <p className="text-sm font-light leading-relaxed text-ca-text-secondary">
                {sol.body}
              </p>

              {/* Specifications block */}
              <div className="space-y-4 pt-4">
                <h5 className="text-[10px] font-mono tracking-widest text-ca-text uppercase border-b border-ca-border pb-2 font-semibold">
                  Especificaciones de Diseño
                </h5>
                <ul className="space-y-3.5">
                  {sol.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start space-x-3 text-[11px] font-sans font-light text-ca-text-secondary/80 leading-normal"
                    >
                      <span className="text-brand-gold mt-1">▪</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
