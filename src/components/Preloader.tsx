"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const contentWrapperRef = useRef<HTMLDivElement>(null);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if the user has already visited in this session
    const hasVisited = sessionStorage.getItem("casa-atenta-preloader-visited");
    
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("casa-atenta-preloader-visited", "true");
          setIsDone(true);
        },
      });

      // Clear styles to prevent flash
      gsap.set(containerRef.current, { display: "flex" });

      if (hasVisited) {
        // Fast preloader on revisit
        tl.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        });
      } else {
        // Full cinematic preloader on first load
        gsap.set(progressLineRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".preloader-text-reveal", { y: 20, opacity: 0 });

        const counter = { value: 0 };
        
        // Timeline
        tl.to(".preloader-text-reveal", {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        })
        .to(counter, {
          value: 100,
          duration: 2.8,
          ease: "power2.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              // Ensure 3 digits for a technical/monumental look: 000 to 100
              const val = Math.round(counter.value).toString().padStart(3, "0");
              counterRef.current.innerText = val;
            }
          },
        }, "-=0.4")
        .to(progressLineRef.current, {
          scaleX: 1,
          duration: 2.8,
          ease: "power2.inOut",
        }, "<") // Sync with counter
        .to(".preloader-text-reveal", {
          y: -20,
          opacity: 0,
          duration: 0.6,
          ease: "power3.in",
          delay: 0.3
        })
        .to(progressLineRef.current, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.6,
          ease: "power3.in",
        }, "<")
        // Curtain Slide Out
        .to(containerRef.current, {
          yPercent: -100,
          duration: 1.2,
          ease: "power4.inOut",
        }, "-=0.1");
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-ca-bg-deep text-ca-text overflow-hidden"
      style={{ display: "none" }}
    >
      {/* Noise Overlay for cinematic feel */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      <div ref={contentWrapperRef} className="w-full px-6 md:px-12 lg:px-24 pb-16 md:pb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div className="preloader-text-reveal space-y-3 mb-12 md:mb-0">
            <p className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-ca-text-secondary">
              Cargando Experiencia
            </p>
            <h2 className="text-base md:text-lg lg:text-xl font-display font-light tracking-[0.2em] uppercase">
              Casa Atenta <span className="mx-3 text-ca-border-hover">/</span> Arte + Automatización
            </h2>
          </div>
          
          <div className="preloader-text-reveal flex items-baseline">
            <span 
              ref={counterRef} 
              className="text-5xl md:text-7xl lg:text-8xl font-display font-light leading-none tracking-tight"
            >
              000
            </span>
            <span className="text-xl md:text-2xl font-light text-ca-text-secondary ml-2 md:ml-4 mb-1 md:mb-2">%</span>
          </div>
        </div>

        {/* Physical Progress Bar */}
        <div className="w-full h-[1px] md:h-[2px] bg-ca-border relative">
          <div 
            ref={progressLineRef}
            className="absolute top-0 left-0 w-full h-full bg-ca-text origin-left"
          />
        </div>
      </div>
    </div>
  );
};

export default Preloader;
