"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { gsap } from "gsap";

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  beforeAlt?: string;
  afterAlt?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforeImage,
  afterImage,
  beforeLabel = "Antes",
  afterLabel = "Después",
  beforeAlt = "Espacio antes de la intervención",
  afterAlt = "Espacio después de la intervención",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPos, setSliderPos] = useState(50);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );
    });
    return () => ctx.revert();
  }, []);

  const getPosition = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return 50;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      return Math.max(0, Math.min(100, (x / rect.width) * 100));
    },
    []
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      isDragging.current = true;
      setSliderPos(getPosition(e.clientX));
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [getPosition]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging.current) return;
      setSliderPos(getPosition(e.clientX));
    },
    [getPosition]
  );

  const handlePointerUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto w-full max-w-5xl cursor-col-resize select-none overflow-hidden rounded-xl border border-ca-border shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
      style={{ aspectRatio: "16/9" }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      role="slider"
      aria-label="Comparación antes y después"
      aria-valuenow={Math.round(sliderPos)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
    >
      {/* After image (full width background) */}
      <div className="absolute inset-0">
        <Image
          src={afterImage}
          alt={afterAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority
        />
      </div>

      {/* Before image (clipped) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPos}%` }}
      >
        <div className="relative h-full" style={{ width: `${100 / (sliderPos / 100)}%` }}>
          <Image
            src={beforeImage}
            alt={beforeAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </div>
      </div>

      {/* Slider line */}
      <div
        className="absolute top-0 z-20 h-full w-[2px]"
        style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
      >
        <div className="h-full w-full bg-brand-gold shadow-[0_0_12px_rgba(216,179,106,0.4)]" />
        {/* Handle */}
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-brand-gold bg-ca-bg-deep/80 backdrop-blur-sm shadow-lg"
        >
          <svg
            className="h-4 w-4 text-brand-gold"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7l-4 5 4 5" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7l4 5-4 5" />
          </svg>
        </div>
      </div>

      {/* Labels */}
      <div className="absolute bottom-4 left-4 z-10">
        <span className="rounded bg-ca-bg-deep/70 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-ca-text backdrop-blur-sm border border-ca-border">
          {beforeLabel}
        </span>
      </div>
      <div className="absolute bottom-4 right-4 z-10">
        <span className="rounded bg-brand-gold/90 px-3 py-1.5 text-[10px] font-mono uppercase tracking-widest text-ca-bg-deep">
          {afterLabel}
        </span>
      </div>
    </div>
  );
};
