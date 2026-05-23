"use client";

import React, { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Header } from './Header';
import { PageTransition } from './PageTransition';
import { BrandText } from './BrandText';
import { Logo } from './Logo';

gsap.registerPlugin(ScrollTrigger);

interface ClientWrapperProps {
  children: React.ReactNode;
}

export const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Lenis smooth scroll
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenis.on('scroll', ScrollTrigger.update);
    const tickerCallback = (time: number) => { lenis.raf(time * 1000); };
    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(500, 33);
    ScrollTrigger.refresh();

    // Initial position setup for cursors
    gsap.set(cursorRef.current, { x: -100, y: -100, xPercent: -50, yPercent: -50 });
    gsap.set(cursorDotRef.current, { x: -100, y: -100, xPercent: -50, yPercent: -50 });

    // GSAP quickTo for ultra-smooth performance
    const xTo = gsap.quickTo(cursorRef.current, 'x', { duration: 0.15, ease: 'power3' });
    const yTo = gsap.quickTo(cursorRef.current, 'y', { duration: 0.15, ease: 'power3' });
    const xDotTo = gsap.quickTo(cursorDotRef.current, 'x', { duration: 0.02, ease: 'power1.out' });
    const yDotTo = gsap.quickTo(cursorDotRef.current, 'y', { duration: 0.02, ease: 'power1.out' });

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      xDotTo(e.clientX);
      yDotTo(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const hovered = (
        t.tagName === 'BUTTON' || t.tagName === 'A' ||
        !!t.closest('button') || !!t.closest('a') ||
        t.classList.contains('cursor-pointer') || !!t.closest('.cursor-pointer')
      );

      if (cursorRef.current) {
        if (hovered) {
          gsap.to(cursorRef.current, {
            width: '40px',
            height: '40px',
            backgroundColor: 'rgba(197, 168, 128, 0.08)',
            duration: 0.3,
            overwrite: 'auto'
          });
        } else {
          gsap.to(cursorRef.current, {
            width: '22px',
            height: '22px',
            backgroundColor: 'transparent',
            duration: 0.3,
            overwrite: 'auto'
          });
        }
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Refresh ScrollTrigger and scroll to top on path change
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);
  }, [pathname]);

  return (
    <div className="relative min-h-screen bg-brand-dark overflow-hidden font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark flex flex-col justify-between">
      {/* Custom Cursor */}
      <div ref={cursorRef} className="hidden md:block custom-cursor" />
      <div ref={cursorDotRef} className="hidden md:block custom-cursor-dot" />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/51908550942?text=Hola%20Casa%20Atenta,%20deseo%20agendar%20una%20consulta%20para%20un%20proyecto."
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-brand-gold text-brand-dark rounded-full flex items-center justify-center border border-brand-gold-light/20 shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer group"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.371a9.994 9.994 0 004.777 1.21h.005c5.505 0 9.99-4.478 9.99-9.985C22 6.478 17.517 2 12.012 2zm5.726 14.167c-.244.686-1.201 1.258-1.65 1.302-.45.044-.9-.089-2.883-.878-2.544-1.01-4.178-3.6-4.305-3.768-.127-.168-1.036-1.375-1.036-2.624 0-1.25.654-1.86.887-2.106.233-.245.507-.306.677-.306.17 0 .34 0 .488.007.155.006.363-.058.568.437.21.507.719 1.748.783 1.88.064.13.106.28.02.45-.084.17-.127.276-.254.425-.127.15-.266.333-.38.457-.128.14-.262.29-.113.543.149.253.66 1.085 1.413 1.758.968.865 1.782 1.135 2.037 1.262.255.127.404.106.552-.065.149-.17.637-.738.807-1.01.17-.27.34-.225.573-.139.234.086 1.487.7 1.742.828.255.127.425.191.489.302.064.11.064.64-.18 1.326z"/>
        </svg>
        {/* Tooltip */}
        <span className="absolute right-14 bg-brand-dark-soft border border-brand-gold/20 px-3 py-1.5 text-[8px] font-mono tracking-widest text-brand-gold uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          <BrandText>CHAT ONLINE</BrandText>
        </span>
      </a>

      <Header />

      <main className="w-full flex-grow">
        <PageTransition>{children}</PageTransition>
      </main>

      {/* Footer */}
      <footer className="w-full bg-brand-dark py-14 px-6 md:px-12 lg:px-24 border-t border-brand-dark-border relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-12 border-b border-brand-dark-border">
            {/* Logo and Description */}
            <div className="lg:col-span-5 space-y-6">
              <Logo className="group" />
              <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-sm">
                Diseñamos residencias de alta gama donde la tecnología se disuelve por completo en la arquitectura.
              </p>
              
              {/* SOCIAL NETWORKS (REAL SVG ICONS WITH HOVER MICRO-INTERACTIONS) */}
              <div className="flex items-center space-x-5 pt-2 text-brand-light/50">
                <a href="https://www.instagram.com/casaatenta/" target="_blank" rel="noopener noreferrer" className="transform transition-all duration-300 hover:scale-110 hover:text-brand-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@casaatenta" target="_blank" rel="noopener noreferrer" className="transform transition-all duration-300 hover:scale-110 hover:text-brand-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
                <a href="https://www.facebook.com/casaatenta" target="_blank" rel="noopener noreferrer" className="transform transition-all duration-300 hover:scale-110 hover:text-brand-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M18 2h-3a5 5 0 0 0 -5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="https://www.linkedin.com/company/casaatenta" target="_blank" rel="noopener noreferrer" className="transform transition-all duration-300 hover:scale-110 hover:text-brand-gold">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0 -2 -2 2 2 0 0 0 -2 2v7h-4v-7a6 6 0 0 1 6 -6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Links and navigation */}
            <div className="lg:col-span-7 flex flex-col md:flex-row justify-between gap-10 md:gap-4">
              <div className="space-y-4">
                <h5 className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase"><BrandText>Navegación</BrandText></h5>
                <div className="flex flex-col space-y-2.5 text-[11px] sm:text-xs font-sans font-light uppercase tracking-[0.2em] text-brand-light/60">
                  {[
                    { name: 'Inicio', path: '/' },
                    { name: 'Nosotros', path: '/nosotros' },
                    { name: 'Soluciones', path: '/soluciones' },
                  ].map((item) => (
                    <Link key={item.name} href={item.path} className="transform transition-all duration-300 hover:translate-x-1.5 hover:text-brand-gold inline-block">
                      <BrandText>{item.name}</BrandText>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase"><BrandText>Especialidades</BrandText></h5>
                <div className="flex flex-col space-y-2.5 text-[11px] sm:text-xs font-sans font-light uppercase tracking-[0.2em] text-brand-light/60">
                  {[
                    { name: 'Proyectos', path: '/proyectos' },
                    { name: 'Proceso', path: '/proceso' },
                    { name: 'Contacto', path: '/contacto' }
                  ].map((item) => (
                    <Link key={item.name} href={item.path} className="transform transition-all duration-300 hover:translate-x-1.5 hover:text-brand-gold inline-block">
                      <BrandText>{item.name}</BrandText>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h5 className="text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase"><BrandText>Contacto Directo</BrandText></h5>
                <div className="space-y-2 text-[11px] sm:text-xs font-sans font-light text-brand-light/60">
                  <p>WhatsApp: <a href="https://wa.me/51908550942" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:underline font-normal">+51 908 550 942</a></p>
                  <p>Email: <a href="mailto:contacto@casaatenta.pe" className="hover:text-brand-gold transition-colors">contacto@casaatenta.pe</a></p>
                  <p>Lima, Perú</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sparkle divider line */}
          <div className="w-full h-[1px] bg-gradient-to-r from-brand-gold/10 via-brand-gold/30 to-brand-gold/10 relative my-8">
            <div className="absolute top-[-1px] left-1/2 -translate-x-1/2 w-[3px] h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-[10px] sm:text-xs font-sans text-brand-light/40">
            <p>&copy; {new Date().getFullYear()} CΛSΛ ΛTENTΛ. Todos los derechos reservados.</p>
            <p className="tracking-wider uppercase text-[9px] font-mono text-brand-gold/60"><BrandText>Diseñado para habitar en sintonía.</BrandText></p>
          </div>
        </div>
      </footer>
    </div>
  );
};
