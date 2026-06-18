"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SectionLabel } from "./SectionLabel";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

interface SectionHeadingProps {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  number,
  label,
  title,
  subtitle,
  className = "",
  align = "left",
}) => {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading) return;

    // Dynamically load split-type only on the client side
    let splitInstance: any = null;

    const ctx = gsap.context(() => {
      import("split-type").then(({ default: SplitType }) => {
        splitInstance = new SplitType(heading, { types: "words,chars" });

        // Set initial state of chars
        gsap.set(splitInstance.chars, { yPercent: 100, opacity: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heading,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        tl.to(
          splitInstance.chars,
          {
            yPercent: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.02,
          }
        );

        if (lineRef.current) {
          tl.to(
            lineRef.current,
            {
              scaleX: 1,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.6"
          );
        }

        if (subtitleRef.current) {
          tl.to(
            subtitleRef.current,
            {
              opacity: 0.8,
              y: 0,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.5"
          );
        }
      });
    }, heading);

    return () => {
      ctx.revert();
      if (splitInstance) {
        splitInstance.revert();
      }
    };
  }, [title]);

  const alignmentClasses = {
    left: "text-left items-start",
    center: "text-center items-center",
    right: "text-right items-end",
  };

  const lineAlignmentClasses = {
    left: "origin-left",
    center: "origin-center mx-auto",
    right: "origin-right",
  };

  return (
    <div className={`flex flex-col gap-4 ${alignmentClasses[align]} ${className}`}>
      {/* Section Label */}
      <SectionLabel number={number} title={label} />

      {/* Main Title (will be split by SplitType) */}
      <h2
        ref={headingRef}
        className="text-3xl font-display font-light uppercase leading-tight tracking-[0.08em] text-brand-light md:text-5xl lg:text-6xl max-w-4xl"
      >
        <BrandText>{title}</BrandText>
      </h2>

      {/* Decorative Gold Line */}
      <div className="relative w-24 h-[1px] overflow-hidden my-1">
        <div
          ref={lineRef}
          className={`absolute inset-0 bg-gradient-to-r from-brand-gold to-transparent h-full w-full scale-x-0 ${lineAlignmentClasses[align]}`}
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          ref={subtitleRef}
          className="text-sm font-serif italic text-brand-light/60 md:text-base max-w-2xl translate-y-3 opacity-0 leading-relaxed"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
