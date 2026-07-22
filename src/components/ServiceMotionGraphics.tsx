"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  isServiceMotionSlug,
  ServiceMotionScene,
  type ServiceMotionSlug,
} from "./service-motion/ServiceMotionScene";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ServiceMotionGraphicsProps = {
  slug: string;
  className?: string;
  decorative?: boolean;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function animateRoof(root: HTMLDivElement, select: gsap.utils.SelectorFunc) {
  const slats = select("[data-roof-slat]");
  const slatCount = slats.length;

  gsap
    .timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 84%",
        end: "bottom 22%",
        scrub: 0.8,
      },
    })
    .to(
      slats,
      {
        scaleY: 0.2,
        rotation: -7,
        stagger: 0.025,
        ease: "none",
        duration: 0.45,
      },
      0,
    )
    .to(
      slats,
      {
        x: (index) => (slatCount - 1 - index) * 34,
        stagger: 0.018,
        ease: "power2.inOut",
        duration: 0.55,
      },
      0.42,
    )
    .to("[data-roof-shadow]", { opacity: 0.2, duration: 0.6 }, 0)
    .to("[data-roof-rays]", { opacity: 0.86, duration: 0.46 }, 0)
    .to(
      "[data-roof-carriage]",
      { x: 274, duration: 0.55, ease: "power2.inOut" },
      0.42,
    )
    .to("[data-roof-measure]", { opacity: 0.62, duration: 0.22 }, 0.76);

  gsap.to("[data-roof-sun]", {
    scale: 1.09,
    opacity: 0.78,
    duration: 2.6,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    scrollTrigger: {
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play pause resume pause",
    },
  });
}

function animateLighting(root: HTMLDivElement) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 86%",
        end: "bottom 22%",
        scrub: 0.85,
      },
    })
    .to("[data-light-knob]", { x: 340, ease: "none", duration: 1 }, 0)
    .to(
      "[data-light-warm]",
      {
        opacity: 0.82,
        scale: 1.12,
        transformOrigin: "50% 50%",
        duration: 0.54,
      },
      0,
    )
    .to(
      "[data-light-cool]",
      { opacity: 0.14, scale: 0.9, transformOrigin: "50% 50%", duration: 0.54 },
      0,
    )
    .to("[data-light-warm]", { opacity: 0.2, duration: 0.46 }, 0.54)
    .to(
      "[data-light-cool]",
      { opacity: 0.82, scale: 1.1, duration: 0.46 },
      0.54,
    )
    .to("[data-light-beams]", { opacity: 0.74, duration: 0.7 }, 0.18);

  gsap.to("[data-light-orbit]", {
    rotation: 360,
    transformOrigin: "50% 50%",
    duration: 26,
    repeat: -1,
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play pause resume pause",
    },
  });
}

function animateSmartHome(
  root: HTMLDivElement,
  select: gsap.utils.SelectorFunc,
) {
  gsap.to("[data-smart-links]", {
    strokeDashoffset: -88,
    duration: 3,
    repeat: -1,
    ease: "none",
    scrollTrigger: {
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play pause resume pause",
    },
  });

  gsap.to("[data-smart-node]", {
    scale: 1.1,
    opacity: 0.98,
    stagger: { each: 0.18, from: "center" },
    duration: 1.5,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
    scrollTrigger: {
      trigger: root,
      start: "top bottom",
      end: "bottom top",
      toggleActions: "play pause resume pause",
    },
  });

  const packets = select("[data-smart-packet]");
  const destinations = [
    { x: -152, y: -24 },
    { x: 152, y: -24 },
    { x: -112, y: 106 },
    { x: 112, y: 106 },
  ];
  packets.forEach((packet, index) => {
    gsap.to(packet, {
      ...destinations[index],
      opacity: 0,
      duration: 1.8,
      delay: index * 0.24,
      repeat: -1,
      ease: "power1.inOut",
      scrollTrigger: {
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play pause resume pause",
      },
    });
  });
}

function animateTerrace(root: HTMLDivElement) {
  gsap.set("[data-terrace-volume], [data-terrace-furniture]", {
    opacity: 0.04,
    y: 28,
  });
  gsap
    .timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 86%",
        end: "bottom 20%",
        scrub: 0.8,
      },
    })
    .to("[data-terrace-plan]", { opacity: 0.28, y: -18, duration: 0.62 }, 0.24)
    .to("[data-terrace-volume]", { opacity: 0.88, y: 0, duration: 0.62 }, 0.18)
    .to(
      "[data-terrace-furniture]",
      { opacity: 0.76, y: 0, duration: 0.34 },
      0.62,
    )
    .to("[data-terrace-circulation]", { opacity: 0.64, duration: 0.3 }, 0.7)
    .to("[data-measure]", { opacity: 0.72, duration: 0.28 }, 0.72);
}

