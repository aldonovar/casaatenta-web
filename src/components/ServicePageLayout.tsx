"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MessageCircle, ArrowUpRight, ChevronDown } from "lucide-react";
import type { ServicePageData } from "@/data/services-pages";
import { servicePages } from "@/data/services-pages";
import { ServiceMotionGraphics } from "./ServiceMotionGraphics";

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────
   Slug → human-readable name map
   ────────────────────────────────────────────── */
const SERVICE_NAMES: Record<string, string> = {
  "techos-sol-y-sombra": "Techos Sol y Sombra",
  "diseno-terrazas": "Diseño de Terrazas",
  "iluminacion-inteligente": "Iluminación Inteligente",
  "smart-homes": "Smart Homes",
  "mantenimiento-general": "Mantenimiento General",
};

/* ──────────────────────────────────────────────
   FAQ Accordion Item
   ────────────────────────────────────────────── */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-ca-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors duration-200 hover:text-brand-gold focus:outline-none"
        aria-expanded={isOpen}
      >
        <span className="text-sm font-sans font-light text-ca-text md:text-base leading-snug">
          {question}
        </span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-brand-gold transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{
          maxHeight: isOpen ? contentRef.current?.scrollHeight ?? 500 : 0,
          opacity: isOpen ? 1 : 0,
        }}
      >
        <p className="pb-5 text-sm font-light leading-relaxed text-ca-text-secondary">
          {answer}
        </p>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────
   Interactive Service Showcase (cinematic and specialized simulators)
   ────────────────────────────────────────────── */
