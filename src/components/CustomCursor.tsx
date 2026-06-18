"use client";
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export const CustomCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");

  useEffect(() => {
    // Disable custom cursor on touch devices or if reduced motion is enabled
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (isTouch || prefersReducedMotion) {
      return;
    }

    // Set body class to hide default cursor
    document.documentElement.classList.add("use-custom-cursor");

    const cursor = cursorRef.current;
    const dot = cursorDotRef.current;

    if (!cursor || !dot) return;

    // Set initial positions off-screen
    gsap.set(cursor, { x: -100, y: -100, xPercent: -50, yPercent: -50 });
    gsap.set(dot, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    // Interpolation loops using gsap.quickTo (highly optimized for responsiveness)
    const xToCursor = gsap.quickTo(cursor, "x", { duration: 0.12, ease: "power3.out" });
    const yToCursor = gsap.quickTo(cursor, "y", { duration: 0.12, ease: "power3.out" });

    const xToDot = gsap.quickTo(dot, "x", { duration: 0.01, ease: "power2.out" });
    const yToDot = gsap.quickTo(dot, "y", { duration: 0.01, ease: "power2.out" });

    const moveCursor = (e: MouseEvent) => {
      xToCursor(e.clientX);
      yToCursor(e.clientY);
      xToDot(e.clientX);
      yToDot(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      // Link/Button Hover State
      const isInteractive =
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        Boolean(target.closest("button")) ||
        Boolean(target.closest("a")) ||
        target.classList.contains("cursor-pointer") ||
        Boolean(target.closest(".cursor-pointer"));

      // Project Hover State
      const isProjectCard =
        target.classList.contains("project-card-hover") ||
        Boolean(target.closest(".project-card-hover"));

      // CTA Hover State
      const isCta =
        target.classList.contains("glow-btn") ||
        Boolean(target.closest(".glow-btn"));

      if (isProjectCard) {
        setLabel("VER");
        gsap.to(cursor, {
          width: 80,
          height: 80,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderColor: "rgba(255, 255, 255, 0.8)",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.3,
          overwrite: "auto",
        });
      } else if (isCta) {
        setLabel("");
        gsap.to(cursor, {
          width: 50,
          height: 50,
          backgroundColor: "rgba(255, 255, 255, 0.15)",
          borderColor: "rgba(255, 255, 255, 0.9)",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.3,
          overwrite: "auto",
        });
      } else if (isInteractive) {
        setLabel("");
        gsap.to(cursor, {
          width: 44,
          height: 44,
          backgroundColor: "rgba(255, 255, 255, 0.08)",
          borderColor: "rgba(255, 255, 255, 0.8)",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 0,
          duration: 0.3,
          overwrite: "auto",
        });
      } else {
        setLabel("");
        gsap.to(cursor, {
          width: 24,
          height: 24,
          backgroundColor: "transparent",
          borderColor: "rgba(255, 255, 255, 0.4)",
          duration: 0.4,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(dot, {
          scale: 1,
          duration: 0.3,
          overwrite: "auto",
        });
      }
    };

    const handleMouseDown = () => {
      gsap.to(cursor, {
        scale: 0.8,
        backgroundColor: "var(--ca-border-hover)",
        duration: 0.2,
        overwrite: "auto",
      });
    };

    const handleMouseUp = () => {
      gsap.to(cursor, {
        scale: 1,
        backgroundColor: "transparent",
        duration: 0.3,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.documentElement.classList.remove("use-custom-cursor");
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <>
      {/* Outer tracking ring */}
      <div
        ref={cursorRef}
        className="custom-cursor hidden md:flex items-center justify-center pointer-events-none fixed z-[9999] rounded-full border border-ca-text bg-transparent mix-blend-difference"
      >
        {label && (
          <span className="text-[10px] font-mono tracking-widest text-ca-text font-medium select-none">
            {label}
          </span>
        )}
      </div>

      {/* Inner tracking dot */}
      <div
        ref={cursorDotRef}
        className="custom-cursor-dot hidden md:block pointer-events-none fixed z-[9999] rounded-full bg-ca-text mix-blend-difference"
      />
    </>
  );
};
export default CustomCursor;
