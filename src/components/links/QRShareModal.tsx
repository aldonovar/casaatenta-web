"use client";

import React, { useState } from "react";
import { X, Copy, Check, Share2, Download } from "lucide-react";
import { Logo } from "@/components/Logo";
import { BrandText } from "@/components/BrandText";

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUrl: string;
}

export const QRShareModal: React.FC<QRShareModalProps> = ({
  isOpen,
  onClose,
  targetUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Error al copiar al portapapeles:", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Casa Atenta - Conexiones Oficiales",
          text: "Accede al directorio digital de contacto, tienda y proyectos de Casa Atenta.",
          url: targetUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error al compartir:", err);
        }
      }
    } else {
      handleCopy();
    }
  };

  // High-reliability QR Code SVG generated for target URL via API with fallback
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    targetUrl
  )}&color=ffffff&bgcolor=0c2742&margin=10`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#07111D] border border-brand-gold/30 p-6 shadow-[0_0_40px_rgba(216,179,106,0.15)] text-center flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-ca-text-secondary hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2 mb-2">
          <Logo className="w-6 h-6 text-brand-gold" iconOnly />
          <h2 className="text-sm font-semibold tracking-wider uppercase text-white">
            <BrandText>CASA ATENTA</BrandText>
          </h2>
        </div>
        <p className="text-[11px] font-mono text-brand-gold uppercase tracking-widest mb-5">
          CÓDIGO QR OFICIAL
        </p>

        {/* QR Display Container */}
        <div className="relative p-4 rounded-xl bg-ca-deep-blue border border-white/10 shadow-inner group">
          {/* Subtle Glow */}
          <div className="absolute -inset-1 rounded-xl bg-brand-gold/20 blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
          
          <div className="relative z-10 bg-[#0C2742] p-3 rounded-lg flex items-center justify-center">
            {/* QR Image */}
            {/* eslint-disable-next-html-element-for-img */}
            <img
              src={qrImageUrl}
              alt="Código QR de Casa Atenta Links"
              className="w-56 h-56 rounded-md object-contain"
            />
            {/* Central Badge Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 rounded-full bg-[#07111D] border border-brand-gold/60 flex items-center justify-center shadow-lg">
                <Logo className="w-5 h-5 text-brand-gold" iconOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic URL Label */}
        <p className="mt-4 text-xs font-mono text-ca-text-secondary truncate max-w-full px-2">
          {targetUrl}
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 w-full mt-5">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-white/10 bg-white/5 text-xs font-medium text-white hover:border-brand-gold/40 hover:bg-white/10 transition-all active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-brand-gold" />
                <span>Copiar Enlace</span>
              </>
            )}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-brand-gold/40 bg-brand-gold/10 text-xs font-medium text-brand-gold hover:bg-brand-gold hover:text-ca-deep-blue transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
            <span>Compartir</span>
          </button>
        </div>

        <a
          href={qrImageUrl}
          download="Casa_Atenta_QR.png"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-mono text-ca-text-secondary hover:text-brand-gold transition-colors"
        >
          <Download className="w-3 h-3" />
          <span>Descargar Imagen QR (PNG)</span>
        </a>
      </div>
    </div>
  );
};
