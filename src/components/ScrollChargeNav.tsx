"use client";

import React, { useEffect, useState } from "react";

interface SectionItem {
  id: string;
  label: string;
  chapter: string;
}

const sections: SectionItem[] = [
  { id: "hero", label: "Inicio", chapter: "01" },
  { id: "manifesto", label: "Manifiesto", chapter: "02" },
  { id: "filosofia", label: "Filosofía", chapter: "03" },
  { id: "hogar-atento", label: "Hogar Atento", chapter: "04" },
  { id: "servicios", label: "Servicios", chapter: "05" },
  { id: "comparacion", label: "Comparación", chapter: "06" },
  { id: "proceso", label: "Proceso", chapter: "07" },
  { id: "tecnologia", label: "Tecnología", chapter: "08" },
  { id: "confianza", label: "Confianza", chapter: "09" },
  { id: "cotiza", label: "Cotizar", chapter: "10" }
];

export const ScrollChargeNav: React.FC = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      const isAtBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 100;

      if (isAtBottom) {
        setActiveSection("cotiza");
        return;
      }

      // Detect active section based on scroll position (middle-third offset)
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial execution
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      // Offset scrolling slightly to account for fixed header
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="fixed right-6 xl:right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-row items-center select-none pointer-events-auto">
      {/* Scroll Charge Line and Ticks Container */}
      <div className="relative flex flex-col items-end py-4 h-[380px]">
        {/* Subtle vertical track line matching brand styling */}
        <div className="absolute right-0 top-4 bottom-4 w-[1px] bg-white/10" />
        
        {/* Navigation Dot/Tick Indicators */}
        <div className="relative z-10 flex flex-col justify-between h-full py-1 items-end pr-[2px]">
          {sections.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <div 
                key={section.id} 
                className="group/dot relative flex items-center justify-end cursor-pointer h-6 py-1"
                onClick={() => scrollToSection(section.id)}
              >
                {/* Floating Glassmorphic Label (Left side) */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded border border-ca-border bg-ca-glass-bg backdrop-blur-md opacity-0 scale-95 pointer-events-none group-hover/dot:opacity-100 group-hover/dot:scale-100 transition-all duration-300 flex items-center space-x-2 whitespace-nowrap shadow-[0_10px_30px_rgba(0,0,0,0.15)]">
                  <span className="font-mono text-[9px] text-brand-gold tracking-widest">{section.chapter}</span>
                  <span className="w-1.5 h-[1px] bg-ca-border/40" />
                  <span className="font-sans text-[10px] uppercase tracking-wider text-ca-text font-light">{section.label}</span>
                </div>

                {/* Technical Blueprint-style Dash Tick */}
                <div 
                  className={`transition-all duration-500 ease-out rounded-full ${
                    isActive 
                      ? "w-5 h-[2px] bg-brand-gold shadow-[0_0_8px_rgba(216,179,106,0.6)]" 
                      : "w-2 h-[1px] bg-white/20 group-hover/dot:w-4 group-hover/dot:bg-brand-gold/60"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ScrollChargeNav;

