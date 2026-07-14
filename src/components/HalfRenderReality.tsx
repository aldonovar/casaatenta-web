"use client";

import Image from "next/image";
import React, { useState, useRef } from "react";
import { homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";

export const HalfRenderReality: React.FC = () => {
  const [sliderPos, setSliderPos] = useState(50); // percentage (0 - 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const handleMove = (clientX: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.current) return;
    handleMove(e.touches[0].clientX);
  };

  const handlePointerMove = (e: PointerEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const handlePointerUp = () => {
    isDragging.current = false;
    document.removeEventListener("pointermove", handlePointerMove);
    document.removeEventListener("pointerup", handlePointerUp);
    document.removeEventListener("touchmove", handleTouchMove);
    document.removeEventListener("touchend", handlePointerUp);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    handleMove(e.clientX);
    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handlePointerUp);
  };

  return (
    <section
      id="half-render-reality"
      className="relative z-20 overflow-hidden bg-ca-bg-surface px-6 py-28 md:px-16 md:py-36 lg:px-28 border-t border-ca-border"
    >
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20">
          <SectionHeading
            number="06"
            label={homeCopy.halfReality.label}
            title={homeCopy.halfReality.title}
            subtitle={homeCopy.halfReality.subtitle}
          />
        </div>

        {/* Wipe Slider Container */}
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          className="relative aspect-[16/9] w-full border border-ca-border rounded-2xl overflow-hidden cursor-ew-resize select-none bg-ca-bg-deep shadow-2xl"
        >
          
          {/* LADO B: REALIDAD TERMINADA (Fondo completo, se revela recortando el Lado A) */}
          <div className="absolute inset-0 w-full h-full">
            <Image
              src="/media/cases/terraza-inteligente/after.png"
              alt="Realidad terminada Casa Atenta"
              fill
              sizes="(max-width: 768px) calc(100vw - 3rem), (max-width: 1280px) calc(100vw - 8rem), 1280px"
              className="object-cover"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-brand-dark/30" />
            
            {/* Label lower right */}
            <span className="absolute bottom-6 right-6 font-mono text-[9px] text-ca-text uppercase tracking-[0.25em] bg-ca-bg-deep/80 px-3 py-1.5 border border-ca-border rounded">
              FOTOGRAFÍA / CASO TERMINADO
            </span>
          </div>

          {/* LADO A: PROPUESTA / BLUEPRINT (Superpuesto, recortado dinámicamente) */}
          <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{
              clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
            }}
          >
            {/* Blueprint image (we apply filters to look like a blueprint sketch) */}
            <Image
              src="/media/cases/terraza-inteligente/before.png"
              alt="Esquema propuesta Casa Atenta"
              fill
              sizes="(max-width: 768px) calc(100vw - 3rem), (max-width: 1280px) calc(100vw - 8rem), 1280px"
              className="object-cover filter grayscale invert contrast-125 brightness-75 opacity-70"
            />
            
            {/* Blue tint mix to feel like architectural blueprint */}
            <div className="absolute inset-0 bg-gradient-to-br from-ca-blue-gray/25 to-transparent mix-blend-color" />
            <div className="absolute inset-0 bg-ca-bg-deep/30" />
            
            {/* Technical grid lines overlay */}
            <div className="absolute inset-0 opacity-15 cad-technical-grid pointer-events-none" />

            {/* Label lower left */}
            <span className="absolute bottom-6 left-6 font-mono text-[9px] text-brand-gold uppercase tracking-[0.25em] bg-ca-bg-deep/80 px-3 py-1.5 border border-ca-border rounded">
              PROPUESTA TÉCNICA / ANTES
            </span>
          </div>

          {/* SLIDER BAR & HANDLE */}
          <div
            className="absolute top-0 bottom-0 w-[1px] bg-brand-gold/60 z-30 pointer-events-none"
            style={{ left: `${sliderPos}%` }}
          >
            {/* Drag Handle */}
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full border border-brand-gold/60 bg-ca-bg-deep flex items-center justify-center shadow-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-4 h-4 text-brand-gold"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                />
              </svg>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default HalfRenderReality;
