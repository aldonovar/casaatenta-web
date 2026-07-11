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
import { ScrollChargeNav } from "./ScrollChargeNav";
import { InjectIconStyles } from "./icons/AnimatedIcons";
import { ZenitMotionSystem } from "./ZenitMotionSystem";

gsap.registerPlugin(ScrollTrigger);

interface ClientWrapperProps {
  children: React.ReactNode;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    ScrollTrigger.config({ ignoreMobileResize: true });

    const lenis = prefersReducedMotion
      ? null
      : new Lenis({
          duration: 1.05,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true,
          wheelMultiplier: 0.92,
          touchMultiplier: 1.45,
          syncTouch: false,
        });

    const tickerCallback = (time: number) => lenis?.raf(time * 1000);

    if (lenis) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);
    }

    let resizeTimeout = 0;
    const handleResize = () => {
      window.clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => ScrollTrigger.refresh(), 220);
    };

    window.addEventListener("resize", handleResize);
    const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());
    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 650);

    return () => {
      lenis?.destroy();
      if (lenis) gsap.ticker.remove(tickerCallback);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(refreshFrame);
      window.clearTimeout(refreshTimer);
      window.clearTimeout(resizeTimeout);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 160);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-ca-bg-deep font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark">
      <InjectIconStyles />
      <ZenitMotionSystem />
      <div className="grain-overlay" />
      <div className="zenit-vignette" />
      <div className="bg-blob-1 absolute left-[5%] top-[15%] z-0 h-[35rem] w-[35rem] rounded-full bg-brand-gold/4 blur-[130px] pointer-events-none" />
      <div className="bg-blob-2 absolute right-[5%] top-[45%] z-0 h-[45rem] w-[45rem] rounded-full bg-ca-deep-blue/40 blur-[150px] pointer-events-none" />
      <BackgroundParticles />
      <CustomCursor />
      <Preloader />
      <WhatsAppButton variant="floating" label="Agendar visita técnica" />
      {pathname !== "/about/conexiones" && <Header />}
      {pathname === "/" && <ScrollChargeNav />}
      <main className="relative z-10 w-full flex-grow bg-transparent">
        <PageTransition>{children}</PageTransition>
      </main>
      {pathname !== "/about/conexiones" && <Footer />}
    </div>
  );
};
