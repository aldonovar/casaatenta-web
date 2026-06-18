"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BrandText } from "./BrandText";
import { WHATSAPP_LINK } from "@/constants/contact";

gsap.registerPlugin(ScrollTrigger);

export const Footer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Animate monumental text characters up
      gsap.fromTo(
        ".footer-char",
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power4.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
          },
        }
      );
      
      // Animate the upper grid elements
      gsap.fromTo(
        ".footer-fade-in",
        { opacity: 0, y: 40 },
        {
           opacity: 1,
           y: 0,
           duration: 1.2,
           stagger: 0.1,
           ease: "power3.out",
           scrollTrigger: {
             trigger: el,
             start: "top 85%",
           }
        }
      )
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="relative bg-ca-bg-deep pt-20 pb-10 overflow-hidden border-t border-ca-border/30">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Upper Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 md:mb-20">
          
          {/* CTA Area */}
          <div className="footer-fade-in space-y-8">
            <h3 className="text-3xl md:text-4xl lg:text-[3.25rem] font-display font-light leading-[1.1] tracking-tight">
              Empecemos un <br/>
              <span className="text-ca-text-secondary italic">nuevo proyecto.</span>
            </h3>
            <div>
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-10 py-4.5 border border-ca-text text-xs font-mono uppercase tracking-[0.2em] hover:bg-ca-text hover:text-ca-bg-deep transition-all duration-500"
              >
                Hablemos por WhatsApp
              </a>
            </div>
          </div>
          
          {/* Links Area */}
          <div className="footer-fade-in grid grid-cols-2 gap-10 md:gap-16 pt-2">
            <div className="space-y-6">
              <h5 className="text-xs font-mono uppercase tracking-[0.2em] text-ca-text-secondary border-b border-ca-border/40 pb-3">Navegación</h5>
              <div className="flex flex-col space-y-3.5 text-xs md:text-sm font-light tracking-widest uppercase">
                <Link href="/" className="hover:text-ca-text-secondary transition-colors w-fit">Inicio</Link>
                <Link href="/servicios" className="hover:text-ca-text-secondary transition-colors w-fit">Servicios</Link>
                <Link href="/proyectos" className="hover:text-ca-text-secondary transition-colors w-fit">Proyectos</Link>
                <Link href="/proceso" className="hover:text-ca-text-secondary transition-colors w-fit">Proceso</Link>
                <Link href="/blog" className="hover:text-ca-text-secondary transition-colors w-fit">Blog</Link>
                <Link href="/nosotros" className="hover:text-ca-text-secondary transition-colors w-fit">Nosotros</Link>
                <Link href="/contacto" className="hover:text-ca-text-secondary transition-colors w-fit">Contacto</Link>
              </div>
            </div>
            
            <div className="space-y-6">
              <h5 className="text-xs font-mono uppercase tracking-[0.2em] text-ca-text-secondary border-b border-ca-border/40 pb-3">Social</h5>
              <div className="flex flex-col space-y-3.5 text-xs md:text-sm font-light tracking-widest uppercase">
                <a href="https://instagram.com/casaatenta" target="_blank" rel="noopener noreferrer" className="hover:text-ca-text-secondary transition-colors w-fit">Instagram</a>
                <a href="https://facebook.com/casaatenta" target="_blank" rel="noopener noreferrer" className="hover:text-ca-text-secondary transition-colors w-fit">Facebook</a>
                <a href="https://tiktok.com/@casaatenta" target="_blank" rel="noopener noreferrer" className="hover:text-ca-text-secondary transition-colors w-fit">TikTok</a>
                <a href="https://www.linkedin.com/company/casaatenta/" target="_blank" rel="noopener noreferrer" className="hover:text-ca-text-secondary transition-colors w-fit">LinkedIn</a>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Typography Section */}
        <div className="w-full border-t border-ca-border/30 pt-10 flex flex-col gap-4">
          <div className="overflow-hidden flex flex-col md:flex-row md:items-baseline md:justify-between w-full">
             <span className="footer-char inline-block text-3xl md:text-5xl lg:text-[2.75rem] font-display font-light uppercase tracking-[0.3em] text-ca-text">
               <BrandText>CASA ATENTA</BrandText>
             </span>
             <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold/60 uppercase mt-2 md:mt-0">
               00 // ARQUITECTURA RESIDENCIAL & DOMÓTICA
             </span>
          </div>
          
          <div className="footer-fade-in flex flex-col md:flex-row justify-between items-center text-[10px] font-mono tracking-[0.2em] text-ca-text-secondary uppercase mt-6 border-t border-ca-border/10 pt-6">
            <p>© {new Date().getFullYear()} Casa Atenta</p>
            <p className="mt-2 md:mt-0">Diseño y Automatización</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
