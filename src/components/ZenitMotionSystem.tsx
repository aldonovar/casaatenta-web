"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const ZenitMotionSystem: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactViewport = window.matchMedia("(max-width: 767px), (pointer: coarse)").matches;
    document.documentElement.dataset.motion = reducedMotion ? "reduced" : "full";

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const revealNodes = gsap.utils.toArray<HTMLElement>("[data-zenit-reveal]");
      revealNodes.forEach((node) => {
        const direction = node.dataset.zenitReveal ?? "up";
        const from = direction === "left"
          ? { x: -42, y: 0 }
          : direction === "right"
            ? { x: 42, y: 0 }
            : { x: 0, y: 42 };

        gsap.fromTo(
          node,
          { ...from, autoAlpha: 0 },
          {
            x: 0,
            y: 0,
            autoAlpha: 1,
            duration: 1.05,
            ease: "power3.out",
            scrollTrigger: {
              trigger: node,
              start: "top 86%",
              once: true,
            },
          },
        );
      });

      if (!compactViewport) {
        const parallaxNodes = gsap.utils.toArray<HTMLElement>("[data-zenit-parallax]");
        parallaxNodes.forEach((node) => {
          const depth = Number(node.dataset.zenitParallax ?? 8);
          gsap.fromTo(
            node,
            { yPercent: -depth },
            {
              yPercent: depth,
              ease: "none",
              scrollTrigger: {
                trigger: node.closest("section") ?? node,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.8,
              },
            },
          );
        });

        const scaleNodes = gsap.utils.toArray<HTMLElement>("[data-zenit-scale]");
        scaleNodes.forEach((node) => {
          gsap.fromTo(
            node,
            { scale: 1.08 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: node,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            },
          );
        });
      }

      const lineNodes = gsap.utils.toArray<HTMLElement>("[data-zenit-line]");
      lineNodes.forEach((node) => {
        gsap.fromTo(
          node,
          { scaleX: 0, transformOrigin: "0% 50%" },
          {
            scaleX: 1,
            duration: 1.2,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: node,
              start: "top 90%",
              once: true,
            },
          },
        );
      });
    });

    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 180);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [pathname]);

  return null;
};

export default ZenitMotionSystem;
