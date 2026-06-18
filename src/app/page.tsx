import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { CinematicWalk } from "@/components/CinematicWalk";
import { CreativeLenses } from "@/components/CreativeLenses";
import { ServicesGallery } from "@/components/ServicesGallery";
import { SceneController } from "@/components/SceneController";
import { HalfRenderReality } from "@/components/HalfRenderReality";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { AboutSection } from "@/components/AboutSection";
import { StatsCounter } from "@/components/StatsCounter";
import { CTAFinal } from "@/components/CTAFinal";

export default function HomePage() {
  return (
    <>
      {/* CAPÍTULO 01: HERO / LA CASA RESPONDE */}
      <HeroSection />

      {/* CAPÍTULO 02: CINEMATIC WALK */}
      <CinematicWalk />

      {/* CAPÍTULO 03: CREATIVE LENSES */}
      <CreativeLenses />

      {/* CAPÍTULO 04: SERVICIOS COMO ESCENAS */}
      <ServicesGallery />

      {/* CAPÍTULO 05: SCENE CONTROLLER INTERACTIVO */}
      <SceneController />

      {/* CAPÍTULO 06: HALF-RENDER / HALF-REALITY */}
      <HalfRenderReality />

      {/* CAPÍTULO 07: CASOS / PROYECTOS */}
      <ProjectsShowcase />

      {/* CAPÍTULO 08: ABOUT / FUNDADORES */}
      <AboutSection />

      {/* CAPÍTULO 09: TELEMETRÍA DEL SISTEMA */}
      <StatsCounter />

      {/* CAPÍTULO 10: CTA FINAL Y CONVERSIÓN */}
      <CTAFinal />
    </>
  );
}
