"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { WHATSAPP_LINK } from "@/constants/contact";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const HeroSection: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const geomRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    let splitTitle: any = null;

    const ctx = gsap.context(() => {
      // Dynamic client-side split type animation
      import("split-type").then(({ default: SplitType }) => {
        if (!titleRef.current) return;
        splitTitle = new SplitType(titleRef.current, { types: "chars,words" });

        gsap.set(splitTitle.chars, { yPercent: 120, opacity: 0 });

        const paths = geomRef.current?.querySelectorAll(".geom-path");
        if (paths) {
          paths.forEach((path: any) => {
            const length = path.getTotalLength();
            gsap.set(path, {
              strokeDasharray: length,
              strokeDashoffset: length,
            });
          });
        }

        const tl = gsap.timeline({ delay: 0.1 });

        // Step 1: Draw minimal lines
        if (paths) {
          tl.to(paths, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: "power2.inOut",
            stagger: 0.05,
          });
        }

        // Step 2: Fade titles and text
        tl.to(splitTitle.chars, {
          yPercent: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.015,
        }, "-=1.0")
          .fromTo(
            ".hero-animate-fade",
            { opacity: 0, y: 25 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08 },
            "-=0.5"
          )
          .fromTo(
            scrollIndicatorRef.current,
            { opacity: 0 },
            { opacity: 0.5, duration: 0.5 },
            "-=0.2"
          );
      });

      // Parallax effects on scroll
      gsap.to(bgImageRef.current, {
        yPercent: 12,
        opacity: 0.08,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -8,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom 35%",
          scrub: true,
        },
      });

      gsap.to(geomRef.current, {
        yPercent: -15,
        rotate: 3,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, hero);

    return () => {
      ctx.revert();
      if (splitTitle) splitTitle.revert();
    };
  }, []);

  // Soft 3D tilt on mousemove
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const hero = heroRef.current;
    const geom = geomRef.current;
    if (!hero || !geom) return;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    const rotX = -(y / (rect.height / 2)) * 6; // max 6 degrees
    const rotY = (x / (rect.width / 2)) * 6;

    gsap.to(geom, {
      rotateX: rotX,
      rotateY: rotY,
      duration: 1.2,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const handleMouseLeave = () => {
    const geom = geomRef.current;
    if (!geom) return;

    gsap.to(geom, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.5,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  return (
    <section
      ref={heroRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative h-screen w-full flex flex-col justify-center overflow-hidden bg-ca-bg-deep px-6 md:px-16 lg:px-28"
      style={{ perspective: "1000px" }}
    >
      {/* Background visual render overlay */}
      <div
        ref={bgImageRef}
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-25 scale-102"
        style={{ backgroundImage: `url('/backgrounds/hero.png')` }}
      />
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-ca-bg-deep/90 via-ca-bg-deep/80 to-ca-bg-deep" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_50%_45%,transparent_20%,var(--color-ca-bg-deep)_85%)]" />

      {/* Large Abstract Geometric Layout Lines in background instead of complex plans */}
      <div className="absolute inset-0 z-0 flex items-center justify-end pointer-events-none select-none px-6 md:px-16 lg:px-28">
        <svg
          ref={geomRef}
          viewBox="0 0 1000 700"
          className="w-full max-w-[850px] h-auto fill-none stroke-ca-text opacity-[0.06] md:opacity-[0.09] transition-transform duration-300 transform-gpu"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* Outer elegant borders */}
          <rect x="50" y="50" width="900" height="600" strokeWidth="0.5" className="geom-path" />
          
          {/* Diagonal intersecting design lines */}
          <path d="M 50 50 L 950 650" strokeWidth="0.5" strokeDasharray="6 12" className="geom-path" />
          <path d="M 950 50 L 50 650" strokeWidth="0.5" strokeDasharray="6 12" className="geom-path" />
          
          {/* Centered concentric rectangles */}
          <rect x="250" y="175" width="500" height="350" strokeWidth="0.75" className="geom-path" />
          <rect x="350" y="245" width="300" height="210" strokeWidth="1" className="geom-path" />
          
          {/* Fine horizontal dividing rules */}
          <line x1="50" y1="350" x2="950" y2="350" strokeWidth="0.5" className="geom-path" />
        </svg>
      </div>

      {/* Hero content */}
      <div
        ref={contentRef}
        className="relative z-10 mx-auto w-full max-w-7xl"
      >
        <div className="flex flex-col items-start space-y-8">
          
          {/* Eyebrow */}
          <div className="hero-animate-fade flex items-center">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.4em] text-ca-text/50">
              CASA ATENTA // DISEÑO Y AUTOMATIZACIÓN RESIDENCIAL
            </span>
          </div>

          {/* Epic scale title */}
          <h1
            ref={titleRef}
            className="text-5xl font-display font-light uppercase leading-[1.02] tracking-[0.02em] text-ca-text sm:text-7xl md:text-8xl lg:text-9.5xl max-w-6xl"
          >
            Estructura, luz y clima <br />
            <span className="font-serif italic lowercase tracking-normal text-ca-text-secondary/85">
              disueltos en la arquitectura.
            </span>
          </h1>

          {/* Elegant horizontal line */}
          <div className="hero-animate-fade relative h-[1px] w-48 overflow-hidden my-4">
            <div className="absolute inset-0 bg-gradient-to-r from-ca-text via-ca-text/20 to-transparent" />
          </div>

          {/* Expanded readable subtext */}
          <p className="hero-animate-fade max-w-2xl text-base md:text-lg font-light leading-relaxed text-ca-text-secondary/80">
            Diseñamos pérgolas bioclimáticas, acabados continuos de travertino, audio de resonancia e iluminación circadiana que se disuelven de forma invisible en tus espacios.
          </p>

          {/* Expanded CTAs */}
          <div className="hero-animate-fade flex flex-col sm:flex-row gap-5 pt-4 w-full sm:w-auto">
            <a
              href={WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-btn inline-flex min-h-14 items-center justify-center bg-ca-text px-10 py-4.5 text-[11px] font-mono uppercase tracking-[0.25em] text-ca-bg-deep transition-all duration-300 font-semibold rounded hover:opacity-90 cursor-pointer"
            >
              <BrandText>Agendar visita técnica</BrandText>
            </a>
            <a
              href="/diseno"
              className="inline-flex min-h-14 items-center justify-center border border-ca-border bg-ca-bg-surface/5 backdrop-filter backdrop-blur-md px-10 py-4.5 text-[11px] font-mono uppercase tracking-[0.25em] text-ca-text transition-all duration-300 hover:bg-ca-text/10 rounded"
            >
              <BrandText>Ver Diseño</BrandText>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom coordinate line details simplified */}
      <div
        ref={scrollIndicatorRef}
        className="absolute bottom-10 left-6 md:left-16 lg:left-28 z-10 flex items-center gap-6 text-[10px] font-mono uppercase tracking-[0.3em] text-ca-text/30 select-none opacity-0"
      >
        <span>LIMA // EXCELENCIA HABITABLE</span>
        <span className="h-[1px] w-16 bg-ca-text/20" />
        <span className="animate-pulse">Desliza para explorar</span>
      </div>
    </section>
  );
};
export default HeroSection;
