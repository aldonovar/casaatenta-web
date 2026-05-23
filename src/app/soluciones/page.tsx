"use client";

import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandText } from '../../components/BrandText';
import { PremiumPlaceholder } from '../../components/PremiumPlaceholder';

gsap.registerPlugin(ScrollTrigger);

interface SolutionItem {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  body: string;
  details: string[];
  placeholder: {
    title: string;
    plano: string;
    requirements: string;
  };
}

const solutionsData: SolutionItem[] = [
  {
    id: 'iluminacion',
    number: '01',
    title: 'Iluminación Circadiana',
    subtitle: 'Luz que acompaña tu ritmo biológico',
    body: 'El sol dicta nuestro reloj interno. Nuestra iluminación emula el tono y la intensidad del sol a lo largo del día de manera automática: desde luz blanca fría y estimulante a las 11:00 am, hasta luz dorada ultra cálida de 2000K a las 8:00 pm, promoviendo el descanso natural.',
    details: [
      'Luminarias lineales invisibles empotradas en los detalles de juntas arquitectónicas.',
      'Sintonía circadiana de temperatura de color dinámico de 1800K a 6500K.',
      'Controladores de atenuación profunda (hasta 0.1%) para transiciones fluidas sin parpadeos.',
      'Sensores de luminosidad exterior ocultos en fachadas para calibrar la luz interna.'
    ],
    placeholder: {
      title: 'INTEGRACIÓN: ILUMINACIÓN INVISIBLE',
      plano: 'Plano de Techo / Reflected Ceiling Plan',
      requirements: 'Plano arquitectónico de techo detallando la junta oculta de yeso de 15mm donde van empotradas las luminarias lineales y los drivers LED invisibles.'
    }
  },
  {
    id: 'clima',
    number: '02',
    title: 'Climatización Invisible',
    subtitle: 'Aire que se siente, pero no se ve ni se oye',
    body: 'Eliminamos los termostatos plásticos y las rejillas industriales. El flujo de aire fresco o cálido se inyecta y retorna a través de finas ranuras lineales de 12mm integradas en las juntas arquitectónicas, operando de forma imperceptible y en absoluto silencio.',
    details: [
      'Difusores lineales ocultos perimetralmente con sonoridad extrema menor a 18 dB.',
      'Distribución de aire por convección natural pasiva, evitando ráfagas molestas.',
      'Módulos de sensado de temperatura y calidad de aire (CO2/VOC) embebidos bajo el revoque.',
      'Suelo y paredes radiantes en espacios húmedos e interiores de concreto.'
    ],
    placeholder: {
      title: 'INTEGRACIÓN: CLIMATIZACIÓN DIFUSA',
      plano: 'Detalle Constructivo Termomecánico',
      requirements: 'Plano de detalle a escala 1:5 que muestra el pleno del cielorraso con inyección de aire lineal, la caja de plenitud acústica con aislamiento, y la ranura arquitectónica de 12mm.'
    }
  },
  {
    id: 'acustica',
    number: '03',
    title: 'Acústica de Resonancia',
    subtitle: 'Música que emana directamente de los muros',
    body: 'Las rejillas de los altavoces son cosa del pasado. Instalamos transductores de panel plano de alta fidelidad que se atornillan a la estructura del panel de yeso o madera y se cubren con el enlucido final. Las paredes del salón se convierten en el propio altavoz envolvente.',
    details: [
      'Transductores de flexión invisibles de 40W/80W montados detrás del yeso.',
      'Sonido envolvente uniforme de 180 grados sin puntos calientes de audio.',
      'Calibración acústica asistida por DSP para compensar la masa del acabado de yeso.',
      'Subwoofers estructurales pasivos ocultos bajo el mobiliario fijo de madera.'
    ],
    placeholder: {
      title: 'INTEGRACIÓN: AUDIO INVISIBLE EN PANELES',
      plano: 'Elevación de Estructura Acústica',
      requirements: 'Dibujo técnico de elevación de pared que muestra el transductor electroacústico fijado entre montantes de acero, con la malla de enlucido y la capa final de yeso de 2mm cubriéndolo.'
    }
  },
  {
    id: 'seguridad',
    number: '04',
    title: 'Seguridad Discreta',
    subtitle: 'Protección permanente sin sensación de encierro',
    body: 'La seguridad no debe ser intimidante. Sustituimos las cámaras y sensores plásticos por barreras de escaneo térmico invisibles integradas en el paisajismo y en los perfiles de la carpintería exterior, detectando intrusiones antes de que sucedan.',
    details: [
      'Barreras perimetrales térmicas e infrarrojas camufladas en el diseño paisajístico.',
      'Cerraduras electromecánicas integradas internamente dentro de los marcos de las puertas.',
      'Detección volumétrica por radar de ultra-frecuencia oculta detrás del concreto.',
      'Integración con software de análisis de IA para evitar falsas alarmas de mascotas.'
    ],
    placeholder: {
      title: 'INTEGRACIÓN: BARRERA PERIMETRAL DISCRETA',
      plano: 'Esquema de Seguridad del Terreno',
      requirements: 'Esquema técnico de planta del terreno que muestra el rango de escaneo de los sensores térmicos ocultos en los muros de piedra exterior y los límites perimetrales de seguridad.'
    }
  },
  {
    id: 'automatizacion',
    number: '05',
    title: 'Control Conversacional',
    subtitle: 'La casa responde a tu voz natural o a un mensaje',
    body: 'Creemos que las aplicaciones móviles llenas de botones son un error de diseño. Casa Atenta automatiza rutinas y responde de forma conversacional: un simple mensaje de WhatsApp o un comando de voz natural modula tu entorno entero de forma fluida.',
    details: [
      'Pasarela de comunicación bidireccional integrada directamente con WhatsApp.',
      'Rutinas autónomas que cruzan datos de clima, presencia, sol y hábitos del usuario.',
      'Sin requerir descargas de aplicaciones propietarias ni capacitaciones técnicas.',
      'Procesamiento local de datos para garantizar la total privacidad de tu vida diaria.'
    ],
    placeholder: {
      title: 'INTEGRACIÓN: INTERFAZ CONVERSACIONAL',
      plano: 'Diagrama de Flujo de Red IoT',
      requirements: 'Diagrama de bloques de comunicación de baja latencia local. Flujo de datos desde sensores a actuadores locales mediante servidor de automatización seguro con cifrado.'
    }
  },
  {
    id: 'diseno',
    number: '06',
    title: 'Planificación de Obra',
    subtitle: 'Garantía estética desde el primer bosquejo',
    body: 'El éxito de la integración invisible reside en planificarla antes de verter el primer camión de concreto. Colaboramos con tu estudio de arquitectura y constructora desde la etapa de planos, supervisando cada ducto y pasarela técnica en obra.',
    details: [
      'Planificación de canalizaciones ocultas en planos de estructuras y encofrados.',
      'Modelado BIM completo (Revit) integrando climatización, audio e iluminación.',
      'Supervisión y control técnico de instaladores en obra semanalmente.',
      'Garantía final de limpieza visual de muros y techos tras la entrega.'
    ],
    placeholder: {
      title: 'INTEGRACIÓN: INGENIERÍA ESTRUCTURAL EN PLANOS',
      plano: 'Coordinación BIM Multidisciplinaria',
      requirements: 'Corte transversal del edificio mostrando la compatibilidad y cruce de tuberías de climatización, mangueras eléctricas, y soportes de audio en el encofrado estructural de concreto.'
    }
  }
];

