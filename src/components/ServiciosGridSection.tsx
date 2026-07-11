import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ServiceCard {
  slug: string;
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  visualLabel: string;
  details: string[];
  featured?: boolean;
}

const serviceCards: ServiceCard[] = [
  {
    slug: "techos-sol-y-sombra",
    title: "Techos Sol y Sombra",
    description:
      "Estructura a medida, cubierta fija o corrediza y accionamiento manual o motorizado según el espacio.",
    image: "/media/cinematic-walk/terraza-02.png",
    imageAlt: "Propuesta visual de terraza con estructura y cubierta Sol y Sombra.",
    visualLabel: "PROPUESTA VISUAL",
    details: ["Cubierta fija", "Corredizo por polea", "Gancho o motor", "Iluminación integrada"],
    featured: true,
  },
  {
    slug: "diseno-terrazas",
    title: "Diseño de terrazas",
    description:
      "Levantamiento, distribución, apoyos, recorrido solar y definición de materiales antes de fabricar.",
    image: "/media/creative-lenses/plano-cenital-01.png",
    imageAlt: "Vista cenital conceptual de una propuesta para terraza.",
    visualLabel: "PROPUESTA VISUAL",
    details: ["Medición", "Distribución", "Estructura", "Acabados"],
  },
  {
    slug: "iluminacion-inteligente",
    title: "Iluminación inteligente",
    description:
      "Puntos de luz, encendidos por zonas, regulación y sensores coordinados con la estructura y el uso.",
    image: "/media/cinematic-walk/luz-03.png",
    imageAlt: "Propuesta visual de iluminación cálida integrada en un espacio residencial.",
    visualLabel: "PROPUESTA VISUAL",
    details: ["Puntos de luz", "Regulación", "Sensores", "Escenas"],
  },
  {
    slug: "smart-homes",
    title: "Smart Homes",
    description:
      "Automatización por etapas para iluminación, accesos, sensores y rutinas sobre una red estable.",
    image: "/media/creative-lenses/half-render-reality-01.png",
    imageAlt: "Composición conceptual de automatización residencial.",
    visualLabel: "COMPOSICIÓN CONCEPTUAL",
    details: ["Escenas", "Sensores", "Accesos", "Control compatible"],
  },
  {
    slug: "mantenimiento-general",
    title: "Mantenimiento y acabados",
    description:
      "Correcciones en pintura, metal, madera y superficies con atención a alineación, unión y remate.",
    image: "/media/creative-lenses/material-encuentro-01.png",
    imageAlt: "Referencia visual de materiales y encuentros de acabado.",
    visualLabel: "REFERENCIA DE MATERIAL",
    details: ["Pintura", "Metal", "Madera", "Correcciones"],
  },
];

export const ServiciosGridSection: React.FC = () => {
  return (
    <section id="servicios" className="relative border-t border-ca-border bg-ca-bg-surface px-6 py-24 md:px-16 md:py-32 lg:px-28">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-8 border-b border-ca-border/60 pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="mb-5 block text-[10px] font-mono uppercase tracking-[0.28em] text-brand-gold">
              SERVICIOS / LIMA
            </span>
            <h2 className="max-w-4xl text-4xl font-display font-light uppercase leading-[1.02] tracking-[0.04em] text-ca-text md:text-6xl">
              Estructura, cubierta, luz y control.
            </h2>
          </div>
          <p className="max-w-xl text-sm font-light leading-relaxed text-ca-text-secondary lg:col-span-4">
            Cada intervención comienza con medidas, apoyos y uso real. La solución se define según la casa, el recorrido solar y el nivel de apertura necesario.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-6">
          {serviceCards.map((card) => (
            <Link
              key={card.slug}
              href={`/servicios/${card.slug}`}
              className={`group relative min-h-[480px] overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-deep ${card.featured ? "lg:col-span-4" : "lg:col-span-2"}`}
            >
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes={card.featured ? "(max-width: 1024px) 100vw, 66vw" : "(max-width: 1024px) 100vw, 33vw"}
                className="object-cover opacity-52 transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-62"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/45 to-ca-bg-deep/5" />

              <span className="absolute left-5 top-5 z-10 border border-white/10 bg-ca-bg-deep/82 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
                {card.visualLabel}
              </span>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6 md:p-8">
                <h3 className="max-w-2xl text-2xl font-display font-light uppercase tracking-[0.05em] text-ca-text md:text-3xl">
                  {card.title}
                </h3>
                <p className="mt-4 max-w-xl text-sm font-light leading-relaxed text-ca-text-secondary">
                  {card.description}
                </p>

                <ul className="mt-6 flex flex-wrap gap-2">
                  {card.details.map((detail) => (
                    <li key={detail} className="border border-white/10 bg-ca-bg-deep/55 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.14em] text-ca-text/80">
                      {detail}
                    </li>
                  ))}
                </ul>

                <div className="mt-7 flex items-center justify-between border-t border-ca-border/50 pt-5 text-[9px] font-mono uppercase tracking-[0.2em] text-brand-gold">
                  <span>Revisar alcance</span>
                  <span aria-hidden="true">↗</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
