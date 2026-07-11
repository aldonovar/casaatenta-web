"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ServiceMotionGraphicsProps {
  slug: string;
}

export const ServiceMotionGraphics: React.FC<ServiceMotionGraphicsProps> = ({ slug }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      if (slug === "techos-sol-y-sombra") {
        gsap.to(".roof-panel", {
          x: 92,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 25%",
            scrub: true,
          },
        });
        gsap.to(".pulley-line", {
          strokeDashoffset: -30,
          duration: 2.2,
          repeat: -1,
          ease: "none",
        });
        gsap.to(".motor-core", {
          rotate: 360,
          transformOrigin: "50% 50%",
          duration: 3,
          repeat: -1,
          ease: "none",
        });
      }

      if (slug === "iluminacion-inteligente") {
        gsap.to(".circadian-wave", {
          scale: 1.18,
          opacity: 0.12,
          transformOrigin: "50% 50%",
          duration: 2.6,
          repeat: -1,
          yoyo: true,
          stagger: 0.3,
          ease: "sine.inOut",
        });
      }

      if (slug === "smart-homes") {
        gsap.to(".network-node", {
          scale: 1.15,
          opacity: 0.95,
          transformOrigin: "50% 50%",
          duration: 1.8,
          repeat: -1,
          yoyo: true,
          stagger: 0.2,
          ease: "sine.inOut",
        });
      }

      if (slug === "diseno-terrazas") {
        gsap.fromTo(
          ".blueprint-line",
          { opacity: 0.2 },
          {
            opacity: 0.75,
            stagger: 0.08,
            scrollTrigger: {
              trigger: root,
              start: "top 82%",
              end: "bottom 28%",
              scrub: true,
            },
          },
        );
      }

      if (slug === "mantenimiento-general") {
        gsap.to(".level-bubble", {
          x: 45,
          ease: "power2.out",
          scrollTrigger: {
            trigger: root,
            start: "top 80%",
            end: "bottom 25%",
            scrub: true,
          },
        });
      }
    }, root);

    return () => ctx.revert();
  }, [slug]);

  const renderGraphic = () => {
    switch (slug) {
      case "techos-sol-y-sombra":
        return (
          <svg viewBox="0 0 400 300" className="h-full w-full fill-none stroke-brand-gold opacity-70" role="img" aria-label="Cubierta Sol y Sombra corrediza por polea, gancho o motor">
            <rect x="48" y="54" width="304" height="190" strokeWidth="1.4" opacity="0.45" />
            <line x1="72" y1="82" x2="328" y2="82" strokeWidth="1" opacity="0.4" />
            <line x1="72" y1="104" x2="328" y2="104" strokeWidth="1" opacity="0.4" />
            <g className="roof-panel">
              <rect x="72" y="92" width="164" height="96" rx="4" fill="#D8B36A" fillOpacity="0.12" strokeWidth="1.4" />
              {[90, 112, 134, 156, 178, 200, 222].map((x) => (
                <line key={x} x1={x} y1="98" x2={x} y2="182" strokeWidth="5" strokeLinecap="round" opacity="0.58" />
              ))}
            </g>
            <circle cx="82" cy="214" r="10" strokeWidth="1.4" />
            <circle cx="82" cy="214" r="3" fill="#D8B36A" stroke="none" />
            <path d="M82 204V128H236" className="pulley-line" strokeDasharray="9 6" strokeWidth="1.3" />
            <path d="M236 128l12 8-12 8" strokeWidth="1.4" />
            <path d="M66 238c10-18 22-18 32 0M82 238v18" strokeWidth="1.3" />
            <rect x="314" y="112" width="36" height="28" rx="5" strokeWidth="1.4" />
            <circle cx="332" cy="126" r="7" className="motor-core" strokeWidth="1.4" />
            <path d="M332 119V133M325 126H339" strokeWidth="1" />
            <text x="50" y="274" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.16em]">POLEA · GANCHO · MOTOR</text>
            <text x="50" y="292" className="fill-brand-gold stroke-none font-mono text-[7px] tracking-[0.11em]">LAMAS ORIENTABLES: SOLUCIÓN ESPECIAL SUJETA A EVALUACIÓN</text>
          </svg>
        );
      case "iluminacion-inteligente":
        return (
          <svg viewBox="0 0 400 300" className="h-full w-full fill-none stroke-brand-gold opacity-70" role="img" aria-label="Esquema de iluminación por escenas">
            <circle cx="200" cy="135" r="42" className="circadian-wave" strokeWidth="0.8" />
            <circle cx="200" cy="135" r="82" className="circadian-wave" strokeWidth="0.6" strokeDasharray="4 5" />
            <circle cx="200" cy="135" r="122" className="circadian-wave" strokeWidth="0.35" />
            <circle cx="200" cy="135" r="24" fill="#D8B36A" fillOpacity="0.32" stroke="none" />
            <path d="M190 126C190 111 210 111 210 126C210 139 202 144 200 152V157M193 157H207" strokeWidth="1.5" />
            <text x="50" y="276" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.18em]">INTENSIDAD · TEMPERATURA · ESCENAS</text>
          </svg>
        );
      case "smart-homes":
        return (
          <svg viewBox="0 0 400 300" className="h-full w-full fill-none stroke-brand-gold opacity-70" role="img" aria-label="Red local de automatización residencial">
            <path d="M100 80Q200 80 200 140M300 80Q200 80 200 140M200 140L130 210M200 140L270 210" strokeWidth="1" strokeDasharray="8 6" />
            {[[100,80,6],[300,80,6],[200,140,10],[130,210,6],[270,210,6]].map(([cx, cy, r]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} className="network-node" strokeWidth="1.3" fill="#07111D" />
            ))}
            <text x="50" y="276" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.18em]">RED LOCAL · SENSORES · CONTROL</text>
          </svg>
        );
      case "diseno-terrazas":
        return (
          <svg viewBox="0 0 400 300" className="h-full w-full fill-none stroke-brand-gold opacity-70" role="img" aria-label="Plano de distribución de terraza">
            <rect x="70" y="60" width="260" height="160" className="blueprint-line" strokeWidth="1" />
            <circle cx="200" cy="140" r="50" className="blueprint-line" strokeWidth="0.75" strokeDasharray="3 3" />
            <path d="M70 60L330 220M200 60V220M70 140H330" className="blueprint-line" strokeWidth="0.55" />
            <text x="50" y="276" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.18em]">MEDIDAS · APOYOS · ORIENTACIÓN</text>
          </svg>
        );
      case "mantenimiento-general":
        return (
          <svg viewBox="0 0 400 300" className="h-full w-full fill-none stroke-brand-gold opacity-70" role="img" aria-label="Control de nivel y acabado">
            <rect x="80" y="110" width="240" height="45" rx="22.5" strokeWidth="1.5" />
            <line x1="160" y1="110" x2="160" y2="155" strokeWidth="1" />
            <line x1="240" y1="110" x2="240" y2="155" strokeWidth="1" />
            <ellipse cx="155" cy="132.5" rx="15" ry="11" fill="#D8B36A" className="level-bubble" stroke="none" opacity="0.5" />
            <text x="50" y="276" className="fill-brand-gold stroke-none font-mono text-[8px] tracking-[0.18em]">NIVEL · ALINEACIÓN · ACABADO</text>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div ref={containerRef} className="flex aspect-square h-full w-full max-w-[280px] items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.01] p-5 shadow-[inset_0_12px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm">
      {renderGraphic()}
    </div>
  );
};

export default ServiceMotionGraphics;