export default function SolucionesPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Create ScrollTrigger for split-screen sync
      solutionsData.forEach((sol, i) => {
        ScrollTrigger.create({
          trigger: `#sol-section-${sol.id}`,
          start: 'top 50%',
          end: 'bottom 50%',
          onEnter: () => setActiveIndex(i),
          onEnterBack: () => setActiveIndex(i),
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-brand-dark min-h-screen pt-24 relative">
      
      <div className="w-full h-full grid grid-cols-1 lg:grid-cols-12 items-stretch relative">
        
        {/* LEFT COLUMN: Pinned Technical Visualizer (Fixed Position) */}
        <div className="hidden lg:block lg:col-span-6 xl:col-span-7 h-screen sticky top-0 bg-brand-dark-soft overflow-hidden border-r border-white/[0.04] p-12 xl:p-20 flex flex-col justify-between">
          <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />
          
          {/* Header in sticky bar */}
          <div className="relative z-10 select-none">
            <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block mb-1">
              02 / SOLUCIONES DISUELTAS
            </span>
            <h2 className="text-xl md:text-2xl font-sans font-light text-brand-light uppercase tracking-[0.15em]">
              <BrandText>Ingeniería Invisible</BrandText><span className="text-brand-gold">.</span>
            </h2>
            {/* Sparkle divider */}
            <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-3">
              <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
            </div>
          </div>

          {/* Crossfaded Placeholders */}
          <div className="relative w-full h-[55vh] flex items-center justify-center my-auto">
            {solutionsData.map((sol, i) => (
              <div
                key={sol.id}
                className="absolute inset-0 w-full h-full transition-all duration-700 ease-out flex items-center justify-center"
                style={{
                  opacity: activeIndex === i ? 1 : 0,
                  transform: activeIndex === i ? 'scale(1) translateY(0)' : 'scale(0.98) translateY(10px)',
                  pointerEvents: activeIndex === i ? 'auto' : 'none'
                }}
              >
                <PremiumPlaceholder
                  title={sol.placeholder.title}
                  plano={sol.placeholder.plano}
                  requirements={sol.placeholder.requirements}
                  dimensions="1200x800 px"
                  aspectRatio="h-full w-full"
                />
              </div>
            ))}
          </div>

          {/* Footer in sticky bar */}
          <div className="relative z-10 flex justify-between items-center text-[10px] font-sans text-white/25 uppercase tracking-widest select-none">
            <span>CΛSΛ ΛTENTΛ // FICHA TÉCNICA</span>
            <span>INTEGRACIÓN 0{activeIndex + 1} DE 06</span>
          </div>

        </div>

        {/* RIGHT COLUMN: Scrolling Description Content */}
        <div className="lg:col-span-6 xl:col-span-5 px-6 md:px-12 lg:px-16 pt-16 lg:pt-28 pb-32 space-y-24 lg:space-y-40">
          
          {/* Page Intro */}
          <div className="space-y-4">
            <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block">
              CATÁLOGO DE EXPERIENCIAS
            </span>
            <h1 className="text-4xl md:text-5xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-[1.1]">
              <BrandText>Nuestras 6</BrandText> <br />
              <span className="font-light text-brand-gold"><BrandText>integraciones</BrandText></span><span className="text-brand-gold">.</span>
            </h1>
            {/* Sparkle divider */}
            <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
              <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
            </div>
            <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-md pt-2">
              Explora las áreas que Casa Atenta unifica para transformar una obra tradicional de alta gama en un ecosistema habitable orgánico, silencioso y altamente intuitivo.
            </p>
          </div>

          {/* The Solutions Sections */}
          {solutionsData.map((sol) => (
            <section
              key={sol.id}
              id={`sol-section-${sol.id}`}
              className="space-y-8 border-t border-white/[0.06] pt-12 first:border-t-0 first:pt-0"
            >
              
              {/* Mobile visualizer (Only visible on small screen) */}
              <div className="block lg:hidden w-full mb-8">
                <PremiumPlaceholder
                  title={sol.placeholder.title}
                  plano={sol.placeholder.plano}
                  requirements={sol.placeholder.requirements}
                  dimensions="1200x800 px"
                  aspectRatio="aspect-video"
                />
              </div>

              {/* Number and Title */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-[10px] font-sans tracking-widest text-brand-gold uppercase font-semibold">
                  <span>{sol.number} /</span>
                  <span>INTEGRACIÓN REGISTRADA</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-sans font-light text-brand-light uppercase tracking-[0.1em]">
                  <BrandText>{sol.title}</BrandText>
                </h2>
                <h4 className="text-xs font-sans text-brand-gold/60 uppercase tracking-widest font-medium">
                  {sol.subtitle}
                </h4>
              </div>

              {/* Body Paragraph */}
              <p className="text-xs md:text-sm font-sans font-light text-brand-light/50 leading-relaxed">
                {sol.body}
              </p>

              {/* Technical bullet points list */}
              <div className="space-y-4 pt-4">
                <h5 className="text-[10px] font-sans tracking-widest text-brand-light uppercase border-b border-white/[0.04] pb-2 font-bold">
                  ESPECIFICACIONES DE INTEGRACIÓN
                </h5>
                <ul className="space-y-3">
                  {sol.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-[11px] font-sans font-light text-brand-light/40 leading-normal">
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
