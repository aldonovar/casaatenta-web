"use client";

import React, { useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ServiceMotionGraphicsProps {
  slug: string;
}

const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const ServiceMotionGraphics: React.FC<ServiceMotionGraphicsProps> = ({ slug }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const uid = rawId.replace(/:/g, "");

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(MOTION_QUERY).matches;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const svg = q("svg")[0] as SVGSVGElement | undefined;
      if (!svg) return;

      gsap.set(svg, { autoAlpha: 1 });

      if (reducedMotion) {
        gsap.set(q("[data-reveal]"), { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
        gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
        return;
      }

      const entrance = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 84%",
          once: true,
        },
      });

      entrance
        .fromTo(svg, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.8 })
        .fromTo(
          q("[data-reveal]"),
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06 },
          "-=0.52",
        );

      q("[data-draw]").forEach((element) => {
        const path = element as SVGGeometryElement;
        const length = typeof path.getTotalLength === "function" ? path.getTotalLength() : 0;
        if (!length) return;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        entrance.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "<0.04");
      });

      if (slug === "techos-sol-y-sombra") {
        gsap.to(q("[data-slat]"), {
          rotate: -38,
          transformOrigin: "50% 50%",
          stagger: 0.035,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 78%",
            end: "bottom 28%",
            scrub: 0.75,
          },
        });

        gsap.to(q("[data-light-band]"), {
          xPercent: 42,
          opacity: 0.56,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }

      if (slug === "iluminacion-inteligente") {
        gsap.to(q("[data-glow]"), {
          scale: 1.18,
          transformOrigin: "50% 50%",
          duration: 2.8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });

        gsap.to(q("[data-orbit]"), {
          rotate: 360,
          transformOrigin: "50% 50%",
          duration: 24,
          repeat: -1,
          ease: "none",
        });

        gsap.to(q("[data-spectrum-stop='warm']"), {
          attr: { offset: "62%" },
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 25%",
            scrub: true,
          },
        });
      }

      if (slug === "smart-homes") {
        gsap.to(q("[data-node-core]"), {
          scale: 1.35,
          opacity: 0.95,
          transformOrigin: "50% 50%",
          duration: 1.7,
          repeat: -1,
          yoyo: true,
          stagger: { each: 0.18, from: "center" },
          ease: "sine.inOut",
        });

        gsap.to(q("[data-signal]"), {
          strokeDashoffset: -56,
          duration: 2.8,
          repeat: -1,
          ease: "none",
        });
      }

      if (slug === "diseno-terrazas") {
        gsap.to(q("[data-plan-layer='02']"), {
          x: 10,
          y: -8,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 24%",
            scrub: 0.8,
          },
        });

        gsap.to(q("[data-measure]"), {
          opacity: 0.9,
          duration: 1.4,
          repeat: -1,
          yoyo: true,
          stagger: 0.22,
          ease: "sine.inOut",
        });
      }

      if (slug === "mantenimiento-general") {
        gsap.to(q("[data-bubble]"), {
          x: 44,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 28%",
            scrub: 0.7,
          },
        });

        gsap.to(q("[data-calibration]"), {
          strokeDashoffset: -32,
          duration: 2.4,
          repeat: -1,
          ease: "none",
        });
      }
    }, root);

    return () => ctx.revert();
  }, [slug]);

  const renderSVG = () => {
    const commonClass = "h-full w-full overflow-visible stroke-brand-gold fill-none";

    switch (slug) {
      case "techos-sol-y-sombra":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Esquema técnico animado de un techo Sol y Sombra">
            <defs>
              <linearGradient id={`${uid}-roof-light`} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#F2D38D" stopOpacity="0" />
                <stop offset="48%" stopColor="#F2D38D" stopOpacity="0.34" />
                <stop offset="100%" stopColor="#F2D38D" stopOpacity="0" />
              </linearGradient>
              <pattern id={`${uid}-roof-grid`} width="18" height="18" patternUnits="userSpaceOnUse">
                <path d="M18 0H0V18" stroke="currentColor" strokeOpacity="0.11" strokeWidth="0.6" />
              </pattern>
            </defs>

            <g data-reveal>
              <path d="M48 250V76H372V250" strokeOpacity="0.34" strokeWidth="1.25" />
              <path d="M48 76L94 48H326L372 76" strokeWidth="2" data-draw />
              <rect x="48" y="76" width="324" height="174" fill={`url(#${uid}-roof-grid)`} strokeOpacity="0.16" />
            </g>

            <g strokeWidth="8" strokeLinecap="round">
              {[94, 136, 178, 220, 262, 304, 346].map((x, index) => (
                <line key={x} x1={x} y1="92" x2={x} y2="210" data-slat data-reveal style={{ opacity: 0.38 + index * 0.055 }} />
              ))}
            </g>

            <path
              d="M62 98L244 226H154L62 160Z"
              fill={`url(#${uid}-roof-light)`}
              stroke="none"
              data-light-band
              opacity="0.26"
            />

            <g data-reveal strokeOpacity="0.5">
              <path d="M82 230H338" strokeDasharray="3 8" />
              <circle cx="94" cy="151" r="4" fill="#D8B36A" stroke="none" />
              <circle cx="346" cy="151" r="4" fill="#D8B36A" stroke="none" />
              <path d="M72 272H348" strokeWidth="0.75" />
              <path d="M72 266V278M348 266V278" strokeWidth="0.75" />
            </g>

            <text x="48" y="302" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.24em]">
              CONTROL DE SOMBRA · APERTURA DE LAMAS
            </text>
          </svg>
        );

      case "iluminacion-inteligente":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Esquema animado de iluminación inteligente y temperatura de color">
            <defs>
              <radialGradient id={`${uid}-circadian`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FFF3C9" stopOpacity="0.94" />
                <stop data-spectrum-stop="warm" offset="38%" stopColor="#D8B36A" stopOpacity="0.48" />
                <stop offset="100%" stopColor="#0C2742" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle cx="210" cy="142" r="104" strokeOpacity="0.15" strokeWidth="0.7" data-orbit />
            <circle cx="210" cy="142" r="78" strokeOpacity="0.25" strokeDasharray="2 10" data-orbit />
            <circle cx="210" cy="142" r="50" strokeOpacity="0.42" strokeDasharray="16 8" data-orbit />
            <circle cx="210" cy="142" r="64" fill={`url(#${uid}-circadian)`} stroke="none" data-glow />

            <g data-reveal>
              <path d="M194 136C194 116 226 116 226 136C226 151 215 156 214 169H206C205 156 194 151 194 136Z" strokeWidth="2" data-draw />
              <path d="M203 177H217M205 184H215" strokeWidth="2" strokeLinecap="round" />
              <path d="M210 76V94M144 142H162M258 142H276M163 95L176 108M244 108L257 95" strokeWidth="1.2" strokeOpacity="0.5" />
            </g>

            <g data-reveal>
              <path d="M74 252H346" strokeOpacity="0.25" />
              <rect x="74" y="245" width="272" height="14" rx="7" fill={`url(#${uid}-circadian)`} strokeOpacity="0.3" />
              <path d="M94 242V262M210 242V262M326 242V262" strokeWidth="0.75" strokeOpacity="0.5" />
              <text x="78" y="280" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.16em]">1800K</text>
              <text x="192" y="280" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.16em]">4000K</text>
              <text x="308" y="280" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.16em]">6500K</text>
            </g>
          </svg>
        );

      case "smart-homes":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Red doméstica inteligente conectada mediante nodos">
            <defs>
              <filter id={`${uid}-node-glow`} x="-80%" y="-80%" width="260%" height="260%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            <path d="M210 52L340 122V258H80V122Z" strokeOpacity="0.22" strokeWidth="1.2" data-reveal />
            <path d="M210 84V222M110 142H310M132 230L288 108M132 108L288 230" strokeOpacity="0.16" strokeDasharray="4 10" data-reveal />

            <g data-signal strokeDasharray="12 8" strokeWidth="1.4" strokeOpacity="0.7">
              <path d="M210 164C170 164 148 126 116 126" />
              <path d="M210 164C250 164 272 126 304 126" />
              <path d="M210 164C176 178 170 220 138 230" />
              <path d="M210 164C244 178 250 220 282 230" />
            </g>

            {[[210,164,14],[116,126,8],[304,126,8],[138,230,8],[282,230,8]].map(([cx, cy, r], index) => (
              <g key={`${cx}-${cy}`} data-reveal>
                <circle cx={cx} cy={cy} r={r + 8} strokeOpacity="0.18" />
                <circle cx={cx} cy={cy} r={r} fill="#0C2742" strokeWidth="1.2" />
                <circle cx={cx} cy={cy} r={Math.max(2.5, r / 3)} fill="#D8B36A" stroke="none" filter={`url(#${uid}-node-glow)`} data-node-core style={{ transformOrigin: `${cx}px ${cy}px` }} />
                {index === 0 && <path d="M202 164H218M210 156V172" strokeWidth="1" strokeOpacity="0.7" />}
              </g>
            ))}

            <text x="58" y="294" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.22em]">
              RED LOCAL · ESCENAS · CONTROL CONVERSACIONAL
            </text>
          </svg>
        );

      case "diseno-terrazas":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Plano arquitectónico animado de una terraza">
            <defs>
              <pattern id={`${uid}-plan-grid`} width="14" height="14" patternUnits="userSpaceOnUse">
                <path d="M14 0H0V14" stroke="currentColor" strokeOpacity="0.09" strokeWidth="0.5" />
              </pattern>
            </defs>

            <rect x="48" y="38" width="324" height="226" fill={`url(#${uid}-plan-grid)`} strokeOpacity="0.16" data-reveal />

            <g data-plan-layer="01" data-reveal>
              <path d="M84 74H332V228H84Z" strokeWidth="1.4" data-draw />
              <path d="M84 156H332M210 74V228" strokeWidth="0.8" strokeOpacity="0.42" data-draw />
              <path d="M112 104H180V140H112ZM240 104H304V140H240Z" strokeOpacity="0.55" data-draw />
              <circle cx="210" cy="184" r="26" strokeOpacity="0.54" data-draw />
            </g>

            <g data-plan-layer="02" data-reveal strokeOpacity="0.38">
              <path d="M100 88H316V214H100Z" strokeDasharray="5 7" />
              <path d="M120 198L150 168H270L300 198" />
              <path d="M132 92V210M288 92V210" />
            </g>

            <g data-measure data-reveal strokeWidth="0.7">
              <path d="M84 52H332M84 46V58M332 46V58" />
              <path d="M354 74V228M348 74H360M348 228H360" />
              <text x="184" y="48" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.12em]">6.20 M</text>
              <text x="362" y="158" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.12em]" transform="rotate(90 362 158)">4.10 M</text>
            </g>

            <text x="48" y="294" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.22em]">
              TRAZO · PROPORCIÓN · ORIENTACIÓN SOLAR
            </text>
          </svg>
        );

      case "mantenimiento-general":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Instrumento técnico animado para calibración y mantenimiento">
            <defs>
              <linearGradient id={`${uid}-level-body`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#D8B36A" stopOpacity="0.05" />
                <stop offset="50%" stopColor="#D8B36A" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#D8B36A" stopOpacity="0.05" />
              </linearGradient>
            </defs>

            <g data-reveal>
              <path d="M64 122H356L370 138V190L356 206H64L50 190V138Z" fill={`url(#${uid}-level-body)`} strokeWidth="1.4" data-draw />
              <rect x="150" y="138" width="120" height="52" rx="26" strokeOpacity="0.46" />
              <path d="M92 146V182M112 154V174M308 154V174M328 146V182" strokeOpacity="0.38" />
            </g>

            <g data-calibration strokeDasharray="12 8" strokeOpacity="0.36">
              <path d="M72 164H142" />
              <path d="M278 164H348" />
            </g>

            <g data-reveal>
              <ellipse cx="172" cy="164" rx="18" ry="13" fill="#D8B36A" fillOpacity="0.28" strokeWidth="1" data-bubble />
              <path d="M204 136V192M216 136V192" strokeOpacity="0.5" />
              <path d="M182 232H238M182 226V238M238 226V238" strokeWidth="0.75" strokeOpacity="0.55" />
              <text x="192" y="251" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.12em]">0.00°</text>
            </g>

            <text x="50" y="294" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.22em]">
              NIVEL · ALINEACIÓN · CONTROL DE ACABADO
            </text>
          </svg>
        );

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className="group relative flex aspect-[4/3] w-full max-w-[360px] items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[radial-gradient(circle_at_50%_36%,rgba(216,179,106,0.07),transparent_58%),linear-gradient(145deg,rgba(255,255,255,0.025),rgba(255,255,255,0.005))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-30px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.025)_50%,transparent_80%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {renderSVG()}
    </div>
  );
};

export default ServiceMotionGraphics;
