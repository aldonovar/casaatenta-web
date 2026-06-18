"use client";

import React from "react";
import { homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

export const AboutSection: React.FC = () => {
  return (
    <section
      id="nosotros-summary"
      className="relative z-20 overflow-hidden bg-ca-bg-primary px-6 py-28 md:px-16 md:py-36 lg:px-28 border-t border-ca-border"
    >
      <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        
        {/* Left column: display quotes */}
        <div className="lg:col-span-5 space-y-6">
          <SectionHeading
            number="08"
            label={homeCopy.about.label}
            title="FUNDADORES"
          />

          <div className="h-[1.5px] w-24 bg-brand-gold/40 my-6" />

          <blockquote className="text-2xl md:text-3xl font-serif italic text-brand-light/95 leading-relaxed">
            "El lujo contemporáneo no está en llenar los muros de gadgets, sino en hacerlos desaparecer en la arquitectura."
          </blockquote>
        </div>

        {/* Right column: detailed description */}
        <div className="lg:col-span-7 space-y-8">
          <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-widest text-brand-gold">
            <BrandText>{homeCopy.about.title}</BrandText>
          </h3>

          <p className="text-base md:text-lg font-light leading-relaxed text-ca-text-secondary/90">
            {homeCopy.about.subtitle}
          </p>

          <p className="text-sm font-sans font-light text-ca-text-muted leading-relaxed max-w-xl">
            "Trabajamos de la mano con tu arquitecto, constructora o directamente contigo. Nos involucramos desde los planos para que todo — iluminación, automatización, terrazas y cableado — quede resuelto antes de los acabados finales. Sin sorpresas."
          </p>

          {/* Social media presence links */}
          <div className="pt-4 flex flex-wrap gap-6 text-[10px] font-mono tracking-widest uppercase">
            <a
              href="https://www.instagram.com/casaatenta/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-light/60 hover:text-brand-gold transition-colors border-b border-transparent hover:border-brand-gold pb-1"
            >
              Instagram
            </a>
            <a
              href="https://www.tiktok.com/@casaatenta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-light/60 hover:text-brand-gold transition-colors border-b border-transparent hover:border-brand-gold pb-1"
            >
              TikTok
            </a>
            <a
              href="https://www.facebook.com/casaatenta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-light/60 hover:text-brand-gold transition-colors border-b border-transparent hover:border-brand-gold pb-1"
            >
              Facebook
            </a>
            <a
              href="https://www.linkedin.com/company/casaatenta"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-light/60 hover:text-brand-gold transition-colors border-b border-transparent hover:border-brand-gold pb-1"
            >
              LinkedIn
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutSection;
