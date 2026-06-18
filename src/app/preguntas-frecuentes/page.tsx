"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle } from "lucide-react";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";
import { FAQAccordion } from "@/components/FAQAccordion";
import { WHATSAPP_LINK } from "@/constants/contact";

gsap.registerPlugin(ScrollTrigger);

interface FAQCategory {
  id: string;
  number: string;
  label: string;
  title: string;
  items: { question: string; answer: string }[];
}

const faqCategories: FAQCategory[] = [
  {
    id: "servicios",
    number: "01",
    label: "Servicios",
    title: "Sobre nuestros servicios",
    items: [
      {
        question: "¿Qué servicios ofrece Casa Atenta?",
        answer:
          "Ofrecemos diseño y construcción de techos sol y sombra, pérgolas, diseño de terrazas, acabados residenciales, iluminación inteligente, automatización del hogar (smart homes) e integración de control por WhatsApp.",
      },
      {
        question: "¿Trabajan solo en Lima?",
        answer:
          "Actualmente operamos en Lima Metropolitana y zonas aledañas. Para proyectos fuera de Lima, evaluamos la viabilidad caso por caso.",
      },
      {
        question: "¿Hacen trabajos pequeños o solo proyectos grandes?",
        answer:
          "Atendemos proyectos de todos los tamaños. Desde instalar iluminación inteligente en una habitación hasta diseñar una terraza completa con automatización integrada.",
      },
      {
        question: "¿Ofrecen garantía en sus trabajos?",
        answer:
          "Sí. Ofrecemos hasta 1 año de garantía estructural en acabados y construcción. Además, incluimos plan de mantenimiento mensual para todo sistema de automatización del hogar, con soporte directo por WhatsApp.",
      },
      {
        question: "¿Pueden trabajar con mi arquitecto o diseñador?",
        answer:
          "Sí. Nos integramos fácilmente con equipos de arquitectura o diseño interior existentes. Podemos complementar el proyecto con nuestra especialidad en domótica y acabados exteriores.",
      },
    ],
  },
  {
    id: "domotica",
    number: "02",
    label: "Domótica",
    title: "Sobre casas inteligentes",
    items: [
      {
        question: "¿Qué es la domótica?",
        answer:
          "La domótica es la automatización de funciones del hogar como iluminación, seguridad, climatización y entretenimiento, controlados desde un celular, la voz o WhatsApp.",
      },
      {
        question: "¿Necesito hacer obra civil para instalar domótica?",
        answer:
          "No necesariamente. La mayoría de dispositivos inteligentes son inalámbricos y se pueden instalar sin romper paredes. Para integraciones más avanzadas puede requerirse trabajo eléctrico menor.",
      },
      {
        question: "¿La domótica funciona sin internet?",
        answer:
          "Los dispositivos básicos pueden funcionar por Bluetooth o red local. Para control remoto, escenas avanzadas y control por WhatsApp, necesitas una conexión Wi-Fi estable.",
      },
      {
        question: "¿Cómo funciona el control por WhatsApp?",
        answer:
          "Conectamos tus dispositivos inteligentes con un chatbot conversacional en WhatsApp. Envías un mensaje como 'Enciende la sala' y el sistema ejecuta la acción. Solo los números autorizados pueden enviar comandos.",
      },
      {
        question: "¿Qué marcas de dispositivos utilizan?",
        answer:
          "Trabajamos con las principales marcas del mercado: Philips Hue, LIFX, Shelly, Sonos, Amazon Alexa, Google Home, entre otras. Seleccionamos la marca según el proyecto y presupuesto.",
      },
      {
        question: "¿Puedo empezar con algo básico y expandir después?",
        answer:
          "Sí. De hecho, lo recomendamos. Puedes empezar con iluminación inteligente o un asistente de voz y agregar más dispositivos gradualmente según tus necesidades.",
      },
    ],
  },
  {
    id: "proceso",
    number: "03",
    label: "Proceso",
    title: "Sobre el proceso de trabajo",
    items: [
      {
        question: "¿Cómo empieza un proyecto con Casa Atenta?",
        answer:
          "Todo comienza con una consulta por WhatsApp o nuestro formulario. Luego agendamos una visita técnica gratuita para evaluar tu espacio, entender tus necesidades y elaborar una propuesta a medida.",
      },
      {
        question: "¿La visita técnica tiene costo?",
        answer:
          "No. La primera visita técnica de evaluación es sin costo y sin compromiso. Evaluamos tu espacio, tomamos medidas y escuchamos lo que necesitas.",
      },
      {
        question: "¿Cuánto tarda un proyecto típico?",
        answer:
          "Depende del alcance. Una instalación de iluminación inteligente puede tomar 1-2 días. Un techo sol y sombra de 1 a 3 semanas. Un proyecto integral de terraza con domótica puede tomar de 3 a 6 semanas.",
      },
      {
        question: "¿Cómo me mantienen informado durante el proyecto?",
        answer:
          "Utilizamos WhatsApp como canal principal de comunicación. Enviamos fotos de avance, resolvemos dudas en tiempo real y coordinamos cada etapa contigo.",
      },
      {
        question: "¿Qué pasa si necesito cambios durante la obra?",
        answer:
          "Entendemos que los proyectos evolucionan. Evaluamos cada cambio, te comunicamos si implica ajustes de tiempo o presupuesto, y procedemos con tu aprobación.",
      },
    ],
  },
  {
    id: "cotizacion",
    number: "04",
    label: "Cotización",
    title: "Sobre precios y presupuesto",
    items: [
      {
        question: "¿Cuánto cuesta un techo sol y sombra?",
        answer:
          "El precio varía según tamaño, material y diseño. Un proyecto estándar puede ir desde S/ 2,500 hasta S/ 15,000 o más para diseños premium con madera y acabados especiales.",
      },
      {
        question: "¿Cuánto cuesta una instalación de domótica básica?",
        answer:
          "Un kit básico de iluminación inteligente con asistente de voz puede costar desde S/ 500. Una automatización parcial de 2-3 habitaciones desde S/ 2,000. Proyectos integrales desde S/ 5,000.",
      },
      {
        question: "¿Ofrecen facilidades de pago?",
        answer:
          "Sí. Trabajamos con esquemas de pago por etapas según avance de obra. Los detalles se definen en la propuesta formal después de la visita técnica.",
      },
      {
        question: "¿La cotización tiene costo?",
        answer:
          "No. Elaboramos la propuesta y cotización sin costo. Solo necesitamos la visita técnica previa para darte números precisos y realistas.",
      },
      {
        question: "¿Por qué no publican precios fijos en la web?",
        answer:
          "Cada proyecto es único. El costo depende del tamaño del espacio, materiales elegidos, nivel de automatización y complejidad de la instalación. Preferimos darte un precio preciso y honesto después de evaluar tu caso.",
      },
    ],
  },
];

