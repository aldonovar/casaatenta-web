import React from 'react';
import { BrandText } from './BrandText';

interface PremiumPlaceholderProps {
  title: string;
  requirements?: string;
  dimensions?: string;
  plano?: string;
  frames?: string;
  aspectRatio?: string;
  className?: string;
}

export const PremiumPlaceholder: React.FC<PremiumPlaceholderProps> = ({
  title,
  requirements = 'Detalle de integración arquitectónica oculta.',
  dimensions = '1920x1080 px',
  plano = 'Plano Detalle (Macro)',
  frames = 'Estático',
  aspectRatio = 'aspect-video',
  className = '',
}) => {
  const isExterior = plano.toLowerCase().includes('exterior') || plano.toLowerCase().includes('norte') || plano.toLowerCase().includes('paisaje') || plano.toLowerCase().includes('axonométrica');
  const isCeiling = plano.toLowerCase().includes('techo') || plano.toLowerCase().includes('cielorraso') || plano.toLowerCase().includes('termomecánico');
  const isDetail = plano.toLowerCase().includes('detalle') || plano.toLowerCase().includes('corte') || plano.toLowerCase().includes('esquema');
  
  return (
    <div
      className={`relative w-full overflow-hidden bg-brand-dark-soft border border-white/[0.04] transition-all duration-700 ease-out hover:border-brand-gold/20 flex flex-col justify-between p-8 select-none ${aspectRatio} ${className}`}
    >
      {/* Background Architectural Grid (Extremely light and dry) */}
      <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* Top section: Title and specs */}
      <div className="relative z-10 flex items-start justify-between w-full border-b border-white/[0.03] pb-4">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono tracking-[0.25em] text-brand-gold uppercase">
            <BrandText>PLANO DE ARQUITECTURA // INTEGRACIÓN</BrandText>
          </span>
          <h4 className="text-xs md:text-sm font-sans font-light text-brand-light uppercase tracking-[0.2em] mt-1.5">
            <BrandText>{title}</BrandText>
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono tracking-widest text-brand-gold/60 uppercase block">
            <BrandText>{plano}</BrandText>
          </span>
          <span className="text-[7.5px] font-mono text-brand-light/30 uppercase tracking-widest mt-0.5 block">
            {dimensions} // {frames}
          </span>
        </div>
      </div>

      {/* Middle section: The Beautiful SVG Line Art Drawing */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none p-16">
        {isExterior && (
          /* Volumetric Minimalist Villa Elevation (e.g., Image 1 and 2) */
          <svg viewBox="0 0 400 220" className="w-full h-full max-h-[75%] opacity-40" stroke="currentColor" fill="none">
            {/* Horizon line */}
            <line x1="10" y1="180" x2="390" y2="180" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-30" />
            
            {/* Ground pool box */}
            <polygon points="50,180 180,180 160,210 30,210" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-20" />
            
            {/* Villa Main Concrete Volume */}
            <rect x="170" y="40" width="160" height="140" stroke="#f5f5f3" strokeWidth="0.75" />
            
            {/* Left overhang cantilever (Image 2 style) */}
            <polygon points="90,70 170,70 170,120 110,120" stroke="#f5f5f3" strokeWidth="1" />
            
            {/* Lower concrete wall support */}
            <line x1="90" y1="120" x2="90" y2="180" stroke="#f5f5f3" strokeWidth="0.75" />
            
            {/* Glass panel lines */}
            <line x1="210" y1="80" x2="210" y2="180" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-40" />
            <line x1="270" y1="80" x2="270" y2="180" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-40" />
            
            {/* Under-cantilever linear lighting glow line (Image 2 style) */}
            <line x1="100" y1="122" x2="168" y2="122" stroke="#c5a880" strokeWidth="2.5" />
            
            {/* Minimalist callout marker (Image 2 style) */}
            {/* Small dot */}
            <circle cx="134" cy="122" r="1.5" fill="#c5a880" />
            {/* Thin vertical leader */}
            <line x1="134" y1="122" x2="134" y2="145" stroke="#c5a880" strokeWidth="0.75" />
            {/* Horizontal leader */}
            <line x1="134" y1="145" x2="210" y2="145" stroke="#c5a880" strokeWidth="0.75" />
            {/* Label */}
            <text x="215" y="148" fill="#c5a880" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1">ILUMINACIÓN INTEGRADA</text>
          </svg>
        )}

        {isCeiling && (
          /* Reflected Ceiling Plan & Ranura constructivo */
          <svg viewBox="0 0 400 220" className="w-full h-full max-h-[75%] opacity-40" stroke="currentColor" fill="none">
            {/* Slab lines */}
            <line x1="20" y1="50" x2="380" y2="50" stroke="#f5f5f3" strokeWidth="1" />
            {/* Suspended Ceiling profiles */}
            <rect x="50" y="80" width="130" height="20" stroke="#f5f5f3" strokeWidth="0.75" />
            <rect x="220" y="80" width="130" height="20" stroke="#f5f5f3" strokeWidth="0.75" />
            
            {/* Structural slab anchors */}
            <line x1="80" y1="50" x2="80" y2="80" stroke="#f5f5f3" strokeWidth="0.5" />
            <line x1="150" y1="50" x2="150" y2="80" stroke="#f5f5f3" strokeWidth="0.5" />
            <line x1="250" y1="50" x2="250" y2="80" stroke="#f5f5f3" strokeWidth="0.5" />
            <line x1="320" y1="50" x2="320" y2="80" stroke="#f5f5f3" strokeWidth="0.5" />
            
            {/* Ranura invisible 12mm (Gap between ceiling volumes) */}
            <line x1="180" y1="80" x2="180" y2="110" stroke="#c5a880" strokeWidth="1.5" />
            <line x1="220" y1="80" x2="220" y2="110" stroke="#c5a880" strokeWidth="1.5" />
            
            {/* Air flow arrows (Faint paths) */}
            <path d="M200,60 Q200,85 190,95" stroke="#c5a880" strokeWidth="0.5" strokeDasharray="2,2" className="opacity-60" />
            <path d="M200,60 Q200,85 210,95" stroke="#c5a880" strokeWidth="0.5" strokeDasharray="2,2" className="opacity-60" />
            
            {/* Callout */}
            <circle cx="200" cy="90" r="1.5" fill="#c5a880" />
            <line x1="200" y1="90" x2="200" y2="135" stroke="#c5a880" strokeWidth="0.75" />
            <line x1="200" y1="135" x2="270" y2="135" stroke="#c5a880" strokeWidth="0.75" />
            <text x="275" y="138" fill="#c5a880" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1">DIFUSIÓN INVISIBLE 12mm</text>
          </svg>
        )}

        {isDetail && !isCeiling && (
          /* Construction detailed section (e.g. sensor or lock under wood/stone) */
          <svg viewBox="0 0 400 220" className="w-full h-full max-h-[75%] opacity-40" stroke="currentColor" fill="none">
            {/* Solid material hatching boundaries */}
            <rect x="40" y="40" width="120" height="140" stroke="#f5f5f3" strokeWidth="0.75" />
            <rect x="240" y="40" width="120" height="140" stroke="#f5f5f3" strokeWidth="0.75" />
            
            {/* Material partition lines */}
            <line x1="40" y1="90" x2="160" y2="90" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-30" />
            <line x1="40" y1="140" x2="160" y2="140" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-30" />
            <line x1="240" y1="90" x2="360" y2="90" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-30" />
            
            {/* Embedded transducer/sensor diagram inside the hollow gap */}
            <rect x="175" y="70" width="50" height="30" stroke="#f5f5f3" strokeWidth="0.75" />
            <circle cx="200" cy="85" r="8" stroke="#c5a880" strokeWidth="1" />
            
            {/* Wiring pathways */}
            <path d="M200,100 L200,150 L140,150" stroke="#f5f5f3" strokeWidth="0.5" strokeDasharray="3,3" className="opacity-50" />
            
            {/* Elegant Callout */}
            <circle cx="200" cy="85" r="1.5" fill="#c5a880" />
            <line x1="200" y1="85" x2="200" y2="135" stroke="#c5a880" strokeWidth="0.75" />
            <line x1="200" y1="135" x2="130" y2="135" stroke="#c5a880" strokeWidth="0.75" />
            <text x="55" y="138" fill="#c5a880" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1">MÓDULO OCULTO</text>
          </svg>
        )}

        {!isExterior && !isCeiling && !isDetail && (
          /* Interior Lounge Room Perspective (Image 5 style) */
          <svg viewBox="0 0 400 220" className="w-full h-full max-h-[75%] opacity-40" stroke="currentColor" fill="none">
            {/* Room corner lines */}
            <line x1="140" y1="30" x2="140" y2="190" stroke="#f5f5f3" strokeWidth="0.75" />
            <line x1="140" y1="30" x2="30" y2="0" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-55" />
            <line x1="140" y1="190" x2="30" y2="210" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-55" />
            <line x1="140" y1="30" x2="370" y2="0" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-55" />
            <line x1="140" y1="190" x2="370" y2="210" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-55" />
            
            {/* Travertino marble block on the floor */}
            <polygon points="170,140 310,120 340,180 190,210" stroke="#f5f5f3" strokeWidth="0.75" />
            
            {/* Recessed linear wall light */}
            <line x1="140" y1="50" x2="370" y2="18" stroke="#c5a880" strokeWidth="2.0" />
            
            {/* Minimalist Door silhouette on the left wall */}
            <polygon points="50,60 110,50 110,185 50,195" stroke="#f5f5f3" strokeWidth="0.5" className="opacity-45" />
            
            {/* Keypad callout on doorframe (Image 5 style) */}
            <circle cx="110" cy="120" r="1.5" fill="#c5a880" />
            <line x1="110" y1="120" x2="175" y2="120" stroke="#c5a880" strokeWidth="0.75" />
            {/* angled leader */}
            <line x1="175" y1="120" x2="195" y2="140" stroke="#c5a880" strokeWidth="0.75" />
            <line x1="195" y1="140" x2="260" y2="140" stroke="#c5a880" strokeWidth="0.75" />
            <text x="265" y="143" fill="#c5a880" fontSize="6.5" fontFamily="sans-serif" letterSpacing="1">ACCESO INTEGRADO</text>
          </svg>
        )}
      </div>

      {/* Bottom section: Text descriptions */}
      <div className="relative z-10 pt-4 flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
        <p className="text-[11px] font-sans font-light text-brand-light/50 leading-relaxed max-w-xl">
          {requirements}
        </p>
        
        {/* Simple Index Marker */}
        <div className="text-[9px] font-mono tracking-widest text-brand-gold uppercase whitespace-nowrap self-end border-t border-brand-gold/10 pt-2 w-full md:w-auto text-right">
          <span><BrandText>ESPECIFICACIÓN // CA-0{isExterior ? '1' : isCeiling ? '2' : isDetail ? '3' : '4'}</BrandText></span>
        </div>
      </div>
    </div>
  );
};
