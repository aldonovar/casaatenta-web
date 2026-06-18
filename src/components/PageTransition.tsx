"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { usePathname } from "next/navigation";
import { PreloaderParticles, getPreloaderDirection } from "./PreloaderParticles";

interface PageTransitionProps {
  children: React.ReactNode;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const logoPathRef1 = useRef<SVGCircleElement>(null);
  const logoPathRef2 = useRef<SVGCircleElement>(null);
  const logoPathRef3 = useRef<SVGPathElement>(null);
  const logoPathRef4 = useRef<SVGPathElement>(null);
  
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const isFirstRender = useRef(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setIsTransitioning(true);

    const direction = getPreloaderDirection(pathname);

    // Default: slide up
    let entryState: gsap.TweenVars = { xPercent: 0, yPercent: 100, scale: 1, opacity: 1 };
    let midState: gsap.TweenVars = { xPercent: 0, yPercent: 0, scale: 1, opacity: 1 };
    let exitState: gsap.TweenVars = { xPercent: 0, yPercent: -100, scale: 1, opacity: 1 };

    switch (direction) {
      case "up":
        entryState = { xPercent: 0, yPercent: 100, scale: 1, opacity: 1 };
        exitState = { xPercent: 0, yPercent: -100, scale: 1, opacity: 1 };
        break;
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
        entryState = { xPercent: 0, yPercent: 0, scale: 0.8, opacity: 0 };
        exitState = { xPercent: 0, yPercent: 0, scale: 1.25, opacity: 0 };
        break;
      case "radial-in":
        entryState = { xPercent: 0, yPercent: 0, scale: 1.25, opacity: 0 };
        exitState = { xPercent: 0, yPercent: 0, scale: 0.8, opacity: 0 };
        break;
      case "diagonal":
      default:
        entryState = { xPercent: -100, yPercent: 100, scale: 1, opacity: 1 };
        exitState = { xPercent: 100, yPercent: -100, scale: 1, opacity: 1 };
        break;
    }

    // Slide curtain, swap children, slide curtain out
    const ctx = gsap.context(() => {
      // Set initial values for drawing
      gsap.set(logoPathRef1.current, { strokeDasharray: 1040, strokeDashoffset: 1040 });
      gsap.set(logoPathRef2.current, { strokeDasharray: 755, strokeDashoffset: 755 });
      gsap.set(logoPathRef3.current, { strokeDasharray: 200, strokeDashoffset: 200 });
      gsap.set(logoPathRef4.current, { strokeDasharray: 100, strokeDashoffset: 100 });

      const tl = gsap.timeline({
        onComplete: () => {
          gsap.set(curtainRef.current, { display: "none" });
          setIsTransitioning(false);
        }
      });

      // 1. Move curtain to entry position and show it
      gsap.set(curtainRef.current, { ...entryState, display: "flex" });

      // 2. Slide curtain to cover viewport
      tl.to(curtainRef.current, {
        ...midState,
        duration: 0.55,
        ease: "power3.inOut",
      })
      // 3. Swap children while covered
      .call(() => {
        setDisplayChildren(children);
        window.scrollTo(0, 0);
      })
      // 4. Draw logo strokes inside curtain
      .to(logoPathRef1.current, { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" })
      .to(logoPathRef2.current, { strokeDashoffset: 0, duration: 0.5, ease: "power2.out" }, "-=0.4")
      .to([logoPathRef3.current, logoPathRef4.current], { strokeDashoffset: 0, duration: 0.35, ease: "power2.out" }, "-=0.25")
      // 5. Slide curtain to exit position
      .to(curtainRef.current, {
        ...exitState,
        duration: 0.55,
        ease: "power3.inOut",
        delay: 0.2,
      })
      // 6. Fade-in reveal of the new page
      .fromTo(
        containerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out", clearProps: "all" },
        "-=0.2"
      );
    });

    return () => ctx.revert();
  }, [pathname, children]);

  return (
    <div className="relative w-full">
      {/* Slide Curtain Overlay */}
      <div
        ref={curtainRef}
        className="fixed inset-0 z-[9999] bg-[#07111D] flex flex-col items-center justify-center pointer-events-none overflow-hidden hidden"
      >
        {/* Architectural grid overlay inside curtain */}
        <div className="absolute inset-0 z-0 opacity-[0.015] architectural-grid pointer-events-none" />

        {/* Dynamic transition stellar rain/constellation particles */}
        {isTransitioning && (
          <PreloaderParticles direction={getPreloaderDirection(pathname)} />
        )}

        <div className="flex flex-col items-center space-y-6 relative z-10">
          {/* Animated Isotipo */}
          <svg
            viewBox="0 0 560 560"
            className="w-24 h-24 md:w-32 md:h-32 fill-none stroke-white transition-all"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g strokeLinecap="round" strokeLinejoin="round">
              <circle
                ref={logoPathRef1}
                cx="280"
                cy="280"
                r="165"
                strokeWidth="20"
              />
              <circle
                ref={logoPathRef2}
                cx="280"
                cy="280"
                r="120"
                strokeWidth="5"
              />
              <path
                ref={logoPathRef3}
                d="M 221 262 L 280 229 L 339 262"
                strokeWidth="11"
              />
              <path
                ref={logoPathRef4}
                d="M 280 295 L 280 347"
                strokeWidth="11"
              />
            </g>
          </svg>
        </div>
      </div>

      <div ref={containerRef} className="w-full">
        {displayChildren}
      </div>
    </div>
  );
};
export default PageTransition;
