"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const Preloader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
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

      // Show container
      gsap.set(containerRef.current, { display: "flex", opacity: 1 });

      if (hasVisited) {
        // Fast preloader on revisit (fade and slide up quickly)
        tl.to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
          ease: "power4.inOut",
        });
      } else {
        // Complete cinematic logo drawing preloader
        // 1. Set initial states of SVG paths
        // Isotipo (sensor-icon)
        gsap.set(".logo-svg-circle-outer", { strokeDasharray: 1040, strokeDashoffset: 1040 });
        gsap.set(".logo-svg-circle-inner", { strokeDasharray: 755, strokeDashoffset: 755 });
        gsap.set(".logo-svg-roof", { strokeDasharray: 200, strokeDashoffset: 200 });
        gsap.set(".logo-svg-vertical", { strokeDasharray: 100, strokeDashoffset: 100 });
        
        // Wordmark (letters)
        const letters = gsap.utils.toArray(".logo-wordmark path");
        gsap.set(letters, { opacity: 0, scale: 0.85, transformOrigin: "50% 50%" });
        
        // Progress elements
        gsap.set(progressLineRef.current, { scaleX: 0, transformOrigin: "left center" });
        gsap.set(".preloader-ui", { opacity: 0, y: 15 });

        const counter = { value: 0 };

        // 2. Build GSAP timeline
        tl.to(".preloader-ui", {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        })
        // Draw the outer icon circle
        .to(".logo-svg-circle-outer", {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
        }, "-=0.2")
        // Draw the inner circle
        .to(".logo-svg-circle-inner", {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
        }, "-=1.0")
        // Draw the sensor roof and vertical line
        .to([".logo-svg-roof", ".logo-svg-vertical"], {
          strokeDashoffset: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.6")
        // Stagger fade-in and scale-in of wordmark letters
        .to(letters, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          stagger: 0.06,
          ease: "back.out(1.5)",
        }, "-=0.4")
        // Add ambient glow behind the logo
        .to(".logo-glow", {
          opacity: 0.22,
          scale: 1.1,
          duration: 1.5,
          ease: "sine.inOut",
        }, "-=1.2")
        // Count from 0 to 100%
        .to(counter, {
          value: 100,
          duration: 2.5,
          ease: "power1.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              const val = Math.round(counter.value).toString().padStart(3, "0");
              counterRef.current.innerText = val;
            }
          },
        }, "-=2.2")
        // Scale loading progress line
        .to(progressLineRef.current, {
          scaleX: 1,
          duration: 2.5,
          ease: "power1.inOut",
        }, "<")
        // Logo final pop and fade out
        .to(".preloader-logo-wrapper", {
          scale: 1.04,
          filter: "blur(4px)",
          opacity: 0,
          duration: 0.6,
          ease: "power2.in",
          delay: 0.2,
        })
        .to(".preloader-ui", {
          opacity: 0,
          y: -10,
          duration: 0.4,
          ease: "power2.in",
        }, "<")
        // Slide out the background curtain
        .to(containerRef.current, {
          yPercent: -100,
          duration: 1.0,
          ease: "power4.inOut",
        }, "-=0.2");
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  if (isDone) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-ca-bg-deep text-ca-text overflow-hidden"
      style={{ display: "none" }}
    >
      {/* Cinematic noise film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Center Wrapper for Logo */}
      <div className="relative flex flex-col items-center max-w-[90vw] md:max-w-2xl px-6">
        
        {/* Soft gold backdrop radial glow */}
        <div className="logo-glow absolute w-72 h-72 rounded-full bg-brand-gold/15 filter blur-3xl opacity-0 scale-90 pointer-events-none z-0" />

        <div className="preloader-logo-wrapper relative z-10 w-full mb-16 select-none pointer-events-none">
          {/* Logo inline paths to allow stroke-drawing animations */}
          <svg
            viewBox="0 0 2400 760"
            className="w-full h-auto fill-none stroke-brand-gold transition-all"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeLinecap="round" strokeLinejoin="round">
              {/* Isotipo: Sensor Icon */}
              <g id="sensor-icon">
                {/* Outer Circle (radius 165, circumference ~1036) */}
                <circle
                  cx="280"
                  cy="380"
                  r="165"
                  strokeWidth="22"
                  className="logo-svg-circle-outer"
                />
                {/* Inner Circle (radius 120, circumference ~754) */}
                <circle
                  cx="280"
                  cy="380"
                  r="120"
                  strokeWidth="6"
                  className="logo-svg-circle-inner"
                />
                {/* Sensor roof path (length ~192) */}
                <path
                  d="M 221 362 L 280 329 L 339 362"
                  strokeWidth="13"
                  className="logo-svg-roof"
                />
                {/* Sensor vertical path (length 52) */}
                <path
                  d="M 280 395 L 280 447"
                  strokeWidth="13"
                  className="logo-svg-vertical"
                />
              </g>

              {/* Wordmark word: CASA ATENTA */}
              <g id="wordmark" className="logo-wordmark" strokeWidth="8">
                {/* C */}
                <path d="M 704.40 318.90 C 651.30 318.90 615.90 354.30 615.90 395.60 C 615.90 436.90 651.30 472.30 704.40 472.30" />
                {/* A (lambda/chevron) */}
                <path d="M 776.00 472.30 L 826.74 318.90 L 877.48 472.30" />
                {/* S */}
                <path d="M 1042.30 334.24 C 1015.16 315.36 963.24 316.54 957.34 357.84 C 951.44 395.60 1042.30 383.80 1038.76 429.82 C 1035.22 477.02 978.58 479.38 947.90 454.60" />
                {/* A */}
                <path d="M 1113.90 472.30 L 1164.64 318.90 L 1215.38 472.30" />
                {/* A */}
                <path d="M 1380.80 472.30 L 1431.54 318.90 L 1482.28 472.30" />
                {/* T */}
                <path d="M 1546.80 318.90 L 1658.90 318.90 M 1602.85 318.90 L 1602.85 472.30" />
                {/* E */}
                <path d="M 1815.46 318.90 L 1724.60 318.90 L 1724.60 472.30 L 1817.82 472.30 M 1724.60 395.60 L 1801.30 395.60" />
                {/* N */}
                <path d="M 1890.60 472.30 L 1890.60 318.90 L 1990.90 472.30 L 1990.90 318.90" />
                {/* T */}
                <path d="M 2056.60 318.90 L 2168.70 318.90 M 2112.65 318.90 L 2112.65 472.30" />
                {/* A */}
                <path d="M 2234.40 472.30 L 2285.14 318.90 L 2335.88 472.30" />
              </g>
            </g>
          </svg>
        </div>

        {/* UI Loading Indicator beneath the logo */}
        <div className="preloader-ui w-64 md:w-80 flex flex-col items-center">
          <div className="w-full h-[1px] bg-white/10 relative overflow-hidden mb-3">
            <div
              ref={progressLineRef}
              className="absolute top-0 left-0 h-full w-full bg-brand-gold"
            />
          </div>
          
          <div className="flex items-center justify-between w-full text-[9px] font-mono tracking-[0.25em] text-ca-text-secondary uppercase">
            <span>SISTEMA ATENTO</span>
            <div className="flex items-baseline font-mono text-[10px] text-brand-gold font-medium">
              <span ref={counterRef}>000</span>
              <span className="text-[8px] ml-0.5">%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
