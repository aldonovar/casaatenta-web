import React, { useEffect, useRef } from 'react';
import { BrandText } from './BrandText';
import { gsap } from 'gsap';

interface PremiumPlaceholderProps {
  title: string;
  requirements?: string;
  dimensions?: string;
  plano?: string;
  frames?: string;
  aspectRatio?: string;
  className?: string;
  scene?: 'hero' | 'manifiesto' | 'before' | 'after' | 'circadian' | 'pergola' | 'detail-audio' | 'detail-clima' | 'detail-sensor' | 'spa' | 'lounge';
  circadianColor?: string;
  circadianOpacity?: number;
}

export const PremiumPlaceholder: React.FC<PremiumPlaceholderProps> = ({
  title,
  requirements = 'Detalle de integración arquitectónica oculta.',
  dimensions = '1920x1080 px',
  plano = 'Plano Detalle (Macro)',
  frames = 'Vectorizado',
  aspectRatio = 'aspect-video',
  className = '',
  scene = 'lounge',
  circadianColor = 'rgba(255,255,255,0.05)',
  circadianOpacity = 0.5
}) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // Self-drawing line animation for the architectural wireframes
    const paths = svgEl.querySelectorAll('path, line, rect, polygon, circle');
    
    // Set initial state for path drawing
    gsap.killTweensOf(paths);
    
    // We animate the strokes using GSAP
    gsap.fromTo(paths, 
      { strokeDasharray: 1000, strokeDashoffset: 1000 },
      { 
        strokeDashoffset: 0, 
        duration: 2.2, 
        ease: 'power2.out', 
        stagger: 0.015,
        overwrite: 'auto'
      }
    );

    // Subtle micro-animations depending on the scene (properly scoped to local nodes)
    if (scene === 'hero') {
      const coords = svgEl.querySelectorAll('.floating-coord');
      gsap.killTweensOf(coords);
      gsap.fromTo(coords,
        { y: 5, opacity: 0.3 },
        { y: -5, opacity: 0.7, duration: 3, repeat: -1, yoyo: true, ease: 'sine.inOut', stagger: 0.4 }
      );
    } else if (scene === 'detail-clima') {
      const airPaths = svgEl.querySelectorAll('.air-path');
      gsap.killTweensOf(airPaths);
      gsap.to(airPaths, {
        strokeDashoffset: -20,
        duration: 1.5,
        repeat: -1,
        ease: 'none'
      });
    } else if (scene === 'detail-audio') {
      const soundwaves = svgEl.querySelectorAll('.soundwave-pulse');
      gsap.killTweensOf(soundwaves);
      gsap.fromTo(soundwaves,
        { scale: 0.9, opacity: 0.1 },
        { scale: 1.15, opacity: 0.6, duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut', transformOrigin: 'center' }
      );
    }

    return () => {
      // Clean up all tweens on elements inside this SVG container on unmount/re-run
      if (svgEl) {
        const allElements = svgEl.querySelectorAll('*');
        gsap.killTweensOf(allElements);
      }
    };
  }, [scene]);

  return (
    <div
      className={`relative w-full overflow-hidden bg-brand-dark-soft border border-white/[0.04] transition-all duration-700 ease-out hover:border-brand-gold/20 flex flex-col justify-between p-6 select-none ${aspectRatio} ${className}`}
    >
      {/* Background Architectural Grid (Extremely light and dry) */}
      <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      {/* Top section: Title and specs */}
      <div className="relative z-10 flex items-start justify-between w-full border-b border-white/[0.03] pb-3">
        <div className="flex flex-col">
          <span className="text-[9px] font-mono tracking-[0.25em] text-brand-gold uppercase">
            <BrandText>PLANO DE ARQUITECTURA // INTEGRACIÓN</BrandText>
          </span>
          <h4 className="text-xs md:text-sm font-sans font-light text-brand-light uppercase tracking-[0.2em] mt-1">
            <BrandText>{title}</BrandText>
          </h4>
        </div>
        <div className="text-right">
          <span className="text-[9px] font-mono tracking-widest text-brand-gold/60 uppercase block font-semibold">
            <BrandText>{plano}</BrandText>
          </span>
          <span className="text-[7.5px] font-mono text-brand-light/30 uppercase tracking-widest mt-0.5 block">
            {dimensions} // {frames}
          </span>
        </div>
      </div>

      {/* Middle section: The Beautiful SVG Line Art Drawing */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none p-12">
        <svg 
          ref={svgRef}
          viewBox="0 0 400 220" 
          className="w-full h-full max-h-[75%] opacity-55 text-brand-light" 
          stroke="currentColor" 
          fill="none"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* SCENE: HERO - Volumetric Architect Villa Wireframe */}
          {scene === 'hero' && (
            <g strokeWidth="0.75" className="text-brand-light/65">
              <line x1="20" y1="180" x2="380" y2="180" strokeWidth="0.5" className="text-brand-light/20" />
              {/* Ground structure */}
              <polygon points="50,180 140,140 330,140 240,180" strokeWidth="0.5" className="text-brand-light/10" />
              {/* Building Blocks */}
              <polygon points="90,170 170,130 250,130 170,170" />
              <polygon points="170,130 250,90 330,90 250,130" />
              {/* Concrete Cantilever overhang */}
              <polygon points="70,120 160,75 270,75 180,120" strokeWidth="1.25" className="text-brand-gold" />
              <line x1="70" y1="120" x2="70" y2="155" />
              <line x1="180" y1="120" x2="180" y2="155" />
              <line x1="160" y1="75" x2="160" y2="130" />
              <line x1="270" y1="75" x2="270" y2="130" />
              {/* Glass railings */}
              <line x1="90" y1="170" x2="90" y2="180" />
              <line x1="170" y1="170" x2="170" y2="180" />
              <line x1="240" y1="170" x2="240" y2="180" />
              {/* Tech callouts */}
              <circle cx="120" cy="98" r="2" fill="currentColor" className="text-brand-gold" />
              <line x1="120" y1="98" x2="120" y2="45" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="120" y1="45" x2="165" y2="45" strokeWidth="0.5" className="text-brand-gold" />
              <text x="170" y="48" fill="#c5a880" fontSize="6.5" fontFamily="monospace" letterSpacing="1" className="floating-coord">SYS_LUMI_OK</text>
            </g>
          )}

          {/* SCENE: MANIFIESTO - Light beam inside bare concrete vault */}
          {scene === 'manifiesto' && (
            <g strokeWidth="0.75" className="text-brand-light/60">
              <line x1="10" y1="180" x2="390" y2="180" strokeWidth="0.5" className="text-brand-light/25" />
              {/* Room perspectives */}
              <polygon points="50,40 180,90 180,180 50,180" />
              <polygon points="180,90 350,40 350,180 180,180" />
              <line x1="50" y1="40" x2="350" y2="40" />
              {/* Narrow Skylight opening */}
              <polygon points="170,40 220,40 200,50 150,50" className="text-brand-gold" />
              {/* Sunlight ray beam slicing down */}
              <polygon points="170,40 220,40 280,180 200,180" fill="rgba(197, 168, 128, 0.08)" stroke="rgba(197, 168, 128, 0.3)" strokeWidth="0.5" />
            </g>
          )}

          {/* SCENE: BEFORE - Room filled with visual noise, wires, bulky components */}
          {scene === 'before' && (
            <g strokeWidth="0.75" className="text-brand-light/45">
              <line x1="20" y1="190" x2="380" y2="190" strokeWidth="0.5" className="text-brand-light/20" />
              <polygon points="60,50 160,100 160,190 60,190" />
              <polygon points="160,100 340,50 340,190 160,190" />
              {/* TV Wall-mounted with visible wires */}
              <rect x="200" y="80" width="90" height="50" />
              <path d="M225,130 L225,160 L245,160 L245,130" />
              {/* Ugly wires dangling */}
              <path d="M245,130 C255,145 250,165 260,180" strokeWidth="0.5" className="text-brand-gold/60" />
              <path d="M235,130 C220,150 230,170 225,185" strokeWidth="0.5" className="text-brand-gold/60" />
              {/* Bulky AC unit split on the left wall */}
              <rect x="80" y="70" width="50" height="15" />
              <line x1="80" y1="82" x2="130" y2="82" />
              {/* Wall switch plate with multiple buttons */}
              <rect x="175" y="125" width="10" height="15" />
              <circle cx="178" cy="130" r="1" fill="currentColor" />
              <circle cx="182" cy="130" r="1" fill="currentColor" />
              <circle cx="178" cy="135" r="1" fill="currentColor" />
              <circle cx="182" cy="135" r="1" fill="currentColor" />
            </g>
          )}

          {/* SCENE: AFTER - Clean, sleek, invisible space */}
          {scene === 'after' && (
            <g strokeWidth="0.75" className="text-brand-light/65">
              <line x1="20" y1="190" x2="380" y2="190" strokeWidth="0.5" className="text-brand-light/20" />
              <polygon points="60,50 160,100 160,190 60,190" />
              <polygon points="160,100 340,50 340,190 160,190" />
              {/* TV is gone! Clean wall with wood panels or stone textures */}
              <line x1="200" y1="50" x2="200" y2="190" strokeWidth="0.5" className="text-brand-light/15" />
              <line x1="250" y1="50" x2="250" y2="190" strokeWidth="0.5" className="text-brand-light/15" />
              <line x1="300" y1="50" x2="300" y2="190" strokeWidth="0.5" className="text-brand-light/15" />
              
              {/* Invisible ceiling slot (Ranura 12mm) */}
              <line x1="160" y1="100" x2="340" y2="50" strokeWidth="2.5" className="text-brand-gold" />
              <circle cx="250" cy="75" r="1.5" fill="currentColor" className="text-brand-gold" />
              <line x1="250" y1="75" x2="250" y2="120" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="250" y1="120" x2="210" y2="120" strokeWidth="0.5" className="text-brand-gold" />
              <text x="145" y="123" fill="#c5a880" fontSize="6.5" fontFamily="monospace" letterSpacing="0.8">RANURA 12mm</text>
            </g>
          )}

          {/* SCENE: CIRCADIAN - Clean room drawing that accepts dynamic colors */}
          {scene === 'circadian' && (
            <g strokeWidth="0.75" className="transition-colors duration-1000" style={{ color: circadianColor }}>
              <line x1="20" y1="190" x2="380" y2="190" strokeWidth="0.5" className="opacity-20" />
              {/* Room outline */}
              <polygon points="50,40 180,90 180,190 50,190" />
              <polygon points="180,90 350,40 350,190 180,190" />
              <line x1="50" y1="40" x2="350" y2="40" />
              
              {/* Minimal low bed structure */}
              <polygon points="140,190 180,150 320,150 280,190" className="opacity-80" />
              <polygon points="180,150 180,135 200,135 200,150" />
              <polygon points="210,150 210,135 230,135 230,150" />
              
              {/* Ambient light glow representing circadian wash */}
              <path d="M50,40 Q180,90 350,40" strokeWidth="2.5" stroke="currentColor" className="opacity-90" />
              <path d="M50,185 L350,185" strokeWidth="2.5" stroke="currentColor" className="opacity-80" />
            </g>
          )}

          {/* SCENE: PERGOLA - Outdoor Terrace Pergola structure */}
          {scene === 'pergola' && (
            <g strokeWidth="0.75" className="text-brand-light/70">
              <line x1="10" y1="180" x2="390" y2="180" strokeWidth="0.5" className="text-brand-light/20" />
              {/* Deck flooring lines */}
              <line x1="30" y1="180" x2="10" y2="210" strokeWidth="0.5" className="text-brand-light/15" />
              <line x1="70" y1="180" x2="50" y2="210" strokeWidth="0.5" className="text-brand-light/15" />
              <line x1="110" y1="180" x2="90" y2="210" strokeWidth="0.5" className="text-brand-light/15" />
              <line x1="150" y1="180" x2="130" y2="210" strokeWidth="0.5" className="text-brand-light/15" />
              
              {/* Aluminum pillars */}
              <rect x="50" y="60" width="10" height="120" />
              <rect x="330" y="60" width="10" height="120" />
              
              {/* Crossbeam structure */}
              <rect x="40" y="45" width="310" height="15" strokeWidth="1.25" className="text-brand-gold" />
              
              {/* Louvers/Slats perimetral */}
              <line x1="80" y1="45" x2="65" y2="60" />
              <line x1="110" y1="45" x2="95" y2="60" />
              <line x1="140" y1="45" x2="125" y2="60" />
              <line x1="170" y1="45" x2="155" y2="60" />
              <line x1="200" y1="45" x2="185" y2="60" />
              <line x1="230" y1="45" x2="215" y2="60" />
              <line x1="260" y1="45" x2="245" y2="60" />
              <line x1="290" y1="45" x2="275" y2="60" />
              
              {/* Callout */}
              <circle cx="200" cy="52" r="1.5" fill="#c5a880" />
              <line x1="200" y1="52" x2="200" y2="120" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="200" y1="120" x2="260" y2="120" strokeWidth="0.5" className="text-brand-gold" />
              <text x="265" y="123" fill="#c5a880" fontSize="6.5" fontFamily="monospace" letterSpacing="0.8">ALUMINIO 6063-T5</text>
            </g>
          )}

          {/* SCENE: DETAIL-AUDIO - Wall profile showing audio transducers */}
          {scene === 'detail-audio' && (
            <g strokeWidth="0.75" className="text-brand-light/60">
              <rect x="40" y="40" width="120" height="140" strokeWidth="0.5" className="text-brand-light/20" />
              <rect x="240" y="40" width="120" height="140" strokeWidth="0.5" className="text-brand-light/20" />
              
              {/* The Gypsum/Drywall layer boundary */}
              <line x1="160" y1="40" x2="160" y2="180" strokeWidth="1.5" />
              <line x1="240" y1="40" x2="240" y2="180" strokeWidth="1.5" />
              
              {/* Transducer mounting box (Audio Invisible) */}
              <rect x="175" y="70" width="50" height="40" strokeWidth="1.25" className="text-brand-gold" />
              <circle cx="200" cy="90" r="10" className="text-brand-gold" />
              
              {/* Sound waves emitting from gypsum board panel */}
              <path d="M150,90 Q120,60 120,90 Q120,120 150,90" strokeWidth="0.5" strokeDasharray="2,2" className="soundwave-pulse" />
              <path d="M250,90 Q280,60 280,90 Q280,120 250,90" strokeWidth="0.5" strokeDasharray="2,2" className="soundwave-pulse" />
              
              {/* Callout */}
              <circle cx="200" cy="90" r="1.5" fill="#c5a880" />
              <line x1="200" y1="90" x2="200" y2="145" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="200" y1="145" x2="135" y2="145" strokeWidth="0.5" className="text-brand-gold" />
              <text x="50" y="148" fill="#c5a880" fontSize="6.5" fontFamily="monospace" letterSpacing="0.8">AUDIO INVISIBLE</text>
            </g>
          )}

          {/* SCENE: DETAIL-CLIMA - Ceiling profile showing air slot */}
          {scene === 'detail-clima' && (
            <g strokeWidth="0.75" className="text-brand-light/65">
              <line x1="20" y1="50" x2="380" y2="50" strokeWidth="1" className="text-brand-light/30" />
              {/* Suspended plasterboard structures */}
              <rect x="40" y="80" width="130" height="25" />
              <rect x="230" y="80" width="130" height="25" />
              
              {/* 12mm Ranura perimetral slots */}
              <line x1="170" y1="80" x2="170" y2="105" strokeWidth="1.75" className="text-brand-gold" />
              <line x1="230" y1="80" x2="230" y2="105" strokeWidth="1.75" className="text-brand-gold" />
              
              {/* Duct airflow paths */}
              <path d="M200,50 L200,85" strokeWidth="0.5" strokeDasharray="3,3" />
              <path d="M200,85 C190,95 180,105 160,110" strokeWidth="0.75" strokeDasharray="2,2" className="air-path text-brand-gold" />
              <path d="M200,85 C210,95 220,105 240,110" strokeWidth="0.75" strokeDasharray="2,2" className="air-path text-brand-gold" />
              
              {/* Callout */}
              <circle cx="200" cy="85" r="1.5" fill="#c5a880" />
              <line x1="200" y1="85" x2="200" y2="140" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="200" y1="140" x2="260" y2="140" strokeWidth="0.5" className="text-brand-gold" />
              <text x="265" y="143" fill="#c5a880" fontSize="6.5" fontFamily="monospace" letterSpacing="0.8">RANURA CLIMA 12mm</text>
            </g>
          )}

          {/* SCENE: DETAIL-SENSOR - Wall section showing capacitive sensor under travertine stone */}
          {scene === 'detail-sensor' && (
            <g strokeWidth="0.75" className="text-brand-light/60">
              {/* Solid Travertine panel */}
              <rect x="40" y="40" width="130" height="140" />
              {/* Hilling pattern representing marble */}
              <path d="M50,50 L90,90" strokeWidth="0.25" className="text-brand-light/10" />
              <path d="M80,110 L130,160" strokeWidth="0.25" className="text-brand-light/10" />
              
              {/* Front solid thickness (3mm margin) */}
              <line x1="170" y1="40" x2="170" y2="180" strokeWidth="1.5" />
              
              {/* Recessed milling pocket at the back */}
              <polygon points="170,75 195,75 195,115 170,115" className="text-brand-gold" />
              {/* Touch sensor element */}
              <circle cx="182" cy="95" r="5" strokeWidth="1.25" className="text-brand-gold" />
              
              {/* Callout */}
              <circle cx="182" cy="95" r="1" fill="#c5a880" />
              <line x1="182" y1="95" x2="230" y2="95" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="230" y1="95" x2="230" y2="145" strokeWidth="0.5" className="text-brand-gold" />
              <line x1="230" y1="145" x2="290" y2="145" strokeWidth="0.5" className="text-brand-gold" />
              <text x="295" y="148" fill="#c5a880" fontSize="6.5" fontFamily="monospace" letterSpacing="0.8">SENSOR CAPACITIVO</text>
            </g>
          )}

          {/* SCENE: SPA - Spa chamber perspective */}
          {scene === 'spa' && (
            <g strokeWidth="0.75" className="text-brand-light/50">
              <line x1="20" y1="180" x2="380" y2="180" strokeWidth="0.5" className="text-brand-light/20" />
              <polygon points="50,40 180,90 180,180 50,180" />
              <polygon points="180,90 350,40 350,180 180,180" />
              {/* Steam waves (wavy paths) */}
              <path d="M120,160 Q130,130 120,110 T120,60" strokeWidth="0.5" strokeDasharray="3,3" className="text-brand-gold/40" />
              <path d="M220,160 Q235,130 220,110 T220,60" strokeWidth="0.5" strokeDasharray="3,3" className="text-brand-gold/40" />
              {/* Recessed bench */}
              <polygon points="180,180 220,150 330,150 290,180" />
            </g>
          )}

          {/* SCENE: LOUNGE (Default) - Minimal interior details */}
          {scene === 'lounge' && (
            <g strokeWidth="0.75" className="text-brand-light/55">
              <line x1="20" y1="180" x2="380" y2="180" strokeWidth="0.5" className="text-brand-light/20" />
              <line x1="160" y1="40" x2="160" y2="180" strokeWidth="0.75" />
              {/* Low credenza block */}
              <polygon points="180,180 230,140 340,140 290,180" />
              {/* Injected sunlight lines */}
              <line x1="160" y1="60" x2="300" y2="180" strokeWidth="0.5" className="text-brand-gold/50" />
            </g>
          )}
        </svg>
      </div>

      {/* Bottom section: Text descriptions */}
      <div className="relative z-10 pt-3 flex flex-col md:flex-row md:items-end justify-between w-full gap-4">
        <p className="text-[11px] font-sans font-light text-brand-light/50 leading-relaxed max-w-xl">
          {requirements}
        </p>
        
        {/* Simple Index Marker */}
        <div className="text-[9px] font-mono tracking-widest text-brand-gold uppercase whitespace-nowrap self-end border-t border-brand-gold/10 pt-1.5 w-full md:w-auto text-right">
          <span><BrandText>ESPECIFICACIÓN // CA-0{scene === 'hero' ? '1' : scene === 'manifiesto' ? '2' : scene === 'before' ? '3' : scene === 'after' ? '4' : '5'}</BrandText></span>
        </div>
      </div>
    </div>
  );
};
