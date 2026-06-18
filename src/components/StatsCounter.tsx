"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

const statsData = [
  { value: 100, suffix: "%", label: "Diseños Personalizados" },
  { value: 1, suffix: " Año", label: "Garantía Estructural" },
  { value: 1, suffix: " / Mes", label: "Mantenimiento del Sistema" },
  { value: 1, suffix: " Canal", label: "Control por WhatsApp" },
];

export const StatsCounter: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Fade in the container
      gsap.fromTo(
        el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
        }
      );

      // Animate the counters
      const counters = gsap.utils.toArray(".stat-number");
      counters.forEach((counter: any) => {
        const targetVal = parseInt(counter.getAttribute("data-target") || "0", 10);
        const obj = { val: 0 };

        gsap.to(obj, {
          val: targetVal,
          duration: 2.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: counter,
            start: "top 90%",
            toggleActions: "play none none none",
          },
          onUpdate: () => {
            counter.innerText = Math.floor(obj.val).toLocaleString();
          },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="stats"
      className="relative z-20 overflow-hidden bg-ca-bg-deep py-16 px-6 md:px-12 lg:px-24"
    >
      <div className="mx-auto max-w-7xl">
        <div className="relative glass-panel rounded-xl overflow-hidden py-12 px-8 md:px-16 border border-white/[0.05] shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/[0.02] via-transparent to-brand-dark/[0.04] pointer-events-none" />

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06] text-center">
            {statsData.map((stat, index) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center justify-center ${
                  index >= 2 ? "pt-8 lg:pt-0" : ""
                } ${index % 2 !== 0 ? "border-l border-white/[0.06] sm:border-l-0 lg:border-l-0" : ""} lg:px-6`}
              >
                {/* Huge animated numbers */}
                <div className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-brand-gold tracking-tight mb-3 flex items-baseline justify-center">
                  <span
                    className="stat-number font-normal"
                    data-target={stat.value}
                  >
                    0
                  </span>
                  <span className="text-2xl sm:text-3xl font-mono text-brand-gold/80 ml-1">
                    {stat.suffix}
                  </span>
                </div>

                {/* Stat label (Monospace uppercase) */}
                <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-brand-light/50 max-w-[150px] leading-relaxed">
                  <BrandText>{stat.label}</BrandText>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
