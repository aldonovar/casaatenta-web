"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

export const ManifestoSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        ruleRef.current,
        { width: 0 },
        { width: "min(16rem, 45vw)", duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          textRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
          "-=0.3"
        );
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="ca-section relative"
      id="manifesto"
    >
      {/* Subtle architectural grid overlay */}
      <div className="absolute inset-0 architectural-grid opacity-40 pointer-events-none" />

      <div className="ca-container relative z-10 flex flex-col items-center text-center">
        <span className="ca-kicker mb-6">Manifiesto</span>

        <div
          ref={ruleRef}
          className="mb-8"
          style={{
            height: "1px",
            width: 0,
            background:
              "linear-gradient(90deg, transparent, var(--ca-gold), transparent)",
          }}
        />

        <h2
          ref={headingRef}
          className="ca-heading max-w-4xl mb-8"
          style={{ opacity: 0 }}
        >
          No instalamos elementos aislados.
          <br />
          <span
            className="font-serif italic font-light"
            style={{ color: "var(--ca-gold)" }}
          >
            Diseñamos experiencias habitables.
          </span>
        </h2>

        <p
          ref={textRef}
          className="ca-body mx-auto text-center max-w-2xl"
          style={{ opacity: 0 }}
        >
          Cada proyecto empieza con una visita técnica gratuita para entender tu espacio. A partir de ahí, diseñamos la iluminación, automatización y acabados ideales para que tu hogar en Lima funcione con inteligencia, comodidad y estilo.
        </p>
      </div>
    </section>
  );
};
