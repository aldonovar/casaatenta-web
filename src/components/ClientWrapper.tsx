"use client";

import React, { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";

import { Header } from "./Header";
import { PageTransition } from "./PageTransition";
import { WhatsAppButton } from "./WhatsAppButton";
import { Preloader } from "./Preloader";
import { CustomCursor } from "./CustomCursor";
import { Footer } from "./Footer";
import { BackgroundParticles } from "./BackgroundParticles";

gsap.registerPlugin(ScrollTrigger);

interface ClientWrapperProps {
  children: React.ReactNode;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    // Custom Lenis smooth scrolling configuration
    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          duration: 0.8,
          easing: (t) => 1 - Math.pow(1 - t, 4), // Quicker out easing
          smoothWheel: true,
          wheelMultiplier: 1.1,
          touchMultiplier: 2.0,
          syncTouch: true,
        });

    const tickerCallback = (time: number) => {
      lenis?.raf(time * 1000);
    };

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    // Debounced ScrollTrigger refresh on resize
    let resizeTimeout: number;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 650);

    return () => {
      lenis?.destroy();
      if (lenis) {
        gsap.ticker.remove(tickerCallback);
      }
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimer);
      clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-ca-bg-deep font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark">
      {/* Cinematic noise film grain */}
      <div className="grain-overlay" />

      {/* Dynamic network particles backdrop */}
      <BackgroundParticles />

      {/* Interactive premium custom cursor */}
      <CustomCursor />

      {/* Cinematic site entrance preloader */}
      <Preloader />

      {/* Floating high-end WhatsApp contact prompt */}
      <WhatsAppButton variant="floating" label="Agendar visita técnica" />

      {/* Navigation menu */}
      <Header />

      {/* Main viewport transition wrapper */}
      <main className="w-full flex-grow relative z-10 bg-transparent">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
