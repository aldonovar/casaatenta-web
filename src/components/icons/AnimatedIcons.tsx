"use client";

import React from "react";

// --- ANIMATION STYLES ---
// We define CSS classes directly for clean SVG keyframe animations
const iconStyles = `
  @keyframes ca-spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes ca-pulse-glow {
    0%, 100% { opacity: 0.4; filter: drop-shadow(0 0 2px var(--ca-gold)); }
    50% { opacity: 1; filter: drop-shadow(0 0 8px var(--ca-gold)); }
  }
  @keyframes ca-dash {
    to { stroke-dashoffset: 0; }
  }
  @keyframes ca-bounce-subtle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
  }
  @keyframes ca-sway {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  @keyframes ca-draw-lines {
    0% { stroke-dashoffset: 100; }
    100% { stroke-dashoffset: 0; }
  }
  @keyframes ca-sun-rays {
    0%, 100% { opacity: 0.6; transform: scale(1); }
    50% { opacity: 1; transform: scale(1.1); }
  }
  @keyframes ca-louver-move {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(0.7); }
  }
  @keyframes ca-twinkle {
    0%, 100% { opacity: 0.3; transform: scale(0.8); }
    50% { opacity: 1; transform: scale(1.2); }
  }
  @keyframes ca-lock-anim {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(2px); }
  }
  @keyframes ca-vibrate {
    0%, 100% { transform: rotate(0deg); }
    20% { transform: rotate(-5deg); }
    40% { transform: rotate(5deg); }
    60% { transform: rotate(-5deg); }
    80% { transform: rotate(5deg); }
  }

  .ca-anim-spin { animation: ca-spin-slow 12s linear infinite; }
  .ca-anim-pulse { animation: ca-pulse-glow 2.5s ease-in-out infinite; }
  .ca-anim-bounce { animation: ca-bounce-subtle 3s ease-in-out infinite; }
  .ca-anim-sway { transform-origin: 50% 0%; animation: ca-sway 4s ease-in-out infinite; }
  .ca-anim-rays { transform-origin: center; animation: ca-sun-rays 3s ease-in-out infinite; }
  .ca-anim-louver { transform-origin: left; animation: ca-louver-move 4s ease-in-out infinite; }
  .ca-anim-lock { animation: ca-lock-anim 2s ease-in-out infinite; }
  
  /* Triggered animations on parent group hover */
  .ca-group-hover-spin:hover .ca-trigger-spin {
    animation: ca-spin-slow 3s linear infinite;
  }
  .ca-group-hover-bounce:hover .ca-trigger-bounce {
    animation: ca-bounce-subtle 1.5s ease-in-out infinite;
  }
  .ca-group-hover-draw:hover .ca-trigger-draw {
    stroke-dasharray: 100;
    stroke-dashoffset: 100;
    animation: ca-draw-lines 1.5s ease-in-out forwards;
  }
  .ca-group-hover-vibrate:hover .ca-trigger-vibrate {
    animation: ca-vibrate 0.4s ease-in-out 2;
  }
`;

// Inject keyframes style block into the document head dynamically to prevent SSR mismatches
export const InjectIconStyles: React.FC = () => {
  return <style dangerouslySetInnerHTML={{ __html: iconStyles }} />;
};

interface IconProps {
  className?: string;
  size?: number;
}

// 1. SUN ICON (Replaces ☀️) - Techos Sol y Sombra
export const TechosIcon: React.FC<IconProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Louver/Slats frame */}
      <rect x="8" y="24" width="48" height="24" rx="4" strokeWidth="2" strokeOpacity="0.3" />
      {/* Louver slats */}
      <line x1="16" y1="30" x2="32" y2="30" strokeWidth="2.5" className="ca-anim-louver" />
      <line x1="16" y1="36" x2="40" y2="36" strokeWidth="2.5" className="ca-anim-louver" style={{ animationDelay: "0.5s" }} />
      <line x1="16" y1="42" x2="48" y2="42" strokeWidth="2.5" className="ca-anim-louver" style={{ animationDelay: "1s" }} />
      
      {/* Sun rising/shining behind louvers */}
      <circle cx="42" cy="22" r="8" strokeWidth="2.5" className="ca-trigger-spin" style={{ transformOrigin: "42px 22px" }} />
      {/* Sun rays */}
      <g className="ca-anim-rays" style={{ transformOrigin: "42px 22px" }}>
        <line x1="42" y1="10" x2="42" y2="12" strokeWidth="2" />
        <line x1="42" y1="32" x2="42" y2="34" strokeWidth="2" />
        <line x1="30" y1="22" x2="32" y2="22" strokeWidth="2" />
        <line x1="52" y1="22" x2="54" y2="22" strokeWidth="2" />
        <line x1="34" y1="14" x2="35.5" y2="15.5" strokeWidth="2" />
        <line x1="48.5" y1="28.5" x2="50" y2="30" strokeWidth="2" />
        <line x1="48.5" y1="15.5" x2="50" y2="14" strokeWidth="2" />
        <line x1="34" y1="30" x2="35.5" y2="28.5" strokeWidth="2" />
      </g>
    </svg>
  );
};

