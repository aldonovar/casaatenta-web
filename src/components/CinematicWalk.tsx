"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { walkSteps, homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const CinematicWalk: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scrollSection = scrollSectionRef.current;
    if (!container || !scrollSection) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray(".walk-panel");
      const totalPanels = panels.length;

      // Pin the section and scroll the panels horizontally
      const mainAnim = gsap.to(scrollSection, {
        xPercent: -100 * (totalPanels - 1),
        ease: "none",
        scrollTrigger: {
          id: "horizontal-scroll",
          trigger: container,
          pin: true,
          scrub: 1,
          start: "top top",
          end: () => `+=${scrollSection.offsetWidth}`,
          invalidateOnRefresh: true,
        },
      });

      // Stagger reveal text inside each active panel
      panels.forEach((panel: any) => {
        const title = panel.querySelector(".walk-title");
        const desc = panel.querySelector(".walk-desc");
        const img = panel.querySelector(".walk-img");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: mainAnim,
            start: "left 70%",
            toggleActions: "play none none reverse",
          }
        });

        if (title) {
          tl.fromTo(title,
            { opacity: 0, x: 40 },
            { opacity: 1, x: 0, duration: 0.8, ease: "power2.out" }
          );
        }

        if (desc) {
          tl.fromTo(desc,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
            "-=0.4"
          );
        }

        // Parallax image movement inside its frame
        if (img) {
          gsap.fromTo(
            img,
            { scale: 1.15, xPercent: -5 },
            {
              scale: 1,
              xPercent: 5,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            }
          );
        }
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="cinematic-walk"
      className="relative w-full bg-ca-bg-deep border-t border-ca-border overflow-hidden"
    >
      {/* Background CAD grid */}
      <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

      {/* Chapter header */}
      <div className="mx-auto max-w-7xl px-6 pt-32 pb-16 md:px-16 lg:px-28 relative z-10">
        <SectionHeading
          number="02"
          label={homeCopy.walk.label}
          title={homeCopy.walk.title}
          subtitle={homeCopy.walk.subtitle}
        />
      </div>

      {/* Horizontal / Vertical Panels container */}
      <div className="relative w-full">
        <div
          ref={scrollSectionRef}
          className="flex flex-col lg:flex-row w-full lg:w-[400vw] h-auto lg:h-[75vh]"
        >
          {walkSteps.map((step, index) => (
            <div
              key={step.number}
              className="walk-panel w-full lg:w-[100vw] h-auto lg:h-full flex flex-col lg:flex-row items-center px-6 md:px-16 lg:px-28 py-12 lg:py-0 gap-10 lg:gap-16 border-b lg:border-b-0 border-ca-border/40"
            >
              {/* Photo frame */}
              <div className="w-full lg:w-6/12 h-[40vh] lg:h-[80%] relative overflow-hidden border border-ca-border rounded-xl shadow-2xl bg-ca-bg-surface select-none">
                <img
                  src={step.image}
                  alt={step.title}
                  className="walk-img absolute inset-0 w-full h-full object-cover opacity-35"
                />
                
                {/* Thin overlay grid drawing */}
                <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-transparent to-transparent opacity-80" />
                <div className="absolute inset-8 border border-white/[0.03] pointer-events-none">
                  <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-brand-gold/30" />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-brand-gold/30" />
                </div>
              </div>

              {/* Text side */}
              <div className="w-full lg:w-5/12 flex flex-col justify-center items-start space-y-6">
                <span
                  className="text-7xl md:text-8xl font-display font-black leading-none opacity-10 select-none"
                  style={{
                    WebkitTextStroke: "1px var(--ca-text)",
                    color: "transparent",
                  }}
                >
                  {step.number}
                </span>

                <h3 className="walk-title text-2xl md:text-4xl font-display font-light uppercase tracking-widest text-ca-text">
                  <BrandText>{step.title}</BrandText>
                </h3>

                <div className="h-[1px] w-16 bg-brand-gold/40" />

                <p className="walk-desc text-base md:text-lg font-serif italic text-ca-text-secondary leading-relaxed max-w-md">
                  "{step.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CinematicWalk;
