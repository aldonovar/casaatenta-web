"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandText } from './BrandText';
import { Logo } from './Logo';

export const Header: React.FC = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 80);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Soluciones', path: '/soluciones' },
    { label: 'Proyectos', path: '/proyectos' },
    { label: 'Proceso', path: '/proceso' },
    { label: 'Contacto', path: '/contacto' },
  ];

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-out ${
        isScrolled ? 'py-2.5' : 'py-4 md:py-5'
      }`}>
        {/* Subtle gradient backdrop */}
        <div className={`absolute inset-0 transition-opacity duration-500 ${
          isScrolled ? 'opacity-100' : 'opacity-0'
        }`} style={{
          background: 'linear-gradient(to bottom, rgba(13,13,13,0.95) 0%, rgba(13,13,13,0.6) 70%, transparent 100%)',
          backdropFilter: isScrolled ? 'blur(16px)' : 'none',
        }} />

        <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="flex items-center cursor-pointer group" onClick={() => setMobileMenuOpen(false)}>
            <Logo className="transition-all duration-500" />
          </Link>

          {/* DESKTOP NAV */}
          <nav className="hidden lg:flex items-center space-x-8 xl:space-x-10">
            {navItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-[11px] xl:text-xs tracking-[0.30em] font-sans font-light uppercase relative group flex items-center transition-all duration-300 hover:-translate-y-[1px] ${
                    isActive ? 'text-brand-gold font-medium' : 'text-brand-light/65 hover:text-brand-gold'
                  }`}
                >
                  <BrandText>{item.label}</BrandText>
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-brand-gold transition-all duration-300 ease-out group-hover:w-full" />
                </Link>
              );
            })}
          </nav>

          {/* CTA + MOBILE TOGGLE */}
          <div className="flex items-center space-x-6">
            <Link
              href="/configurador"
              className="hidden md:block px-5 py-2 text-[11px] tracking-[0.25em] font-sans font-light uppercase text-brand-gold border border-brand-gold/20 hover:border-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <BrandText>Diseñar Espacio</BrandText>
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden flex flex-col space-y-1.5 w-7 relative z-50 cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`h-[1px] bg-brand-light transition-all duration-300 ${mobileMenuOpen ? 'w-7 rotate-45 translate-y-[4px]' : 'w-7'}`} />
              <span className={`h-[1px] bg-brand-light transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 w-0' : 'w-5'}`} />
              <span className={`h-[1px] bg-brand-light transition-all duration-300 ${mobileMenuOpen ? 'w-7 -rotate-45 -translate-y-[4px]' : 'w-3'}`} />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div className={`fixed inset-0 z-40 transition-all duration-500 lg:hidden ${
        mobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}>
        <div className="absolute inset-0 bg-brand-dark/97 backdrop-blur-xl" />
        <div className="relative h-full flex flex-col items-center justify-center space-y-8">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-lg md:text-xl font-sans font-light tracking-[0.2em] transition-colors uppercase ${
                  isActive ? 'text-brand-gold font-medium' : 'text-brand-light hover:text-brand-gold'
                }`}
              >
                <BrandText>{item.label}</BrandText>
              </Link>
            );
          })}
          <div className="h-[1px] w-12 bg-brand-gold/30 my-3" />
          <Link
            href="/configurador"
            onClick={() => setMobileMenuOpen(false)}
            className="px-8 py-3.5 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300"
          >
            <BrandText>Diseñar Espacio</BrandText>
          </Link>
        </div>
      </div>
    </>
  );
};
