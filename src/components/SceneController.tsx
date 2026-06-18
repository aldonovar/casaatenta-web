"use client";

import React, { useState } from "react";
import { sceneModes, homeCopy } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

export const SceneController: React.FC = () => {
  const [activeMode, setActiveMode] = useState(sceneModes[0]);

  // Images mapping to reflect each mode visually
  const modeImages: { [key: string]: string } = {
    dia: "/media/cinematic-walk/entrada-01.png",
    tarde: "/media/cinematic-walk/terraza-02.png",
    noche: "/media/cinematic-walk/luz-03.png",
    seguridad: "/media/cinematic-walk/escena-04.png",
  };

  return (
    <section
      id="scene-controller"
      className="relative z-20 overflow-hidden bg-ca-bg-deep px-6 py-28 md:px-16 md:py-36 lg:px-28 border-t border-ca-border"
    >
      <div className="absolute inset-0 z-0 opacity-5 cad-technical-grid pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20">
          <SectionHeading
            number="05"
            label={homeCopy.controller.label}
            title={homeCopy.controller.title}
            subtitle={homeCopy.controller.subtitle}
          />
        </div>

        {/* Interactive layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          
          {/* Visual Canvas Simulator */}
          <div className="lg:col-span-7 relative min-h-[45vh] lg:min-h-0 border border-ca-border rounded-2xl overflow-hidden bg-ca-bg-surface flex items-end p-6 md:p-10 shadow-2xl">
            {/* Base Image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out scale-102"
              style={{
                backgroundImage: `url(${modeImages[activeMode.id]})`,
              }}
            />

            {/* Tint overlay matching active mode */}
            <div
              className="absolute inset-0 transition-colors duration-1000 mix-blend-color"
              style={{ backgroundColor: activeMode.color }}
            />
            {/* Deep darkness mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-transparent to-transparent opacity-85" />

            {/* Corner CAD Ticks */}
            <div className="absolute inset-6 border border-white/[0.03] pointer-events-none">
              <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-brand-gold/40" />
              <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-brand-gold/40" />
            </div>

            {/* Live Indicator */}
            <div className="relative z-10 font-mono text-[9px] text-white/40 flex items-center space-x-2 select-none uppercase tracking-widest bg-ca-bg-deep/80 px-4 py-2 border border-ca-border rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-ping" />
              <span>Simulación Atmosférica // Escena Activa: {activeMode.label}</span>
            </div>
          </div>

          {/* Controller Panel */}
          <div className="lg:col-span-5 flex flex-col justify-between border border-ca-border rounded-2xl bg-ca-bg-surface/20 p-8 md:p-12 shadow-2xl gap-10">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-ca-border/40 pb-4">
                <h4 className="text-xs font-mono tracking-widest text-ca-text uppercase">
                  Telemetría Casa Atenta
                </h4>
                <span className="font-mono text-[8px] text-brand-gold uppercase tracking-widest border border-brand-gold/20 px-2 py-0.5 font-bold">
                  SYS-OS
                </span>
              </div>

              {/* Mode Buttons */}
              <div className="grid grid-cols-2 gap-3">
                {sceneModes.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setActiveMode(mode)}
                    className={`py-3 px-4 text-left text-[10px] tracking-wider uppercase font-mono border transition-all duration-350 flex justify-between items-center cursor-pointer rounded ${
                      activeMode.id === mode.id
                        ? "border-brand-gold text-brand-gold bg-brand-gold/5 shadow-lg"
                        : "border-ca-border/40 text-brand-light/40 hover:border-ca-text/30 hover:text-ca-text"
                    }`}
                  >
                    <span>{mode.label}</span>
                    {activeMode.id === mode.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Stats Feedback */}
            <div className="space-y-6">
              <div className="space-y-2.5">
                <h3 className="text-xl md:text-2xl font-display font-light uppercase tracking-widest text-ca-text">
                  <BrandText>{activeMode.title}</BrandText>
                </h3>
                <p className="text-xs font-sans font-light text-ca-text-secondary leading-relaxed">
                  {activeMode.text}
                </p>
              </div>

              <div className="bg-ca-bg-deep/50 border border-ca-border/40 p-5 font-mono text-[10px] text-brand-light/75 tracking-wider space-y-3 rounded">
                <div className="flex justify-between items-center text-brand-gold border-b border-ca-border/30 pb-2 font-sans tracking-[0.15em] uppercase font-bold">
                  <span>Datos de Escena</span>
                  <span>SYS-{activeMode.id.toUpperCase()}-01</span>
                </div>
                <div className="flex justify-between">
                  <span>Temperatura Clima:</span>
                  <span className="text-brand-light font-semibold">{activeMode.temp}</span>
                </div>
                <div className="flex justify-between">
                  <span>Intensidad Lumínica:</span>
                  <span className="text-brand-light font-semibold">{activeMode.lux}</span>
                </div>
                <div className="flex justify-between">
                  <span>Modo de Audio:</span>
                  <span className="text-brand-light font-semibold uppercase">{activeMode.audio}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default SceneController;
