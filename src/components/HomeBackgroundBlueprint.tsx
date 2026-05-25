"use client";

import React from 'react';

export const HomeBackgroundBlueprint: React.FC = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none select-none overflow-hidden bg-brand-dark">
      
      {/* Retícula Arquitectónica de Fondo (Sutil y constante en toda la web) */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.12) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255, 255, 255, 0.12) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} 
      />
      <div 
        className="absolute inset-0 opacity-[0.02]" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.15) 1px, transparent 1px), 
            linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '200px 200px'
        }} 
      />

      {/* ═══════════════════════════════════════════════════════════════
         MARCO CONSTRUCTIVO FIJO DE PLANO (Aporta densidad visual)
         ═══════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-4 md:inset-8 border border-white/[0.04] pointer-events-none z-10">
        
        {/* Corner ticks */}
        <div className="absolute -top-1 -left-1 w-5 h-5 border-t border-l border-brand-gold/60" />
        <div className="absolute -top-1 -right-1 w-5 h-5 border-t border-r border-brand-gold/60" />
        <div className="absolute -bottom-1 -left-1 w-5 h-5 border-b border-l border-brand-gold/60" />
        <div className="absolute -bottom-1 -right-1 w-5 h-5 border-b border-r border-brand-gold/60" />

        {/* Center Crosshairs */}
        <div className="absolute top-1/2 left-0 w-3 h-[1px] bg-white/20 -translate-y-1/2" />
        <div className="absolute top-1/2 right-0 w-3 h-[1px] bg-white/20 -translate-y-1/2" />
        <div className="absolute top-0 left-1/2 h-3 w-[1px] bg-white/20 -translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 h-3 w-[1px] bg-white/20 -translate-x-1/2" />

        {/* Coordinate rulers text on borders */}
        <div className="absolute top-2 left-6 text-[6.5px] font-mono text-white/20 tracking-widest uppercase">
          SECCIÓN: H-09 // ELEVACIÓN GENERAL
        </div>
        <div className="absolute top-2 right-6 text-[6.5px] font-mono text-white/20 tracking-widest uppercase">
          PROYECTO: RESIDENCIA CASTELLANA
        </div>
        <div className="absolute bottom-2 left-6 text-[6.5px] font-mono text-white/20 tracking-widest uppercase">
          CΛSΛ ΛTENTΛ © 2026 // TECNOLOGÍA DISUELTA
        </div>

        {/* Technical Title Block (Esquina inferior derecha) */}
        <div className="absolute bottom-6 right-6 bg-brand-dark border border-white/[0.08] p-4 text-[8px] font-mono tracking-widest uppercase text-brand-light/40 space-y-1.5 hidden md:block">
          <div>
            <span className="text-brand-gold font-bold">CΛSΛ ΛTENTΛ</span> // EXPEDIENTE DE INTEGRACIÓN
          </div>
          <div>PLANO: PLAN DE AUTOMATIZACIÓN INVISIBLE</div>
          <div className="flex justify-between gap-8 text-[7.5px] text-white/30 border-t border-white/[0.04] pt-1 mt-1">
            <span>ESCALA: 1:50</span>
            <span>FECHA: 24/05/2026</span>
          </div>
          <div className="text-brand-gold/65 text-[7.5px]">
            APROBADO POR: DIRECTIVOS DE ARQUITECTURA
          </div>
        </div>

        {/* Isometric compass indicator on left border */}
        <div className="absolute top-1/3 left-4 border border-white/[0.05] p-2 flex flex-col items-center justify-center space-y-1 hidden md:flex bg-brand-dark/50">
          <span className="text-[6px] font-mono text-brand-gold">AXO</span>
          <svg viewBox="0 0 30 30" className="w-6 h-6 text-brand-gold/50" fill="none" stroke="currentColor" strokeWidth="0.75">
            <circle cx="15" cy="15" r="12" />
            <line x1="15" y1="3" x2="15" y2="27" />
            <line x1="3" y1="15" x2="27" y2="15" />
            <line x1="6" y1="6" x2="24" y2="24" className="text-brand-gold" />
          </svg>
          <span className="text-[5.5px] font-mono text-white/20">30° / 60°</span>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
         BLUEPRINT FRAMES (GSAP controlará autoAlpha para evitar cuelgues)
         ═══════════════════════════════════════════════════════════════ */}

      {/* FRAME 0: HERO (Fachada Axonométrica de Villa Completa) */}
      <div className="blueprint-frame-0 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Ground contour lines - denser */}
          <path d="M 50,480 C 250,510 450,450 650,480 C 850,510 900,470 950,490" strokeDasharray="3,3" className="text-white/25" />
          <path d="M 50,500 C 300,530 500,470 700,500 C 900,530 950,500 950,510" strokeDasharray="5,5" className="text-brand-gold/20" />
          <path d="M 50,520 C 350,550 550,490 750,520 C 920,550 950,530 950,530" strokeWidth="0.3" className="opacity-15" />
          
          {/* Detailed Villa Structure */}
          {/* Main geometric blocks */}
          <polygon points="300,430 300,260 480,170 650,260 650,430 480,510" strokeWidth="1" className="text-brand-gold" />
          <line x1="480" y1="170" x2="480" y2="510" strokeWidth="0.75" />
          
          {/* Left Block (Garage / Service) */}
          <polygon points="120,430 300,340 300,430 120,430" className="text-white/20" />
          <polygon points="120,360 300,270 300,340 120,360" />
          <line x1="120" y1="360" x2="120" y2="430" />
          
          {/* Second level floor plates and ceilings */}
          <polygon points="300,340 480,430 650,340 480,250" strokeWidth="0.8" />
          <line x1="300" y1="343" x2="480" y2="433" strokeWidth="0.5" strokeDasharray="2,2" />
          
          {/* Cantilever overhang roof on the right */}
          <polygon points="650,310 830,220 830,140 650,230" strokeWidth="1" className="text-brand-gold" />
          <polygon points="480,170 650,80 830,170 650,260" strokeWidth="1" />
          <line x1="830" y1="220" x2="830" y2="410" strokeDasharray="2,2" className="opacity-40" />
          <line x1="830" y1="140" x2="830" y2="220" strokeWidth="0.8" />
          
          {/* Window mullion divisions */}
          <line x1="330" y1="315" x2="330" y2="415" strokeWidth="0.5" />
          <line x1="450" y1="250" x2="450" y2="495" strokeWidth="0.5" />
          <line x1="510" y1="250" x2="510" y2="495" strokeWidth="0.5" />
          <line x1="620" y1="315" x2="620" y2="415" strokeWidth="0.5" />

          {/* Perspective grid projection lines */}
          <line x1="120" y1="360" x2="300" y2="270" strokeWidth="0.3" strokeDasharray="4,4" className="text-brand-gold/45" />
          <line x1="300" y1="260" x2="480" y2="170" strokeWidth="0.3" strokeDasharray="4,4" className="text-brand-gold/45" />
          
          {/* Notations */}
          <text x="670" y="100" fill="currentColor" className="text-brand-gold font-bold" fontSize="8.5" fontFamily="monospace" letterSpacing="1">VILLA_MODEL_RE-01</text>
          <text x="670" y="115" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="text-white/40">LAT: -12.0431 // LON: -77.0282 // SURCO</text>
          <circle cx="650" cy="97" r="2.5" fill="#c5a880" />
          <line x1="650" y1="97" x2="665" y2="97" strokeWidth="0.5" className="text-brand-gold" />
        </svg>
      </div>

      {/* FRAME 1: MANIFIESTO (Corte Transversal, Columnas y Cimientos) */}
      <div className="blueprint-frame-1 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Column grids (A, B, C, D) */}
          <line x1="150" y1="40" x2="150" y2="540" strokeDasharray="3,3" className="opacity-25" />
          <line x1="380" y1="40" x2="380" y2="540" strokeDasharray="3,3" className="opacity-25" />
          <line x1="610" y1="40" x2="610" y2="540" strokeDasharray="3,3" className="opacity-25" />
          <line x1="840" y1="40" x2="840" y2="540" strokeDasharray="3,3" className="opacity-25" />
          <text x="145" y="35" fill="currentColor" fontSize="8" fontFamily="monospace" className="text-white/35">EJE 01</text>
          <text x="375" y="35" fill="currentColor" fontSize="8" fontFamily="monospace" className="text-white/35">EJE 02</text>
          <text x="605" y="35" fill="currentColor" fontSize="8" fontFamily="monospace" className="text-white/35">EJE 03</text>
          <text x="835" y="35" fill="currentColor" fontSize="8" fontFamily="monospace" className="text-white/35">EJE 04</text>

          {/* Foundation ground detailing */}
          <rect x="80" y="470" width="840" height="50" strokeWidth="0.5" className="text-white/20" />
          <line x1="80" y1="495" x2="920" y2="495" strokeDasharray="8,4" className="text-brand-gold/30" />
          
          {/* Slab and structural joists */}
          <rect x="80" y="260" width="840" height="25" strokeWidth="0.8" className="text-brand-gold" />
          <line x1="80" y1="272.5" x2="920" y2="272.5" strokeWidth="0.3" strokeDasharray="1,2" />
          
          {/* Vertical concrete pillars */}
          <rect x="140" y="90" width="20" height="380" />
          <rect x="830" y="90" width="20" height="380" />
          <rect x="370" y="285" width="20" height="185" />
          <rect x="600" y="285" width="20" height="185" />

          {/* Foundation reinforcements lines (cross hatch inside foundation) */}
          <line x1="140" y1="480" x2="160" y2="510" strokeWidth="0.3" className="opacity-20" />
          <line x1="370" y1="480" x2="390" y2="510" strokeWidth="0.3" className="opacity-20" />
          <line x1="600" y1="480" x2="620" y2="510" strokeWidth="0.3" className="opacity-20" />
          
          {/* Roof slab and central cenital skylight aperture */}
          <polygon points="80,90 350,90 350,60 550,60 550,90 920,90 920,70 80,70" strokeWidth="1" className="text-brand-gold" />
          
          {/* Sunlight beams slicing down */}
          <line x1="350" y1="60" x2="570" y2="470" className="text-brand-gold" strokeWidth="1" />
          <line x1="410" y1="60" x2="630" y2="470" className="text-brand-gold" strokeWidth="0.75" strokeDasharray="3,3" />
          <line x1="470" y1="60" x2="690" y2="470" className="text-brand-gold/60" strokeWidth="0.5" strokeDasharray="4,4" />
          <path d="M 350,60 A 120,120 0 0,0 410,130" strokeWidth="0.5" className="text-brand-gold" />
          <text x="365" y="105" fill="#c5a880" fontSize="8.5" fontFamily="monospace">SOLAR_ANGLE: 38.6°</text>

          {/* Telemetry and height metrics */}
          <text x="95" y="250" fill="currentColor" fontSize="7.5" fontFamily="monospace">NIV_2: +3.00 m</text>
          <text x="95" y="460" fill="currentColor" fontSize="7.5" fontFamily="monospace">NPT: +0.00 m</text>
          <text x="95" y="60" fill="currentColor" fontSize="7.5" fontFamily="monospace">CUB: +6.30 m</text>
        </svg>
      </div>

      {/* FRAME 2: ANTES / DESPUÉS (Montantes, Cavidades y Juntas) */}
      <div className="blueprint-frame-2 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* perspective floor grid - denser */}
          <polygon points="100,100 400,220 400,420 100,500" strokeWidth="0.5" />
          <polygon points="400,220 900,100 900,500 400,420" strokeWidth="0.5" />
          <line x1="100" y1="100" x2="900" y2="100" />
          <line x1="100" y1="500" x2="900" y2="500" />
          
          {/* Floor grid lines */}
          <line x1="100" y1="500" x2="400" y2="420" />
          <line x1="220" y1="500" x2="400" y2="420" />
          <line x1="340" y1="500" x2="400" y2="420" />
          <line x1="460" y1="500" x2="400" y2="420" />
          <line x1="580" y1="500" x2="400" y2="420" />
          <line x1="700" y1="500" x2="400" y2="420" />
          <line x1="820" y1="500" x2="400" y2="420" />
          <line x1="900" y1="500" x2="400" y2="420" />

          {/* Wall metal framing studs (detailed vertical lines) */}
          <line x1="150" y1="120" x2="150" y2="487" strokeDasharray="2,2" className="text-white/20" />
          <line x1="200" y1="140" x2="200" y2="473" strokeDasharray="2,2" className="text-white/20" />
          <line x1="250" y1="160" x2="250" y2="460" strokeDasharray="2,2" className="text-white/20" />
          <line x1="300" y1="180" x2="300" y2="447" strokeDasharray="2,2" className="text-white/20" />
          <line x1="350" y1="200" x2="350" y2="433" strokeDasharray="2,2" className="text-white/20" />

          {/* Recessed slots with golden outline (Ranura Clima 12mm) */}
          <path d="M 400,220 L 800,127" strokeWidth="2.5" className="text-brand-gold" />
          <path d="M 400,225 L 800,132" strokeWidth="0.5" className="text-brand-gold/60" />
          <text x="650" y="115" fill="#c5a880" fontSize="8.5" fontFamily="monospace" letterSpacing="0.8">DETALLE_RANURA: ACABADO_12mm</text>
          <circle cx="620" cy="169" r="3" fill="#c5a880" />
          <line x1="620" y1="169" x2="640" y2="125" strokeWidth="0.5" className="text-brand-gold" />

          {/* Transducer speaker structural outline on left wall */}
          <rect x="220" y="240" width="50" height="80" strokeWidth="0.8" className="text-brand-gold" />
          <circle cx="245" cy="280" r="12" className="text-brand-gold/50" />
          <line x1="245" y1="260" x2="245" y2="300" />
          <line x1="225" y1="280" x2="265" y2="280" />
          <text x="180" y="340" fill="currentColor" fontSize="6.5" fontFamily="monospace">EMISOR_ACÚSTICO_OCULTO</text>
        </svg>
      </div>

      {/* FRAME 3: CIRCADIANO (Trayectorias, Brújula y Espectros de Luz) */}
      <div className="blueprint-frame-3 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Compass circle system */}
          <circle cx="500" cy="300" r="230" strokeWidth="0.8" className="text-brand-gold" />
          <circle cx="500" cy="300" r="222" strokeWidth="0.3" strokeDasharray="3,1" />
          <circle cx="500" cy="300" r="190" strokeDasharray="6,4" className="opacity-30" />
          <circle cx="500" cy="300" r="255" strokeWidth="0.25" />
          
          {/* Compass axes */}
          <line x1="500" y1="50" x2="500" y2="550" strokeWidth="0.3" className="opacity-35" />
          <line x1="220" y1="300" x2="780" y2="300" strokeWidth="0.3" className="opacity-35" />
          
          {/* Compass labels */}
          <text x="494" y="60" fill="currentColor" fontSize="12" fontFamily="sans-serif" className="text-brand-gold font-bold">N</text>
          <text x="495" y="550" fill="currentColor" fontSize="12" fontFamily="sans-serif" className="opacity-80">S</text>
          <text x="745" y="304" fill="currentColor" fontSize="12" fontFamily="sans-serif" className="opacity-80">E</text>
          <text x="235" y="304" fill="currentColor" fontSize="12" fontFamily="sans-serif" className="opacity-80">W</text>
          
          {/* Solar paths curve (Multiple golden arcs representing seasons) */}
          <path d="M 270,300 Q 500,60 730,300" strokeWidth="1.5" className="text-brand-gold" />
          <path d="M 270,300 Q 500,140 730,300" strokeWidth="0.75" strokeDasharray="4,2" className="text-brand-gold" />
          <path d="M 270,300 Q 500,220 730,300" strokeWidth="0.5" strokeDasharray="10,5" className="text-brand-gold/60" />
          
          {/* Active sun vector position indicator */}
          <circle cx="410" cy="151" r="5.5" fill="currentColor" className="text-brand-gold" />
          <line x1="500" y1="300" x2="410" y2="151" strokeWidth="1" className="text-brand-gold" />
          <text x="320" y="130" fill="#c5a880" fontSize="9" fontFamily="monospace" className="font-bold">POS_SOL: 10:45 AM</text>
          <text x="320" y="142" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">AZIMUTH: 136.2° // ELEVACIÓN: 48.9°</text>

          {/* Lux/Kelvin spectrum charts on the bottom sides */}
          {/* Left chart */}
          <path d="M 100,500 H 260" strokeWidth="0.5" />
          <path d="M 100,430 V 500" strokeWidth="0.5" />
          <path d="M 100,500 C 130,410 180,450 260,500" strokeWidth="1.25" className="text-brand-gold/70" />
          <text x="105" y="420" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="text-brand-gold">ESPECTRO DE LUZ CIRCADIANA</text>
          
          {/* Right chart */}
          <path d="M 740,500 H 900" strokeWidth="0.5" />
          <path d="M 900,430 V 500" strokeWidth="0.5" />
          <path d="M 740,500 C 820,450 870,410 900,500" strokeWidth="1" strokeDasharray="3,3" className="text-white/40" />
          <text x="745" y="420" fill="currentColor" fontSize="6.5" fontFamily="monospace" className="text-white/40">KELVIN DYNAMIC CHART</text>
        </svg>
      </div>

      {/* FRAME 4: ESPECIALIDADES (Nodos, Acústica y Clima IoT) */}
      <div className="blueprint-frame-4 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Detailed schematic mosaic grid */}
          <rect x="120" y="80" width="760" height="440" strokeWidth="0.25" className="opacity-30" />
          <line x1="120" y1="226.6" x2="880" y2="226.6" strokeWidth="0.25" className="opacity-20" />
          <line x1="120" y1="373.3" x2="880" y2="373.3" strokeWidth="0.25" className="opacity-20" />
          <line x1="373.3" y1="80" x2="373.3" y2="520" strokeWidth="0.25" className="opacity-20" />
          <line x1="626.6" y1="80" x2="626.6" y2="520" strokeWidth="0.25" className="opacity-20" />
          
          {/* Node block 1: Lighting controller */}
          <rect x="150" y="110" width="180" height="90" strokeWidth="1" className="text-brand-gold" />
          <text x="160" y="128" fill="currentColor" className="text-brand-gold font-bold" fontSize="9" fontFamily="monospace">CTRL_LUMI_NODE_A</text>
          <text x="160" y="145" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">ESTADO: TRANSMITIENDO</text>
          <text x="160" y="157" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">OUTPUT: DALI-2 (64CH)</text>
          <text x="160" y="169" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">VOLT: 24VDC // TEMP: 28.5°C</text>
          <circle cx="310" cy="125" r="3" fill="currentColor" className="text-brand-gold animate-pulse" />
          
          {/* Connection lines with arrows */}
          <path d="M 330,155 H 480 V 270" strokeDasharray="3,3" className="text-brand-gold/60" />
          <path d="M 475,270 L 480,275 L 485,270" />

          {/* Node block 2: Main Rack Gateway */}
          <rect x="440" y="270" width="140" height="100" strokeWidth="1" />
          <text x="450" y="290" fill="currentColor" className="text-brand-gold font-bold" fontSize="9" fontFamily="monospace">GATEWAY_SERVER_RACK</text>
          <text x="450" y="308" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">HOST IP: 192.168.1.150</text>
          <text x="450" y="320" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">LATENCY: 1.4ms (LOCAL)</text>
          <text x="450" y="332" fill="currentColor" fontSize="7" fontFamily="monospace" className="text-white/40">BUS: KNX-TP / ETHERNET</text>
          <circle cx="560" cy="285" r="3" fill="currentColor" className="text-emerald-400" />
          
          {/* Acoustic soundwaves diagram */}
          <g transform="translate(650, 110)">
            <rect x="0" y="0" width="200" height="90" strokeWidth="0.5" className="opacity-20" />
            <path d="M 15,45 Q 40,15 65,45 T 115,45 T 165,45" strokeWidth="1" className="text-brand-gold" />
            <path d="M 15,55 Q 40,25 65,55 T 115,55 T 165,55" strokeWidth="0.5" strokeDasharray="2,2" className="text-brand-gold/50" />
            <text x="15" y="80" fill="currentColor" fontSize="7" fontFamily="monospace">AUDIO INVISIBLE DSP TUNING</text>
          </g>

          {/* Intersecting flow lines */}
          <line x1="580" y1="320" x2="680" y2="320" strokeDasharray="3,3" />
          <circle cx="680" cy="320" r="2.5" fill="currentColor" />
        </svg>
      </div>

      {/* FRAME 5: CASTELLANA 503 (Cortes de Pérgola e Isometría Explotada) */}
      <div className="blueprint-frame-5 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Structural framing guide lines */}
          <polygon points="350,420 350,180 750,180 750,420" strokeWidth="0.25" className="opacity-20" />
          
          {/* Rafters and ledger plates details */}
          <line x1="260" y1="210" x2="720" y2="210" strokeWidth="1.5" />
          <line x1="260" y1="225" x2="720" y2="225" strokeWidth="1" />
          
          {/* Main projecting structural beams of the pergola */}
          <polygon points="260,210 160,380 620,380 720,210" strokeWidth="1.5" className="text-brand-gold" />
          <polygon points="260,225 160,395 620,395 720,225" strokeWidth="1" className="text-brand-gold/60" />
          <line x1="160" y1="380" x2="160" y2="395" strokeWidth="1.25" />
          <line x1="620" y1="380" x2="620" y2="395" strokeWidth="1.25" />
          
          {/* Slats / louvers detail (transversal layout) */}
          <line x1="310" y1="295" x2="410" y2="295" />
          <line x1="350" y1="295" x2="450" y2="295" />
          <line x1="390" y1="295" x2="490" y2="295" />
          <line x1="430" y1="295" x2="530" y2="295" />
          <line x1="470" y1="295" x2="570" y2="295" />
          <line x1="510" y1="295" x2="610" y2="295" />
          <line x1="550" y1="295" x2="650" y2="295" />

          {/* Exploded detail arrow for wall anchor */}
          <line x1="210" y1="295" x2="210" y2="215" strokeDasharray="3,3" className="text-brand-gold" />
          <polygon points="200,215 220,215 210,200" fill="none" className="text-brand-gold" />
          <text x="180" y="195" fill="#c5a880" fontSize="8" fontFamily="monospace" className="font-bold">PERFIL: AL-6063-T5</text>
          
          {/* Dimension notations - metric */}
          <line x1="160" y1="415" x2="620" y2="415" strokeWidth="0.5" />
          <line x1="160" y1="410" x2="160" y2="420" />
          <line x1="620" y1="410" x2="620" y2="420" />
          <text x="360" y="432" fill="currentColor" fontSize="8.5" fontFamily="monospace" letterSpacing="0.8">COT_A // ANCHO: 6000 mm</text>
          
          <line x1="130" y1="380" x2="230" y2="210" strokeWidth="0.5" />
          <line x1="127" y1="385" x2="133" y2="375" />
          <line x1="227" y1="215" x2="233" y2="205" />
          <text x="120" y="285" fill="currentColor" fontSize="8.5" fontFamily="monospace" letterSpacing="0.8" transform="rotate(-30 120 285)">COT_B // PROJ: 3500 mm</text>
        </svg>
      </div>

      {/* FRAME 6: CTA / LOGO DE MARCA Y CÍRCULOS CONCÉNTRICOS */}
      <div className="blueprint-frame-6 absolute inset-0 w-full h-full flex items-center justify-center p-8 md:p-24">
        <svg 
          viewBox="0 0 1000 600" 
          className="w-full h-full text-brand-light max-w-5xl opacity-45" 
          stroke="currentColor" 
          fill="none" 
          strokeWidth="0.65"
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {/* Large Concentric Calibration Circles */}
          <circle cx="500" cy="300" r="200" strokeWidth="1" className="text-brand-gold" />
          <circle cx="500" cy="300" r="170" strokeWidth="0.5" strokeDasharray="6,4" className="text-brand-gold/60" />
          <circle cx="500" cy="300" r="235" strokeWidth="0.25" className="opacity-40" />
          
          {/* Inner brand geometric details */}
          <circle cx="500" cy="300" r="140" strokeWidth="0.5" />
          <path d="M 430,270 L 500,240 L 570,270" strokeWidth="1.25" className="text-brand-gold" />
          <path d="M 500,305 L 500,355" strokeWidth="1.25" className="text-brand-gold" />
          
          {/* Diagonal grids */}
          <line x1="200" y1="300" x2="800" y2="300" strokeWidth="0.25" className="opacity-30" />
          <line x1="500" y1="50" x2="500" y2="550" strokeWidth="0.25" className="opacity-30" />
          <line x1="287" y1="87" x2="713" y2="513" strokeWidth="0.25" strokeDasharray="3,3" className="opacity-20" />
          <line x1="287" y1="513" x2="713" y2="87" strokeWidth="0.25" strokeDasharray="3,3" className="opacity-20" />
          
          {/* Watermark brand text */}
          <text x="500" y="465" fill="currentColor" fontSize="11" fontFamily="monospace" letterSpacing="4" textAnchor="middle" className="text-brand-gold font-bold">CΛSΛ ΛTENTΛ</text>
          <text x="500" y="480" fill="currentColor" fontSize="7.5" fontFamily="monospace" letterSpacing="1" textAnchor="middle" className="opacity-40">DISEÑO Y REMODELACIÓN INVISIBLE</text>
        </svg>
      </div>

    </div>
  );
};