// 2. HOUSE / BLUEPRINT ICON (Replaces 🏡) - Diseño de Terrazas
export const TerrazasIcon: React.FC<IconProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-draw ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Isometric Grid Floor base */}
      <path d="M 8 42 L 32 54 L 56 42 L 32 30 Z" strokeWidth="2" strokeOpacity="0.4" />
      
      {/* Decking Planks lines (isometric) */}
      <line x1="16" y1="38" x2="36" y2="48" strokeWidth="1.5" strokeOpacity="0.4" />
      <line x1="24" y1="34" x2="44" y2="44" strokeWidth="1.5" strokeOpacity="0.4" />
      
      {/* Outdoor Columns / Pergola frames */}
      <line x1="12" y1="40" x2="12" y2="20" strokeWidth="2" />
      <line x1="52" y1="40" x2="52" y2="20" strokeWidth="2" />
      <line x1="32" y1="52" x2="32" y2="30" strokeWidth="2" />
      
      {/* Roof beam connection */}
      <path d="M 12 20 L 32 30 L 52 20" strokeWidth="2" className="ca-trigger-draw" />
      
      {/* Plant/Leaf growth decoration */}
      <path 
        d="M 46 41 C 46 36, 50 34, 50 34 C 50 34, 48 38, 46 41 Z" 
        fill="var(--ca-gold)" 
        strokeWidth="1" 
        className="ca-anim-bounce" 
        style={{ transformOrigin: "46px 41px" }}
      />
    </svg>
  );
};

// 3. BULB ICON (Replaces 💡) - Iluminación Inteligente
export const IluminacionIcon: React.FC<IconProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Glow rings */}
      <circle cx="32" cy="28" r="22" strokeWidth="1" strokeDasharray="3 6" strokeOpacity="0.3" className="ca-anim-spin" />
      <circle cx="32" cy="28" r="16" strokeWidth="1.5" strokeOpacity="0.5" className="ca-anim-pulse" />
      
      {/* Bulb Glass */}
      <path d="M 22 38 C 18 34, 18 24, 24 18 C 30 12, 38 12, 44 18 C 50 24, 50 34, 46 38 C 43 41, 41 44, 41 48 L 23 48 C 23 44, 21 41, 22 38 Z" strokeWidth="2.5" />
      
      {/* Bulb Thread Base & contact */}
      <line x1="26" y1="52" x2="38" y2="52" strokeWidth="3" />
      <line x1="28" y1="56" x2="36" y2="56" strokeWidth="2.5" />
      
      {/* Glowing inner filament */}
      <path d="M 28 36 L 32 26 L 36 36" strokeWidth="2" className="ca-anim-pulse" />
    </svg>
  );
};

// 4. MICROPROCESSOR / CPU ICON (Replaces 🤖) - Smart Homes
export const SmartHomeIcon: React.FC<IconProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-draw ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main outer shell resembling a technical house */}
      <path d="M 32 10 L 52 26 L 52 54 L 12 54 L 12 26 Z" strokeWidth="2" strokeOpacity="0.3" />
      
      {/* CPU Silicon chip in center */}
      <rect x="22" y="26" width="20" height="20" rx="2" strokeWidth="2.5" />
      <circle cx="32" cy="36" r="3" fill="var(--ca-gold)" className="ca-anim-pulse" />
      
      {/* Pin traces */}
      <line x1="32" y1="18" x2="32" y2="26" strokeWidth="2" className="ca-trigger-draw" />
      <line x1="32" y1="46" x2="32" y2="50" strokeWidth="2" className="ca-trigger-draw" />
      <line x1="16" y1="36" x2="22" y2="36" strokeWidth="2" className="ca-trigger-draw" />
      <line x1="42" y1="36" x2="48" y2="36" strokeWidth="2" className="ca-trigger-draw" />
      
      {/* Node connectors */}
      <circle cx="32" cy="18" r="1.5" fill="currentColor" />
      <circle cx="32" cy="50" r="1.5" fill="currentColor" />
      <circle cx="16" cy="36" r="1.5" fill="currentColor" />
      <circle cx="48" cy="36" r="1.5" fill="currentColor" />
    </svg>
  );
};

