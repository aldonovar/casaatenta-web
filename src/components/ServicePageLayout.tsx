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
