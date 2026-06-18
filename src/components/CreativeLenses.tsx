"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { lenses, homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const CreativeLenses: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Reveal the grid items
      ScrollTrigger.batch(".lens-card", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "power2.out",
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
      id="creative-lenses"
      className="relative z-20 overflow-hidden bg-ca-bg-surface px-6 py-28 md:px-16 md:py-36 lg:px-28 border-t border-ca-border"
    >
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20">
          <SectionHeading
            number="03"
            label={homeCopy.lenses.label}
            title={homeCopy.lenses.title}
            subtitle={homeCopy.lenses.subtitle}
          />
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {lenses.map((lens, i) => (
            <div
              key={lens.title}
              className="lens-card group relative aspect-[3/4] overflow-hidden border border-ca-border/40 rounded-xl bg-ca-bg-deep cursor-pointer select-none"
            >
              {/* Background cover image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103 opacity-40 group-hover:opacity-65"
                style={{ backgroundImage: `url(${lens.image})` }}
              />
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep/90 via-ca-bg-deep/30 to-transparent" />
              
              {/* Coordinate CAD overlay visible on hover */}
              <div className="absolute inset-4 border border-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-brand-gold/50" />
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-brand-gold/50" />
                <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-brand-gold/50" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-brand-gold/50" />
                
                {/* Tech coordinates label */}
                <span className="absolute bottom-2 left-2 font-mono text-[7px] text-brand-gold/70 tracking-widest">
                  SYS-LENS-0{i+1} // LAT_ZOOM
                </span>
              </div>

              {/* Text info */}
              <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end h-full z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className="text-[9px] font-mono text-brand-gold uppercase tracking-[0.25em] mb-2 block">
                  LENTE 0{i + 1}
                </span>
                
                <h4 className="text-lg md:text-xl font-display font-light uppercase tracking-wider text-ca-text">
                  <BrandText>{lens.title}</BrandText>
                </h4>
                
                <div className="h-[1px] w-12 bg-ca-text/20 my-3 group-hover:w-full transition-all duration-500" />
                
                <p className="text-[11px] font-sans font-light text-ca-text-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-relaxed">
                  {lens.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CreativeLenses;
