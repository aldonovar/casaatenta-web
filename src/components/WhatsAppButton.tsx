"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { WhatsAppIcon } from "./icons/AnimatedIcons";
import { WHATSAPP_LINK } from "@/constants/contact";
import { BrandText } from "./BrandText";

interface WhatsAppButtonProps {
  label?: string;
  href?: string;
  variant?: "primary" | "secondary" | "floating";
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  label = "Agendar visita técnica",
  href = WHATSAPP_LINK,
  variant = "primary",
  className = "",
}) => {
  const floatingRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (variant === "floating" && floatingRef.current) {
      // Fade in floating button with delay on mount
      gsap.fromTo(
        floatingRef.current,
        { opacity: 0, scale: 0.8, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          delay: 3,
          ease: "back.out(1.7)",
        }
      );
    }
  }, [variant]);

  if (variant === "floating") {
    return (
      <a
        ref={floatingRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-brand-gold/30 bg-ca-bg-surface/80 text-brand-gold shadow-[0_12px_30px_rgba(0,0,0,0.4)] backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-brand-gold hover:text-brand-gold focus:outline-none opacity-0 group ca-group-hover-spin ca-group-hover-vibrate ${className}`}
      >
        {/* Glowing aura */}
        <span className="absolute inset-0 rounded-full bg-brand-gold/10 animate-ping opacity-75" />
        
        <WhatsAppIcon size={24} className="relative z-10 ca-trigger-spin ca-trigger-vibrate" aria-hidden="true" />
        
        {/* Hover Tooltip */}
        <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-ca-bg-surface text-ca-text border border-ca-border px-3 py-1.5 rounded text-[10px] tracking-widest font-mono uppercase whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-300 group-hover:opacity-100 shadow-xl">
          <BrandText>{label}</BrandText>
        </div>
      </a>
    );
  }

  const variantClass =
    variant === "secondary"
      ? "border-white/10 bg-white/[0.02] text-brand-light hover:border-brand-gold hover:bg-brand-gold/10 hover:text-brand-gold"
      : "border-brand-gold/40 bg-brand-gold text-brand-dark hover:bg-brand-gold-dark hover:border-brand-gold-dark";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`glow-btn group ca-group-hover-spin ca-group-hover-vibrate inline-flex min-h-12 items-center justify-center gap-2 border px-6 py-3.5 text-[10px] font-mono uppercase tracking-widest transition-all duration-300 ${variantClass} ${className}`}
    >
      <WhatsAppIcon size={18} className="ca-trigger-spin ca-trigger-vibrate" aria-hidden="true" />
      <span>{label}</span>
      <ArrowUpRight
        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </a>
  );
};
export default WhatsAppButton;
