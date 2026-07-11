"use client";

import Link from "next/link";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectCard } from "./ProjectCard";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    imageSrc: "/media/cases/terraza-inteligente/after.png",
    imageAlt: "Propuesta visual de terraza con cubierta e iluminación integrada.",
    visualLabel: "PROPUESTA VISUAL",
    title: "Terraza con cubierta corrediza",
    location: "LIMA / EVALUACIÓN TÉCNICA",
    size: "Estructura + cubierta + luz",
    tags: ["Estructura", "Corredizo", "Iluminación"],
  },
  {
    imageSrc: "/media/cases/cocina-renovada/after.png",
    imageAlt: "Propuesta visual de iluminación funcional para cocina.",
    visualLabel: "PROPUESTA VISUAL",
    title: "Iluminación funcional de cocina",
    location: "LIMA / ESTUDIO LUMÍNICO",
    size: "Trabajo + ambiente + escenas",
    tags: ["Luz lineal", "Sensores", "Control"],
  },
  {
    imageSrc: "/media/cases/fachada-acceso/after.png",
    imageAlt: "Propuesta visual de acceso residencial con iluminación y control.",
    visualLabel: "PROPUESTA VISUAL",
    title: "Acceso con iluminación y control",
    location: "LIMA / PROPUESTA DE ACCESO",
    size: "Presencia + luz + seguridad",
    tags: ["Acceso", "Sensores", "Iluminación"],
  },
];

export const ProjectsShowcase: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".project-card-wrapper",
        { autoAlpha: 0, y: 42 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.14,
          scrollTrigger: {
            trigger: root,
            start: "top 72%",
            once: true,
          },
        },
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 overflow-hidden bg-ca-bg-deep px-6 py-28 md:px-16 md:py-36 lg:px-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-5 cad-technical-grid" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20 grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <SectionHeading
              number="07"
              label="Propuestas y alcance"
              title="CADA VISUAL INDICA SU ESTADO."
              subtitle="Estas imágenes comunican criterios de estructura, iluminación y uso. La solución ejecutiva se define después de medir apoyos, niveles y recorrido de instalaciones."
            />
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <Link
              href="/diseno"
              className="inline-flex min-h-14 items-center justify-center gap-3 border border-ca-text bg-ca-text px-8 py-4 text-[10px] font-mono font-semibold uppercase tracking-[0.24em] text-ca-bg-deep transition hover:bg-transparent hover:text-ca-text"
            >
              <BrandText>Revisar propuestas</BrandText>
              <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>

        <div className="rounded-[1.75rem] border border-ca-border bg-ca-bg-surface/5 p-4 md:p-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {projectsData.map((project) => (
              <div key={project.title} className="project-card-wrapper">
                <ProjectCard
                  imageSrc={project.imageSrc}
                  imageAlt={project.imageAlt}
                  visualLabel={project.visualLabel}
                  title={project.title}
                  location={project.location}
                  size={project.size}
                  tags={project.tags}
                  aspectRatio="aspect-[4/5]"
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
