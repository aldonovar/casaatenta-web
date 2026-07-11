"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Header } from "./Header";
import { WhatsAppButton } from "./WhatsAppButton";
import { Footer } from "./Footer";
import { InjectIconStyles } from "./icons/AnimatedIcons";

gsap.registerPlugin(ScrollTrigger);

interface ClientWrapperProps {
  children: React.ReactNode;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const frame = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });

    const timer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-ca-bg-deep font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark">
      <InjectIconStyles />
      {pathname !== "/about/conexiones" && <Header />}

      <main className="relative z-10 w-full flex-grow bg-ca-bg-deep">
        {children}
      </main>

      <WhatsAppButton variant="floating" label="Agendar visita técnica" />
      {pathname !== "/about/conexiones" && <Footer />}
    </div>
  );
};
