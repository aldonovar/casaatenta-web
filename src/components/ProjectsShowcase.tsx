"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    imageSrc: "/media/cases/terraza-inteligente/after.png",
    title: "Propuesta Terraza",
    location: "DISEÑO CONCEPTUAL / LIMA",
    size: "Pérgola + Escenas",
    tags: ["Pérgolas", "Luz", "Sombra"],
    aspectRatio: "aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]",
    gridSpan: "lg:col-span-4",
  },
  {
    imageSrc: "/media/cases/cocina-renovada/after.png",
    title: "Atmósfera Cocina",
    location: "DISEÑO CONCEPTUAL / LIMA",
    size: "Luz lineal + Control",
    tags: ["Cocina", "Luz", "Escenas"],
    aspectRatio: "aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]",
    gridSpan: "lg:col-span-4",
  },
  {
    imageSrc: "/media/cases/fachada-acceso/after.png",
    title: "Fachada y Acceso",
    location: "DISEÑO CONCEPTUAL / LIMA",
    size: "Seguridad + Presencia",
    tags: ["Accesos", "Cerraduras", "Seguridad"],
    aspectRatio: "aspect-[4/5] md:aspect-[3/4] lg:aspect-[4/5]",
    gridSpan: "lg:col-span-4",
  },
];

export const ProjectsShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".project-card-wrapper", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 1.0,
              ease: "power3.out",
              stagger: 0.15,
              overwrite: "auto",
            }
          ),
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 overflow-hidden bg-ca-bg-deep px-6 py-28 md:px-16 md:py-36 lg:px-28"
    >
      <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Section Title (Cinematic scale) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end mb-20">
          <div className="lg:col-span-8">
            <SectionHeading
              number="07"
              label="Propuestas"
              title="ESCENARIOS DE INTERVENCIÓN"
              subtitle="Propuestas conceptuales tridimensionales para la automatización, iluminación y habitabilidad de espacios residenciales en Lima."
            />
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link
              href="/diseno"
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-ca-text bg-ca-text px-8 py-4 text-[11px] font-mono uppercase tracking-[0.25em] text-ca-bg-deep transition-all duration-300 font-semibold hover:bg-transparent hover:text-ca-text"
            >
              <BrandText>Ver propuestas</BrandText>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                className="w-3.5 h-3.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Clean Bento Grid container */}
        <div className="relative border border-ca-border p-6 md:p-12 rounded-2xl bg-ca-bg-surface/5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 auto-rows-max">
            {projectsData.map((project) => (
              <div
                key={project.title}
                className="project-card-wrapper opacity-0 lg:col-span-4"
              >
                <ProjectCard
                  imageSrc={project.imageSrc}
                  title={project.title}
                  location={project.location}
                  size={project.size}
                  tags={project.tags}
                  aspectRatio={project.aspectRatio}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
export default ProjectsShowcase;
