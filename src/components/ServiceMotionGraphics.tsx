"use client";

import React, { useId, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

interface ServiceMotionGraphicsProps { slug: string; }
const MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export const ServiceMotionGraphics: React.FC<ServiceMotionGraphicsProps> = ({ slug }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const reduced = window.matchMedia(MOTION_QUERY).matches;
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(root);
      const svg = q("svg")[0] as SVGSVGElement | undefined;
      if (!svg) return;

      gsap.set(svg, { autoAlpha: 1 });
      if (reduced) {
        gsap.set(q("[data-reveal]"), { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0 });
        gsap.set(q("[data-draw]"), { strokeDashoffset: 0 });
        return;
      }

      const entrance = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: root, start: "top 84%", once: true },
      });
      entrance.fromTo(svg, { autoAlpha: 0, scale: 0.96 }, { autoAlpha: 1, scale: 1, duration: 0.8 });
      entrance.fromTo(q("[data-reveal]"), { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.65, stagger: 0.06 }, "-=0.52");

      q("[data-draw]").forEach((el) => {
        const path = el as SVGGeometryElement;
        const length = typeof path.getTotalLength === "function" ? path.getTotalLength() : 0;
        if (!length) return;
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
        entrance.to(path, { strokeDashoffset: 0, duration: 1.1, ease: "power2.inOut" }, "<0.04");
      });

      if (slug === "techos-sol-y-sombra") {
        gsap.to(q("[data-roof-panel]"), {
          x: 118,
          ease: "none",
          scrollTrigger: { trigger: root, start: "top 78%", end: "bottom 28%", scrub: 0.75 },
        });
        gsap.to(q("[data-pulley-line]"), {
          strokeDashoffset: -36,
          duration: 2.2,
          repeat: -1,
          ease: "none",
        });
        gsap.to(q("[data-motor-core]"), {
          rotate: 360,
          transformOrigin: "50% 50%",
          duration: 3.2,
          repeat: -1,
          ease: "none",
        });
      }

      if (slug === "iluminacion-inteligente") {
        gsap.to(q("[data-glow]"), { scale: 1.18, transformOrigin: "50% 50%", duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
        gsap.to(q("[data-orbit]"), { rotate: 360, transformOrigin: "50% 50%", duration: 24, repeat: -1, ease: "none" });
      }

      if (slug === "smart-homes") {
        gsap.to(q("[data-node-core]"), { scale: 1.35, opacity: 0.95, transformOrigin: "50% 50%", duration: 1.7, repeat: -1, yoyo: true, stagger: 0.18, ease: "sine.inOut" });
        gsap.to(q("[data-signal]"), { strokeDashoffset: -56, duration: 2.8, repeat: -1, ease: "none" });
      }

      if (slug === "diseno-terrazas") {
        gsap.to(q("[data-plan-layer='02']"), { x: 10, y: -8, ease: "none", scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 24%", scrub: 0.8 } });
      }

      if (slug === "mantenimiento-general") {
        gsap.to(q("[data-bubble]"), { x: 44, ease: "power2.out", scrollTrigger: { trigger: root, start: "top 80%", end: "bottom 28%", scrub: 0.7 } });
      }
    }, root);
    return () => ctx.revert();
  }, [slug]);

  const commonClass = "h-full w-full overflow-visible stroke-brand-gold fill-none";

  const renderSVG = () => {
    switch (slug) {
      case "techos-sol-y-sombra":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Techo Sol y Sombra corredizo con accionamiento por polea, gancho o motor">
            <defs>
              <pattern id={`${uid}-grid`} width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M16 0H0V16" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.6" />
              </pattern>
            </defs>
            <g data-reveal>
              <path d="M48 246V78H372V246" strokeOpacity="0.35" strokeWidth="1.25" />
              <path d="M48 78L92 50H328L372 78" strokeWidth="2" data-draw />
              <rect x="48" y="78" width="324" height="168" fill={`url(#${uid}-grid)`} strokeOpacity="0.16" />
              <path d="M72 96H348M72 116H348" strokeOpacity="0.35" />
            </g>

            <g data-roof-panel data-reveal>
              <rect x="76" y="92" width="172" height="104" rx="4" fill="#D8B36A" fillOpacity="0.14" strokeWidth="1.5" />
              {[94, 116, 138, 160, 182, 204, 226].map((x) => <line key={x} x1={x} y1="96" x2={x} y2="192" strokeWidth="5" strokeLinecap="round" strokeOpacity="0.56" />)}
            </g>

            <g data-reveal>
              <circle cx="82" cy="214" r="10" strokeWidth="1.4" />
              <circle cx="82" cy="214" r="3" fill="#D8B36A" stroke="none" />
              <path d="M82 204V126H248" strokeDasharray="9 6" data-pulley-line strokeOpacity="0.72" />
              <path d="M248 126l12 8-12 8" strokeWidth="1.5" />
              <path d="M64 238c10-18 22-18 32 0" strokeWidth="1.3" />
              <path d="M80 238v18" strokeWidth="1.3" />
              <rect x="316" y="112" width="34" height="28" rx="5" strokeWidth="1.4" />
              <circle cx="333" cy="126" r="7" data-motor-core strokeWidth="1.4" />
              <path d="M333 119V133M326 126H340" strokeWidth="1" />
            </g>

            <g data-reveal className="stroke-none fill-brand-gold font-mono text-[8px] tracking-[0.14em]">
              <text x="52" y="284">POLEA</text>
              <text x="170" y="284">GANCHO</text>
              <text x="304" y="284">MOTOR</text>
              <text x="48" y="304" className="text-[8px] tracking-[0.16em]">CUBIERTA CORREDIZA · LAMAS ORIENTABLES BAJO SOLICITUD ESPECIAL</text>
            </g>
          </svg>
        );
      case "iluminacion-inteligente":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Iluminación inteligente y temperatura de color">
            <circle cx="210" cy="142" r="104" strokeOpacity="0.15" data-orbit />
            <circle cx="210" cy="142" r="76" strokeOpacity="0.28" strokeDasharray="3 9" data-orbit />
            <circle cx="210" cy="142" r="54" fill="#D8B36A" fillOpacity="0.14" stroke="none" data-glow />
            <path d="M194 136C194 116 226 116 226 136C226 151 215 156 214 169H206C205 156 194 151 194 136Z" strokeWidth="2" data-draw />
            <path d="M203 177H217M205 184H215" strokeWidth="2" strokeLinecap="round" />
            <text x="64" y="286" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.2em]">ESCENAS · INTENSIDAD · TEMPERATURA DE COLOR</text>
          </svg>
        );
      case "smart-homes":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Red doméstica inteligente">
            <path d="M210 52L340 122V258H80V122Z" strokeOpacity="0.22" strokeWidth="1.2" data-reveal />
            <g data-signal strokeDasharray="12 8" strokeWidth="1.4" strokeOpacity="0.7">
              <path d="M210 164C170 164 148 126 116 126" /><path d="M210 164C250 164 272 126 304 126" /><path d="M210 164L138 230" /><path d="M210 164L282 230" />
            </g>
            {[[210,164,14],[116,126,8],[304,126,8],[138,230,8],[282,230,8]].map(([cx,cy,r]) => <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} fill="#0C2742" strokeWidth="1.2" data-node-core />)}
            <text x="58" y="294" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.22em]">RED LOCAL · ESCENAS · CONTROL CONVERSACIONAL</text>
          </svg>
        );
      case "diseno-terrazas":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Plano arquitectónico de terraza">
            <rect x="48" y="38" width="324" height="226" strokeOpacity="0.16" data-reveal />
            <g data-plan-layer="01" data-reveal><path d="M84 74H332V228H84Z" strokeWidth="1.4" data-draw /><path d="M84 156H332M210 74V228" strokeOpacity="0.42" /></g>
            <g data-plan-layer="02" data-reveal strokeOpacity="0.38"><path d="M100 88H316V214H100Z" strokeDasharray="5 7" /><path d="M120 198L150 168H270L300 198" /></g>
            <text x="48" y="294" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.22em]">TRAZO · PROPORCIÓN · ORIENTACIÓN SOLAR</text>
          </svg>
        );
      case "mantenimiento-general":
        return (
          <svg viewBox="0 0 420 320" className={commonClass} role="img" aria-label="Calibración y mantenimiento">
            <path d="M64 122H356L370 138V190L356 206H64L50 190V138Z" strokeWidth="1.4" data-draw />
            <rect x="150" y="138" width="120" height="52" rx="26" strokeOpacity="0.46" />
            <ellipse cx="172" cy="164" rx="18" ry="13" fill="#D8B36A" fillOpacity="0.28" strokeWidth="1" data-bubble />
            <path d="M204 136V192M216 136V192" strokeOpacity="0.5" />
            <text x="50" y="294" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.22em]">NIVEL · ALINEACIÓN · CONTROL DE ACABADO</text>
          </svg>
        );
      default: return null;
    }
  };

  return (
    <div ref={containerRef} className="group relative flex aspect-[4/3] w-full max-w-[360px] items-center justify-center overflow-hidden rounded-[1.4rem] border border-white/[0.08] bg-[radial-gradient(circle_at_50%_36%,rgba(216,179,106,0.07),transparent_58%),linear-gradient(145deg,rgba(255,255,255,0.025),rgba(255,255,255,0.005))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04),inset_0_-30px_80px_rgba(0,0,0,0.22)] backdrop-blur-sm">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,rgba(255,255,255,0.025)_50%,transparent_80%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      {renderSVG()}
    </div>
  );
};

export default ServiceMotionGraphics;
