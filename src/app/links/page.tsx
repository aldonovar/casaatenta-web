"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { Sacramento } from "next/font/google";
import { 
  MessageCircle, 
  ArrowRight, 
  Globe, 
  ShoppingBag, 
  BookOpen, 
  UserPlus, 
  Share2, 
  Check, 
  ArrowLeft
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { WHATSAPP_LINK } from "@/constants/contact";
import { STORE_URL } from "@/data/navigation";
import { BLOG_URL } from "@/lib/urls";
import { downloadVCard } from "@/lib/vcard";

const sacramentoFont = Sacramento({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function LinksPage() {
  const containerRef = useRef<HTMLElement>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canonicalUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/links`
    : "https://www.casa-atenta.com/links";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".animate-header", { opacity: 0, y: -15 });
      gsap.set(".animate-subfirm", { opacity: 0, scale: 0.95 });
      gsap.set(".animate-socials", { opacity: 0, y: 10 });
      gsap.set(".animate-vcard", { opacity: 0, y: 10 });
      gsap.set(".animate-main-links", { opacity: 0, y: 15 });
      gsap.set(".animate-secondary", { opacity: 0, y: 10 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(".animate-header", {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      })
      .to(".animate-subfirm", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.5")
      .to(".animate-socials", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.4")
      .to(".animate-vcard", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3")
      .to(".animate-main-links", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }, "-=0.3")
      .to(".animate-secondary", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.05,
        ease: "power2.out",
      }, "-=0.2");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSaveContact = () => {
    downloadVCard();
    showToast("Contacto de Casa Atenta descargado");
  };

  const handleSharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Casa Atenta | zenit design",
          text: "Tu Hogar Responde. Directorio oficial de Casa Atenta.",
          url: canonicalUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          showToast("Enlace copiado al portapapeles");
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(canonicalUrl);
        showToast("Enlace copiado al portapapeles");
      } catch (err) {
        console.error("Error copying URL:", err);
      }
    }
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/casaatenta",
      path: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1,1 0 0,1 19,6A1,1 0 0,1 17,6A1,1 0 0,1 17,6A1,1 0 0,1 18,5Z",
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@casaatenta",
      path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.9-6.84V6.16a9.29 9.29 0 0 0 5-1.57v-3.9a5.61 5.61 0 0 1-1.67.9z",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/casaatenta/",
      path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/casaatenta",
      path: "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.16L15.72 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z",
    },
  ];

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen py-12 px-5 bg-[#07111D] flex flex-col items-center justify-between text-[#F4F0E8] font-sans antialiased overflow-x-hidden selection:bg-brand-gold selection:text-[#07111D]"
    >
      {/* Background Architectural Grid & Subtle Warm Atmosphere Lighting */}
      <div className="fixed inset-0 z-0 opacity-[0.02] architectural-grid pointer-events-none" />
      <div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-brand-gold/[0.06] rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Return Button */}
      <div className="w-full max-w-md flex items-center justify-between relative z-10 mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#91A3B3] hover:text-white transition-colors group uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Inicio</span>
        </Link>
      </div>

      {/* Main Content Wrapper */}
      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        
        {/* BRAND PROFILE HEADER */}
        <div className="flex flex-col items-center text-center mb-6 animate-header">
          
          {/* Prominent Casa Atenta Horizontal Logo */}
          <div className="mb-5 flex justify-center items-center">
            <Logo className="h-10 md:h-12 w-auto text-white" iconOnly={false} light={true} />
          </div>

          {/* Official Slogan */}
          <h1 className="text-xl md:text-2xl font-serif font-light tracking-[0.2em] text-[#F4F0E8] uppercase mb-1">
            TU HOGAR RESPONDE.
          </h1>

          {/* Subfirma: zenit design en caligrafía Sacramento ultra-legible y fluida */}
          <div className="animate-subfirm flex items-center justify-center gap-3 my-1">
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#D8B36A]/50 to-transparent" />
            <span 
              className={`${sacramentoFont.className} text-3xl md:text-4xl text-[#D8B36A] font-normal tracking-wide lowercase leading-none drop-shadow-[0_2px_10px_rgba(216,179,106,0.25)]`}
            >
              zenit design
            </span>
            <span className="h-[1px] w-10 bg-gradient-to-r from-transparent via-[#D8B36A]/50 to-transparent" />
          </div>
        </div>

        {/* REDES SOCIALES (Integradas arriba en la cabecera) */}
        <div className="w-full mb-6 animate-socials">
          <div className="flex items-center justify-center gap-4 py-2">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${social.name} de Casa Atenta`}
                className="w-11 h-11 flex items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-[#91A3B3] hover:text-[#D8B36A] hover:border-[#D8B36A]/50 hover:bg-[#D8B36A]/10 transition-all duration-300 active:scale-95"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* BOTÓN PRINCIPAL DE TARJETA DIGITAL (GUARDAR CONTACTO VCF) */}
        <div className="w-full mb-6 animate-vcard">
          <button
            onClick={handleSaveContact}
            className="w-full flex items-center justify-center gap-2.5 p-3.5 rounded-xl border border-[#D8B36A]/50 bg-[#D8B36A]/10 text-[#D8B36A] hover:bg-[#D8B36A] hover:text-[#07111D] font-mono text-xs tracking-widest uppercase transition-all duration-300 shadow-md active:scale-95 group"
          >
            <UserPlus className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>Guardar Contacto en el Teléfono</span>
          </button>
        </div>

        {/* CANALES PRINCIPALES (LIMPIO Y EN PRIMER PLANO) */}
        <div className="w-full space-y-3 mb-8 animate-main-links">
          
          {/* WhatsApp Corporativo */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-400/60 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:border-emerald-400 transition-colors">
                <MessageCircle className="w-5 h-5 fill-current" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-sans font-medium text-white group-hover:text-emerald-300 transition-colors">
                  WhatsApp Corporativo
                </h2>
                <p className="text-[11px] font-sans font-light text-emerald-200/60">
                  Atención inmediata para proyectos
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
          </a>

          {/* Página Web Principal */}
          <Link
            href="/"
            className="group w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#D8B36A]/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-[#D8B36A] border border-white/10 group-hover:border-[#D8B36A]/30 transition-colors">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-sans font-medium text-white group-hover:text-[#D8B36A] transition-colors">
                  Página Web Principal
                </h2>
                <p className="text-[11px] font-sans font-light text-[#91A3B3]">
                  www.casa-atenta.com
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#91A3B3] group-hover:text-[#D8B36A] group-hover:translate-x-1 transition-all" />
          </Link>

          {/* Tienda Virtual */}
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#D8B36A]/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-white border border-white/10 group-hover:border-[#D8B36A]/30 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-sans font-medium text-white group-hover:text-[#D8B36A] transition-colors">
                  Tienda Virtual
                </h2>
                <p className="text-[11px] font-sans font-light text-[#91A3B3]">
                  tienda.casa-atenta.com
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#91A3B3] group-hover:text-[#D8B36A] group-hover:translate-x-1 transition-all" />
          </a>

          {/* Blog Editorial */}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#D8B36A]/50 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white/5 text-[#91A3B3] border border-white/10 group-hover:border-[#D8B36A]/30 transition-colors">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-sans font-medium text-white group-hover:text-[#D8B36A] transition-colors">
                  Blog & Editorial
                </h2>
                <p className="text-[11px] font-sans font-light text-[#91A3B3]">
                  blog.casa-atenta.com
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[#91A3B3] group-hover:text-[#D8B36A] group-hover:translate-x-1 transition-all" />
          </a>

        </div>

        {/* EXPLORAR MÁS (Líneas minimalistas sin sobrecargas) */}
        <div className="w-full space-y-2 animate-secondary">
          <Link
            href="/cotiza"
            className="group w-full flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/15 transition-all"
          >
            <span className="text-xs font-sans text-[#91A3B3] group-hover:text-white transition-colors">
              Cuestionario de Cotización
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#91A3B3] group-hover:text-[#D8B36A] transition-colors" />
          </Link>

          <Link
            href="/proyectos"
            className="group w-full flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/15 transition-all"
          >
            <span className="text-xs font-sans text-[#91A3B3] group-hover:text-white transition-colors">
              Portafolio de Proyectos
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#91A3B3] group-hover:text-[#D8B36A] transition-colors" />
          </Link>

          <Link
            href="/servicios"
            className="group w-full flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-white/15 transition-all"
          >
            <span className="text-xs font-sans text-[#91A3B3] group-hover:text-[#D8B36A] transition-colors">
              Especialidades & Servicios
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-[#91A3B3] group-hover:text-[#D8B36A] transition-colors" />
          </Link>
        </div>

      </div>

      {/* FOOTER DISCRETO */}
      <div className="relative z-10 text-center text-[10px] font-mono text-[#91A3B3]/60 flex flex-col items-center gap-2 pt-8">
        <button 
          onClick={handleSharePage} 
          className="hover:text-[#D8B36A] transition-colors inline-flex items-center gap-1.5"
        >
          <Share2 className="w-3 h-3" />
          <span>Compartir esta tarjeta digital</span>
        </button>
        <div className="opacity-40">
          © {new Date().getFullYear()} CASA ATENTA. ZENIT DESIGN.
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 py-2.5 px-4 rounded-xl bg-[#D8B36A] text-[#07111D] text-xs font-medium shadow-2xl border border-white/20">
          <Check className="w-3.5 h-3.5 text-[#07111D]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
