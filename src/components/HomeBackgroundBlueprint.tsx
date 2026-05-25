"use client";

import React from 'react';
import { BrandText } from './BrandText';

export const HomeBackgroundBlueprint: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden bg-brand-dark">
      {/* Retícula Arquitectónica de Fondo (Sutil y constante en toda la web) */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} 
      />
      <div 
        className="absolute inset-0 opacity-[0.015]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.1) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px'
        }} 
      />

      {/* FRAME 0: HERO (Fachada Axonométrica de Villa) */}
      <div className="blueprint-frame-0 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-25">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Ground contour lines */}
          <path d="M 50,500 C 250,520 450,470 650,490 C 850,510 900,480 950,500" strokeDasharray="3,3" />
          <path d="M 50,520 C 300,540 500,490 700,510 C 900,530 950,510 950,520" strokeDasharray="5,5" className="opacity-50" />
          
          {/* Villa Structure */}
          {/* Main block */}
          <polygon points="300,450 300,300 480,210 650,300 650,450 480,530" />
          <line x1="480" y1="210" x2="480" y2="530" />
          
          {/* Left garage slab */}
          <polygon points="120,450 300,360 300,450 120,450" className="opacity-80" />
          <polygon points="120,380 300,290 300,360 120,380" />
          <line x1="120" y1="380" x2="120" y2="450" />
          
          {/* Right structural overhang cantilever */}
          <polygon points="650,350 830,260 830,180 650,270" strokeWidth="0.8" />
          <polygon points="480,210 650,120 830,210 650,300" strokeWidth="0.8" />
          <line x1="830" y1="260" x2="830" y2="450" strokeDasharray="2,2" className="opacity-40" />
          <line x1="830" y1="180" x2="830" y2="260" />
          
          {/* Glass panels frame */}
          <line x1="330" y1="335" x2="330" y2="435" />
          <line x1="450" y1="275" x2="450" y2="515" />
          <line x1="510" y1="275" x2="510" y2="515" />
          <line x1="620" y1="335" x2="620" y2="435" />
          
          {/* Coordinates and notations */}
          <text x="670" y="140" fill="currentColor" className="text-brand-gold" fontSize="8" fontFamily="monospace" letterSpacing="1">SYS_PROJ_CA_01</text>
          <text x="670" y="155" fill="currentColor" fontSize="6" fontFamily="monospace" className="opacity-50">LAT: -12.0431 // LON: -77.0282</text>
          <line x1="650" y1="135" x2="665" y2="135" />
          <circle cx="650" cy="135" r="1.5" fill="#c5a880" />
        </svg>
      </div>

      {/* FRAME 1: MANIFIESTO (Corte Arquitectónico y Tragaluz Cenital) */}
      <div className="blueprint-frame-1 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-0">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Structural grid lines */}
          <line x1="200" y1="50" x2="200" y2="550" strokeDasharray="3,3" className="opacity-30" />
          <line x1="500" y1="50" x2="500" y2="550" strokeDasharray="3,3" className="opacity-30" />
          <line x1="800" y1="50" x2="800" y2="550" strokeDasharray="3,3" className="opacity-30" />
          <text x="195" y="45" fill="currentColor" fontSize="8" fontFamily="monospace">EJE A</text>
          <text x="495" y="45" fill="currentColor" fontSize="8" fontFamily="monospace">EJE B</text>
          <text x="795" y="45" fill="currentColor" fontSize="8" fontFamily="monospace">EJE C</text>

          {/* Foundation & concrete floor slabs */}
          <rect x="100" y="480" width="800" height="40" />
          <line x1="100" y1="500" x2="900" y2="500" strokeDasharray="10,5" />
          
          {/* Second level slab */}
          <rect x="100" y="270" width="800" height="25" />
          
          {/* Vertical Columns */}
          <rect x="190" y="100" width="20" height="380" />
          <rect x="790" y="100" width="20" height="380" />
          <rect x="490" y="295" width="20" height="185" />
          
          {/* Roof line and Cenital opening */}
          <polygon points="100,100 420,100 420,70 580,70 580,100 900,100 900,80 100,80" />
          
          {/* Sunlight angle beam representation */}
          <line x1="420" y1="70" x2="680" y2="480" className="text-brand-gold" strokeWidth="0.75" />
          <line x1="480" y1="70" x2="780" y2="480" className="text-brand-gold" strokeWidth="0.75" strokeDasharray="2,2" />
          <path d="M 420,70 A 100,100 0 0,0 470,140" strokeWidth="0.5" className="text-brand-gold/60" />
          <text x="430" y="110" fill="currentColor" className="text-brand-gold" fontSize="7" fontFamily="monospace">SUN_ANG: 42.5°</text>
          
          {/* Dimension notations */}
          <text x="120" y="260" fill="currentColor" fontSize="7" fontFamily="monospace">H1: +2.95 m</text>
          <text x="120" y="470" fill="currentColor" fontSize="7" fontFamily="monospace">NPT: +0.00 m</text>
        </svg>
      </div>

      {/* FRAME 2: ANTES / DESPUÉS (Estructura de Vigas e Interiores) */}
      <div className="blueprint-frame-2 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-0">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Room perspective bounding box */}
          <polygon points="150,120 400,220 400,420 150,480" />
          <polygon points="400,220 850,120 850,480 400,420" />
          <line x1="150" y1="120" x2="850" y2="120" />
          <line x1="150" y1="480" x2="850" y2="480" />
          
          {/* Perspective grid lines on floor (converging to center) */}
          <line x1="150" y1="480" x2="400" y2="420" />
          <line x1="280" y1="480" x2="400" y2="420" />
          <line x1="400" y1="480" x2="400" y2="420" />
          <line x1="550" y1="480" x2="400" y2="420" />
          <line x1="700" y1="480" x2="400" y2="420" />
          <line x1="850" y1="480" x2="400" y2="420" />

          {/* Wall framing studs (metal structure details) */}
          <line x1="200" y1="138" x2="200" y2="460" strokeDasharray="3,3" />
          <line x1="250" y1="156" x2="250" y2="444" strokeDasharray="3,3" />
          <line x1="300" y1="175" x2="300" y2="430" strokeDasharray="3,3" />
          <line x1="350" y1="195" x2="350" y2="423" strokeDasharray="3,3" />

          {/* Ceiling slot (Ranura Clima 12mm) */}
          <path d="M 400,220 L 760,140" strokeWidth="2" className="text-brand-gold" />
          <path d="M 400,223 L 760,143" strokeWidth="0.5" className="text-brand-gold/60" />
          <text x="620" y="125" fill="#c5a880" fontSize="7.5" fontFamily="monospace" letterSpacing="0.8">DET_SLOT: RANURA_12mm</text>
          <circle cx="600" cy="175" r="2.5" fill="#c5a880" />
          <line x1="600" y1="175" x2="615" y2="135" strokeWidth="0.5" className="text-brand-gold" />
        </svg>
      </div>

      {/* FRAME 3: CIRCADIANO (Trayectorias Solares y Esfera Celeste) */}
      <div className="blueprint-frame-3 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-0">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Compass circle */}
          <circle cx="500" cy="300" r="220" strokeWidth="0.75" />
          <circle cx="500" cy="300" r="180" strokeDasharray="4,4" className="opacity-40" />
          <circle cx="500" cy="300" r="240" strokeWidth="0.25" />
          
          {/* Compass labels */}
          <text x="495" y="65" fill="currentColor" fontSize="10" fontFamily="sans-serif" className="opacity-80">N</text>
          <text x="495" y="545" fill="currentColor" fontSize="10" fontFamily="sans-serif" className="opacity-80">S</text>
          <text x="735" y="304" fill="currentColor" fontSize="10" fontFamily="sans-serif" className="opacity-80">E</text>
          <text x="250" y="304" fill="currentColor" fontSize="10" fontFamily="sans-serif" className="opacity-80">W</text>
          
          {/* Dials / Degree marks */}
          <line x1="500" y1="80" x2="500" y2="90" />
          <line x1="500" y1="510" x2="500" y2="520" />
          <line x1="280" y1="300" x2="290" y2="300" />
          <line x1="710" y1="300" x2="720" y2="300" />
          
          {/* Solar paths curve (Sine waves) */}
          <path d="M 280,300 Q 500,80 720,300" strokeWidth="1.25" className="text-brand-gold" />
          <path d="M 280,300 Q 500,160 720,300" strokeDasharray="3,3" className="text-brand-gold/60" />
          <path d="M 280,300 Q 500,240 720,300" strokeWidth="0.5" className="text-brand-gold/30" />
          
          {/* Active sun vector lines */}
          <circle cx="430" cy="165" r="4" fill="currentColor" className="text-brand-gold" />
          <line x1="500" y1="300" x2="430" y2="165" strokeWidth="0.75" className="text-brand-gold" />
          <text x="360" y="150" fill="#c5a880" fontSize="8" fontFamily="monospace">SOLAR_POS: 11:20 AM</text>
          <text x="360" y="162" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="opacity-50">AZIMUTH: 142.4° // ELEV: 58.2°</text>

          {/* Lux chart graph (bottom left) */}
          <path d="M 120,500 L 260,500" />
          <path d="M 120,440 L 120,500" />
          <path d="M 120,500 Q 190,440 260,500" strokeWidth="0.75" className="text-brand-gold/50" />
          <text x="125" y="435" fill="currentColor" fontSize="6" fontFamily="monospace">LUX SPECTRUM INDEX</text>
        </svg>
      </div>

      {/* FRAME 4: ESPECIALIDADES (Retícula de Nodos e Ingeniería IoT) */}
      <div className="blueprint-frame-4 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-0">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Mosaic matrix grid */}
          <rect x="150" y="100" width="700" height="400" strokeWidth="0.25" className="opacity-30" />
          <line x1="150" y1="233" x2="850" y2="233" strokeWidth="0.25" className="opacity-20" />
          <line x1="150" y1="366" x2="850" y2="366" strokeWidth="0.25" className="opacity-20" />
          <line x1="383" y1="100" x2="383" y2="500" strokeWidth="0.25" className="opacity-20" />
          <line x1="616" y1="100" x2="616" y2="500" strokeWidth="0.25" className="opacity-20" />
          
          {/* Technical block schematic - Block 1 */}
          <rect x="180" y="120" width="160" height="85" />
          <text x="190" y="135" fill="currentColor" className="text-brand-gold font-bold" fontSize="8" fontFamily="monospace">NODE_LUMI_01</text>
          <text x="190" y="150" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="opacity-50">STATUS: ON_LINE</text>
          <text x="190" y="162" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="opacity-50">TEMP: 32.5°C // V: 24V</text>
          <circle cx="320" cy="132" r="2.5" fill="currentColor" className="text-brand-gold" />
          
          {/* Signal path arrows */}
          <path d="M 340,162 H 450 V 280" strokeDasharray="3,3" />
          <path d="M 445,280 L 450,285 L 455,280" />

          {/* Technical block schematic - Block 2 */}
          <rect x="450" y="280" width="120" height="90" />
          <text x="460" y="298" fill="currentColor" className="text-brand-gold font-bold" fontSize="8" fontFamily="monospace">GATEWAY_RACK_A</text>
          <text x="460" y="315" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="opacity-50">IP: 192.168.10.12</text>
          <text x="460" y="327" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="opacity-50">PING: 2.1ms</text>
          <circle cx="550" cy="295" r="2.5" fill="currentColor" className="text-emerald-400" />
          
          {/* Acoustic soundwaves diagram inside block */}
          <path d="M 640,150 Q 660,130 680,150 T 720,150" strokeWidth="0.75" className="text-brand-gold/60" />
          <path d="M 640,165 Q 660,145 680,165 T 720,165" strokeWidth="0.75" className="text-brand-gold/40" />
          <text x="640" y="125" fill="currentColor" fontSize="7" fontFamily="monospace">ACOUSTIC WAVEFORM (DSP)</text>

          {/* Dotted connections */}
          <line x1="570" y1="325" x2="680" y2="325" strokeDasharray="2,2" />
          <circle cx="680" cy="325" r="2" fill="currentColor" />
        </svg>
      </div>

      {/* FRAME 5: CASTELLANA 503 (Corte e Isometría Explotada de Pérgola) */}
      <div className="blueprint-frame-5 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-0">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Structural framing isometric */}
          <polygon points="350,420 350,180 750,180 750,420" strokeWidth="0.3" className="opacity-20" />
          
          {/* Pérgola top rafters framing */}
          {/* Back wall ledger plate */}
          <line x1="280" y1="210" x2="680" y2="210" strokeWidth="1.25" />
          <line x1="280" y1="225" x2="680" y2="225" />
          
          {/* Main projection structural beams */}
          <polygon points="280,210 180,380 580,380 680,210" strokeWidth="1.5" className="text-brand-gold" />
          <polygon points="280,225 180,395 580,395 680,225" strokeWidth="1" className="text-brand-gold/60" />
          <line x1="180" y1="380" x2="180" y2="395" />
          <line x1="580" y1="380" x2="580" y2="395" />
          
          {/* Structural Louvers slats (transversal) */}
          <line x1="330" y1="295" x2="430" y2="295" />
          <line x1="370" y1="295" x2="470" y2="295" />
          <line x1="410" y1="295" x2="510" y2="295" />
          <line x1="450" y1="295" x2="550" y2="295" />
          <line x1="490" y1="295" x2="590" y2="295" />
          
          {/* Exploded line for bracket assembly */}
          <line x1="230" y1="295" x2="230" y2="215" strokeDasharray="3,3" className="text-brand-gold/80" />
          <polygon points="220,215 240,215 230,200" fill="none" className="text-brand-gold" />
          <text x="210" y="195" fill="#c5a880" fontSize="7.5" fontFamily="monospace">MOD_BOLT: M12-SUS316</text>
          
          {/* Dimension guidelines */}
          <line x1="180" y1="415" x2="580" y2="415" strokeWidth="0.5" />
          <line x1="180" y1="410" x2="180" y2="420" />
          <line x1="580" y1="410" x2="580" y2="420" />
          <text x="350" y="432" fill="currentColor" fontSize="8" fontFamily="monospace" letterSpacing="0.8">WIDTH: 6000 mm</text>
          
          <line x1="150" y1="380" x2="250" y2="210" strokeWidth="0.5" />
          <line x1="147" y1="385" x2="153" y2="375" />
          <line x1="247" y1="215" x2="253" y2="205" />
          <text x="145" y="285" fill="currentColor" fontSize="8" fontFamily="monospace" letterSpacing="0.8" transform="rotate(-30 145 285)">PROJ: 3500 mm</text>
        </svg>
      </div>

      {/* FRAME 6: CTA / GEOMETRÍA CONCÉNTRICA */}
      <div className="blueprint-frame-6 absolute inset-0 w-full h-full flex items-center justify-center p-12 md:p-24 transition-opacity duration-700 ease-out opacity-0">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-6xl opacity-20" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.5"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Large Concentric Circles (Geometric Dial) */}
          <circle cx="500" cy="300" r="180" strokeWidth="1" className="text-brand-gold" />
          <circle cx="500" cy="300" r="150" strokeWidth="0.5" strokeDasharray="5,3" className="text-brand-gold/60" />
          <circle cx="500" cy="300" r="220" strokeWidth="0.25" className="opacity-40" />
          
          {/* Inner details representing geometric sensor badge */}
          <circle cx="500" cy="300" r="120" strokeWidth="0.5" />
          <path d="M 440,280 L 500,250 L 560,280" strokeWidth="1" className="text-brand-gold" />
          <path d="M 500,310 L 500,350" strokeWidth="1" className="text-brand-gold" />
          
          {/* Intersecting horizontal and vertical lines */}
          <line x1="200" y1="300" x2="800" y2="300" strokeWidth="0.25" className="opacity-30" />
          <line x1="500" y1="50" x2="500" y2="550" strokeWidth="0.25" className="opacity-30" />
          
          {/* Angled axes */}
          <line x1="287" y1="87" x2="713" y2="513" strokeWidth="0.25" strokeDasharray="3,3" className="opacity-20" />
          <line x1="287" y1="513" x2="713" y2="87" strokeWidth="0.25" strokeDasharray="3,3" className="opacity-20" />
          
          {/* Monospace coordinates watermark */}
          <text x="500" y="470" fill="currentColor" fontSize="10" fontFamily="monospace" letterSpacing="3" textAnchor="middle" className="text-brand-gold font-bold">CΛSΛ ΛTENTΛ</text>
          <text x="500" y="485" fill="currentColor" fontSize="7" fontFamily="monospace" letterSpacing="1" textAnchor="middle" className="opacity-40">INTEGRACIÓN TECNOLÓGICA INVISIBLE</text>
        </svg>
      </div>
    </div>
  );
};
