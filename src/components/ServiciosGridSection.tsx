"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ServiceCard {
  slug: string;
  title: string;
  description: string;
  icon: string;
  image: string;
  tags: string[];
}

const serviceCards: ServiceCard[] = [
  {
    slug: "techos-sol-y-sombra",
    title: "Techos Sol y Sombra",
    description:
      "Sombra funcional, estética arquitectónica y protección para tu terraza.",
    icon: "☀️",
    image: "/backgrounds/casestudy.png",
    tags: ["Sombra", "Cubierta", "Exterior"],
  },
  {
    slug: "diseno-terrazas",
    title: "Diseño de Terrazas",
    description:
      "Distribución, materiales, iluminación y uso para terrazas que se viven.",
    icon: "🏡",
    image: "/backgrounds/casestudy.png",
    tags: ["Distribución", "Exterior", "Mobiliario"],
  },
  {
    slug: "pergolas",
    title: "Pérgolas",
    description:
      "Estructuras que ordenan el espacio exterior con criterio arquitectónico.",
    icon: "🪵",
    image: "/backgrounds/casestudy.png",
    tags: ["Estructura", "Madera", "Aluminio"],
  },
  {
    slug: "iluminacion-inteligente",
    title: "Iluminación Inteligente",
    description:
      "Escenas, sensores y control para que cada ambiente tenga la luz correcta.",
    icon: "💡",
    image: "/backgrounds/circadian.png",
    tags: ["Escenas", "LED", "Sensores"],
  },
  {
    slug: "smart-homes",
    title: "Smart Homes",
    description:
      "Automatización por etapas para hogares más cómodos, seguros y eficientes.",
    icon: "🤖",
    image: "/backgrounds/specialties.png",
    tags: ["Domótica", "Rutinas", "Control"],
  },
  {
    slug: "automatizacion-whatsapp",
    title: "Automatización por WhatsApp",
    description:
      "Controla luces, escenas y rutinas desde la app que ya usas todos los días.",
    icon: "📱",
    image: "/backgrounds/specialties.png",
    tags: ["WhatsApp", "Chatbot", "IA"],
  },
  {
    slug: "mantenimiento-general",
    title: "Mantenimiento General",
    description:
      "Resane, pintura, carpintería y mejoras con criterio técnico y visual.",
    icon: "🔧",
    image: "/backgrounds/beforeafter.png",
    tags: ["Pintura", "Acabados", "Soporte"],
  },
];

export const ServiciosGridSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      if (gridRef.current) {
        const cards = gridRef.current.querySelectorAll(".srv-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: gridRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="ca-section relative" id="servicios">
      <div className="ca-container relative z-10">
        <div ref={headingRef} className="mb-14 text-center" style={{ opacity: 0 }}>
          <span className="ca-kicker mb-4 block">Nuestros Servicios</span>
          <h2 className="ca-heading mx-auto max-w-4xl mb-6">
            Lo que Casa Atenta puede hacer
            <br />
            <span className="font-serif italic" style={{ color: "var(--ca-gold)" }}>
              por tu hogar.
            </span>
          </h2>
          <p className="ca-body mx-auto text-center">
            Desde techos y terrazas hasta automatización inteligente. Cada
            servicio empieza con una visita técnica y termina con un espacio
            que funciona mejor.
          </p>
        </div>

        <div
          ref={gridRef}
          className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {serviceCards.map((card) => (
            <Link
              key={card.slug}
              href={`/servicios/${card.slug}`}
              className="srv-card group glass-card flex flex-col overflow-hidden rounded-xl"
              style={{ opacity: 0 }}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep/80 to-transparent" />
                <span className="absolute top-3 left-3 text-xl">{card.icon}</span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-base font-display font-medium text-ca-text mb-2 tracking-wide uppercase group-hover:text-brand-gold transition-colors duration-300">
                  {card.title}
                </h3>
                <p className="text-sm text-ca-text-secondary leading-relaxed mb-4 flex-1">
                  {card.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-ca-border px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-ca-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="flex items-center gap-1.5 text-brand-gold text-xs font-mono uppercase tracking-widest transition-all duration-300 group-hover:gap-3">
                  <span>Ver más</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
