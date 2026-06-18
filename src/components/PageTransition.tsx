"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { BrandText } from "./BrandText";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const transitionRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // If it's the very first mount of the application, skip the curtain animation
    // to avoid conflicting with the cinematic Preloader
    if (isFirstRender.current) {
      isFirstRender.current = false;
      
      const ctx = gsap.context(() => {
        gsap.fromTo(
          transitionRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.5, ease: "power2.out" }
        );
      });
      return () => ctx.revert();
    }

    // Subsequent route changes: run the full sliding curtain transition
    const ctx = gsap.context(() => {
      gsap.set(curtainRef.current, { yPercent: 0, display: "flex" });

      gsap
        .timeline()
        .to(curtainRef.current, {
          yPercent: -100,
          duration: 0.6,
          ease: "power3.inOut",
        })
        .set(curtainRef.current, { display: "none" })
        .fromTo(
          transitionRef.current,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
            clearProps: "transform", // Crucial to prevent breaking fixed/pinned children ScrollTriggers
          },
          "-=0.25"
        );
    });

    return () => ctx.revert();
  }, [pathname]);

  return (
    <div className="relative w-full">
      {/* Page Curtain Slide Transition Overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[999] bg-ca-bg-deep flex flex-col items-center justify-center pointer-events-none hidden"
      >
        <div className="flex flex-col items-center space-y-4">
          {/* Subtle Logo Sensor Icon */}
          <svg
            viewBox="0 0 760 760"
            className="w-10 h-10 fill-none stroke-brand-gold opacity-50"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeLinecap="round" strokeLinejoin="round" strokeWidth="16">
              <circle cx="380" cy="380" r="165" />
              <path d="M 321 362 L 380 329 L 439 362" />
            </g>
          </svg>
          <span className="text-[10px] font-mono tracking-[0.35em] text-brand-gold uppercase opacity-80">
            <BrandText>CASA ATENTA</BrandText>
          </span>
        </div>
      </div>

      <div ref={transitionRef} className="w-full">
        {children}
      </div>
    </div>
  );
};
