"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { InjectIconStyles } from "./icons/AnimatedIcons";
import { PageRail } from "./PageRail";
import { RouteScape } from "./RouteScape";
import { SmoothScroll } from "./SmoothScroll";
import { WhatsAppButton } from "./WhatsAppButton";
import { ZenitMotionSystem } from "./ZenitMotionSystem";

gsap.registerPlugin(ScrollTrigger);

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash) {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
      ScrollTrigger.refresh();
    });
    const timer = window.setTimeout(() => ScrollTrigger.refresh(), 450);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
  }, [pathname]);

  useEffect(() => {
    const bar = document.getElementById("scroll-progress");
    if (!bar) return;

    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
      });
    };

    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update, { passive: true });
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
      cancelAnimationFrame(frame);
    };
  }, []);

  const showShell = pathname !== "/about/conexiones";

  return (
    <div className="relative flex min-h-[100dvh] flex-col overflow-x-clip bg-ca-bg-deep font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark">
      <a
        href="#main-content"
        onClick={() => {
          requestAnimationFrame(() =>
            document.getElementById("main-content")?.focus(),
          );
        }}
        className="fixed left-4 top-3 z-[10000] -translate-y-24 bg-brand-gold px-4 py-3 font-mono text-[10px] font-semibold uppercase tracking-[.16em] text-[#07111d] shadow-xl transition-transform focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-brand-gold-light focus:ring-offset-2 focus:ring-offset-ca-bg-deep"
      >
        Saltar al contenido
      </a>
      <InjectIconStyles />
      <SmoothScroll />
      <ZenitMotionSystem />
      <RouteScape />
      <div
        id="scroll-progress"
        aria-hidden="true"
        className="fixed left-0 top-0 z-[9100] h-[2px] w-full origin-left scale-x-0 bg-brand-gold"
      />
      {showShell && <Header />}
      {showShell && pathname !== "/" ? <PageRail /> : null}
      <div
        id="main-content"
        tabIndex={-1}
        className="relative z-10 w-full flex-grow bg-transparent focus:outline-none"
      >
        {children}
      </div>
      <WhatsAppButton variant="floating" label="Cuéntanos qué debe responder" />
      {showShell && <Footer />}
    </div>
  );
}

export default ClientWrapper;
