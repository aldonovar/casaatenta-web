"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";
import { 
  MessageSquare, 
  Layers, 
  FileText, 
  Eye, 
  Sliders, 
  PhoneCall 
} from "lucide-react";
import { PremiumIconWrapper } from "@/components/icons/AnimatedIcons";

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  imageSrc: string;
  plano: string;
  requirements: string;
}

const processStepsData: ProcessStep[] = [
  {
    number: "01",
    code: "PH-CONS-01",
    title: "Consulta Inicial",
    subtitle: "Alineación de objetivos y alcances",
    description: "Nos reunimos de manera presencial o virtual para analizar los planos iniciales de tu obra, entender tus necesidades y la filosofía del estudio de arquitectura a cargo.",
    details: [
      "Análisis preliminar de planos estructurales y de distribución.",
      "Definición de alcances (Iluminación, acústica, clima, etc.).",
      "Explicación del alcance de la integración técnica invisible."
    ],
    imageSrc: "/backgrounds/manifesto.png",
    plano: "Reunión de Coordinación Preliminar",
    requirements: "Revisión técnica en plano cenital de mesa de diseño arquitectónico con planos de obra de Casa Atenta extendidos, cuadernos de bocetos y muestras de acabados."
  },
  {
    number: "02",
    code: "PH-DIAG-02",
    title: "Diagnóstico & Ingeniería",
    subtitle: "Planificación de la infraestructura técnica",
    description: "Nuestros ingenieros y diseñadores volumétricos estudian las pasarelas, ductos y encofrados necesarios para disolver los componentes tecnológicos dentro de la tabiquería de yeso, concreto o piedra.",
    details: [
      "Modelado de canalizaciones bajo estándar BIM.",
      "Estudio acústico de resonancia de muros y cálculo lumínico circadiano.",
      "Especificación de marcas compatibles (Lutron, Crestron, Savant)."
    ],
    imageSrc: "/backgrounds/casestudy.png",
    plano: "Isométrica de Canalizaciones Ocultas",
    requirements: "Planificación técnica tridimensional en color dorado y gris de los ductos flexibles y mangueras embebidos dentro de las losas de concreto armado y perfiles metálicos."
  },
  {
    number: "03",
    code: "PH-PROP-03",
    title: "Propuesta Ejecutiva",
    subtitle: "Presupuesto transparente y plano final",
    description: "Te presentamos una cotización sumamente detallada, acompañada del plan maestro de ingeniería invisible y planos constructivos de juntas especiales que se entregarán al constructor.",
    details: [
      "Planos de detalles arquitectónicos de ranuras de clima e iluminación.",
      "Propuesta económica modular transparente, sin sorpresas posteriores.",
      "Aprobación final del flujo conversacional para el control por WhatsApp."
    ],
    imageSrc: "/backgrounds/circadian.png",
    plano: "Lámina de Detalles Ejecutivos",
    requirements: "Plano técnico editorial a escala con tablas de cableado y diagramas de interconexión con el rótulo corporativo premium de Casa Atenta en la base."
  },
  {
    number: "04",
    code: "PH-WORK-04",
    title: "Supervisión en Obra",
    subtitle: "Coordinación directa con tu constructora",
    description: "Durante la fase de construcción, realizamos visitas técnicas regulares para asegurar que los ductos se dejen en las posiciones exactas en el concreto y que las mallas de enlucido cubran adecuadamente los emisores acústicos.",
    details: [
      "Visitas de inspección en obra semanales por directores de proyecto.",
      "Coordinación directa con el electricista, yesero y contratista civil.",
      "Pruebas de aislamiento acústico y estructural previas al enlucido final."
    ],
    imageSrc: "/backgrounds/beforeafter.png",
    plano: "Foto de Obra - Registro de Canalización",
    requirements: "Vista a nivel de ojos de obra residencial de alta gama en proceso de acabados, mostrando las ranuras perimetrales del cielo raso y las cajas de empalme metálicas listas."
  },
  {
    number: "05",
    code: "PH-RUN-05",
    title: "Calibración & Marcha",
    subtitle: "Puesta en marcha del ecosistema invisible",
    description: "Instalamos los equipos centrales en el rack oculto, calibramos los sensores táctiles capacitivos que están bajo la piedra y programamos el algoritmo circadiano que comanda las luces según la posición del sol.",
    details: [
      "Calibración milimétrica de sensores táctiles bajo madera o travertino.",
      "Calibración acústica de transductores ocultos asistida por DSP.",
      "Pruebas finales de la pasarela conversacional de WhatsApp."
    ],
    imageSrc: "/backgrounds/cta.png",
    plano: "Esquema de Rack y Conectividad",
    requirements: "Plano de elevación del rack de telecomunicaciones y automatización instalado en el gabinete técnico oculto de la casa, ordenado y rotulado bajo normas técnicas."
  },
  {
    number: "06",
    code: "PH-SUPP-06",
    title: "Soporte Continuo",
    subtitle: "Acompañamiento post-entrega por WhatsApp",
    description: "Tras la entrega de la residencia, te brindamos soporte remoto constante. El sistema se actualiza de manera silenciosa por internet y cualquier ajuste de atmósferas lo coordinamos de manera directa por chat.",
    details: [
      "Monitoreo remoto preventivo y actualizaciones automáticas de firmware.",
      "Ajustes de atmósferas lumínicas y persianas directamente por chat.",
      "Garantía técnica de integración de hardware por 5 años."
    ],
    imageSrc: "/backgrounds/specialties.png",
    plano: "Diagrama de Servicios de Nube Local",
    requirements: "Esquema simplificado de soporte post-venta. El software de control local reporta anomalías preventivas cifradas al canal técnico para asistencia inmediata."
  }
];

