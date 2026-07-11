import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { ServiciosGridSection } from "@/components/ServiciosGridSection";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { ProcesoSection } from "@/components/ProcesoSection";
import { AboutSection } from "@/components/AboutSection";
import { CotizaFormSection } from "@/components/CotizaFormSection";
import { CTAFinal } from "@/components/CTAFinal";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServiciosGridSection />
      <ProjectsShowcase />
      <ProcesoSection />
      <AboutSection />
      <CotizaFormSection />
      <CTAFinal />
    </>
  );
}
