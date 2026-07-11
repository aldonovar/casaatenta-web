"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeCopy } from "@/data/site";
import { WHATSAPP_LINK } from "@/constants/contact";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

const HERO_IMAGES = [
  { src: "/media/hero/hero-desktop-01.webp", delay: "0s" },
  { src: "/media/hero/hero-desktop-02.webp", delay: "6s" },
  { src: "/media/hero/hero-desktop-03.webp", delay: "12s" },
] as const;

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const geometryRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = gsap.context(() => {
      const revealNodes = gsap.utils.toArray<HTMLElement>("[data-hero-reveal]");
      const lines = gsap.utils.toArray<SVGGeometryElement>(".hero-geometry-line");

      if (reducedMotion) {
        gsap.set(revealNodes, { autoAlpha: 1, y: 0 });
        return;
      }

      lines.forEach((line) => {
        const length = line.getTotalLength();
        gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
      });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(lines, { strokeDashoffset: 0, duration: 1.25, stagger: 0.06, ease: "power2.inOut" })
        .fromTo(
          revealNodes,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09 },
          "-=0.7",
        );

      gsap.to(visualRef.current, {
        yPercent: 9,
        scale: 1.035,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -7,
        autoAlpha: 0.18,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom 30%",
          scrub: 0.7,
        },
      });

      gsap.to(geometryRef.current, {
        yPercent: -12,
        rotate: 2,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[760px] h-[100svh] w-full items-center overflow-hidden bg-ca-bg-deep px-6 md:px-16 lg:px-28"
    >
      <style>{`
        @keyframes caHeroCrossfade {
          0%, 100% { opacity: 0; transform: scale(1.035); }
          5%, 29% { opacity: 1; transform: scale(1.075); }
          34% { opacity: 0; transform: scale(1.095); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ca-hero-frame { animation: none !important; }
          .ca-hero-frame:not(:first-child) { display: none; }
        }
      `}</style>

      <div ref={visualRef} className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {HERO_IMAGES.map((image, index) => (
          <div
            key={image.src}
            className="ca-hero-frame absolute inset-0 opacity-0 will-change-transform"
            style={{ animation: "caHeroCrossfade 18s linear infinite", animationDelay: image.delay }}
          >
            <Image
              src={image.src}
              alt=""
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-ca-bg-deep via-ca-bg-deep/82 to-ca-bg-deep/24" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-ca-bg-deep/30 via-transparent to-ca-bg-deep" />
      <div className="absolute inset-0 z-[1] bg-[radial-gradient(circle_at_72%_44%,transparent_0%,rgba(7,17,29,0.18)_36%,var(--color-ca-bg-deep)_100%)]" />

      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-end px-6 md:px-16 lg:px-28">
        <svg
          ref={geometryRef}
          viewBox="0 0 960 640"
          className="h-auto w-full max-w-[820px] fill-none stroke-ca-text opacity-[0.055] md:opacity-[0.09]"
          aria-hidden="true"
        >
          <rect x="58" y="50" width="844" height="540" strokeWidth="0.7" className="hero-geometry-line" />
          <path d="M58 320H902" strokeWidth="0.6" className="hero-geometry-line" />
          <path d="M226 50V590M734 50V590" strokeWidth="0.6" className="hero-geometry-line" />
          <path d="M58 590L226 320L480 164L734 320L902 590" strokeWidth="0.8" className="hero-geometry-line" />
          <rect x="318" y="214" width="324" height="212" strokeWidth="1" className="hero-geometry-line" />
        </svg>
      </div>

      <div ref={contentRef} className="relative z-10 mx-auto w-full max-w-7xl">
        <div className="max-w-5xl">
          <div data-hero-reveal className="mb-7 flex flex-wrap items-center gap-3">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-brand-gold">
              {homeCopy.hero.eyebrow}
            </span>
            <span className="h-px w-12 bg-brand-gold/45" />
            <span className="border border-brand-gold/30 bg-ca-bg-deep/55 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.22em] text-brand-gold backdrop-blur-md">
              Propuesta visual
            </span>
          </div>

          <h1
            id="hero-title"
            data-hero-reveal
            className="max-w-5xl text-5xl font-display font-light uppercase leading-[0.92] tracking-[0.015em] text-ca-text sm:text-7xl md:text-8xl lg:text-[7.4rem]"
          >
            <BrandText>{homeCopy.hero.title}</BrandText>
          </h1>

          <div data-hero-reveal className="my-8 h-px w-48 bg-gradient-to-r from-brand-gold via-brand-gold/35 to-transparent" />

          <p
            data-hero-reveal
            className="max-w-2xl text-base font-light leading-relaxed text-ca-text-secondary md:text-lg"
          >
            {homeCopy.hero.subtitle}
          </p>

          <div data-hero-reveal className="mt-9 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-14 items-center justify-center border border-ca-text bg-ca-text px-8 py-4 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-ca-bg-deep transition-colors duration-300 hover:bg-transparent hover:text-ca-text"
            >
              <BrandText>{homeCopy.hero.primaryCta}</BrandText>
            </a>
            <Link
              href="/servicios"
              className="inline-flex min-h-14 items-center justify-center border border-ca-border bg-ca-bg-deep/28 px-8 py-4 font-mono text-[10px] uppercase tracking-[0.22em] text-ca-text backdrop-blur-md transition-colors duration-300 hover:border-ca-text/40 hover:bg-ca-text/5"
            >
              <BrandText>{homeCopy.hero.secondaryCta}</BrandText>
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 right-6 z-10 flex items-center justify-between border-t border-ca-border/45 pt-4 font-mono text-[8px] uppercase tracking-[0.24em] text-ca-text/45 md:left-16 md:right-16 lg:left-28 lg:right-28">
        <span>Lima · levantamiento / diseño / montaje</span>
        <span className="hidden sm:inline">Desplaza para revisar el proceso</span>
      </div>
    </section>
  );
};

export default HeroSection;
