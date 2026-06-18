"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { servicesData, homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";
import { WHATSAPP_LINK } from "@/constants/contact";

gsap.registerPlugin(ScrollTrigger);

export const ServicesGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollSection = scrollSectionRef.current;
    if (!container || !scrollSection) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray(".service-panel");
      const totalPanels = panels.length;

      // Pin and horizontally scroll the panels
      gsap.to(scrollSection, {
        xPercent: -100 * (totalPanels - 1),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollSection.offsetWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Animate progress scale
      gsap.fromTo(
        ".services-progress-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${scrollSection.offsetWidth}`,
            scrub: 1,
          },
        }
      );
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.set(scrollSection, { xPercent: 0 });
    });

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} id="servicios" className="relative w-full bg-ca-bg-surface border-t border-ca-border">
      {/* Title block */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-16 lg:px-28">
        <SectionHeading
          number="04"
          label={homeCopy.services.label}
          title={homeCopy.services.title}
          subtitle={homeCopy.services.subtitle}
        />
      </div>

      {/* Horizontal scroll section */}
      <div className="relative w-full overflow-hidden">
        <div
          ref={scrollSectionRef}
          className="flex flex-col lg:flex-row w-full lg:w-[500vw] h-auto lg:h-[80vh]"
        >
          {servicesData.map((service, index) => (
            <div
              key={service.id}
              className="service-panel w-full lg:w-[100vw] h-auto lg:h-full flex flex-col lg:flex-row items-center px-6 md:px-16 lg:px-28 py-16 lg:py-0 gap-12 lg:gap-20 border-b lg:border-b-0 border-ca-border"
            >
              {/* Massive Atmospheric Image Frame */}
              <div className="w-full lg:w-7/12 h-[45vh] lg:h-[85%] relative overflow-hidden border border-ca-border rounded-xl shadow-2xl group bg-ca-bg-deep select-none">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103 opacity-40 group-hover:opacity-15"
                  style={{ backgroundImage: `url(${service.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/20 to-transparent" />
                
                {/* Large minimal line work overlays */}
                {index === 0 && (
                  <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full stroke-ca-text/30 fill-none p-12 opacity-60">
                    <circle cx="200" cy="150" r="90" strokeWidth="0.5" strokeDasharray="4 4" />
                    <circle cx="200" cy="150" r="60" strokeWidth="0.5" />
                    <circle cx="200" cy="150" r="30" strokeWidth="0.75" />
                  </svg>
                )}
                {index === 1 && (
                  <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full stroke-ca-text/30 fill-none p-12 opacity-60">
                    <rect x="50" y="50" width="300" height="200" strokeWidth="0.5" strokeDasharray="6 6" />
                    <line x1="100" y1="50" x2="100" y2="250" strokeWidth="0.5" />
                    <line x1="200" y1="50" x2="200" y2="250" strokeWidth="0.5" />
                    <line x1="300" y1="50" x2="300" y2="250" strokeWidth="0.5" />
                  </svg>
                )}
                {index === 2 && (
                  <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full stroke-ca-text/30 fill-none p-12 opacity-60">
                    <path d="M 100 220 L 200 80 L 300 220" strokeWidth="0.75" />
                    <line x1="100" y1="220" x2="300" y2="220" strokeWidth="0.5" strokeDasharray="3 3" />
                    <circle cx="200" cy="80" r="4" fill="var(--color-brand-gold)" />
                  </svg>
                )}
                {index === 3 && (
                  <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full stroke-ca-text/30 fill-none p-12 opacity-60">
                    <line x1="50" y1="150" x2="350" y2="150" strokeWidth="0.5" />
                    <path d="M 120 150 L 200 70 L 280 150" strokeWidth="0.5" />
                    <rect x="180" y="150" width="40" height="60" strokeWidth="0.5" strokeDasharray="2 2" />
                  </svg>
                )}
                {index === 4 && (
                  <svg viewBox="0 0 400 300" className="absolute inset-0 w-full h-full stroke-ca-text/30 fill-none p-12 opacity-60">
                    <circle cx="200" cy="150" r="10" fill="var(--color-brand-gold)" />
                    <path d="M 150 150 A 50 50 0 0 1 250 150" strokeWidth="0.5" strokeDasharray="3 3" />
                    <path d="M 120 150 A 80 80 0 0 1 280 150" strokeWidth="0.5" />
                    <path d="M 90 150 A 110 110 0 0 1 310 150" strokeWidth="0.5" strokeDasharray="3 3" />
                  </svg>
                )}

                <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-widest bg-ca-bg-deep/85 px-4 py-2 rounded border border-ca-border uppercase">
                  <span>SERVICIOS // 0{index + 1}</span>
                </div>
              </div>

              {/* Large scale Content Side */}
              <div className="w-full lg:w-5/12 flex flex-col justify-center items-start space-y-8">
                <div className="flex items-center justify-between w-full border-b border-ca-border/40 pb-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-ca-text/60">
                    Casa Atenta // {service.title}
                  </span>
                  <span className="text-xs font-mono text-ca-text/30">
                    0{index + 1} / 05
                  </span>
                </div>

                <h3 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wide text-ca-text">
                  <BrandText>{service.title}</BrandText>
                </h3>

                <p className="text-sm md:text-base font-light leading-relaxed text-ca-text-secondary/90">
                  {service.text}
                </p>

                {/* Features List */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full pt-2">
                  {service.includes.map((bullet) => (
                    <li
                      key={bullet}
                      className="flex items-center gap-3 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-ca-text/80"
                    >
                      <span className="h-2 w-2 rounded-full bg-ca-text" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={service.href || WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 text-[11px] font-mono uppercase tracking-[0.25em] text-ca-text border-b border-ca-text/30 pb-1 pt-4 transition-all duration-300 hover:border-ca-text"
                >
                  <BrandText>{service.cta || "Saber Más"}</BrandText>
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
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Bar (Desktop only) */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-ca-border/20 z-20 hidden lg:block">
        <div className="services-progress-bar absolute left-0 top-0 h-full w-full bg-ca-text origin-left scale-x-[0.20]" />
      </div>
    </div>
  );
};

export default ServicesGallery;
