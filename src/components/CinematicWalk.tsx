"use client";

import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeCopy, walkSteps } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const CinematicWalk: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const media = gsap.matchMedia();

    if (!reducedMotion) {
      media.add("(min-width: 1024px)", () => {
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
        const panels = Array.from(track.querySelectorAll<HTMLElement>(".walk-panel"));

        const horizontalTween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.85,
            invalidateOnRefresh: true,
          },
        });

        panels.forEach((panel) => {
          const image = panel.querySelector<HTMLElement>(".walk-image");
          const copy = panel.querySelector<HTMLElement>(".walk-copy");

          if (image) {
            gsap.fromTo(
              image,
              { scale: 1.08, xPercent: -2 },
              {
                scale: 1,
                xPercent: 2,
                ease: "none",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              },
            );
          }

          if (copy) {
            gsap.fromTo(
              copy,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: panel,
                  containerAnimation: horizontalTween,
                  start: "left 72%",
                  once: true,
                },
              },
            );
          }
        });
      });
    }

    media.add("(max-width: 1023px)", () => gsap.set(track, { x: 0 }));
    return () => media.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="cinematic-walk"
      className="relative w-full overflow-hidden border-t border-ca-border bg-ca-bg-deep"
    >
      <div className="pointer-events-none absolute inset-0 opacity-5 cad-technical-grid" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-16 lg:px-28">
        <SectionHeading
          number="02"
          label={homeCopy.walk.label}
          title={homeCopy.walk.title}
          subtitle={homeCopy.walk.subtitle}
        />
      </div>

      <div className="relative w-full overflow-hidden">
        <div ref={trackRef} className="flex w-full flex-col lg:w-max lg:flex-row">
          {walkSteps.map((step) => (
            <article
              key={step.number}
              className="walk-panel flex min-h-[720px] w-full flex-col items-center gap-10 border-b border-ca-border/40 px-6 py-14 md:px-16 lg:h-[78vh] lg:min-h-[720px] lg:w-screen lg:flex-row lg:gap-16 lg:border-b-0 lg:px-28 lg:py-0"
            >
              <div className="relative h-[46vh] min-h-[360px] w-full overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-surface shadow-2xl lg:h-[82%] lg:w-7/12">
                <div className="walk-image absolute inset-0">
                  <Image
                    src={step.image}
                    alt={step.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    className="object-cover opacity-52"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/15 to-transparent" />
                <span className="absolute left-5 top-5 z-10 border border-white/10 bg-ca-bg-deep/80 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
                  {step.visualLabel}
                </span>
                <div className="pointer-events-none absolute inset-7 border border-white/[0.04]">
                  <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-brand-gold/50" />
                  <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-brand-gold/50" />
                </div>
              </div>

              <div className="walk-copy flex w-full flex-col items-start justify-center space-y-6 lg:w-5/12">
                <span
                  className="select-none text-7xl font-display font-black leading-none opacity-10 md:text-8xl"
                  style={{ WebkitTextStroke: "1px var(--ca-text)", color: "transparent" }}
                >
                  {step.number}
                </span>
                <h3 className="text-2xl font-display font-light uppercase tracking-[0.08em] text-ca-text md:text-4xl">
                  <BrandText>{step.title}</BrandText>
                </h3>
                <div className="h-px w-16 bg-brand-gold/45" />
                <p className="max-w-md text-base font-light leading-relaxed text-ca-text-secondary md:text-lg">
                  {step.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CinematicWalk;
