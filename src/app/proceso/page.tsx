"use client";

import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BrandText } from '../../components/BrandText';
import { PremiumPlaceholder } from '../../components/PremiumPlaceholder';

gsap.registerPlugin(ScrollTrigger);

interface ProcessStep {
  number: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  details: string[];
  placeholder: {
    title: string;
    plano: string;
    requirements: string;
  };
}

const processStepsData: ProcessStep[] = [
  {
    number: '01',
    code: 'PH-CONS-01',
    title: 'Consulta Inicial',
    subtitle: 'Alineación de objetivos y alcances',
    description: 'Nos reunimos de manera presencial o virtual para analizar los planos iniciales de tu obra, entender tus necesidades y la filosofía del estudio de arquitectura a cargo.',
    details: [
      'Análisis preliminar de planos estructurales y de distribución.',
      'Definición de alcances (Iluminación, acústica, clima, etc.).',
      'Explicación del alcance de la integración técnica invisible.'
    ],
    placeholder: {
      title: 'PROCESO: CONSULTA INICIAL Y SESIÓN DE PLANOS',
      plano: 'Reunión de Coordinación Preliminar',
      requirements: 'Representación técnica en plano cenital de mesa de diseño arquitectónico con planos de obra de Casa Atenta extendidos, cuaderno de bocetos y muestras de materiales.'
    }
  },
  {
    number: '02',
    code: 'PH-DIAG-02',
    title: 'Diagnóstico & Ingeniería',
    subtitle: 'Planificación de la infraestructura técnica',
    description: 'Nuestros ingenieros y diseñadores volumétricos estudian las pasarelas, ductos y encofrados necesarios para disolver los componentes tecnológicos dentro de la tabiquería de yeso, concreto o piedra.',
    details: [
      'Modelado de canalizaciones bajo estándar BIM.',
      'Estudio acústico de resonancia de muros y cálculo lumínico circadiano.',
      'Especificación de marcas compatibles (Lutron, Crestron, Savant).'
    ],
    placeholder: {
      title: 'PROCESO: INGENIERÍA Y COMPATIBILIDAD BIM',
      plano: 'Isométrica de Canalizaciones Ocultas',
      requirements: 'Planificación técnica tridimensional en color dorado y gris de los ductos flexibles y mangueras embebidos dentro de las losas de concreto armado y perfiles metálicos.'
    }
  },
  {
    number: '03',
    code: 'PH-PROP-03',
    title: 'Propuesta Ejecutiva',
    subtitle: 'Presupuesto transparente y plano final',
    description: 'Te presentamos una cotización sumamente detallada, acompañada del plan maestro de ingeniería invisible y planos constructivos de juntas especiales que se entregarán al constructor.',
    details: [
      'Planos de detalles arquitectónicos de ranuras de clima e iluminación.',
      'Propuesta económica modular transparente, sin sorpresas posteriores.',
      'Aprobación final del flujo conversacional para el control por WhatsApp.'
    ],
    placeholder: {
      title: 'PROCESO: ENTREGA DE PLAN MAESTRO',
      plano: 'Lámina de Detalles Ejecutivos',
      requirements: 'Plano técnico editorial a escala con tablas de cableado y diagramas de interconexión con el rótulo corporativo premium de Casa Atenta en la base.'
    }
  },
  {
    number: '04',
    code: 'PH-WORK-04',
    title: 'Supervisión en Obra',
    subtitle: 'Coordinación directa con tu constructora',
    description: 'Durante la fase de construcción, realizamos visitas técnicas regulares para asegurar que los ductos se dejen en las posiciones exactas en el concreto y que las mallas de enlucido cubran adecuadamente los emisores acústicos.',
    details: [
      'Visitas de inspección en obra semanales por directores de proyecto.',
      'Coordinación directa con el electricista, yesero y contratista civil.',
      'Pruebas de aislamiento acústico y estructural previas al enlucido final.'
    ],
    placeholder: {
      title: 'PROCESO: SUPERVISIÓN EN OBRA GRIS Y ACABADOS',
      plano: 'Foto de Obra - Registro de Canalización',
      requirements: 'Vista a nivel de ojos de obra residencial de alta gama en proceso de acabados, mostrando las ranuras perimetrales del cielo raso y las cajas de empalme metálicas listas.'
    }
  },
  {
    number: '05',
    code: 'PH-RUN-05',
    title: 'Calibración & Marcha',
    subtitle: 'Puesta en marcha del ecosistema invisible',
    description: 'Instalamos los equipos centrales en el rack oculto, calibramos los sensores táctiles capacitivos que están bajo la piedra y programamos el algoritmo circadiano que comanda las luces según la posición del sol.',
    details: [
      'Calibración milimétrica de sensores táctiles bajo madera o travertino.',
      'Calibración acústica de transductores ocultos asistida por DSP.',
      'Pruebas finales de la pasarela conversacional de WhatsApp.'
    ],
    placeholder: {
      title: 'PROCESO: RACK CENTRAL Y PUESTA EN MARCHA',
      plano: 'Esquema de Rack y Conectividad',
      requirements: 'Plano de elevación del rack de telecomunicaciones y automatización instalado en el gabinete técnico oculto de la casa, ordenado y rotulado bajo normas técnicas.'
    }
  },
  {
    number: '06',
    code: 'PH-SUPP-06',
    title: 'Soporte Continuo',
    subtitle: 'Acompañamiento post-entrega por WhatsApp',
    description: 'Tras la entrega de la residencia, te brindamos soporte remoto constante. El sistema se actualiza de manera silenciosa por internet y cualquier ajuste de atmósferas lo coordinamos de manera directa por chat.',
    details: [
      'Monitoreo remoto preventivo y actualizaciones automáticas de firmware.',
      'Ajustes de atmósferas lumínicas y persianas directamente por chat.',
      'Garantía técnica de integración de hardware por 5 años.'
    ],
    placeholder: {
      title: 'PROCESO: SERVICIO DE MONITOREO Y SOPORTE',
      plano: 'Diagrama de Servicios de Nube Local',
      requirements: 'Esquema simplificado de soporte post-venta. El software de control local reporta anomalías preventivas cifradas al canal técnico para asistencia inmediata.'
    }
  }
];

