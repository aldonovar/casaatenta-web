import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { ManifestoSection } from "@/components/ManifestoSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { HogarAtentoSection } from "@/components/HogarAtentoSection";
import { ServiciosGridSection } from "@/components/ServiciosGridSection";
import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import { ProcesoSection } from "@/components/ProcesoSection";
import { TecnologiaSection } from "@/components/TecnologiaSection";
import { ConfianzaSection } from "@/components/ConfianzaSection";
import { CotizaFormSection } from "@/components/CotizaFormSection";
import { StatsCounter } from "@/components/StatsCounter";
import { CTAFinal } from "@/components/CTAFinal";

export default function HomePage() {
  return (
    <>
      {/* CAPÍTULO 01: HERO / LA CASA RESPONDE */}
      <HeroSection />

      {/* CAPÍTULO 02: MANIFIESTO DE MARCA */}
      <ManifestoSection />

      {/* CAPÍTULO 03: FILOSOFÍA / LO QUE HACEMOS */}
      <PhilosophySection />

      {/* CAPÍTULO 04: EL HOGAR ATENTO (SCROLLYTELLING + WHATSAPP) */}
      <HogarAtentoSection />

      {/* CAPÍTULO 05: SERVICIOS GRID (CATEGORÍAS Y DETALLES) */}
      <ServiciosGridSection />

      {/* CAPÍTULO 06: COMPARATIVA ANTES / DESPUÉS */}
      <section className="ca-section bg-ca-bg-surface overflow-hidden relative" id="comparacion">
        <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />
        <div className="ca-container relative z-10 space-y-12">
          <div className="text-center">
            <span className="ca-kicker mb-4 block">Transformación</span>
            <h2 className="ca-heading mx-auto max-w-3xl mb-6">
              El impacto del diseño.
              <br />
              <span className="font-serif italic text-brand-gold">Antes y después.</span>
            </h2>
            <p className="ca-body mx-auto text-center max-w-2xl">
              Arrastra el control central para comparar el estado original de una terraza frente a la simulación y diseño proyectado por Casa Atenta.
            </p>
          </div>
          <BeforeAfterSlider
            beforeImage="/media/cases/terraza-inteligente/before.png"
            afterImage="/media/cases/terraza-inteligente/after.png"
            beforeLabel="Estado Original"
            afterLabel="Resultado Casa Atenta"
          />
        </div>
      </section>

      {/* CAPÍTULO 07: PROCESO TIMELINE DE TRABAJO */}
      <ProcesoSection />

      {/* CAPÍTULO 08: TRANSPARENCIA Y COMPATIBILIDAD TECNOLÓGICA */}
      <TecnologiaSection />

      {/* CAPÍTULO 09: SEÑALES DE CONFIANZA Y GARANTÍA */}
      <ConfianzaSection />

      {/* CAPÍTULO 10: FORMULARIO CALIFICADO DE COTIZACIÓN */}
      <CotizaFormSection />

      {/* CAPÍTULO 11: TELEMETRÍA DEL SISTEMA */}
      <StatsCounter />

      {/* CAPÍTULO 12: CTA FINAL Y ENLACES */}
      <CTAFinal />
    </>
  );
}