function InteractiveServiceShowcase({ slug }: { slug: string }) {
  const [louvreAngle, setLouvreAngle] = useState(45);
  const [beforeAfterPosition, setBeforeAfterPosition] = useState(50);
  const beforeAfterRef = useRef<HTMLDivElement>(null);
  const [circadianScene, setCircadianScene] = useState<"dawn" | "noon" | "sunset" | "night">("noon");
  const [whatsappMessages, setWhatsappMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([
    { sender: "bot", text: "Hola, soy el asistente inteligente de Casa Atenta. Escribe un comando o selecciona una escena para ver cómo responde el hogar en tiempo real." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [homeLights, setHomeLights] = useState({ terrace: true, living: true, cinema: false, security: false });

  // Handle Before/After dragging
  const handleBeforeAfterMove = (clientX: number) => {
    const container = beforeAfterRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setBeforeAfterPosition(percentage);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    handleBeforeAfterMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleBeforeAfterMove(e.touches[0].clientX);
    }
  };

  // Handle WhatsApp commands
  const triggerWhatsappCommand = (command: string, botReply: string, updatedLights: typeof homeLights) => {
    if (isTyping) return;
    setWhatsappMessages(prev => [...prev, { sender: "user", text: command }]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setWhatsappMessages(prev => [...prev, { sender: "bot", text: botReply }]);
      setHomeLights(updatedLights);
    }, 1000);
  };

  switch (slug) {
    case "techos-sol-y-sombra":
      return (
        <div className="glass-card p-6 md:p-10 rounded-sm space-y-8 max-w-4xl mx-auto border border-ca-border">
          <div className="text-center space-y-2">
            <span className="tech-label">Orientación Bioclimática</span>
            <h4 className="text-xl font-display font-light uppercase text-ca-text">Control de Sombra y Apertura</h4>
            <p className="text-xs text-ca-text-secondary">Usa el control deslizante para orientar las lamas y ajustar el nivel de sombra.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Interactive Roof SVG Cross Section */}
            <div className="relative aspect-[4/3] w-full border border-ca-border/40 bg-ca-bg-deep rounded-sm overflow-hidden flex items-center justify-center p-6">
              {/* Sun Light Rays */}
              <div 
                className="absolute inset-0 bg-gradient-to-b from-brand-gold/15 to-transparent pointer-events-none transition-opacity duration-300"
                style={{ opacity: louvreAngle / 90 }}
              />

              <svg viewBox="0 0 300 200" className="w-full h-full stroke-brand-gold fill-none">
                {/* Structure frame */}
                <rect x="30" y="40" width="240" height="120" strokeWidth="1" stroke="var(--ca-blue-gray)" className="opacity-30" />
                
                {/* 5 Rotating Slats (Lamas) */}
                {[55, 95, 135, 175, 215].map((x) => (
                  <line
                    key={x}
                    x1={x}
                    y1="60"
                    x2={x + 30}
                    y2="60"
                    strokeWidth="5"
                    stroke="var(--ca-gold)"
                    style={{
                      transformOrigin: `${x + 15}px 60px`,
                      transform: `rotate(${louvreAngle}deg)`,
                      transition: "transform 150ms ease-out"
                    }}
                  />
                ))}
                
                {/* Support Beams details */}
                <line x1="30" y1="160" x2="270" y2="160" strokeWidth="1.5" stroke="var(--ca-blue-gray)" className="opacity-50" />
                <line x1="60" y1="160" x2="60" y2="40" strokeWidth="2" stroke="var(--ca-blue-gray)" className="opacity-50" />
                <line x1="240" y1="160" x2="240" y2="40" strokeWidth="2" stroke="var(--ca-blue-gray)" className="opacity-50" />

                {/* Sombra indicators */}
                <text x="150" y="125" textAnchor="middle" className="fill-ca-text-secondary stroke-none font-mono text-[9px] tracking-widest uppercase">
                  {louvreAngle < 15 ? "SOMBRA TOTAL (100%)" : louvreAngle > 75 ? "APERTURA MÁXIMA (90% LUZ)" : "VENTILACIÓN Y SOMBRA"}
                </text>
              </svg>
            </div>

            {/* Slider Controls */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-ca-text-secondary">ÁNGULO DE LAMAS:</span>
                  <span className="text-brand-gold font-bold">{louvreAngle}°</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="90" 
                  value={louvreAngle} 
                  onChange={(e) => setLouvreAngle(Number(e.target.value))}
                  className="w-full h-1 bg-ca-border rounded-lg appearance-none cursor-pointer accent-brand-gold"
                />
              </div>

              <div className="border border-ca-border p-4 bg-ca-bg-surface/50 space-y-2 rounded-sm">
                <span className="tech-label text-[10px]">Diagnóstico Bioclimático</span>
                <p className="text-xs text-ca-text leading-relaxed">
                  {louvreAngle < 15 && "Lamas completamente cerradas. Bloqueo del 100% de luz y lluvia directa, ideal para días húmedos e invierno limeño."}
                  {louvreAngle >= 15 && louvreAngle <= 60 && "Modo flujo cruzado. Equilibrio idóneo entre luz solar filtrada y ventilación natural para disipar aire caliente en verano."}
                  {louvreAngle > 60 && "Apertura máxima. Iluminación natural difusa para atardeceres u horas nubladas sin pérdida de confort."}
                </p>
              </div>
            </div>
          </div>
        </div>
      );

    case "diseno-terrazas":
      return (
        <div className="glass-card p-6 md:p-10 rounded-sm space-y-8 max-w-4xl mx-auto border border-ca-border">
          <div className="text-center space-y-2">
            <span className="tech-label">Antes y Después Interactivo</span>
            <h4 className="text-xl font-display font-light uppercase text-ca-text">Transformación de Espacio</h4>
            <p className="text-xs text-ca-text-secondary">Arrastra el ratón o desliza el dedo sobre la imagen para revelar la terraza finalizada.</p>
          </div>

          <div 
            ref={beforeAfterRef}
            onMouseMove={onMouseMove}
            onTouchMove={onTouchMove}
            className="relative aspect-[16/9] w-full border border-ca-border bg-ca-bg-deep rounded-sm overflow-hidden select-none cursor-ew-resize"
          >
            {/* Before (Background) */}
            <Image
              src="/backgrounds/beforeafter.png"
              alt="Terraza antes del proyecto"
              fill
              className="object-cover pointer-events-none"
              sizes="(max-width: 768px) 100vw, 800px"
            />
            <div className="absolute top-4 left-4 z-20 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-mono tracking-widest text-white uppercase">
              ANTES
            </div>

            {/* After (Foreground, Clipped) */}
            <div 
              className="absolute inset-y-0 left-0 right-0 z-10 overflow-hidden pointer-events-none"
              style={{ width: `${beforeAfterPosition}%` }}
            >
              <div className="absolute inset-0 w-full h-full aspect-[16/9]" style={{ width: beforeAfterRef.current?.getBoundingClientRect().width }}>
                <Image
                  src="/backgrounds/casestudy.png"
                  alt="Terraza después del diseño Casa Atenta"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
              </div>
              <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-brand-gold/80 backdrop-blur-md rounded-full border border-brand-gold text-[10px] font-mono tracking-widest text-ca-bg-deep uppercase font-bold">
                DESPUÉS
              </div>
            </div>

            {/* Slider bar line */}
            <div 
              className="absolute inset-y-0 z-20 w-[2px] bg-brand-gold pointer-events-none"
              style={{ left: `${beforeAfterPosition}%` }}
            >
              {/* Slider circle handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-brand-gold bg-ca-bg-deep flex items-center justify-center shadow-lg">
                <span className="text-[10px] text-brand-gold font-mono">&lt;&gt;</span>
              </div>
            </div>
          </div>
        </div>
      );

    case "iluminacion-inteligente":
      return (
        <div className="glass-card p-6 md:p-10 rounded-sm space-y-8 max-w-4xl mx-auto border border-ca-border">
          <div className="text-center space-y-2">
            <span className="tech-label">Espectro Lumínico Circadiano</span>
            <h4 className="text-xl font-display font-light uppercase text-ca-text">Atmósferas de Iluminación</h4>
            <p className="text-xs text-ca-text-secondary">Haz clic en las diferentes horas del día para visualizar el espectro de luz y sintonía circadiana.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Control buttons */}
            <div className="flex flex-col gap-3 justify-center">
              {[
                { id: "dawn", label: "07:00 AM // Amanecer", temp: "2700K", intensity: "40%", desc: "Luz cálida y suave para despertar el organismo sin estrés visual." },
                { id: "noon", label: "01:00 PM // Luz Cenital", temp: "5500K", intensity: "100%", desc: "Luz blanca fría de alta intensidad que bloquea la melatonina y promueve el enfoque." },
                { id: "sunset", label: "06:30 PM // Atardecer", temp: "3200K", intensity: "60%", desc: "Luz ámbar relajante para una transición gradual hacia el descanso." },
                { id: "night", label: "11:00 PM // Noche", temp: "1800K", intensity: "10%", desc: "Luz muy cálida atenuada para la relajación final sin perturbar el ciclo de sueño." }
              ].map((scene) => (
                <button
                  key={scene.id}
                  onClick={() => setCircadianScene(scene.id as any)}
                  className={`text-left p-4 border rounded-sm font-mono text-[11px] uppercase tracking-wider transition-all duration-300 ${
                    circadianScene === scene.id
                      ? "border-brand-gold bg-brand-gold/10 text-brand-gold"
                      : "border-ca-border hover:border-ca-text-secondary/50 text-ca-text-secondary"
                  }`}
                >
                  <span className="block font-bold">{scene.label}</span>
                  <span className="block text-[10px] opacity-60 mt-1">Temp: {scene.temp} / Intensidad: {scene.intensity}</span>
                </button>
              ))}
            </div>

            {/* Immersive Lighting Output Preview */}
            <div 
              className="md:col-span-2 relative aspect-[4/3] border border-ca-border/40 rounded-sm overflow-hidden flex flex-col justify-between p-6 transition-all duration-500"
              style={{
                background: 
                  circadianScene === "dawn" ? "linear-gradient(to bottom, #2b1c19, #07111d)" :
                  circadianScene === "noon" ? "linear-gradient(to bottom, #1f2f3d, #07111d)" :
                  circadianScene === "sunset" ? "linear-gradient(to bottom, #3a2214, #07111d)" :
                  "linear-gradient(to bottom, #050a12, #020407)"
              }}
            >
              {/* Glowing Aura Effect */}
              <div 
                className="absolute top-10 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full blur-[80px] pointer-events-none transition-all duration-500"
                style={{
                  background:
                    circadianScene === "dawn" ? "#E37A53" :
                    circadianScene === "noon" ? "#89c5fa" :
                    circadianScene === "sunset" ? "#b8621d" :
                    "#E69A33",
                  opacity: 
                    circadianScene === "dawn" ? 0.4 :
                    circadianScene === "noon" ? 0.6 :
                    circadianScene === "sunset" ? 0.5 :
                    0.2
                }}
              />

              {/* Top readout info */}
              <div className="flex justify-between items-start z-10 font-mono text-[9px] tracking-widest text-ca-text-secondary uppercase">
                <span>RANGO: RITMO NATURAL</span>
                <span>EMISIÓN ACTIVA</span>
              </div>

              {/* Centered technical device rendering */}
              <div className="flex flex-col items-center justify-center z-10 gap-3">
                <svg viewBox="0 0 100 100" className="w-16 h-16 stroke-brand-gold fill-none">
                  {/* Circular bulb representation */}
                  <circle cx="50" cy="45" r="20" strokeWidth="1" style={{
                    stroke: 
                      circadianScene === "dawn" ? "#E37A53" :
                      circadianScene === "noon" ? "#ffffff" :
                      circadianScene === "sunset" ? "#d88040" :
                      "#D8B36A"
                  }} />
                  <path d="M 40 65 L 60 65 M 43 70 L 57 70" strokeWidth="1" stroke="var(--ca-blue-gray)" />
                  <line x1="50" y1="25" x2="50" y2="15" strokeWidth="1" stroke="var(--ca-blue-gray)" className="opacity-40" />
                </svg>
                <span className="text-2xl font-display font-light text-ca-text">
                  {circadianScene === "dawn" && "2700K Amanecer"}
                  {circadianScene === "noon" && "5500K Cenital"}
                  {circadianScene === "sunset" && "3200K Atardecer"}
                  {circadianScene === "night" && "1800K Noche"}
                </span>
              </div>

              {/* Bottom text explanation */}
              <p className="z-10 text-xs font-light leading-relaxed text-ca-text-secondary border-t border-ca-border/30 pt-4">
                {circadianScene === "dawn" && "Amanecer: Estimula suavemente los niveles de cortisol mediante longitudes de onda cálidas. Prepara el cuerpo para iniciar el día."}
                {circadianScene === "noon" && "Luz Cenital: Alta concentración de azul cielo. Maximiza los niveles de atención, reduce la somnolencia y aumenta el rendimiento."}
                {circadianScene === "sunset" && "Atardecer: Bloqueo de longitudes de azul. Indica al cuerpo el fin de la jornada laboral, promoviendo tranquilidad."}
                {circadianScene === "night" && "Noche: Atenuación total. Habilita la secreción natural de melatonina para un descanso reparador y profundo."}
              </p>
            </div>
          </div>
        </div>
      );

    case "smart-homes":
      return (
        <div className="glass-card p-6 md:p-10 rounded-sm space-y-8 max-w-4xl mx-auto border border-ca-border">
          <div className="text-center space-y-2">
            <span className="tech-label">Control Conversacional WhatsApp</span>
            <h4 className="text-xl font-display font-light uppercase text-ca-text">Hogar Inteligente Conversacional</h4>
            <p className="text-xs text-ca-text-secondary">Interactúa con los comandos de abajo para experimentar la respuesta residencial integrada.</p>
          </div>

          <div className="grid md:grid-cols-12 gap-8 items-stretch">
            {/* simulated Phone layout */}
            <div className="md:col-span-5 flex flex-col border border-ca-border bg-[#050a12] rounded-2xl overflow-hidden aspect-[9/16] max-w-[280px] mx-auto w-full shadow-2xl">
              {/* Phone Status bar */}
              <div className="bg-[#020509] px-4 py-2 flex justify-between items-center text-[9px] font-mono text-ca-text-secondary border-b border-ca-border/20">
                <span>09:41 AM</span>
                <div className="flex gap-1">
                  <span>5G</span>
                  <span>100%</span>
                </div>
              </div>
              
              {/* WhatsApp chat header */}
              <div className="bg-[#0a1827] px-4 py-3 flex items-center gap-2 border-b border-ca-border/20">
                <div className="w-7 h-7 rounded-full bg-brand-gold/20 flex items-center justify-center text-brand-gold text-[10px] font-bold">CA</div>
                <div className="flex flex-col">
                  <span className="text-xs text-ca-text font-bold">Casa Atenta Bot</span>
                  <span className="text-[8px] text-brand-gold uppercase tracking-wider font-mono">En línea</span>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-grow p-4 space-y-3 overflow-y-auto flex flex-col justify-end text-[10px]">
                {whatsappMessages.map((msg, i) => (
                  <div 
                    key={i} 
                    className={`max-w-[85%] p-3 rounded-xl leading-relaxed ${
                      msg.sender === "user" 
                        ? "self-end bg-brand-gold text-ca-bg-deep font-medium rounded-tr-none" 
                        : "self-start bg-[#162a3f] text-ca-text rounded-tl-none border border-ca-border/30"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
                
                {isTyping && (
                  <div className="self-start bg-[#162a3f] text-ca-text-secondary p-2.5 rounded-xl rounded-tl-none border border-ca-border/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <span className="w-1.5 h-1.5 bg-brand-gold/60 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-[#020509] border-t border-ca-border/20 flex gap-2 items-center">
                <div className="flex-grow bg-[#162a3f] rounded-full px-3 py-2 text-[9px] text-ca-text-secondary">Escribe una escena...</div>
                <div className="w-7 h-7 rounded-full bg-brand-gold flex items-center justify-center text-ca-bg-deep font-bold text-xs">➔</div>
              </div>
            </div>

            {/* Simulated House layout nodes */}
            <div className="md:col-span-7 flex flex-col justify-between p-6 border border-ca-border bg-ca-bg-surface/50 rounded-sm">
              <div className="space-y-2">
                <span className="tech-label text-[10px]">Respuesta de Integración</span>
                <p className="text-xs text-ca-text-secondary leading-relaxed">
                  Presiona las escenas para previsualizar cómo el ecosistema responde de forma sutil y eficiente.
                </p>
              </div>

              {/* Vector blueprint schema of house */}
              <div className="my-6 relative aspect-[16/10] w-full border border-ca-border/30 bg-ca-bg-deep/40 rounded-sm flex items-center justify-center p-4">
                <svg viewBox="0 0 200 120" className="w-full h-full stroke-ca-border fill-none">
                  {/* Floor plan rooms */}
                  <rect x="10" y="10" width="80" height="50" strokeWidth="0.5" />
                  <text x="50" y="40" textAnchor="middle" className="fill-ca-text-secondary stroke-none font-mono text-[7px] tracking-widest uppercase">SALA</text>
                  
                  <rect x="90" y="10" width="100" height="50" strokeWidth="0.5" />
                  <text x="140" y="40" textAnchor="middle" className="fill-ca-text-secondary stroke-none font-mono text-[7px] tracking-widest uppercase">TERRAZA</text>
                  
                  <rect x="10" y="60" width="180" height="50" strokeWidth="0.5" />
                  <text x="100" y="90" textAnchor="middle" className="fill-ca-text-secondary stroke-none font-mono text-[7px] tracking-widest uppercase">CINE / DORMITORIO</text>
                  
                  {/* Node indicators */}
                  <circle cx="50" cy="25" r="4" className={`transition-all duration-300 ${homeLights.living ? "fill-brand-gold stroke-brand-gold" : "stroke-ca-text-secondary opacity-30"}`} strokeWidth="1" />
                  <circle cx="140" cy="25" r="4" className={`transition-all duration-300 ${homeLights.terrace ? "fill-brand-gold stroke-brand-gold" : "stroke-ca-text-secondary opacity-30"}`} strokeWidth="1" />
                  <circle cx="50" cy="75" r="4" className={`transition-all duration-300 ${homeLights.cinema ? "fill-brand-gold stroke-brand-gold" : "stroke-ca-text-secondary opacity-30"}`} strokeWidth="1" />
                  <circle cx="150" cy="75" r="4" className={`transition-all duration-300 ${homeLights.security ? "fill-red-500 stroke-red-500" : "stroke-ca-text-secondary opacity-30"}`} strokeWidth="1" />
                </svg>
              </div>

              {/* Command quick triggers */}
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => triggerWhatsappCommand(
                    "Activar Escena Terraza", 
                    "Casa Atenta Smart: Escena Terraza activa. Se encendieron luces de terraza cálidas al 40% y se encendió el amplificador de audio exterior.",
                    { terrace: true, living: false, cinema: false, security: false }
                  )}
                  className="p-3 border border-ca-border hover:border-brand-gold hover:text-brand-gold text-[10px] font-mono text-left uppercase transition-all duration-200"
                >
                  ☀️ ESCENA TERRAZA
                </button>
                <button 
                  onClick={() => triggerWhatsappCommand(
                    "Activar Modo Cine", 
                    "Casa Atenta Smart: Modo Cine activo. Luces de sala y dormitorio apagadas. Tira LED del televisor atenuada al 10%.",
                    { terrace: false, living: false, cinema: true, security: false }
                  )}
                  className="p-3 border border-ca-border hover:border-brand-gold hover:text-brand-gold text-[10px] font-mono text-left uppercase transition-all duration-200"
                >
                  🎬 MODO CINE
                </button>
                <button 
                  onClick={() => triggerWhatsappCommand(
                    "Activar Seguridad Nocturna", 
                    "Casa Atenta Smart: Modo Seguridad activado. Sensores de movimiento activos en patio. Luces exteriores apagadas.",
                    { terrace: false, living: false, cinema: false, security: true }
                  )}
                  className="p-3 border border-ca-border hover:border-brand-gold hover:text-brand-gold text-[10px] font-mono text-left uppercase transition-all duration-200"
                >
                  🔒 MODO SEGURIDAD
                </button>
                <button 
                  onClick={() => triggerWhatsappCommand(
                    "Estado del Hogar", 
                    "Casa Atenta Smart: Reporte — Sala: Luces ON. Terraza: Luces ON. Dormitorio: Luces OFF. Seguridad: Inactiva.",
                    { terrace: true, living: true, cinema: false, security: false }
                  )}
                  className="p-3 border border-ca-border hover:border-brand-gold hover:text-brand-gold text-[10px] font-mono text-left uppercase transition-all duration-200"
                >
                  💡 ESTADO DEL HOGAR
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}

/* ──────────────────────────────────────────────
   Main Layout
   ────────────────────────────────────────────── */
export default function ServicePageLayout({
  data,
}: {
  data: ServicePageData;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const benefitsRef = useRef<HTMLDivElement>(null);
  const subServicesRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const materialsRef = useRef<HTMLDivElement>(null);
  const faqRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const relatedRef = useRef<HTMLDivElement>(null);

  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  /* ── GSAP ScrollTrigger animations ── */
  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero content reveal
      const heroContent = heroRef.current?.querySelector(".hero-content");
      if (heroContent) {
        gsap.fromTo(
          heroContent,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 1, delay: 0.2, ease: "power3.out" }
        );
      }

      // Hero image parallax
      const heroBg = heroRef.current?.querySelector(".hero-parallax-img");
      if (heroBg) {
        gsap.fromTo(
          heroBg,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: heroRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }

      // Section reveal helper
      const revealSections = [
        introRef,
        benefitsRef,
        subServicesRef,
        processRef,
        materialsRef,
        faqRef,
        ctaRef,
        relatedRef,
      ];

      revealSections.forEach((ref) => {
        if (!ref.current) return;
        gsap.fromTo(
          ref.current,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ref.current,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      });

      // Stagger benefit cards
      if (benefitsRef.current) {
        const cards = benefitsRef.current.querySelectorAll(".benefit-card");
        gsap.fromTo(
          cards,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: benefitsRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }

      // Stagger process steps
      if (processRef.current) {
        const steps = processRef.current.querySelectorAll(".process-step");
        gsap.fromTo(
          steps,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: processRef.current,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [data.slug]);

  /* ── Derive related service info ── */
  const relatedInfo = data.relatedServices
    .map((slug) => {
      const page = servicePages[slug];
      if (!page) return null;
      return {
        slug,
        name: SERVICE_NAMES[slug] ?? slug,
        eyebrow: page.hero.eyebrow,
      };
    })
    .filter(Boolean) as { slug: string; name: string; eyebrow: string }[];

  return (
    <div ref={containerRef} className="bg-ca-bg-deep min-h-screen">
      {/* ═══════════════════════════════════
          HERO
         ═══════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex min-h-[70vh] items-end overflow-hidden md:min-h-[80vh]"
      >
        {/* Background image with parallax space */}
        <Image
          src={data.hero.image}
          alt={data.hero.imageAlt}
          fill
          priority
          className="object-cover scale-110 hero-parallax-img"
          sizes="100vw"
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-ca-bg-deep/60 to-transparent" />

        {/* Content */}
        <div className="hero-content relative z-10 w-full px-6 pb-16 pt-40 md:px-12 lg:px-20">
          <div className="max-w-3xl space-y-5">
            {/* Eyebrow */}
            <span className="ca-kicker block">{data.hero.eyebrow}</span>
            <div className="ca-rule" />

            {/* H1 */}
            <h1 className="font-display text-3xl font-light uppercase leading-tight tracking-wide text-ca-text md:text-5xl lg:text-6xl">
              {data.hero.h1}
            </h1>

            {/* Subtitle */}
            <p className="max-w-2xl text-sm font-light leading-relaxed text-ca-text-secondary md:text-base">
              {data.hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          INTRO
         ═══════════════════════════════════ */}
      <section ref={introRef} className="ca-section bg-ca-bg-surface/30 relative border-t border-ca-border/40">
        <div className="absolute inset-0 z-0 opacity-[0.015] architectural-grid pointer-events-none" />
        <div className="ca-container relative z-10 grid gap-12 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <p className="ca-body leading-relaxed md:text-lg text-ca-text-secondary text-center lg:text-left">{data.intro}</p>
          </div>
          <div className="lg:col-span-4 flex justify-center lg:justify-end">
            <ServiceMotionGraphics slug={data.slug} />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          INTERACTIVE SHOWCASE (Cinematic experience for each page)
         ═══════════════════════════════════ */}
      {["techos-sol-y-sombra", "diseno-terrazas", "iluminacion-inteligente", "smart-homes"].includes(data.slug) && (
        <section className="ca-section bg-ca-bg-surface/10 relative overflow-hidden border-t border-b border-ca-border/30">
          <div className="absolute inset-0 z-0 opacity-5 blueprint-grid pointer-events-none" />
          <div className="ca-container relative z-10">
            <InteractiveServiceShowcase slug={data.slug} />
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          BENEFITS
         ═══════════════════════════════════ */}
      <section ref={benefitsRef} className="ca-section">
        <div className="ca-container space-y-12">
          {/* Section heading */}
          <div className="space-y-3">
            <span className="ca-kicker block">Ventajas</span>
            <div className="ca-rule" />
            <h2 className="font-display text-2xl font-light uppercase tracking-wide text-ca-text md:text-4xl">
              ¿Por qué elegirnos?
            </h2>
          </div>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.benefits.map((benefit, i) => (
              <div
                key={i}
                className="benefit-card glass-card rounded-sm p-6 md:p-8 space-y-3"
              >
                <span className="tech-label block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-lg font-light uppercase tracking-wide text-ca-text">
                  {benefit.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-ca-text-secondary">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SUB-SERVICES (optional, specifically for Mantenimiento General)
         ═══════════════════════════════════ */}
      {data.subServices && data.subServices.length > 0 && (
        <section
          ref={subServicesRef}
          className="ca-section bg-ca-bg-surface/10 relative overflow-hidden border-t border-b border-ca-border/30"
        >
          <div className="absolute inset-0 z-0 opacity-5 blueprint-grid pointer-events-none" />
          <div className="ca-container relative z-10 space-y-12">
            {/* Section heading */}
            <div className="space-y-3">
              <span className="ca-kicker block">Especialidades</span>
              <div className="ca-rule" />
              <h2 className="font-display text-2xl font-light uppercase tracking-wide text-ca-text md:text-4xl">
                Nuestros campos de especialización
              </h2>
              <p className="max-w-2xl text-sm font-light leading-relaxed text-ca-text-secondary">
                Abordamos cada mantenimiento técnico con la rigurosidad de un proyecto de arquitectura, garantizando precisión funcional y estética en cada detalle.
              </p>
            </div>

            {/* Sub-services Grid */}
            <div className="grid gap-6 md:grid-cols-2">
              {data.subServices.map((sub, i) => (
                <div
                  key={i}
                  className="group relative flex flex-col justify-between overflow-hidden border border-ca-border bg-ca-bg-card/50 p-8 transition-all duration-300 hover:border-brand-gold/50 rounded-sm"
                >
                  {/* Subtle grid pattern background on hover */}
                  <div className="absolute inset-0 z-0 opacity-0 bg-[linear-gradient(to_right,rgba(216,179,106,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(216,179,106,0.03)_1px,transparent_1px)] bg-[size:14px_24px] transition-opacity duration-500 group-hover:opacity-100 pointer-events-none" />
                  
                  <div className="relative z-10 space-y-4">
                    <span className="tech-label text-brand-gold/60 block">0{i + 1} // SUBSERVICIO</span>
                    <h3 className="font-display text-xl font-light uppercase tracking-wide text-ca-text group-hover:text-brand-gold transition-colors duration-200">
                      {sub.title}
                    </h3>
                    <p className="text-sm font-light leading-relaxed text-ca-text-secondary">
                      {sub.description}
                    </p>
                    
                    {/* List of details */}
                    <ul className="space-y-2 pt-2">
                      {sub.details.map((detail, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-ca-text-secondary font-mono">
                          <span className="h-1 w-1 bg-brand-gold rounded-full" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          PROCESS
         ═══════════════════════════════════ */}
      <section ref={processRef} className="ca-section">
        <div className="ca-container space-y-12">
          {/* Heading */}
          <div className="space-y-3">
            <span className="ca-kicker block">Proceso</span>
            <div className="ca-rule" />
            <h2 className="font-display text-2xl font-light uppercase tracking-wide text-ca-text md:text-4xl">
              {data.process.title}
            </h2>
          </div>

          {/* Timeline steps */}
          <div className="relative space-y-0 pl-8 md:pl-12">
            {/* Vertical line */}
            <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-brand-gold via-brand-gold/40 to-transparent md:left-5" />

            {data.process.steps.map((step, i) => (
              <div
                key={i}
                className="process-step relative flex items-start gap-5 py-5"
              >
                {/* Dot */}
                <div className="absolute -left-5 top-6 flex h-5 w-5 items-center justify-center md:-left-7">
                  <span className="h-2.5 w-2.5 rounded-full border border-brand-gold bg-ca-bg-deep" />
                </div>

                {/* Content */}
                <div className="space-y-1">
                  <span className="tech-label">
                    Paso {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-sm font-light leading-relaxed text-ca-text-secondary md:text-base">
                    {step}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          MATERIALS (optional)
         ═══════════════════════════════════ */}
      {data.materials && data.materials.length > 0 && (
        <section ref={materialsRef} className="ca-section">
          <div className="ca-container space-y-8">
            {/* Heading */}
            <div className="space-y-3">
              <span className="ca-kicker block">Materiales</span>
              <div className="ca-rule" />
              <h2 className="font-display text-2xl font-light uppercase tracking-wide text-ca-text md:text-4xl">
                Materiales que utilizamos
              </h2>
            </div>

            {/* Pills */}
            <div className="flex flex-wrap gap-3">
              {data.materials.map((material, i) => (
                <span
                  key={i}
                  className="inline-flex items-center rounded-sm border border-ca-border bg-ca-bg-card px-4 py-2 text-xs font-mono uppercase tracking-widest text-ca-text-secondary transition-colors duration-200 hover:border-brand-gold/40 hover:text-brand-gold"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════
          FAQ
         ═══════════════════════════════════ */}
      <section ref={faqRef} className="ca-section">
        <div className="ca-container max-w-3xl space-y-10">
          {/* Heading */}
          <div className="space-y-3">
            <span className="ca-kicker block">Preguntas frecuentes</span>
            <div className="ca-rule" />
            <h2 className="font-display text-2xl font-light uppercase tracking-wide text-ca-text md:text-4xl">
              Resolvemos tus dudas
            </h2>
          </div>

          {/* Accordion */}
          <div className="border-t border-ca-border">
            {data.faqs.map((faq, i) => (
              <FAQItem
                key={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          CTA
         ═══════════════════════════════════ */}
      <section ref={ctaRef} className="ca-section">
        <div className="ca-container flex flex-col items-center space-y-8 text-center">
          <span className="ca-kicker">¿Listo para empezar?</span>
          <div className="ca-rule mx-auto" />
          <h2 className="font-display text-2xl font-light uppercase tracking-wide text-ca-text md:text-4xl lg:text-5xl">
            Hablemos de tu proyecto
          </h2>
          <p className="max-w-xl text-sm font-light leading-relaxed text-ca-text-secondary md:text-base">
            Conversemos por WhatsApp para entender tu espacio, tus necesidades y
            encontrar la mejor solución.
          </p>

          <a
            href={data.cta.href}
            target="_blank"
            rel="noopener noreferrer"
            className="ca-button group inline-flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>{data.cta.label}</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </section>

      {/* ═══════════════════════════════════
          RELATED SERVICES
         ═══════════════════════════════════ */}
      {relatedInfo.length > 0 && (
        <section ref={relatedRef} className="ca-section border-t border-ca-border">
          <div className="ca-container space-y-10">
            <div className="space-y-3">
              <span className="ca-kicker block">Servicios relacionados</span>
              <div className="ca-rule" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedInfo.map((svc) => (
                <Link
                  key={svc.slug}
                  href={`/servicios/${svc.slug}`}
                  className="glass-card group flex flex-col justify-between gap-4 rounded-sm p-6 transition-colors duration-200"
                >
                  <div className="space-y-2">
                    <span className="tech-label block">{svc.eyebrow}</span>
                    <h3 className="font-display text-lg font-light uppercase tracking-wide text-ca-text group-hover:text-brand-gold transition-colors duration-200">
                      {svc.name}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-brand-gold">
                    <span>Ver servicio</span>
                    <ArrowUpRight
                      className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
