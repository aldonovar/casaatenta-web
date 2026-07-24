"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { 
  MessageCircle, 
  ArrowRight, 
  Mail, 
  Sliders, 
  Layers, 
  Cpu, 
  UserCheck, 
  ArrowLeft,
  UserPlus,
  QrCode,
  Share2,
  Globe,
  ShoppingBag,
  BookOpen,
  Check,
  PhoneCall,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { BrandText } from "@/components/BrandText";
import { WHATSAPP_LINK } from "@/constants/contact";
import { STORE_URL } from "@/data/navigation";
import { BLOG_URL } from "@/lib/urls";
import { downloadVCard } from "@/lib/vcard";
import { QRShareModal } from "@/components/links/QRShareModal";

export default function LinksPage() {
  const containerRef = useRef<HTMLElement>(null);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canonicalUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/links`
    : "https://www.casa-atenta.com/links";

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".animate-header", { opacity: 0, y: -20 });
      gsap.set(".animate-socials-top", { opacity: 0, scale: 0.95 });
      gsap.set(".animate-hero-cards", { opacity: 0, y: 15 });
      gsap.set(".animate-actions-bar", { opacity: 0, y: 15 });
      gsap.set(".animate-secondary-cards", { opacity: 0, y: 15 });
      gsap.set(".animate-footer", { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(".animate-header", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out",
      })
      .to(".animate-socials-top", {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: "back.out(1.4)",
      }, "-=0.3")
      .to(".animate-hero-cards", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: "power2.out",
      }, "-=0.3")
      .to(".animate-actions-bar", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.2")
      .to(".animate-secondary-cards", {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.06,
        ease: "power2.out",
      }, "-=0.2")
      .to(".animate-footer", {
        opacity: 1,
        duration: 0.4,
        ease: "sine.out",
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
    showToast("¡Contacto de Casa Atenta guardado!");
  };

  const handleSharePage = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Casa Atenta - Conexiones Oficiales",
          text: "Directorio oficial de contacto, tienda y proyectos de Casa Atenta.",
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
        showToast("¡Enlace copiado al portapapeles!");
      } catch (err) {
        console.error("Error copying URL:", err);
      }
    }
  };

  const socialPlatforms = [
    {
      name: "Instagram",
      href: "https://instagram.com/casaatenta",
      color: "hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400",
      path: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1,1 0 0,1 19,6A1,1 0 0,1 17,6A1,1 0 0,1 17,6A1,1 0 0,1 18,5Z",
    },
    {
      name: "TikTok",
      href: "https://tiktok.com/@casaatenta",
      color: "hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-300",
      path: "M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 1 0-1 13.6 6.84 6.84 0 0 0 6.9-6.84V6.16a9.29 9.29 0 0 0 5-1.57v-3.9a5.61 5.61 0 0 1-1.67.9z",
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/casaatenta/",
      color: "hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400",
      path: "M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z",
    },
    {
      name: "Facebook",
      href: "https://facebook.com/casaatenta",
      color: "hover:border-blue-600/50 hover:bg-blue-600/10 hover:text-blue-500",
      path: "M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.15 5.96C15.21 5.96 16.12 6.04 16.12 6.04V8.51H15.01C13.77 8.51 13.38 9.28 13.38 10.07V12.06H16.16L15.72 14.96H13.38V21.96C18.16 21.21 21.82 17.06 21.82 12.06C21.82 6.53 17.32 2.04 12 2.04Z",
    },
  ];

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen py-8 px-4 bg-[#050C15] flex flex-col items-center justify-between text-white selection:bg-brand-gold selection:text-[#050C15]"
    >
      {/* Background Architectural Grid & Subtle Radial Glow */}
      <div className="fixed inset-0 z-0 opacity-[0.02] architectural-grid pointer-events-none" />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gradient-to-b from-brand-gold/15 via-brand-gold/5 to-transparent rounded-full blur-[140px] pointer-events-none" />

      {/* Navigation Header */}
      <div className="w-full max-w-md flex items-center justify-between relative z-10 mb-6 px-1">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-ca-text-secondary hover:text-white hover:border-white/20 transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
          <span>Volver al sitio</span>
        </Link>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          <span>Atención Directa</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md flex flex-col items-center relative z-10">
        
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center mb-6 animate-header">
          <div className="relative mb-3 group cursor-pointer">
            <div className="absolute -inset-2 rounded-full bg-brand-gold/25 blur-xl opacity-75 group-hover:scale-110 transition-all duration-500" />
            <div className="relative w-20 h-20 flex items-center justify-center rounded-full border border-brand-gold/40 bg-[#0A1A2D] shadow-[0_0_35px_rgba(216,179,106,0.2)]">
              <Logo className="text-brand-gold h-10 w-10" iconOnly={true} />
            </div>
          </div>
          
          <h1 className="text-2xl font-bold tracking-[0.2em] text-white uppercase mb-1">
            <BrandText>CASA ATENTA</BrandText>
          </h1>
          <p className="text-[11px] font-mono tracking-[0.25em] text-brand-gold uppercase font-medium">
            ARQUITECTURA & AUTOMATIZACIÓN
          </p>
        </div>

        {/* REDES SOCIALES (Primer Plano - Visibles Arriba) */}
        <div className="w-full mb-6 animate-socials-top">
          <div className="grid grid-cols-4 gap-2.5 p-2 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl">
            {socialPlatforms.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${social.name} de Casa Atenta`}
                className={`flex flex-col items-center justify-center gap-1.5 py-3 px-1 rounded-xl border border-white/5 bg-white/[0.02] text-ca-text-secondary ${social.color} transition-all duration-300 group active:scale-95`}
              >
                <svg className="w-5 h-5 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d={social.path} />
                </svg>
                <span className="text-[10px] font-mono tracking-wide font-medium">
                  {social.name}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* SECCIÓN 1: CANALES PRINCIPALES EN PRIMER PLANO (HERO CARDS) */}
        <div className="w-full space-y-3 mb-6 animate-hero-cards">
          
          {/* WhatsApp Directo (Hero Highlight) */}
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between p-4 rounded-2xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-[#0A1A2D] to-emerald-950/30 hover:border-emerald-400 hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 cursor-pointer relative overflow-hidden"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/40 group-hover:bg-emerald-500 group-hover:text-ca-deep-blue text-emerald-400 transition-all duration-300 shrink-0 shadow-lg">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                    WhatsApp Corporativo
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-mono tracking-wider font-semibold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    DIRECTO
                  </span>
                </div>
                <p className="text-xs text-emerald-100/70 font-light truncate mt-0.5">
                  Atención inmediata y consultas de proyectos
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-2" />
          </a>

          {/* Página Web Principal */}
          <Link
            href="/"
            className="group w-full flex items-center justify-between p-4 rounded-2xl border border-brand-gold/40 bg-gradient-to-r from-brand-gold/10 via-[#0A1A2D] to-[#0A1A2D] hover:border-brand-gold hover:shadow-[0_0_25px_rgba(216,179,106,0.18)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-brand-gold/15 border border-brand-gold/30 text-brand-gold group-hover:bg-brand-gold group-hover:text-ca-deep-blue transition-all duration-300 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <h2 className="text-sm font-semibold text-white group-hover:text-brand-gold transition-colors truncate">
                  Página Web Principal
                </h2>
                <p className="text-xs text-ca-text-secondary font-light truncate mt-0.5">
                  www.casa-atenta.com
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-all duration-300 shrink-0 ml-2" />
          </Link>

          {/* Tienda Virtual */}
          <a
            href={STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-emerald-400/50 hover:shadow-[0_0_20px_rgba(52,211,153,0.12)] transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 shrink-0">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="text-left min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors truncate">
                    Tienda Virtual
                  </h2>
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono tracking-wider font-semibold uppercase bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                    TIENDA
                  </span>
                </div>
                <p className="text-xs text-ca-text-secondary font-light truncate mt-0.5">
                  Catálogo de productos y tecnología
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-ca-text-secondary group-hover:text-emerald-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 shrink-0 ml-2" />
          </a>

          {/* Blog Editorial */}
          <a
            href={BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full flex items-center justify-between p-3.5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-400/40 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 shrink-0">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div className="text-left min-w-0">
                <h2 className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors truncate">
                  Blog & Editorial Casa Atenta
                </h2>
                <p className="text-[11px] text-ca-text-secondary font-light truncate mt-0.5">
                  Artículos sobre diseño, domótica e iluminación
                </p>
              </div>
            </div>
            <ExternalLink className="w-4 h-4 text-ca-text-secondary group-hover:text-cyan-300 transition-all duration-300 shrink-0 ml-2" />
          </a>

        </div>

        {/* ACCIONES DE TARJETA DIGITAL (vCard + QR) */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 animate-actions-bar">
          <button
            onClick={handleSaveContact}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-brand-gold/40 bg-brand-gold/10 text-brand-gold hover:bg-brand-gold hover:text-ca-deep-blue font-semibold text-xs transition-all duration-300 shadow-md active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Guardar Contacto (.VCF)</span>
          </button>

          <button
            onClick={() => setIsQRModalOpen(true)}
            className="flex items-center justify-center gap-2 p-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white hover:border-brand-gold/50 hover:bg-white/10 font-medium text-xs transition-all duration-300 active:scale-95"
          >
            <QrCode className="w-4 h-4 text-brand-gold" />
            <span>Ver mi Código QR</span>
          </button>
        </div>

        {/* SECCIÓN 2: HERRAMIENTAS Y EXPLORACIÓN (COMPACTAS) */}
        <div className="w-full space-y-2.5 mb-8 animate-secondary-cards">
          <div className="flex items-center gap-2 mb-2 px-1">
            <span className="h-[1px] w-3 bg-brand-gold/60" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold/80 uppercase font-medium">
              HERRAMIENTAS & PROYECTOS
            </span>
          </div>

          <Link
            href="/cotiza"
            className="group w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-brand-gold/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sliders className="w-4 h-4 text-brand-gold shrink-0" />
              <span className="text-xs font-medium text-white group-hover:text-brand-gold transition-colors truncate">
                Cuestionario de Cotización Interactivo
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-ca-text-secondary group-hover:text-brand-gold transition-all shrink-0" />
          </Link>

          <Link
            href="/configurador"
            className="group w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-amber-400/30 transition-all duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors truncate">
                Configurador 3D de Terrazas & Domótica
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-ca-text-secondary group-hover:text-amber-300 transition-all shrink-0" />
          </Link>

          <Link
            href="/proyectos"
            className="group w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Layers className="w-4 h-4 text-white/80 shrink-0" />
              <span className="text-xs font-medium text-white group-hover:text-brand-gold transition-colors truncate">
                Portafolio de Proyectos & Renders 3D
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-ca-text-secondary group-hover:text-brand-gold transition-all shrink-0" />
          </Link>

          <Link
            href="/servicios"
            className="group w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Cpu className="w-4 h-4 text-white/80 shrink-0" />
              <span className="text-xs font-medium text-white group-hover:text-brand-gold transition-colors truncate">
                Especialidades (Sol y Sombra, Domótica, Iluminación)
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-ca-text-secondary group-hover:text-brand-gold transition-all shrink-0" />
          </Link>

          <Link
            href="/nosotros"
            className="group w-full flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
          >
            <div className="flex items-center gap-3 min-w-0">
              <UserCheck className="w-4 h-4 text-white/80 shrink-0" />
              <span className="text-xs font-medium text-white group-hover:text-brand-gold transition-colors truncate">
                Nosotros & Filosofía de Trabajo
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-ca-text-secondary group-hover:text-brand-gold transition-all shrink-0" />
          </Link>
        </div>

      </div>

      {/* Footer */}
      <div className="animate-footer relative z-10 text-center text-[10px] font-mono text-ca-text-secondary/60 flex flex-col items-center gap-1.5 pb-4">
        <button 
          onClick={handleSharePage} 
          className="hover:text-brand-gold transition-colors inline-flex items-center gap-1 text-[11px]"
        >
          <Share2 className="w-3 h-3" />
          <span>Compartir esta tarjeta digital</span>
        </button>
        <div className="opacity-40 text-[9px] mt-1">
          © {new Date().getFullYear()} CASA ATENTA. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </div>

      {/* QR Share Modal */}
      <QRShareModal
        isOpen={isQRModalOpen}
        onClose={() => setIsQRModalOpen(false)}
        targetUrl={canonicalUrl}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 py-3 px-5 rounded-2xl bg-brand-gold text-ca-deep-blue text-xs font-bold shadow-2xl animate-fade-in border border-white/30">
          <Check className="w-4 h-4 text-ca-deep-blue" />
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}
