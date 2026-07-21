"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Logo } from "@/components/Logo";
import { BrandText } from "@/components/BrandText";
import { WHATSAPP_LINK } from "@/constants/contact";
import { 
  MessageCircle, 
  ArrowRight, 
  Mail, 
  Sliders, 
  Layers, 
  Cpu, 
  UserCheck, 
  ArrowLeft 
} from "lucide-react";
import Link from "next/link";

interface LinkItem {
  title: string;
  subtitle: string;
  href: string;
  icon: React.ReactNode;
  external?: boolean;
}

export default function ConexionesPage() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states for entrance animations
      gsap.set(".animate-header", { opacity: 0, y: -25 });
      gsap.set(".animate-section", { opacity: 0, y: 15 });
      gsap.set(".animate-social-btn", { opacity: 0, scale: 0.8 });
      gsap.set(".animate-footer", { opacity: 0 });

      const tl = gsap.timeline({ delay: 0.1 });

      tl.to(".animate-header", {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power3.out",
      })
      .to(".animate-section", {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
      }, "-=0.4")
      .to(".animate-social-btn", {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        stagger: 0.06,
        ease: "back.out(1.5)",
      }, "-=0.3")
      .to(".animate-footer", {
        opacity: 1,
        duration: 0.6,
        ease: "sine.out",
      }, "-=0.2");
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const contactLinks: LinkItem[] = [
    {
      title: "WhatsApp Corporativo",
      subtitle: "Atención inmediata para proyectos residenciales",
      href: WHATSAPP_LINK,
      icon: <MessageCircle className="w-5 h-5 text-emerald-400" />,
      external: true,
    },
    {
      title: "Cuestionario de Cotización",
      subtitle: "Presupuesta e inicia tu diseño a medida",
      href: "/cotiza",
      icon: <Sliders className="w-5 h-5 text-brand-gold" />,
    },
    {
      title: "Escribir un Correo",
      subtitle: "Consultas comerciales y corporativas",
      href: "mailto:info@casa-atenta.com",
      icon: <Mail className="w-5 h-5 text-ca-blue-gray" />,
      external: true,
    },
  ];

  const digitalBranchLinks: LinkItem[] = [
    {
      title: "Configurador Interactivo",
      subtitle: "Diseña tu terraza y domótica en 3 minutos",
      href: "/configurador",
      icon: <Sliders className="w-5 h-5 text-white" />,
    },
    {
      title: "Portafolio de Proyectos",
      subtitle: "Explora planos de iluminación y renders 3D",
      href: "/proyectos",
      icon: <Layers className="w-5 h-5 text-white" />,
    },
    {
      title: "Nuestras Especialidades",
      subtitle: "Techos sol y sombra, domótica invisible e iluminación",
      href: "/servicios",
      icon: <Cpu className="w-5 h-5 text-white" />,
    },
    {
      title: "Nosotros y Filosofía",
      subtitle: "El enfoque metódico de ejecución premium",
      href: "/nosotros",
      icon: <UserCheck className="w-5 h-5 text-white" />,
    },
  ];

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com/casaatenta",
      path: "M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M18,5A1,1 0 0,1 19,6A1,1 0 0,1 17,6A1,1 0 0,1 17,6A1,1 0 0,1 18,5Z",
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

  const renderLinkCard = (item: LinkItem, idx: number) => {
    const CardContent = (
      <>
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-white/5 border border-white/10 group-hover:border-white/20 transition-colors">
            {item.icon}
          </div>
          <div className="text-left">
            <h3 className="text-[13px] font-sans font-semibold tracking-wide text-white group-hover:text-brand-gold transition-colors duration-300">
              {item.title}
            </h3>
            <p className="text-[10px] font-sans font-light text-ca-text-secondary mt-0.5 max-w-[200px] sm:max-w-none">
              {item.subtitle}
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-ca-text-secondary group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-300" />
      </>
    );

    const cardClasses = "group w-full flex items-center justify-between p-3.5 rounded-xl border border-white/5 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.04] hover:border-brand-gold/40 hover:shadow-[0_0_15px_rgba(216,179,106,0.05)] transition-all duration-300 cursor-pointer mb-3.5";

    if (item.external) {
      return (
        <a 
          key={idx}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cardClasses}
        >
          {CardContent}
        </a>
      );
    }

    return (
      <Link key={idx} href={item.href} className={cardClasses}>
        {CardContent}
      </Link>
    );
  };

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen py-16 px-4 bg-[#07111D] flex flex-col items-center justify-between overflow-hidden"
    >
      {/* Background grids / lines */}
      <div className="absolute inset-0 z-0 opacity-[0.015] architectural-grid pointer-events-none" />
      
      {/* Back button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-mono text-ca-text-secondary hover:text-white transition-colors group z-10"
      >
        <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
        <BrandText>VOLVER AL INICIO</BrandText>
      </Link>

      {/* Main Content Area */}
      <div className="w-full max-w-md flex flex-col items-center relative z-10 mt-6 mb-12">
        
        {/* Header Profile Section */}
        <div className="flex flex-col items-center text-center mb-10 animate-header">
          <div className="relative mb-5 group cursor-pointer">
            {/* Outer soft aura */}
            <div className="absolute -inset-2 rounded-full bg-brand-gold/10 filter blur-md opacity-60 scale-95 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative w-22 h-22 flex items-center justify-center rounded-full border border-white/10 bg-ca-deep-blue">
              <Logo className="text-white h-11 w-11" iconOnly={true} />
            </div>
          </div>
          
          <h1 className="text-lg tracking-[0.25em] text-white font-semibold uppercase mb-1.5">
            <BrandText>CASA ATENTA</BrandText>
          </h1>
          <p className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase mb-4">
            DISEÑO & AUTOMATIZACIÓN
          </p>
          <p className="text-xs text-ca-text-secondary max-w-sm font-light leading-relaxed px-4">
            Directorio oficial de contacto e interconexión digital corporativa. Accede a nuestros canales directos y ecosistema social.
          </p>
        </div>

        {/* Links: Trato Directo */}
        <div className="w-full mb-8 animate-section">
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="h-[1px] w-4 bg-brand-gold/40" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-brand-gold uppercase font-medium">
              TRATO DIRECTO
            </span>
          </div>
          {contactLinks.map((link, idx) => renderLinkCard(link, idx))}
        </div>

        {/* Links: Sucursal Digital */}
        <div className="w-full mb-8 animate-section">
          <div className="flex items-center gap-2 mb-4 px-2">
            <span className="h-[1px] w-4 bg-ca-blue-gray/40" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-ca-blue-gray uppercase font-medium">
              SUCURSAL DIGITAL
            </span>
          </div>
          {digitalBranchLinks.map((link, idx) => renderLinkCard(link, idx))}
        </div>

        {/* Ecosistema Social */}
        <div className="w-full flex flex-col items-center animate-section">
          <div className="flex items-center justify-center gap-2 mb-5 w-full">
            <span className="h-[1px] flex-grow bg-white/5 max-w-[60px]" />
            <span className="text-[10px] font-mono tracking-[0.2em] text-ca-text-secondary uppercase font-medium">
              ECOSISTEMA
            </span>
            <span className="h-[1px] flex-grow bg-white/5 max-w-[60px]" />
          </div>

          <div className="flex gap-4">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visitar ${social.name} de Casa Atenta`}
                className="animate-social-btn w-11 h-11 flex items-center justify-center rounded-full border border-white/10 text-ca-text-secondary hover:text-brand-gold hover:border-brand-gold hover:bg-brand-gold/5 transition-all duration-300"
              >
                <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d={social.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* Footer Branding (Allyx) */}
      <div className="animate-footer relative z-10 text-center text-[10px] font-mono text-ca-text-secondary/70 flex flex-col items-center gap-2">
        <a 
          href="https://allyxorb.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hover:text-brand-gold transition-colors duration-300 group flex items-center gap-1.5"
        >
          <span>DESARROLLADO POR ALLYX</span>
          <span className="text-[8px] opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300">↗</span>
        </a>
        <div className="opacity-50 text-[9px]">
          © {new Date().getFullYear()} CASA ATENTA. TODOS LOS DERECHOS RESERVADOS.
        </div>
      </div>

    </main>
  );
}
