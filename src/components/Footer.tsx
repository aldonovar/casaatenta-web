"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Logo } from "./Logo";
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
            start: "top 80%",
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
             start: "top 90%",
           }
        }
      )
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={containerRef} className="group/footer relative bg-ca-bg-deep pt-0 pb-12 md:pb-16 overflow-hidden border-t border-ca-border/20 transition-colors duration-800">
      
      {/* Interactive Architectural Blueprint SVG Background */}
      <svg 
        viewBox="0 0 1000 600" 
        className="absolute right-[-100px] bottom-[-50px] w-full max-w-[700px] h-auto opacity-[0.025] group-hover/footer:opacity-[0.07] transition-opacity duration-1000 pointer-events-none stroke-current text-ca-text z-0"
        fill="none"
      >
        {/* Schematic lines of a bioclimatic pergola & terrace layout */}
        <g strokeWidth="0.75" strokeDasharray="3 6">
          <rect x="100" y="100" width="800" height="400" />
          <line x1="100" y1="180" x2="900" y2="180" />
          <line x1="100" y1="260" x2="900" y2="260" />
          <line x1="100" y1="340" x2="900" y2="340" />
          <line x1="100" y1="420" x2="900" y2="420" />
          <line x1="300" y1="100" x2="300" y2="500" />
          <line x1="500" y1="100" x2="500" y2="500" />
          <line x1="700" y1="100" x2="700" y2="500" />
        </g>
        <g strokeWidth="1">
          {/* Support columns */}
          <circle cx="100" cy="100" r="16" />
          <circle cx="900" cy="100" r="16" />
          <circle cx="100" cy="500" r="16" />
          <circle cx="900" cy="500" r="16" />
          {/* Louver slat rotational guides */}
          <path d="M 320 200 C 350 220, 350 240, 320 260" />
          <path d="M 520 200 C 550 220, 550 240, 520 260" />
          {/* Technical crosshairs and coordinates */}
          <circle cx="500" cy="300" r="80" strokeWidth="0.5" />
          <circle cx="500" cy="300" r="4" fill="currentColor" />
          <line x1="500" y1="180" x2="500" y2="420" strokeWidth="0.5" />
          <line x1="380" y1="300" x2="620" y2="300" strokeWidth="0.5" />
          <text x="520" y="280" className="font-mono text-[9px] fill-current uppercase tracking-widest">SISTEMA DE TECHADO PERMITIDO // ROT: 45°</text>
          <text x="520" y="335" className="font-mono text-[9px] fill-current uppercase tracking-widest">CASA ATENTA // LAT: -12.04637 // LON: -77.04278</text>
        </g>
      </svg>

      {/* Cinematic noise film grain */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.75%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />

      {/* Infinite Technical Marquee */}
      <div className="w-full border-t border-b border-ca-border/10 py-5 overflow-hidden bg-ca-bg-surface/30 mb-16 relative">
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-ca-bg-deep to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-ca-bg-deep to-transparent z-10 pointer-events-none" />
        <div className="animate-marquee whitespace-nowrap flex items-center space-x-12 text-xs md:text-sm font-mono uppercase tracking-[0.25em] text-ca-text-secondary/60">
          <span>ILUMINACIÓN SENSORIAL Y CICLO CIRCADIANO</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>DOMÓTICA RESIDENCIAL DE CONTROL INVISIBLE</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>TECHOS SOL Y SOMBRA BIOCLIMÁTICOS PREMIUM</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>DISEÑO DE TERRAZAS RESIDENCIALES OUTDOOR</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>CONECTIVIDAD SECURE & SMART HOMES LIMA</span>
          <span className="text-brand-gold font-serif italic">•</span>
          {/* Duplicate for infinite loop wrapping */}
          <span>ILUMINACIÓN SENSORIAL Y CICLO CIRCADIANO</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>DOMÓTICA RESIDENCIAL DE CONTROL INVISIBLE</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>TECHOS SOL Y SOMBRA BIOCLIMÁTICOS PREMIUM</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>DISEÑO DE TERRAZAS RESIDENCIALES OUTDOOR</span>
          <span className="text-brand-gold font-serif italic">•</span>
          <span>CONECTIVIDAD SECURE & SMART HOMES LIMA</span>
          <span className="text-brand-gold font-serif italic">•</span>
        </div>
      </div>

      <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-20 relative z-10">
        
        {/* Upper Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 mb-16 md:mb-20">
          
          {/* Column 1: Brand & Social */}
          <div className="md:col-span-4 space-y-8 footer-fade-in">
            <Link href="/" className="inline-block group">
              <Logo className="h-10 md:h-12 w-auto transition-transform duration-500 group-hover:scale-105" />
            </Link>
            <p className="text-sm md:text-base font-light leading-relaxed max-w-sm text-ca-text-secondary transition-colors duration-800">
              Diseñamos y ejecutamos espacios habitables que sintonizan con tu vida. 
              Arquitectura de terrazas premium y automatización invisible en Lima, Perú.
            </p>
            
            {/* Social Icons Container */}
            <div className="flex gap-3 pt-2">
              {[
                {
                  name: "Instagram",
                  href: "https://instagram.com/casaatenta",
                  path: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1,1 0 0,1 19,6A1,1 0 0,1 17,6A1,1 0 0,1 17,6A1,1 0 0,1 18,5Z"
                },
                {
                  name: "Facebook",
                  href: "https://facebook.com/casaatenta",
                  path: "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.16L15.72 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z"
                },
                {
                  name: "TikTok",
                  href: "https://tiktok.com/@casaatenta",
                  path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.9-6.84V6.16a9.29 9.29 0 0 0 5-1.57v-3.9a5.61 5.61 0 0 1-1.67.9z"
                },
                {
                  name: "LinkedIn",
                  href: "https://www.linkedin.com/company/casaatenta/",
                  path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
                }
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visitar ${social.name} de Casa Atenta`}
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-ca-border/30 text-ca-text-secondary hover:text-brand-gold hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-300"
                >
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d={social.path} />
                  </svg>
                </a>
              ))}
            </div>

            {/* IoT status indicator */}
            <div className="border border-ca-border/20 bg-ca-bg-surface/50 rounded-lg p-4 space-y-2 max-w-sm transition-all duration-500 hover:border-brand-gold/30">
              <div className="flex items-center justify-between text-[10px] font-mono tracking-widest">
                <span className="text-ca-text-secondary/70">MONITOR DOMÓTICO</span>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-gold opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-gold"></span>
                  </span>
                  <span className="text-brand-gold font-bold">ONLINE</span>
                </div>
              </div>
              <div className="text-[10px] font-mono tracking-wider text-ca-text-secondary/60 grid grid-cols-2 gap-y-1">
                <span>RED LOCAL: SECURE</span>
                <span>LATENCIA: 4.2ms</span>
                <span>LUMINARIAS: EN LÍNEA</span>
                <span>DIAGNÓSTICO: OK</span>
              </div>
            </div>
          </div>
          
          {/* Column 2: Quick Links */}
          <div className="md:col-span-2 space-y-6 footer-fade-in">
            <h5 className="text-xs md:text-sm font-mono font-medium uppercase tracking-[0.22em] text-brand-gold border-b border-ca-border/20 pb-3">Explora</h5>
            <div className="flex flex-col space-y-3.5 text-[13px] md:text-sm font-mono uppercase tracking-wider text-ca-text-secondary">
              <Link href="/" className="hover:text-ca-text transition-colors w-fit">Inicio</Link>
              <Link href="/nosotros" className="hover:text-ca-text transition-colors w-fit">Nosotros</Link>
              <Link href="/servicios" className="hover:text-ca-text transition-colors w-fit">Servicios</Link>
              <Link href="/proyectos" className="hover:text-ca-text transition-colors w-fit">Proyectos</Link>
              <Link href="/proceso" className="hover:text-ca-text transition-colors w-fit">Proceso</Link>
              <Link href="/blog" className="hover:text-ca-text transition-colors w-fit">Blog</Link>
              <Link href="/contacto" className="hover:text-ca-text transition-colors w-fit">Contacto</Link>
            </div>
          </div>
          
          {/* Column 3: Specialties */}
          <div className="md:col-span-3 space-y-6 footer-fade-in">
            <h5 className="text-xs md:text-sm font-mono font-medium uppercase tracking-[0.22em] text-brand-gold border-b border-ca-border/20 pb-3">Especialidades</h5>
            <div className="flex flex-col space-y-3.5 text-[13px] md:text-sm font-mono uppercase tracking-wider text-ca-text-secondary">
              <Link href="/servicios/techo-sol-y-sombra" className="hover:text-ca-text transition-colors w-fit">Techos Sol y Sombra</Link>
              <Link href="/servicios/diseno-terrazas" className="hover:text-ca-text transition-colors w-fit">Diseño de Terrazas</Link>
              <Link href="/servicios/iluminacion-inteligente" className="hover:text-ca-text transition-colors w-fit">Iluminación Inteligente</Link>
              <Link href="/servicios/smart-homes" className="hover:text-ca-text transition-colors w-fit">Smart Homes</Link>
              <Link href="/servicios/mantenimiento-general" className="hover:text-ca-text transition-colors w-fit">Mantenimiento General</Link>
            </div>
          </div>
          
          {/* Column 4: Contact info */}
          <div className="md:col-span-3 space-y-6 footer-fade-in">
            <h5 className="text-xs md:text-sm font-mono font-medium uppercase tracking-[0.22em] text-brand-gold border-b border-ca-border/20 pb-3">Contacto</h5>
            <ul className="space-y-5">
              <li className="space-y-1">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-ca-text-secondary/50">WhatsApp</span>
                <a 
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-mono uppercase tracking-wider text-ca-text hover:text-brand-gold transition-colors block"
                >
                  +51 908 550 942
                </a>
              </li>
              <li className="space-y-1">
                <span className="block text-[10px] font-mono uppercase tracking-widest text-ca-text-secondary/50">Email</span>
                <a 
                  href="mailto:contacto@casa-atenta.com"
                  className="text-sm font-mono uppercase tracking-wider text-ca-text hover:text-brand-gold transition-colors block break-all"
                >
                  contacto@casa-atenta.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Elegant Typography Section */}
        <div className="w-full border-t border-ca-border/20 pt-8 flex flex-col gap-4">
          <div className="overflow-hidden flex flex-col md:flex-row md:items-baseline md:justify-between w-full">
             <span className="footer-char inline-block text-2xl md:text-4xl lg:text-[2.25rem] font-display font-light uppercase tracking-[0.3em] text-ca-text transition-colors duration-800">
               <BrandText>CASA ATENTA</BrandText>
             </span>
             <span className="text-[10px] font-mono tracking-[0.22em] text-brand-gold/60 uppercase mt-2 md:mt-0">
               00 // ARQUITECTURA RESIDENCIAL & DOMÓTICA
             </span>
          </div>
          
          {/* Lower Bottom Bar */}
          <div className="footer-fade-in flex flex-col lg:flex-row justify-between items-center text-xs font-mono tracking-[0.18em] text-ca-text-secondary/55 uppercase mt-6 border-t border-ca-border/10 pt-6 gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
              <p>© {new Date().getFullYear()} Casa Atenta.</p>
              <div className="hidden md:block w-px h-3 bg-ca-border/20" />
              <div className="flex gap-4 md:gap-6 flex-wrap justify-center text-center">
                <Link href="/privacidad" className="hover:text-ca-text transition-colors">Política de Privacidad</Link>
                <Link href="/terminos" className="hover:text-ca-text transition-colors">Términos y Condiciones</Link>
                <Link href="/reclamaciones" className="hover:text-ca-text transition-colors text-brand-gold hover:text-brand-gold-light">Libro de Reclamaciones</Link>
              </div>
            </div>
            
            {/* Developed by ALLYX Credit Badge */}
            <div className="flex items-center gap-1 uppercase tracking-widest text-xs">
              <span>Experiencia digital desarrollada por</span>
              <a 
                href="https://allyxorb.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-ca-text transition-colors font-bold text-ca-text-secondary/80 ml-1 border-b border-transparent hover:border-ca-text pb-0.5"
              >
                ALLYX
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
