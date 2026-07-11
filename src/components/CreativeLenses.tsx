"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeCopy, lenses } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const CreativeLenses: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".lens-card",
        { autoAlpha: 0, y: 34 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
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
      id="creative-lenses"
      className="relative z-20 overflow-hidden border-t border-ca-border bg-ca-bg-surface px-6 py-28 md:px-16 md:py-36 lg:px-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-5 architectural-grid" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20">
          <SectionHeading
            number="03"
            label={homeCopy.lenses.label}
            title={homeCopy.lenses.title}
            subtitle={homeCopy.lenses.subtitle}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {lenses.map((lens, index) => (
            <article
              key={lens.title}
              className="lens-card group relative aspect-[3/4] overflow-hidden rounded-2xl border border-ca-border/50 bg-ca-bg-deep"
            >
              <Image
                src={lens.image}
                alt={lens.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                className="object-cover opacity-45 transition duration-700 ease-out group-hover:scale-[1.035] group-hover:opacity-68"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/30 to-transparent" />
              <div className="pointer-events-none absolute inset-4 border border-white/[0.04]">
                <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-brand-gold/50" />
                <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-brand-gold/50" />
              </div>

              <span className="absolute left-5 top-5 z-10 border border-white/10 bg-ca-bg-deep/80 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
                {lens.visualLabel}
              </span>

              <div className="absolute inset-x-0 bottom-0 z-10 p-6">
                <span className="mb-3 block text-[9px] font-mono uppercase tracking-[0.28em] text-brand-gold">
                  ESCALA 0{index + 1}
                </span>
                <h3 className="text-lg font-display font-light uppercase tracking-[0.08em] text-ca-text md:text-xl">
                  <BrandText>{lens.title}</BrandText>
                </h3>
                <div className="my-4 h-px w-12 bg-ca-text/25 transition-all duration-500 group-hover:w-full" />
                <p className="max-w-xs text-xs font-light leading-relaxed text-ca-text-secondary">
                  {lens.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreativeLenses;