// 5. CALIPER / SURFACES ICON (Replaces 🔧) - Mantenimiento General
export const MantenimientoIcon: React.FC<IconProps> = ({ className = "", size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-bounce ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Blueprint background grid pattern */}
      <line x1="10" y1="12" x2="54" y2="12" strokeWidth="0.75" strokeDasharray="2 4" strokeOpacity="0.2" />
      <line x1="10" y1="24" x2="54" y2="24" strokeWidth="0.75" strokeDasharray="2 4" strokeOpacity="0.2" />
      <line x1="10" y1="36" x2="54" y2="36" strokeWidth="0.75" strokeDasharray="2 4" strokeOpacity="0.2" />
      
      {/* Architectural Ruler / Caliper structure */}
      <rect x="8" y="44" width="48" height="8" rx="1" strokeWidth="2" />
      {/* Ruler ticks */}
      <line x1="16" y1="44" x2="16" y2="48" strokeWidth="1.5" />
      <line x1="24" y1="44" x2="24" y2="47" strokeWidth="1.5" />
      <line x1="32" y1="44" x2="32" y2="48" strokeWidth="1.5" />
      <line x1="40" y1="44" x2="40" y2="47" strokeWidth="1.5" />
      <line x1="48" y1="44" x2="48" y2="48" strokeWidth="1.5" />
      
      {/* Precision measurement gauge */}
      <path d="M 28 14 L 36 14 M 32 14 L 32 44" strokeWidth="2" />
      
      {/* Compass / Caliper arm */}
      <path d="M 32 14 L 16 36 L 20 38" strokeWidth="2" className="ca-trigger-bounce" style={{ transformOrigin: "32px 14px" }} />
      <path d="M 32 14 L 48 36 L 44 38" strokeWidth="2" className="ca-trigger-bounce" style={{ transformOrigin: "32px 14px" }} />
      
      <circle cx="32" cy="14" r="3" fill="var(--ca-gold)" />
    </svg>
  );
};

// 6. SUNRISE ICON (Replaces 🌅) - Routine: Buenos días
export const BuenosDiasIcon: React.FC<IconProps> = ({ className = "", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-bounce ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Horizon line */}
      <line x1="4" y1="24" x2="28" y2="24" strokeWidth="2" strokeLinecap="round" />
      
      {/* Sun rising */}
      <path d="M 10 24 A 6 6 0 0 1 22 24" strokeWidth="2" fill="var(--ca-gold)" fillOpacity="0.1" className="ca-trigger-bounce" />
      
      {/* Sunlight rays */}
      <line x1="16" y1="10" x2="16" y2="6" strokeWidth="2" strokeLinecap="round" />
      <line x1="8" y1="16" x2="5" y2="14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="16" x2="27" y2="14" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="10" y1="12" x2="7" y2="9" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="22" y1="12" x2="25" y2="9" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// 7. CENA / DINNER LAMP ICON (Replaces 🍽️) - Routine: Hora de cena
export const HoraCenaIcon: React.FC<IconProps> = ({ className = "", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-bounce ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Table base */}
      <line x1="6" y1="28" x2="26" y2="28" strokeWidth="2" strokeLinecap="round" />
      
      {/* Hanging lamp cable */}
      <line x1="16" y1="2" x2="16" y2="12" strokeWidth="1.5" className="ca-anim-sway" />
      
      {/* Hanging lamp head */}
      <g className="ca-anim-sway">
        <path d="M 11 18 L 21 18 L 19 12 L 13 12 Z" strokeWidth="2" fill="var(--ca-gold)" fillOpacity="0.1" />
        {/* Glow projection cone */}
        <polygon points="12,18 20,18 26,27 6,27" fill="url(#cena-glow-grad)" opacity="0.35" className="ca-anim-pulse" />
      </g>
      
      <defs>
        <linearGradient id="cena-glow-grad" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="var(--ca-gold)" stopOpacity="1" />
          <stop offset="100%" stopColor="var(--ca-gold)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

// 8. NIGHT / MOON ICON (Replaces 🌙) - Routine: Buenas noches
export const BuenasNochesIcon: React.FC<IconProps> = ({ className = "", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Moon path */}
      <path 
        d="M 22 18 C 22 23.5, 17.5 28, 12 28 C 9.5 28, 7.2 27.1, 5.5 25.5 C 10.5 24.5, 14 20, 14 15 C 14 10, 10.5 5.5, 5.5 4.5 C 7.2 2.9, 9.5 2, 12 2 C 17.5 2, 22 6.5, 22 12 Z" 
        strokeWidth="2" 
        fill="var(--ca-gold)" 
        fillOpacity="0.08" 
        className="ca-anim-pulse"
      />
      
      {/* Twinkling stars */}
      <path d="M 23 6 L 24 8 L 26 9 L 24 10 L 23 12 L 22 10 L 20 9 L 22 8 Z" fill="currentColor" stroke="none" className="ca-anim-rays" style={{ animationDelay: "0.2s" }} />
      <path d="M 27 15 L 27.8 16.5 L 29.3 17 L 27.8 17.5 L 27 19 L 26.2 17.5 L 24.7 17 L 26.2 16.5 Z" fill="currentColor" stroke="none" className="ca-anim-rays" style={{ animationDelay: "1s" }} />
    </svg>
  );
};

// 9. SECURITY / LOCK ICON (Replaces 🔒) - Routine: Salir de casa
export const SalirCasaIcon: React.FC<IconProps> = ({ className = "", size = 28 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ca-group-hover-bounce ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Lock body */}
      <rect x="8" y="16" width="16" height="12" rx="2" strokeWidth="2" fill="var(--ca-gold)" fillOpacity="0.1" />
      {/* Keyhole */}
      <circle cx="16" cy="21" r="1.5" fill="currentColor" />
      <line x1="16" y1="22.5" x2="16" y2="25" strokeWidth="1.5" />
      
      {/* Lock Shackle */}
      <path 
        d="M 11 16 L 11 11 C 11 8, 13 6, 16 6 C 19 6, 21 8, 21 11 L 21 16" 
        strokeWidth="2" 
        strokeLinecap="round"
        className="ca-trigger-bounce" 
      />
    </svg>
  );
};

