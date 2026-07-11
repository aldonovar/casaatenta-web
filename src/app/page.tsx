import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { CinematicWalk } from "@/components/CinematicWalk";
import { CreativeLenses } from "@/components/CreativeLenses";
import { ServicesGallery } from "@/components/ServicesGallery";
import { SceneController } from "@/components/SceneController";
import { HalfRenderReality } from "@/components/HalfRenderReality";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { ProcesoSection } from "@/components/ProcesoSection";
import { AboutSection } from "@/components/AboutSection";
import { CotizaFormSection } from "@/components/CotizaFormSection";
import { CTAFinal } from "@/components/CTAFinal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CinematicWalk />
      <CreativeLenses />
      <ServicesGallery />
      <SceneController />
      <HalfRenderReality />
      <ProjectsShowcase />
      <ProcesoSection />
      <AboutSection />
      <CotizaFormSection />
      <CTAFinal />
    </>
  );
}