export default function PreguntasFrecuentesPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".faq-category",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: ".faq-categories",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-ca-bg-deep min-h-screen pt-36 pb-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <section className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        {/* Header */}
        <div className="mb-20">
          <SectionHeading
            number="?"
            label="FAQ"
            title="Preguntas frecuentes"
            subtitle="Resolvemos las dudas más comunes sobre domótica, automatización del hogar, terrazas inteligentes y nuestros servicios de diseño residencial en Lima."
          />
        </div>

        {/* FAQ Categories */}
        <div className="faq-categories space-y-20">
          {faqCategories.map((category) => (
            <div
              key={category.id}
              id={category.id}
              className="faq-category"
            >
              {/* Category Header */}
              <div className="mb-6">
                <span className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase block mb-2">
                  {category.number} / {category.label}
                </span>
                <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-brand-light">
                  <BrandText>{category.title}</BrandText>
                </h2>
                <div className="ca-rule mt-3" />
              </div>

              {/* Accordion */}
              <FAQAccordion items={category.items} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-24 text-center border-t border-white/[0.05] pt-16">
          <p className="text-sm font-serif italic text-brand-light/50 mb-6">
            ¿No encontraste lo que buscabas? Escríbenos directamente.
          </p>
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="ca-button inline-flex items-center gap-2"
          >
            <MessageCircle size={14} />
            <span>Preguntar por WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
}