// 10. WHATSAPP ICON - Custom SVG WhatsApp message circular badge
export const WhatsAppIcon: React.FC<IconProps> = ({ className = "", size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={`text-brand-gold ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Aura ring */}
      <circle cx="12" cy="12" r="10" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="2 4" className="ca-anim-spin" />
      
      {/* Message Balloon */}
      <path 
        d="M 12 3 C 7 3, 3 7, 3 12 C 3 14, 3.8 15.8, 5.2 17.2 L 4 21 L 8 19.8 C 9.2 20.6, 10.6 21, 12 21 C 17 21, 21 17, 21 12 C 21 7, 17 3, 12 3 Z" 
        strokeWidth="2" 
        fill="currentColor"
        fillOpacity="0.05"
      />
      
      {/* Dot matrix pattern inside icon */}
      <circle cx="9" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="15" cy="12" r="1" fill="currentColor" />
    </svg>
  );
};

// 11. CHEVRON DOWN ICON - Animated accordion toggle arrow
export const ChevronDownIcon: React.FC<IconProps & { isOpen?: boolean }> = ({ className = "", size = 16, isOpen = false }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`transition-all duration-300 ${isOpen ? "text-brand-gold" : "text-brand-light/40"} ${className}`}
      style={{
        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
        filter: isOpen ? "drop-shadow(0 0 3px rgba(216, 179, 106, 0.4))" : "none"
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
};

// 12. PREMIUM WRAPPER FOR OTHER ICONS
export const PremiumIconWrapper: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}> = ({ children, className = "", glow = true }) => {
  return (
    <div 
      className={`group relative flex items-center justify-center rounded-xl border border-brand-gold/20 bg-brand-gold/[0.02] p-3 transition-all duration-500 hover:border-brand-gold/50 hover:bg-brand-gold/[0.06] hover:scale-105 ${className}`}
    >
      {/* Background radial soft light grid */}
      <span className="absolute inset-0 rounded-xl bg-brand-gold/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      
      {/* Animated glowing border border-glow effect */}
      {glow && (
        <span className="absolute -inset-[1px] rounded-xl bg-gradient-to-tr from-brand-gold/30 via-transparent to-brand-gold/10 opacity-40 blur-[1px] transition-opacity duration-500 group-hover:opacity-100" />
      )}
      
      {/* Child icon */}
      <div className="relative z-10 transition-transform duration-500 group-hover:scale-110">
        {children}
      </div>
    </div>
  );
};

// 13. CUSTOM SUN ICON
export const SunIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-brand-gold ca-anim-spin ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" fillOpacity="0.1" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  );
};

// 14. CUSTOM MOON ICON
export const MoonIcon: React.FC<IconProps> = ({ className = "", size = 16 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-brand-light/70 ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        transform: "rotate(-15deg)",
      }}
    >
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="currentColor" fillOpacity="0.05" />
    </svg>
  );
};
