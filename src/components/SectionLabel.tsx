"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

interface SectionLabelProps {
  number: string;
  title: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  number,
  title,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -20 },
        {
          opacity: 0.8,
          x: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-3 text-[10px] font-mono uppercase tracking-[0.35em] text-brand-gold/80 ${className}`}
    >
      <span>{number}</span>
      <span className="opacity-40">—</span>
      <h2>
        <BrandText>{title}</BrandText>
      </h2>
    </div>
  );
};
