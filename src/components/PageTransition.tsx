"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { PreloaderParticles, getPreloaderDirection } from "./PreloaderParticles";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoPathRef1 = useRef<SVGCircleElement>(null);
  const logoPathRef2 = useRef<SVGCircleElement>(null);
  const logoPathRef3 = useRef<SVGPathElement>(null);
  const logoPathRef4 = useRef<SVGPathElement>(null);
  const isFirstRender = useRef(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const curtain = curtainRef.current;
    if (!container || !curtain) return;

    gsap.killTweensOf([
      container,
      curtain,
      logoPathRef1.current,
      logoPathRef2.current,
      logoPathRef3.current,
      logoPathRef4.current,
    ]);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      gsap.set(curtain, { display: "none" });
      gsap.set(container, { autoAlpha: 1, x: 0, y: 0, clearProps: "transform" });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      setIsTransitioning(false);
      gsap.set(curtain, { display: "none" });
      gsap.set(container, { autoAlpha: 1, x: 0, y: 0, clearProps: "transform" });
      return;
    }

    const direction = getPreloaderDirection(pathname);
    let entryState: gsap.TweenVars = { xPercent: 0, yPercent: 100, scale: 1, opacity: 1 };
    let exitState: gsap.TweenVars = { xPercent: 0, yPercent: -100, scale: 1, opacity: 1 };

    switch (direction) {
      case "down":
        entryState = { xPercent: 0, yPercent: -100, scale: 1, opacity: 1 };
        exitState = { xPercent: 0, yPercent: 100, scale: 1, opacity: 1 };
        break;
      case "right":
        entryState = { xPercent: -100, yPercent: 0, scale: 1, opacity: 1 };
        exitState = { xPercent: 100, yPercent: 0, scale: 1, opacity: 1 };
        break;
      case "left":
        entryState = { xPercent: 100, yPercent: 0, scale: 1, opacity: 1 };
        exitState = { xPercent: -100, yPercent: 0, scale: 1, opacity: 1 };
        break;
      case "radial-out":
        entryState = { xPercent: 0, yPercent: 0, scale: 0.84, opacity: 0 };
        exitState = { xPercent: 0, yPercent: 0, scale: 1.18, opacity: 0 };
        break;
      case "radial-in":
        entryState = { xPercent: 0, yPercent: 0, scale: 1.18, opacity: 0 };
        exitState = { xPercent: 0, yPercent: 0, scale: 0.84, opacity: 0 };
        break;
      case "diagonal":
        entryState = { xPercent: -100, yPercent: 100, scale: 1, opacity: 1 };
        exitState = { xPercent: 100, yPercent: -100, scale: 1, opacity: 1 };
        break;
      case "up":
      default:
        break;
    }

    setIsTransitioning(true);
    gsap.set(container, { autoAlpha: 0, y: 12 });
    gsap.set(curtain, { ...entryState, display: "flex" });
    gsap.set(logoPathRef1.current, { strokeDasharray: 1040, strokeDashoffset: 1040 });
    gsap.set(logoPathRef2.current, { strokeDasharray: 755, strokeDashoffset: 755 });
    gsap.set(logoPathRef3.current, { strokeDasharray: 200, strokeDashoffset: 200 });
    gsap.set(logoPathRef4.current, { strokeDasharray: 100, strokeDashoffset: 100 });

    const timeline = gsap.timeline({
      onComplete: () => {
        gsap.set(curtain, { display: "none" });
        gsap.set(container, { clearProps: "transform,opacity,visibility" });
        setIsTransitioning(false);
      },
    });

    timeline
      .to(curtain, {
        xPercent: 0,
        yPercent: 0,
        scale: 1,
        opacity: 1,
        duration: 0.42,
        ease: "power3.inOut",
      })
      .to(logoPathRef1.current, { strokeDashoffset: 0, duration: 0.34, ease: "power2.out" })
      .to(logoPathRef2.current, { strokeDashoffset: 0, duration: 0.3, ease: "power2.out" }, "-=0.25")
      .to([logoPathRef3.current, logoPathRef4.current], { strokeDashoffset: 0, duration: 0.24, ease: "power2.out" }, "-=0.18")
      .to(curtain, { ...exitState, duration: 0.42, ease: "power3.inOut" })
      .to(container, { autoAlpha: 1, y: 0, duration: 0.36, ease: "power2.out" }, "-=0.28");

    return () => {
      timeline.kill();
      gsap.set(curtain, { display: "none" });
      gsap.set(container, { autoAlpha: 1, x: 0, y: 0, clearProps: "transform,opacity,visibility" });
      setIsTransitioning(false);
    };
  }, [pathname]);

  return (
    <div className="relative w-full">
      <div
        ref={curtainRef}
        className="pointer-events-none fixed inset-0 z-[9999] hidden flex-col items-center justify-center overflow-hidden bg-[#07111D]"
        aria-hidden="true"
      >
        <div className="architectural-grid pointer-events-none absolute inset-0 z-0 opacity-[0.015]" />
        {isTransitioning && <PreloaderParticles direction={getPreloaderDirection(pathname)} />}
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <svg
            viewBox="0 0 560 560"
            className="h-24 w-24 fill-none stroke-white md:h-32 md:w-32"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeLinecap="round" strokeLinejoin="round">
              <circle ref={logoPathRef1} cx="280" cy="280" r="165" strokeWidth="20" />
              <circle ref={logoPathRef2} cx="280" cy="280" r="120" strokeWidth="5" />
              <path ref={logoPathRef3} d="M 221 262 L 280 229 L 339 262" strokeWidth="11" />
              <path ref={logoPathRef4} d="M 280 295 L 280 347" strokeWidth="11" />
            </g>
          </svg>
        </div>
      </div>

      <div ref={containerRef} className="w-full">
        {children}
      </div>
    </div>
  );
};

export default PageTransition;
