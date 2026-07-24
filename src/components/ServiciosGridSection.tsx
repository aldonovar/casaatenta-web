import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import { BrandText } from "./BrandText";
import { ServiceMotionGraphics } from "./ServiceMotionGraphics";
import {
  IluminacionIcon,
  MantenimientoIcon,
  SmartHomeIcon,
  TechosIcon,
  TerrazasIcon,
} from "./icons/AnimatedIcons";

type Icon = ComponentType<{ className?: string; size?: number }>;

type Card = {
  slug: string;
  title: string;
  text: string;
  image: string;
  label: string;
  items: string[];
  Icon: Icon;
  wide?: boolean;
};

const cards: Card[] = [
  {
    slug: "smart-homes",
    title: "Automatización del hogar",
    text: "Iluminación, sensores, accesos y rutinas coordinados por zonas, según compatibilidad e infraestructura disponible.",
    image: "/media/creative-lenses/half-render-reality-01.png",
    label: "SERVICIO PRINCIPAL",
    items: ["Escenas", "Sensores", "Accesos", "Control"],
    Icon: SmartHomeIcon,
    wide: true,
  },
  {
    slug: "iluminacion-inteligente",
    title: "Iluminación inteligente",
    text: "Puntos, regulación, sensores y encendidos coordinados con cada uso.",
    image: "/media/cinematic-walk/luz-03.png",
    label: "PROPUESTA VISUAL",
    items: ["Puntos", "Regulación", "Sensores", "Escenas"],
    Icon: IluminacionIcon,
  },
  {
    slug: "techos-sol-y-sombra",
    title: "Techos Sol y Sombra",
    text: "Estructura a medida, cubierta fija o corrediza y accionamiento manual o motorizado.",
    image: "/media/cinematic-walk/terraza-02.png",
    label: "PROPUESTA VISUAL",
    items: ["Cubierta fija", "Polea o gancho", "Motor", "Luz integrada"],
    Icon: TechosIcon,
  },
  {
    slug: "diseno-terrazas",
    title: "Diseño de terrazas",
    text: "Medidas, apoyos, recorrido solar, distribución y definición de materiales.",
    image: "/media/creative-lenses/plano-cenital-01.png",
    label: "PROPUESTA VISUAL",
    items: ["Medición", "Distribución", "Estructura", "Acabados"],
    Icon: TerrazasIcon,
  },
  {
    slug: "mantenimiento-general",
    title: "Mantenimiento y acabados",
    text: "Correcciones en pintura, metal, madera y superficies visibles.",
    image: "/media/creative-lenses/material-encuentro-01.png",
    label: "REFERENCIA DE MATERIAL",
    items: ["Pintura", "Metal", "Madera", "Remates"],
    Icon: MantenimientoIcon,
  },
];

export function ServiciosGridSection() {
  return (
    <section
      id="servicios"
      className="relative border-t border-ca-border bg-ca-bg-surface/80 px-6 py-24 text-ca-text backdrop-blur-xl lg:px-10"
    >
      <div className="architectural-grid absolute inset-0 opacity-[0.05]" />
      <div className="relative mx-auto max-w-[1440px]">
        <div className="mb-14 grid gap-8 border-b border-ca-border pb-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-gold">
              Servicios / sistemas interactivos
            </span>
            <h2 className="mt-5 font-display text-4xl font-light uppercase leading-[1.02] md:text-6xl">
              <BrandText>
                Tu hogar responde desde un sistema coordinado.
              </BrandText>
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-ca-text-secondary lg:col-span-4">
            Explora el comportamiento de cada sistema. Dentro de cada servicio
            encontrarás una experiencia scrollable con sus decisiones y
            subservicios.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-6">
          {cards.map(
            ({
              slug,
              title,
              text,
              image,
              label,
              items,
              Icon,
              wide = false,
            }) => (
              <Link
                key={slug}
                href={`/servicios/${slug}`}
                className={`glass-card group relative min-h-[660px] overflow-hidden ${
                  wide ? "lg:col-span-4" : "lg:col-span-2"
                }`}
              >
                <Image
                  src={image}
                  alt={`${label.toLowerCase()} de ${title.toLowerCase()}`}
                  fill
                  sizes={
                    wide
                      ? "(max-width:1024px) 100vw,66vw"
                      : "(max-width:1024px) 100vw,33vw"
                  }
                  className="object-cover opacity-[0.18] transition duration-700 group-hover:scale-[1.03] group-hover:opacity-[0.28]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/72 to-ca-bg-deep/32" />

                <div className="absolute inset-x-4 top-20 z-[5] flex h-[300px] items-center justify-center sm:inset-x-8">
                  <ServiceMotionGraphics
                    slug={slug}
                    decorative
                    className={`max-w-[360px] scale-[0.94] border-white/[0.07] bg-ca-bg-deep/35 transition duration-700 group-hover:scale-100 group-hover:border-brand-gold/25 ${
                      wide ? "sm:max-w-[440px]" : ""
                    }`}
                  />
                </div>

                <div className="absolute left-5 top-5 z-10 flex items-center gap-3">
                  <span
                    className={`border px-3 py-2 font-mono text-[8px] uppercase tracking-[0.18em] backdrop-blur-md ${
                      wide
                        ? "border-brand-gold/45 bg-brand-gold/10 text-brand-gold"
                        : "border-ca-border bg-ca-bg-deep/82"
                    }`}
                  >
                    {label}
                  </span>
                  <span className="grid h-11 w-11 place-items-center border border-brand-gold/25 bg-ca-bg-deep/82 text-brand-gold backdrop-blur-md">
                    <Icon size={25} />
                  </span>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/95 to-transparent p-6 pt-24 md:p-8 md:pt-24">
                  <h3 className="font-display text-2xl font-light uppercase md:text-3xl">
                    <BrandText>{title}</BrandText>
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-ca-text-secondary">
                    {text}
                  </p>
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="border border-ca-border bg-ca-bg-deep/55 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.14em]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-7 flex items-center justify-between border-t border-ca-border pt-5 font-mono text-[9px] uppercase tracking-[0.2em] text-brand-gold">
                    <span>
                      {wide ? "Explorar sistema" : "Ver motion study"}
                    </span>
                    <span aria-hidden="true">↗</span>
                  </div>
                </div>
              </Link>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default ServiciosGridSection;