export default function ProcesoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      // Timeline step animations
      processStepsData.forEach((step) => {
        gsap.fromTo(`#process-step-${step.number}`,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
              trigger: `#process-step-${step.number}`,
              start: 'top 80%',
              toggleActions: 'play none none reverse'
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="bg-brand-dark min-h-screen pt-36 pb-28 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Page Header */}
        <div className="mb-24 space-y-4">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase block">
            04 / NUESTRO MÉTODO DE TRABAJO
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-[1.1]">
            <BrandText>El Proceso</BrandText> <br />
            <span className="font-light text-brand-gold"><BrandText>paso a paso</BrandText></span><span className="text-brand-gold">.</span>
          </h1>
          {/* Sparkle divider */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
          <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-md pt-2">
            Desde la primera revisión de planos hasta el soporte post-entrega por chat. Así es como logramos integrar la tecnología con total invisibilidad estética.
          </p>
        </div>

        {/* Vertical Timeline Steps */}
        <div className="space-y-24 relative pl-6 md:pl-12 border-l border-white/[0.06]">
          {processStepsData.map((step) => (
            <div 
              key={step.number} 
              id={`process-step-${step.number}`}
              className="relative space-y-8"
            >
              
              {/* Timeline dot */}
              <div className="absolute -left-[31px] md:-left-[55px] top-1.5 w-4 h-4 bg-brand-dark border-2 border-brand-gold rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
              </div>

              {/* Step info block */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Content side */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="flex items-center space-x-3 text-[10px] font-sans tracking-widest text-brand-gold uppercase font-semibold">
                    <span>FASE {step.number} /</span>
                    <span>{step.code}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-sans font-light text-brand-light uppercase tracking-[0.1em]">
                    <BrandText>{step.title}</BrandText>
                  </h2>
                  <h4 className="text-xs font-sans text-brand-gold/60 uppercase tracking-widest font-medium">
                    {step.subtitle}
                  </h4>
                  <p className="text-xs md:text-sm font-sans font-light text-brand-light/50 leading-relaxed pt-2">
                    {step.description}
                  </p>
                  
                  {/* Step Bullet details */}
                  <div className="space-y-3 pt-4">
                    <h5 className="text-[10px] font-sans tracking-widest text-brand-light uppercase border-b border-white/[0.04] pb-2 font-bold">
                      ENTREGABLES Y ACCIONES CLAVE
                    </h5>
                    <ul className="space-y-2">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start space-x-3 text-[11px] font-sans font-light text-brand-light/40 leading-normal">
                          <span className="text-brand-gold mt-1">▪</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Technical visual side */}
                <div className="lg:col-span-7">
                  <PremiumPlaceholder 
                    title={step.placeholder.title}
                    plano={step.placeholder.plano}
                    requirements={step.placeholder.requirements}
                    dimensions="1000x600 px"
                    aspectRatio="aspect-[5/3]"
                  />
                </div>

              </div>

            </div>
          ))}
        </div>

        {/* CTA final de Proceso */}
        <div className="mt-32 border-t border-white/[0.06] pt-16 text-center max-w-2xl mx-auto space-y-6">
          <h3 className="text-2xl md:text-3xl font-sans font-extralight text-brand-light uppercase tracking-widest">
            ¿Tienes un proyecto en camino?
          </h3>
          {/* Sparkle divider */}
          <div className="h-[1px] w-24 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-4 mx-auto">
            <div className="absolute top-[-1px] left-4 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
          <p className="text-xs font-sans font-light text-brand-light/45 leading-relaxed">
            Involucrarnos tempranamente en la fase de anteproyecto es crucial para asegurar la total disolución de los equipos técnicos en los acabados. Consúltanos sin compromisos.
          </p>
          <div className="pt-4">
            <Link
              href="/contacto"
              className="px-8 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-400 inline-block"
            >
              <BrandText>Iniciar Consulta Gratuita</BrandText>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
