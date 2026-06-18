"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { methodSteps, homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";
import { Eye, Layers, Cpu, Ruler, Sliders, ShieldCheck } from "lucide-react";
import { PremiumIconWrapper } from "./icons/AnimatedIcons";

gsap.registerPlugin(ScrollTrigger);

const icons = [Eye, Layers, Cpu, Ruler, Sliders, ShieldCheck];

export const ProcessTimeline: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const line = lineRef.current;
    if (!container || !line) return;

    const ctx = gsap.context(() => {
      // Calculate length of the path dynamically
      const pathLength = line.getTotalLength();
      
      // Set initial path state
      gsap.set(line, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });

      // Scrub the vertical path drawing based on container scroll progress
      gsap.to(line, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          start: "top 40%",
          end: "bottom 80%",
          scrub: 0.5,
        },
      });

      // Animate individual nodes as the scroll passes them
      const stepItems = gsap.utils.toArray(".timeline-step");
      stepItems.forEach((step: any, index: number) => {
        const node = step.querySelector(".timeline-node");
        const number = step.querySelector(".step-number-outline");
        const content = step.querySelector(".step-content-card");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: step,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        });

        tl.to(node, {
          backgroundColor: "var(--color-brand-gold)",
          borderColor: "var(--color-brand-gold)",
          scale: 1.15,
          duration: 0.4,
          ease: "back.out(1.7)",
        })
          .to(node.querySelector("svg"), {
            color: "var(--ca-bg-deep)",
            duration: 0.4,
          }, "-=0.4")
          .fromTo(
            number,
            { opacity: 0, x: index % 2 === 0 ? -20 : 20 },
            { opacity: 0.1, x: 0, duration: 0.6, ease: "power2.out" },
            "-=0.2"
          )
          .fromTo(
            content,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
            "-=0.4"
          );
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative z-20 overflow-hidden bg-ca-bg-surface px-6 py-24 md:px-12 md:py-32 lg:px-24"
    >
      <div className="absolute inset-0 z-0 opacity-[0.03] architectural-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Title */}
        <div className="mb-20 text-center flex flex-col items-center">
          <SectionHeading
            number="04"
            label={homeCopy.method.label}
            title={homeCopy.method.title}
            subtitle={homeCopy.method.subtitle}
            align="center"
          />
        </div>

        {/* Timeline body */}
        <div className="relative mt-20">
          {/* Vertical Drawing Line (Desktop only) */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-[2px] hidden lg:block z-0 h-[85%]">
            <svg className="w-full h-full" viewBox="0 0 2 800" preserveAspectRatio="none">
              {/* Background Track */}
              <line x1="1" y1="0" x2="1" y2="800" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
              {/* Active Path */}
              <path
                ref={lineRef}
                d="M 1 0 L 1 800"
                stroke="var(--color-brand-gold)"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </div>

          {/* Steps List */}
          <div className="space-y-16 lg:space-y-32">
            {methodSteps.map((step, index) => {
              const IconComponent = icons[index] ?? Ruler;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={step.number}
                  className="timeline-step relative grid grid-cols-1 lg:grid-cols-12 items-center w-full"
                >
                  {/* Central Node Circle (Desktop only) */}
                  <PremiumIconWrapper className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden lg:flex h-10 w-10 timeline-node !rounded-full !p-0">
                    <IconComponent className="h-4.5 w-4.5 text-brand-gold transition-transform duration-300" />
                  </PremiumIconWrapper>

                  {/* Left Column (Content or Empty depending on step parity) */}
                  <div
                    className={`lg:col-span-5 flex flex-col ${
                      isEven ? "lg:items-end lg:text-right" : "lg:order-last lg:items-start lg:text-left"
                    }`}
                  >
                    <div className="step-content-card p-6 md:p-8 glass-card rounded-lg w-full max-w-lg">
                      <div className="flex items-center gap-4 mb-4 lg:hidden">
                        <PremiumIconWrapper className="!p-2 flex h-9 w-9 items-center justify-center rounded-xl">
                          <IconComponent size={16} className="text-brand-gold" />
                        </PremiumIconWrapper>
                        <span className="text-xs font-mono text-brand-gold font-semibold">
                          FASE {step.number}
                        </span>
                      </div>

                      <span className="hidden lg:block text-xs font-mono text-brand-gold uppercase tracking-widest mb-3">
                        FASE {step.number}
                      </span>
                      
                      <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-brand-light mb-4">
                        <BrandText>{step.title}</BrandText>
                      </h3>
                      
                      <p className="text-sm font-light leading-relaxed text-brand-light/60">
                        {step.text}
                      </p>
                    </div>
                  </div>

                  {/* Outlined Huge Number column */}
                  <div
                    className={`hidden lg:flex lg:col-span-5 items-center justify-center ${
                      isEven ? "lg:order-last" : ""
                    }`}
                  >
                    <span
                      className="step-number-outline text-8xl md:text-9.5xl font-display font-black leading-none opacity-0 select-none"
                      style={{
                        WebkitTextStroke: "1.5px var(--ca-border)",
                        color: "transparent",
                      }}
                    >
                      {step.number}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
