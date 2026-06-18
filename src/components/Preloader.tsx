"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { PreloaderParticles, getPreloaderDirection } from "./PreloaderParticles";

export const Preloader: React.FC = () => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
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
          duration: 0.6,
          ease: "power4.inOut",
        });
      } else {
        // Complete cinematic logo drawing preloader
        // 1. Set initial states of SVG paths
        gsap.set(".logo-svg-circle-outer", { strokeDasharray: 1040, strokeDashoffset: 1040 });
        gsap.set(".logo-svg-circle-inner", { strokeDasharray: 755, strokeDashoffset: 755 });
        gsap.set(".logo-svg-roof", { strokeDasharray: 200, strokeDashoffset: 200 });
        gsap.set(".logo-svg-vertical", { strokeDasharray: 100, strokeDashoffset: 100 });
        gsap.set(".logo-glow", { opacity: 0, scale: 0.8 });

        // 2. Build GSAP timeline
        // Draw the outer icon circle
        tl.to(".logo-svg-circle-outer", {
          strokeDashoffset: 0,
          duration: 1.2,
          ease: "power2.inOut",
        })
        // Draw the inner circle
        .to(".logo-svg-circle-inner", {
          strokeDashoffset: 0,
          duration: 1.0,
          ease: "power2.inOut",
        }, "-=0.8")
        // Draw the sensor roof and vertical line
        .to([".logo-svg-roof", ".logo-svg-vertical"], {
          strokeDashoffset: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power2.out",
        }, "-=0.5")
        // Add ambient glow behind the logo
        .to(".logo-glow", {
          opacity: 0.25,
          scale: 1.05,
          duration: 1.2,
          ease: "sine.inOut",
        }, "-=0.8")
        // Logo final pop and fade out
        .to(".preloader-logo-wrapper", {
          scale: 1.03,
          filter: "blur(4px)",
          opacity: 0,
          duration: 0.5,
          ease: "power2.in",
          delay: 0.3,
        })
        // Slide out the background curtain
        .to(containerRef.current, {
          yPercent: -100,
          duration: 0.8,
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

      {/* Stellar rain and constellation background particles */}
      <PreloaderParticles direction={getPreloaderDirection(pathname)} />

      {/* Center Wrapper for Logo Icon */}
      <div className="relative flex flex-col items-center max-w-[90vw] px-6">
        
        {/* Soft white backdrop radial glow */}
        <div className="logo-glow absolute w-64 h-64 rounded-full bg-white/10 filter blur-3xl opacity-0 scale-90 pointer-events-none z-0" />

        <div className="preloader-logo-wrapper relative z-10 w-28 h-28 md:w-36 md:h-36 select-none pointer-events-none">
          {/* Logo inline paths to allow stroke-drawing animations */}
          <svg
            viewBox="0 0 760 760"
            className="w-full h-full fill-none stroke-white transition-all"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeLinecap="round" strokeLinejoin="round">
              {/* Outer Circle (radius 165, circumference ~1036) */}
              <circle
                cx="380"
                cy="380"
                r="165"
                strokeWidth="24"
                className="logo-svg-circle-outer"
              />
              {/* Inner Circle (radius 120, circumference ~754) */}
              <circle
                cx="380"
                cy="380"
                r="120"
                strokeWidth="7"
                className="logo-svg-circle-inner"
              />
              {/* Sensor roof path (length ~135) */}
              <path
                d="M 321 362 L 380 329 L 439 362"
                strokeWidth="15"
                className="logo-svg-roof"
              />
              {/* Sensor vertical path (length 52) */}
              <path
                d="M 380 395 L 380 447"
                strokeWidth="15"
                className="logo-svg-vertical"
              />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
