"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { Sun, Moon } from "lucide-react";
import { Logo } from "./Logo";
import { BrandText } from "./BrandText";

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isLight, setIsLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const linksContainerRef = useRef<HTMLDivElement>(null);
  
  // Theme logic
  useEffect(() => {
    const savedTheme = localStorage.getItem("casa-atenta-theme");
    const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
    
    if (savedTheme === "light" || (!savedTheme && systemPrefersLight)) {
      document.documentElement.classList.add("light");
      setIsLight(true);
    } else {
      document.documentElement.classList.remove("light");
      setIsLight(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isLight) {
      document.documentElement.classList.remove("light");
      localStorage.setItem("casa-atenta-theme", "dark");
      setIsLight(false);
    } else {
      document.documentElement.classList.add("light");
      localStorage.setItem("casa-atenta-theme", "light");
      setIsLight(true);
    }
  };

  // Overlay Menu Animation Logic
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (!overlayRef.current) return;
      
      if (menuOpen) {
        document.body.style.overflow = "hidden";
        
        // Overlay reveal: slides down
        gsap.to(overlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.2,
          ease: "power4.inOut"
        });
        
        // Links stagger slide-up
        gsap.fromTo(".menu-link-item", 
          { yPercent: 120, opacity: 0, rotateZ: 3 },
          { 
            yPercent: 0, 
            opacity: 1, 
            rotateZ: 0,
            duration: 1, 
            stagger: 0.1, 
            ease: "power4.out",
            delay: 0.4 
          }
        );
        
        // Secondary info fade-in
        gsap.fromTo(".menu-secondary", 
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.8 }
        );
      } else {
        document.body.style.overflow = "";
        
        // Close animation
        gsap.to(".menu-link-item", {
          yPercent: -120,
          opacity: 0,
          duration: 0.6,
          ease: "power3.inOut",
          stagger: -0.05
        });
        
        gsap.to(".menu-secondary", {
          opacity: 0,
          duration: 0.4
        });
        
        gsap.to(overlayRef.current, {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
          duration: 1,
          ease: "power4.inOut",
          delay: 0.3
        });
      }
    }, overlayRef);

    return () => ctx.revert();
  }, [menuOpen]);

  // Route change -> close menu
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navItems = [
    { label: "Inicio", path: "/" },
    { label: "Diseño", path: "/diseno" },
    { label: "Nosotros", path: "/nosotros" },
    { label: "Contacto", path: "/contacto" },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 py-8 px-6 md:px-12 lg:px-24 transition-colors duration-500 text-ca-text`}>
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <Link href="/" className="relative z-[60] group" onClick={() => setMenuOpen(false)}>
            <Logo className="h-10 md:h-12 lg:h-14 w-auto transition-transform duration-500 group-hover:scale-105" />
          </Link>
          
          <div className="flex items-center space-x-6 md:space-x-12 relative z-[60]">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-10 w-10 rounded-full border border-ca-border hover:border-ca-text hover:bg-ca-text/5 transition-all duration-300"
              aria-label="Toggle Theme"
            >
              {isLight ? <Moon size={16} /> : <Sun size={16} />}
            </button>
            
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="group flex items-center space-x-3 cursor-pointer"
            >
              <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] font-medium hidden md:block">
                {menuOpen ? "Cerrar" : "Menú"}
              </span>
              <div className="w-8 flex flex-col space-y-1.5 items-end">
                <span className={`h-[1.5px] bg-ca-text transition-all duration-500 ease-in-out ${menuOpen ? "w-8 rotate-45 translate-y-[3.5px]" : "w-8 group-hover:w-6"}`} />
                <span className={`h-[1.5px] bg-ca-text transition-all duration-500 ease-in-out ${menuOpen ? "w-8 -rotate-45 -translate-y-[4px]" : "w-5 group-hover:w-8"}`} />
              </div>
            </button>
          </div>
        </div>
      </header>
      
      {/* FULL SCREEN OVERLAY */}
      <div 
        ref={overlayRef}
        className="fixed inset-0 z-40 bg-ca-bg-deep text-ca-text flex flex-col"
        style={{ clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)" }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

        <div className="flex-grow flex flex-col justify-center px-6 md:px-12 lg:px-24 max-w-[1600px] mx-auto w-full pt-32 pb-12 relative z-10">
           <nav ref={linksContainerRef} className="flex flex-col space-y-6 md:space-y-10 items-start w-full">
             {navItems.map((item, i) => (
               <div key={item.path} className="overflow-hidden py-1">
                 <Link href={item.path} className="menu-link-item inline-block text-4xl md:text-5xl lg:text-6xl font-display font-light uppercase tracking-[0.15em] leading-tight hover:text-ca-text-secondary transition-colors origin-left">
                   <BrandText>{item.label}</BrandText>
                 </Link>
               </div>
             ))}
           </nav>
           
           <div className="menu-secondary mt-auto pt-16 flex flex-col md:flex-row justify-between items-start md:items-center border-t border-ca-border/40 text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-ca-text-secondary gap-6">
              <p>Lima, Perú</p>
              <a href="mailto:contacto@casaatenta.pe" className="hover:text-ca-text transition-colors border-b border-transparent hover:border-ca-text pb-1">contacto@casaatenta.pe</a>
              <p>Arte + Automatización</p>
           </div>
        </div>
      </div>
    </>
  );
};

export default Header;
