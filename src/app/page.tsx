import React from "react";
import { HeroSection } from "@/components/HeroSection";
import { PhilosophySection } from "@/components/PhilosophySection";
import { ServicesGallery } from "@/components/ServicesGallery";
import { ProjectsShowcase } from "@/components/ProjectsShowcase";
import { ProcessTimeline } from "@/components/ProcessTimeline";
import { StatsCounter } from "@/components/StatsCounter";
import { CTAFinal } from "@/components/CTAFinal";

export default function HomePage() {
  return (
    <>
      {/* Immersive cinematic introductory hero */}
      <HeroSection />

      {/* Brand philosophy scroll-driven pinned layout */}
      <PhilosophySection />

      {/* Horizontal scroll business lines presentation */}
      <ServicesGallery />

      {/* Modern bento project masonry grid */}
      <ProjectsShowcase />

      {/* SVG vertical drawing timeline */}
      <ProcessTimeline />

      {/* Numerical count increments counters section */}
      <StatsCounter />

      {/* Conversion CTA layout */}
      <CTAFinal />
    </>
  );
}
