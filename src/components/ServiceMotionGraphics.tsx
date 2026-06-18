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
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      if (slug === "techos-sol-y-sombra") {
        // Louvre slats open/close rotation based on scroll position
        const slats = gsap.utils.toArray(".slat") as SVGLineElement[];
        gsap.to(slats, {
          transformOrigin: "50% 50%",
          rotate: 90, // Closed slats (horizontal) rotate to vertical
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      } else if (slug === "iluminacion-inteligente") {
        // Circadian light gradient color shifts and radius pulse
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });

        tl.to(".circadian-glow", {
          fill: "#F2D38D", // Warm golden light
          scale: 1.25,
          duration: 1,
        })
        .to(".circadian-glow", {
          fill: "#0C2742", // Night cool blue
          scale: 0.85,
          duration: 1,
        });

        // Pulsing circular wave outlines
        gsap.fromTo(".circadian-wave", 
          { r: 30, opacity: 0.8 },
          { r: 160, opacity: 0, duration: 3, repeat: -1, ease: "power1.out", stagger: 0.8 }
        );
      } else if (slug === "smart-homes") {
        // Technical connection line drawing
        const path = document.querySelector(".network-cable") as SVGPathElement;
        if (path) {
          const length = path.getTotalLength();
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });

          gsap.to(path, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "bottom 20%",
              scrub: true,
            },
          });
        }

        // Pulse dots blinking
        gsap.fromTo(".network-node", 
          { scale: 0.85, opacity: 0.4 },
          { scale: 1.15, opacity: 0.95, duration: 1.8, yoyo: true, repeat: -1, stagger: 0.25, ease: "sine.inOut" }
        );
      } else if (slug === "diseno-terrazas") {
        // Floorplan blueprint layout line-draws
        const drawLines = gsap.utils.toArray(".blueprint-line") as SVGPathElement[];
        drawLines.forEach((line) => {
          const length = line.getTotalLength();
          gsap.set(line, { strokeDasharray: length, strokeDashoffset: length });
          gsap.to(line, {
            strokeDashoffset: 0,
            ease: "power1.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "bottom 25%",
              scrub: true,
            },
          });
        });
      } else if (slug === "mantenimiento-general") {
        // Align technical bubble in level tool
        gsap.to(".level-bubble", {
          x: 45, // Slide bubble to perfect center calibration
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            end: "bottom 20%",
            scrub: true,
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [slug]);

  const renderSVG = () => {
    switch (slug) {
      case "techos-sol-y-sombra":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-gold fill-none opacity-60">
            {/* Frame outline */}
            <rect x="50" y="50" width="300" height="200" strokeWidth="1.5" />
            <line x1="50" y1="150" x2="350" y2="150" strokeWidth="0.5" strokeDasharray="3 6" />
            
            {/* Louvres/Slats */}
            <g strokeWidth="4">
              <line x1="100" y1="100" x2="100" y2="200" className="slat" />
              <line x1="150" y1="100" x2="150" y2="200" className="slat" />
              <line x1="200" y1="100" x2="200" y2="200" className="slat" />
              <line x1="250" y1="100" x2="250" y2="200" className="slat" />
              <line x1="300" y1="100" x2="300" y2="200" className="slat" />
            </g>

            {/* Louvre pivots */}
            <circle cx="100" cy="150" r="3" fill="#D8B36A" strokeWidth="1" />
            <circle cx="150" cy="150" r="3" fill="#D8B36A" strokeWidth="1" />
            <circle cx="200" cy="150" r="3" fill="#D8B36A" strokeWidth="1" />
            <circle cx="250" cy="150" r="3" fill="#D8B36A" strokeWidth="1" />
            <circle cx="300" cy="150" r="3" fill="#D8B36A" strokeWidth="1" />
            <text x="50" y="275" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.25em] uppercase">
              ÁNGULO BIOCLIMÁTICO
            </text>
          </svg>
        );
      case "iluminacion-inteligente":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-gold fill-none opacity-60">
            {/* Circadian waves */}
            <circle cx="200" cy="135" r="40" className="circadian-wave" strokeWidth="0.75" />
            <circle cx="200" cy="135" r="85" className="circadian-wave" strokeWidth="0.5" strokeDasharray="4 4" />
            <circle cx="200" cy="135" r="130" className="circadian-wave" strokeWidth="0.25" />
            
            {/* Central Glow */}
            <circle cx="200" cy="135" r="24" fill="#D8B36A" className="circadian-glow stroke-none opacity-50" />
            
            {/* Filament icon */}
            <path d="M 190 125 C 190 110, 210 110, 210 125 C 210 138, 202 143, 200 150 L 200 155 M 193 155 L 207 155" strokeWidth="1.5" />
            <text x="50" y="275" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.25em] uppercase">
              ESPECTRO SOLAR (1800K - 6500K)
            </text>
          </svg>
        );
      case "smart-homes":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-gold fill-none opacity-60">
            {/* Concentric Node Connections */}
            <circle cx="100" cy="80" r="6" className="network-node" strokeWidth="1" />
            <circle cx="300" cy="80" r="6" className="network-node" strokeWidth="1" />
            <circle cx="200" cy="140" r="10" className="network-node" strokeWidth="1.5" />
            <circle cx="130" cy="210" r="6" className="network-node" strokeWidth="1" />
            <circle cx="270" cy="210" r="6" className="network-node" strokeWidth="1" />
            
            {/* Path connecting nodes */}
            <path
              d="M 100 80 Q 200 80, 200 140 M 300 80 Q 200 80, 200 140 M 200 140 L 130 210 M 200 140 L 270 210"
              strokeWidth="1"
              className="network-cable"
            />
            <text x="50" y="275" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.25em] uppercase">
              RUTAS DE DATOS INALÁMBRICAS
            </text>
          </svg>
        );
      case "diseno-terrazas":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-gold fill-none opacity-60">
            {/* Floorplan CAD blueprint */}
            <rect x="70" y="60" width="260" height="160" strokeWidth="1" className="blueprint-line" />
            <circle cx="200" cy="140" r="50" strokeWidth="0.75" className="blueprint-line" strokeDasharray="3 3" />
            <path d="M 70 60 L 330 220" strokeWidth="0.5" strokeDasharray="5 10" className="blueprint-line" />
            <line x1="200" y1="60" x2="200" y2="220" strokeWidth="0.5" className="blueprint-line" />
            <line x1="70" y1="140" x2="330" y2="140" strokeWidth="0.5" className="blueprint-line" />
            <text x="50" y="275" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.25em] uppercase">
              GEOMETRÍA Y ORIENTACIÓN CAD
            </text>
          </svg>
        );
      case "mantenimiento-general":
        return (
          <svg viewBox="0 0 400 300" className="w-full h-full stroke-brand-gold fill-none opacity-60">
            {/* Level Tool SVG */}
            <rect x="80" y="110" width="240" height="45" rx="22.5" strokeWidth="1.5" />
            <line x1="160" y1="110" x2="160" y2="155" strokeWidth="1" />
            <line x1="240" y1="110" x2="240" y2="155" strokeWidth="1" />
            
            {/* Bubble */}
            <ellipse cx="155" cy="132.5" rx="15" ry="11" fill="#D8B36A" className="level-bubble stroke-none opacity-50" />
            <text x="50" y="275" className="fill-brand-gold stroke-none font-mono text-[9px] tracking-[0.25em] uppercase">
              CALIBRACIÓN DE SUPERFICIES
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
      className="w-full h-full max-w-[280px] aspect-square flex items-center justify-center border border-white/[0.07] rounded-2xl bg-white/[0.01] p-5 shadow-[inset_0_12px_24px_rgba(0,0,0,0.3)] backdrop-blur-sm"
    >
      {renderSVG()}
    </div>
  );
};
export default ServiceMotionGraphics;