const stepIcons = [
  MessageSquare,
  Layers,
  FileText,
  Eye,
  Sliders,
  PhoneCall
];

export default function ProcesoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const container = containerRef.current;
    const timeline = timelineRef.current;
    const line = lineRef.current;
    if (!container || !timeline || !line) return;

    const ctx = gsap.context(() => {
      // Calculate length of the path dynamically
      const pathLength = line.getTotalLength();
      
      // Set initial path state
      gsap.set(line, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Scrub the vertical path drawing based on container scroll progress
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: timeline,
          start: "top 30%",
          end: "bottom 75%",
          scrub: 0.3,
        },
      });

      // Timeline step animations
      processStepsData.forEach((step, idx) => {
        const stepElement = document.getElementById(`process-step-${step.number}`);
        if (!stepElement) return;

        const node = stepElement.querySelector(".timeline-node");
        const card = stepElement.querySelector(".step-card-container");
        const visual = stepElement.querySelector(".step-visual-container");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: stepElement,
            start: "top 70%",
            toggleActions: "play none none reverse",
          },
        });

        if (node) {
          tl.to(node, {
            backgroundColor: "var(--color-brand-gold)",
            borderColor: "var(--color-brand-gold)",
            scale: 1.15,
            duration: 0.4,
            ease: "back.out(1.7)",
          })
          .to(node.querySelector("svg"), {
            color: "var(--ca-bg-deep)",
            duration: 0.4,
          }, "-=0.4");
        }

        if (card) {
          tl.fromTo(
            card,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
            "-=0.2"
          );
        }

        if (visual) {
          tl.fromTo(
            visual,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.6, ease: "power3.out" },
            "-=0.5"
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-ca-bg-deep min-h-screen pt-36 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Page Header */}
        <div className="mb-24 space-y-4">
          <SectionHeading
            number="04"
            label="Metodología"
            title="EL PROCESO PASO A PASO"
            subtitle="Desde la primera revisión de planos estructurales hasta el soporte post-entrega directo por chat. Así es como logramos integrar la tecnología sin impactar el diseño visual."
          />
        </div>

        {/* Vertical Timeline Container */}
        <div ref={timelineRef} className="relative pl-8 md:pl-16 mt-20">
          
          {/* Vertical drawing SVG line */}
          <div className="absolute left-0 top-2 bottom-0 w-[2px] z-0 h-[92%]">
            <svg className="w-full h-full" viewBox="0 0 2 1000" preserveAspectRatio="none">
              {/* Background Track */}
              <line x1="1" y1="0" x2="1" y2="1000" stroke="var(--ca-border)" strokeWidth="2" />
              {/* Active Path */}
              <path
                ref={lineRef}
                d="M 1 0 L 1 1000"
                stroke="var(--color-brand-gold)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Steps List */}
          <div className="space-y-32">
            {processStepsData.map((step, index) => {
              const IconComponent = stepIcons[index] || MessageSquare;
              return (
                <div
                  key={step.number}
                  id={`process-step-${step.number}`}
                  className="relative space-y-8"
                >
                  {/* Timeline dot with icon */}
                  <PremiumIconWrapper className="timeline-node absolute left-0 top-1.5 -translate-x-1/2 z-10 flex h-9 w-9 items-center justify-center !rounded-full !p-0">
                    <IconComponent className="h-4.5 w-4.5 text-brand-gold transition-colors duration-300" />
                  </PremiumIconWrapper>

                  {/* Step info block */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Content side with CAD technical framing */}
                    <div className="step-card-container lg:col-span-5 space-y-4 opacity-0 border border-ca-border p-6 rounded-lg bg-ca-bg-surface/5 relative">
                      {/* CAD corner crosshairs */}
                      <span className="absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%] text-[8px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
                      <span className="absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] text-[8px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
                      <span className="absolute bottom-0 left-0 translate-x-[-50%] translate-y-[50%] text-[8px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
                      <span className="absolute bottom-0 right-0 translate-x-[50%] translate-y-[50%] text-[8px] font-mono text-brand-gold/35 pointer-events-none select-none">+</span>
                      
                      <div className="flex items-center space-x-3 text-[10px] font-mono tracking-widest text-brand-gold uppercase font-semibold">
                        <span>FASE {step.number} /</span>
                        <span>{step.code}</span>
                      </div>
                      <h2 className="text-2xl md:text-3.5xl font-display font-light text-ca-text uppercase tracking-wide">
                        <BrandText>{step.title}</BrandText>
                      </h2>
                      <h4 className="text-xs font-mono text-brand-gold/60 uppercase tracking-widest font-semibold">
                        {step.subtitle}
                      </h4>
                      <p className="text-sm font-light leading-relaxed text-ca-text-secondary pt-2">
                        {step.description}
                      </p>
                      
                      {/* Step Bullet details */}
                      <div className="space-y-3 pt-4">
                        <h5 className="text-[10px] font-mono tracking-widest text-ca-text uppercase border-b border-ca-border pb-2 font-semibold">
                          Entregables y acciones clave
                        </h5>
                        <ul className="space-y-2.5">
                          {step.details.map((detail, idx) => (
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
                    </div>

                    {/* Technical visual side with CAD framing */}
                    <div className="step-visual-container lg:col-span-7 group opacity-0">
                      <div className="relative aspect-[5/3] w-full rounded-lg overflow-hidden border border-ca-border shadow-xl bg-ca-bg-surface select-none">
                        {/* CAD corner crosshairs */}
                        <span className="absolute top-0 left-0 translate-x-[-50%] translate-y-[-50%] text-[8px] font-mono text-brand-gold/35 z-10 pointer-events-none select-none">+</span>
                        <span className="absolute top-0 right-0 translate-x-[50%] translate-y-[-50%] text-[8px] font-mono text-brand-gold/35 z-10 pointer-events-none select-none">+</span>
                        <span className="absolute bottom-0 left-0 translate-x-[-50%] translate-y-[50%] text-[8px] font-mono text-brand-gold/35 z-10 pointer-events-none select-none">+</span>
                        <span className="absolute bottom-0 right-0 translate-x-[50%] translate-y-[50%] text-[8px] font-mono text-brand-gold/35 z-10 pointer-events-none select-none">+</span>

                        <div
                          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                          style={{ backgroundImage: `url(${step.imageSrc})` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-transparent to-transparent opacity-40" />
                      </div>
                      <div className="mt-3 p-3 rounded border border-ca-border bg-ca-bg-surface/50">
                        <span className="text-[9px] font-mono text-brand-gold tracking-widest uppercase mb-1 block">
                          {step.plano}
                        </span>
                        <p className="text-[10px] font-sans text-ca-text-secondary leading-relaxed font-light">
                          {step.requirements}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA final */}
        <div className="mt-32 border-t border-ca-border pt-16 text-center max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3.5xl font-display font-light text-ca-text uppercase tracking-wide">
            ¿Tienes un proyecto en camino?
          </h3>
          <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-4 mx-auto" />
          <p className="text-sm font-light leading-relaxed text-ca-text-secondary">
            Involucrarnos tempranamente en la fase de anteproyecto es crucial para asegurar la total disolución de los equipos técnicos en los acabados. Consúltanos sin compromiso.
          </p>
          <div className="pt-6">
            <Link
              href="/contacto"
              className="glow-btn px-8 py-3.5 text-[10px] font-mono tracking-widest uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-400 inline-block font-semibold"
            >
              <BrandText>Iniciar consulta técnica</BrandText>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
