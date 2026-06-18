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
    <footer ref={containerRef} className="relative bg-ca-bg-deep pt-32 pb-12 overflow-hidden border-t border-ca-border/40">
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      <div className="max-w-[1600px] mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Upper Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 md:mb-32">
          
          {/* CTA Area */}
          <div className="footer-fade-in space-y-10">
            <h3 className="text-5xl md:text-7xl lg:text-[5.5rem] font-display font-light leading-[1.05] tracking-tight">
              Empecemos un <br/>
              <span className="text-ca-text-secondary italic">nuevo proyecto.</span>
            </h3>
            <div>
              <a 
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-12 py-5 border border-ca-text text-xs md:text-sm font-mono uppercase tracking-[0.2em] hover:bg-ca-text hover:text-ca-bg-deep transition-all duration-500"
              >
                Hablemos por WhatsApp
              </a>
            </div>
          </div>
          
          {/* Links Area */}
          <div className="footer-fade-in grid grid-cols-2 gap-10 md:gap-16 pt-2 lg:pt-6">
            <div className="space-y-8">
              <h5 className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-ca-text-secondary border-b border-ca-border/50 pb-4">Navegación</h5>
              <div className="flex flex-col space-y-5 text-sm md:text-base font-light tracking-widest uppercase">
                <Link href="/" className="hover:text-ca-text-secondary transition-colors w-fit">Inicio</Link>
                <Link href="/diseno" className="hover:text-ca-text-secondary transition-colors w-fit">Diseño</Link>
                <Link href="/nosotros" className="hover:text-ca-text-secondary transition-colors w-fit">Nosotros</Link>
                <Link href="/contacto" className="hover:text-ca-text-secondary transition-colors w-fit">Contacto</Link>
              </div>
            </div>
            
            <div className="space-y-8">
              <h5 className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-ca-text-secondary border-b border-ca-border/50 pb-4">Social</h5>
              <div className="flex flex-col space-y-5 text-sm md:text-base font-light tracking-widest uppercase">
                <a href="https://instagram.com/casaatenta" target="_blank" className="hover:text-ca-text-secondary transition-colors w-fit">Instagram</a>
                <a href="https://facebook.com/casaatenta" target="_blank" className="hover:text-ca-text-secondary transition-colors w-fit">Facebook</a>
                <a href="https://tiktok.com/@casaatenta" target="_blank" className="hover:text-ca-text-secondary transition-colors w-fit">TikTok</a>
              </div>
            </div>
          </div>
        </div>

        {/* Elegant Typography Section */}
        <div className="w-full border-t border-ca-border/50 pt-12 flex flex-col gap-6">
          <div className="overflow-hidden flex w-full justify-center md:justify-start items-center">
             <span className="footer-char inline-block text-4xl md:text-6xl lg:text-7xl font-display font-light uppercase tracking-[0.2em] text-ca-text">
               <BrandText>CASA ATENTA</BrandText>
             </span>
          </div>
          
          <div className="footer-fade-in flex flex-col md:flex-row justify-between items-center text-xs md:text-sm font-mono tracking-[0.2em] text-ca-text-secondary uppercase mt-8 md:mt-12">
            <p>© {new Date().getFullYear()} Casa Atenta</p>
            <p className="mt-4 md:mt-0">Diseño y Automatización</p>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
