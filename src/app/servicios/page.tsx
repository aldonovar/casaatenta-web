import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { servicePages, allServiceSlugs } from "@/data/services-pages";

export const metadata: Metadata = {
  title:
    "Servicios | Diseño, terrazas, pérgolas, iluminación y smart homes | Casa Atenta",
  description:
    "Conoce todos los servicios de Casa Atenta: techos sol y sombra, diseño de terrazas, pérgolas, iluminación inteligente, smart homes, automatización por WhatsApp y mantenimiento general en Lima.",
  keywords: [
    "servicios Casa Atenta",
    "diseño de terrazas Lima",
    "pérgolas Lima",
    "techos sol y sombra Lima",
    "iluminación inteligente Lima",
    "smart homes Lima",
    "automatización hogar Lima",
    "mantenimiento residencial Lima",
  ],
};

export default function ServiciosPage() {
  return (
    <div className="bg-ca-bg-deep min-h-screen pt-24 pb-32">
      {/* Background grid */}
      <div className="fixed inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <div className="relative z-10 px-6 md:px-12 lg:px-20">
        {/* ── Page Header ── */}
        <header className="ca-container space-y-5 pb-16 pt-8 md:pt-12">
          <span className="ca-kicker block">Nuestros servicios</span>
          <div className="ca-rule" />
          <h1 className="font-display text-4xl font-light uppercase leading-tight tracking-wide text-ca-text md:text-6xl lg:text-7xl max-w-4xl">
            Servicios diseñados para tu hogar
          </h1>
          <p className="ca-body">
            Cada servicio de Casa Atenta está pensado con criterio técnico,
            estético y funcional. Explora nuestras soluciones y encuentra la que
            mejor se adapta a tu espacio.
          </p>
        </header>

        {/* ── Service Grid ── */}
        <div className="ca-container grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allServiceSlugs.map((slug) => {
            const svc = servicePages[slug];
            return (
              <Link
                key={slug}
                href={`/servicios/${slug}`}
                className="glass-card group relative flex flex-col overflow-hidden rounded-sm"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={svc.hero.image}
                    alt={svc.hero.imageAlt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep/80 to-transparent" />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col justify-between gap-4 p-6 md:p-8">
                  <div className="space-y-3">
                    <span className="tech-label block">
                      {svc.hero.eyebrow}
                    </span>
                    <h2 className="font-display text-xl font-light uppercase leading-tight tracking-wide text-ca-text group-hover:text-brand-gold transition-colors duration-200 md:text-2xl">
                      {svc.seo.title.split("|")[0].trim()}
                    </h2>
                    <p className="text-sm font-light leading-relaxed text-ca-text-secondary line-clamp-3">
                      {svc.seo.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-brand-gold pt-2">
                    <span>Ver servicio</span>
                    <ArrowUpRight
                      className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
