"use client";

import Image from "next/image";
import React, { useState } from "react";
import { homeCopy, sceneModes } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

const modeImages: Record<string, { src: string; alt: string; label: string }> = {
  dia: {
    src: "/media/cinematic-walk/entrada-01.png",
    alt: "Referencia visual de terraza durante el día.",
    label: "REFERENCIA VISUAL",
  },
  tarde: {
    src: "/media/cinematic-walk/terraza-02.png",
    alt: "Propuesta visual de terraza con apertura parcial al final de la tarde.",
    label: "PROPUESTA VISUAL",
  },
  noche: {
    src: "/media/cinematic-walk/luz-03.png",
    alt: "Propuesta visual de iluminación cálida para uso nocturno.",
    label: "PROPUESTA VISUAL",
  },
  seguridad: {
    src: "/media/cinematic-walk/escena-04.png",
    alt: "Composición conceptual de iluminación de paso y seguridad.",
    label: "COMPOSICIÓN CONCEPTUAL",
  },
};

export const SceneController: React.FC = () => {
  const [activeMode, setActiveMode] = useState(sceneModes[0]);
  const visual = modeImages[activeMode.id];

  return (
    <section
      id="scene-controller"
      className="relative z-20 overflow-hidden border-t border-ca-border bg-ca-bg-deep px-6 py-28 md:px-16 md:py-36 lg:px-28"
    >
      <div className="pointer-events-none absolute inset-0 opacity-5 cad-technical-grid" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-20">
          <SectionHeading
            number="05"
            label={homeCopy.controller.label}
            title={homeCopy.controller.title}
            subtitle={homeCopy.controller.subtitle}
          />
        </div>

        <div className="grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12">
          <div className="relative min-h-[480px] overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-surface shadow-2xl lg:col-span-7">
            <Image
              key={visual.src}
              src={visual.src}
              alt={visual.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover opacity-58 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/20 to-transparent" />
            <div
              className="absolute inset-0 mix-blend-color transition-colors duration-700"
              style={{ backgroundColor: activeMode.color }}
            />
            <div className="pointer-events-none absolute inset-6 border border-white/[0.04]">
              <span className="absolute -left-px -top-px h-3 w-3 border-l border-t border-brand-gold/50" />
              <span className="absolute -bottom-px -right-px h-3 w-3 border-b border-r border-brand-gold/50" />
            </div>

            <span className="absolute left-6 top-6 z-10 border border-white/10 bg-ca-bg-deep/80 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
              {visual.label}
            </span>

            <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-10">
              <span className="mb-3 block text-[9px] font-mono uppercase tracking-[0.22em] text-brand-gold">
                CONFIGURACIÓN / {activeMode.label}
              </span>
              <h3 className="max-w-xl text-2xl font-display font-light uppercase tracking-[0.06em] text-ca-text md:text-4xl">
                <BrandText>{activeMode.title}</BrandText>
              </h3>
            </div>
          </div>

          <div className="flex flex-col justify-between gap-10 rounded-2xl border border-ca-border bg-ca-bg-surface/20 p-7 shadow-2xl md:p-10 lg:col-span-5">
            <div>
              <div className="mb-6 flex items-center justify-between border-b border-ca-border/40 pb-4">
                <h4 className="text-[10px] font-mono uppercase tracking-[0.2em] text-ca-text">
                  Configuraciones de uso
                </h4>
                <span className="border border-brand-gold/20 px-2 py-1 text-[8px] font-mono uppercase tracking-[0.16em] text-brand-gold">
                  Referencial
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {sceneModes.map((mode) => (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => setActiveMode(mode)}
                    className={`flex items-center justify-between rounded border px-4 py-3 text-left text-[9px] font-mono uppercase tracking-[0.16em] transition ${
                      activeMode.id === mode.id
                        ? "border-brand-gold bg-brand-gold/5 text-brand-gold"
                        : "border-ca-border/45 text-ca-text/50 hover:border-ca-text/40 hover:text-ca-text"
                    }`}
                    aria-pressed={activeMode.id === mode.id}
                  >
                    <span>{mode.label}</span>
                    <span className={`h-1.5 w-1.5 rounded-full ${activeMode.id === mode.id ? "bg-brand-gold" : "bg-ca-text/20"}`} />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-sm font-light leading-relaxed text-ca-text-secondary">
                {activeMode.text}
              </p>

              <dl className="space-y-3 rounded-xl border border-ca-border/40 bg-ca-bg-deep/45 p-5 text-[9px] font-mono uppercase tracking-[0.13em] text-ca-text-secondary">
                <div className="flex items-start justify-between gap-5 border-b border-ca-border/30 pb-3">
                  <dt>Cubierta</dt>
                  <dd className="max-w-[58%] text-right text-ca-text">{activeMode.temp}</dd>
                </div>
                <div className="flex items-start justify-between gap-5 border-b border-ca-border/30 pb-3">
                  <dt>Iluminación</dt>
                  <dd className="max-w-[58%] text-right text-ca-text">{activeMode.lux}</dd>
                </div>
                <div className="flex items-start justify-between gap-5">
                  <dt>Accionamiento</dt>
                  <dd className="max-w-[58%] text-right text-ca-text">{activeMode.audio}</dd>
                </div>
              </dl>

              <p className="text-[10px] leading-relaxed text-ca-text/45">
                La configuración final depende de medidas, orientación, puntos eléctricos y sistema de apertura disponible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SceneController;