function animateMaintenance(root: HTMLDivElement) {
  gsap
    .timeline({
      scrollTrigger: {
        trigger: root,
        start: "top 86%",
        end: "bottom 20%",
        scrub: 0.8,
      },
    })
    .to("[data-maintenance-scan]", { x: 500, ease: "none", duration: 0.5 }, 0)
    .to("[data-maintenance-damage]", { opacity: 0.08, duration: 0.34 }, 0.42)
    .to("[data-maintenance-layers]", { opacity: 0.64, duration: 0.28 }, 0.22)
    .to(
      "[data-maintenance-layer]",
      {
        x: (index) => (index - 1) * 22,
        y: (index) => (index - 1) * -14,
        stagger: 0.04,
        duration: 0.34,
      },
      0.24,
    )
    .to(
      "[data-maintenance-layer]",
      { x: 0, y: 0, stagger: 0.04, duration: 0.26 },
      0.58,
    )
    .to("[data-maintenance-finish]", { opacity: 0.72, duration: 0.28 }, 0.7)
    .to(
      "[data-maintenance-bubble]",
      { x: 44, duration: 0.72, ease: "power2.out" },
      0.14,
    );
}

export function ServiceMotionGraphics({
  slug,
  className = "",
  decorative = false,
}: ServiceMotionGraphicsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = containerRef.current;
    if (!root || !isServiceMotionSlug(slug)) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    const context = gsap.context(() => {
      const select = gsap.utils.selector(root);
      const svg = root.querySelector<SVGSVGElement>("svg") ?? undefined;
      if (!svg) return;
      const revealTargets = select("[data-reveal]");
      const drawTargets = select("[data-draw]");

      gsap.set(svg, { autoAlpha: 1 });
      if (reducedMotion) {
        if (revealTargets.length) {
          gsap.set(revealTargets, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
          });
        }
        if (drawTargets.length) {
          gsap.set(drawTargets, { strokeDashoffset: 0 });
        }
        return;
      }

      const entrance = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: root,
          start: "top 90%",
          once: true,
        },
      });

      entrance.fromTo(
        svg,
        { autoAlpha: 0, scale: 0.96 },
        { autoAlpha: 1, scale: 1, duration: 0.75 },
      );

      if (revealTargets.length) {
        entrance.fromTo(
          revealTargets,
          { autoAlpha: 0, y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.55, stagger: 0.045 },
          "-=0.46",
        );
      }

      root
        .querySelectorAll<SVGGeometryElement>("[data-draw]")
        .forEach((path) => {
          const length =
            typeof path.getTotalLength === "function"
              ? path.getTotalLength()
              : 0;
          if (!length) return;
          gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
          entrance.to(
            path,
            { strokeDashoffset: 0, duration: 0.9, ease: "power2.inOut" },
            "<0.03",
          );
        });

      const animations: Record<ServiceMotionSlug, () => void> = {
        "techos-sol-y-sombra": () => animateRoof(root, select),
        "iluminacion-inteligente": () => animateLighting(root),
        "smart-homes": () => animateSmartHome(root, select),
        "diseno-terrazas": () => animateTerrace(root),
        "mantenimiento-general": () => animateMaintenance(root),
      };
      animations[slug]();
    }, root);

    return () => context.revert();
  }, [slug]);

  if (!isServiceMotionSlug(slug)) return null;

  return (
    <div
      ref={containerRef}
      data-service-motion={slug}
      className={`group relative flex aspect-[4/3] w-full max-w-[440px] items-center justify-center overflow-hidden rounded-[1.5rem] border border-white/[0.09] bg-[radial-gradient(circle_at_48%_34%,rgba(216,179,106,0.09),transparent_58%),linear-gradient(145deg,rgba(255,255,255,0.035),rgba(255,255,255,0.006))] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-40px_100px_rgba(0,0,0,0.28),0_30px_80px_rgba(0,0,0,0.16)] backdrop-blur-sm sm:p-5 ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(112deg,transparent_18%,rgba(255,255,255,0.035)_50%,transparent_82%)] opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
      <ServiceMotionScene slug={slug} decorative={decorative} />
    </div>
  );
}

export default ServiceMotionGraphics;
