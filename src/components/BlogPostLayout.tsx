"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { createWhatsAppLink } from "@/constants/contact";
import { BrandText } from "./BrandText";
import { FAQAccordion } from "./FAQAccordion";
import type { BlogPost } from "@/data/blog-posts";
import { blogPosts } from "@/data/blog-posts";

gsap.registerPlugin(ScrollTrigger);

interface BlogPostLayoutProps {
  post: BlogPost;
}

export const BlogPostLayout: React.FC<BlogPostLayoutProps> = ({ post }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Hero elements
      gsap.fromTo(
        ".blog-hero-content",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 }
      );

      // Reading progress bar
      gsap.to("#read-progress-bar", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Article sections scroll reveal
      const sections = containerRef.current?.querySelectorAll(".blog-section");
      if (sections) {
        sections.forEach((section) => {
          gsap.fromTo(
            section,
            { opacity: 0, y: 35 },
            {
              opacity: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            }
          );
        });
      }

      // FAQ section
      gsap.fromTo(
        ".blog-faq",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blog-faq",
            start: "top 85%",
          },
        }
      );

      // Related section
      gsap.fromTo(
        ".blog-related",
        { opacity: 0, y: 25 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: ".blog-related",
            start: "top 85%",
          },
        }
      );

      // CTA section
      gsap.fromTo(
        ".blog-cta",
        { opacity: 0, scale: 0.97 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".blog-cta",
            start: "top 85%",
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Service slug -> display name mapping
  const serviceNames: Record<string, string> = {
    "techos-sol-y-sombra": "Techos sol y sombra",
    "diseno-terrazas": "Diseño de terrazas",
    "smart-homes": "Smart homes",
    "iluminacion-inteligente": "Iluminación inteligente",
    "mantenimiento-general": "Mantenimiento general",
  };

  const whatsAppMessage = `Hola Casa Atenta, acabo de leer su artículo "${post.hero.h1}" y me gustaría más información.`;

  return (
    <div
      ref={containerRef}
      className="bg-ca-bg-deep min-h-screen relative overflow-hidden"
    >
      {/* Reading progress bar */}
      <div
        id="read-progress-bar"
        className="fixed top-0 left-0 h-[3px] bg-ca-gold z-[60] origin-left w-full scale-x-0"
      />

      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      {/* ── HERO ── */}
      <section className="relative z-10 pt-32 pb-20 md:pt-40 md:pb-28">
        {/* Background image overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${post.hero.image})` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-ca-bg-deep/60 via-transparent to-ca-bg-deep" />

        <div className="blog-hero-content relative z-10 max-w-4xl mx-auto px-6 md:px-12">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-[10px] font-mono tracking-[0.25em] text-brand-gold uppercase mb-8 hover:text-brand-gold-light transition-colors duration-300 group"
          >
            <ArrowLeft
              size={12}
              className="transition-transform duration-300 group-hover:-translate-x-1"
            />
            <span>Volver al blog</span>
          </Link>

          {/* Category */}
          <span className="tech-label block mb-4">{post.hero.category}</span>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-light uppercase leading-tight tracking-wide text-brand-light mb-6">
            <BrandText>{post.hero.h1}</BrandText>
          </h1>

          {/* Subtitle */}
          <p className="text-base md:text-lg font-serif italic text-brand-light/60 leading-relaxed max-w-2xl mb-8">
            {post.hero.subtitle}
          </p>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-6 text-[10px] font-mono tracking-widest text-brand-light/35 uppercase">
            <span className="flex items-center gap-1.5">
              <Calendar size={12} className="text-brand-gold/60" />
              {formatDate(post.hero.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-brand-gold/60" />
              {post.hero.readTime} de lectura
            </span>
            <span className="flex items-center gap-1.5">
              <Tag size={12} className="text-brand-gold/60" />
              {post.hero.category}
            </span>
          </div>

          {/* Decorative line */}
          <div className="ca-rule mt-10" />
        </div>
      </section>

      {/* ── ARTICLE BODY ── */}
      <article className="blog-article relative z-10 max-w-3xl mx-auto px-6 md:px-12 pb-20">
        {post.sections.map((section, i) => (
          <div key={i} className="blog-section mb-14">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-brand-light mb-4">
              <BrandText>{section.heading}</BrandText>
            </h2>
            <p className="ca-body">{section.content}</p>
            {section.list && (
              <ul className="mt-5 space-y-3">
                {section.list.map((item, j) => (
                  <li key={j} className="flex items-start gap-3">
                    <span className="text-brand-gold mt-1 shrink-0">▪</span>
                    <span className="text-sm font-light text-brand-light/55 leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </article>

      {/* ── FAQ ── */}
      {post.faqs.length > 0 && (
        <section className="blog-faq relative z-10 border-t border-white/[0.05] py-20">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <span className="tech-label block mb-3">
              Preguntas frecuentes
            </span>
            <h2 className="text-2xl md:text-3xl font-display font-light uppercase tracking-wide text-brand-light mb-8">
              <BrandText>Resuelve tus dudas</BrandText>
            </h2>
            <FAQAccordion items={post.faqs} />
          </div>
        </section>
      )}

      {/* ── RELATED CONTENT ── */}
      <section className="blog-related relative z-10 border-t border-white/[0.05] py-20">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          {/* Related Services */}
          {post.relatedServices.length > 0 && (
            <div className="mb-14">
              <span className="tech-label block mb-4">
                Servicios relacionados
              </span>
              <div className="flex flex-wrap gap-3">
                {post.relatedServices.map((slug) => (
                  <Link
                    key={slug}
                    href={`/soluciones#${slug}`}
                    className="inline-flex items-center gap-2 border border-white/[0.1] bg-white/[0.02] px-4 py-2.5 text-[10px] font-mono uppercase tracking-widest text-brand-light/60 transition-all duration-300 hover:border-brand-gold/40 hover:text-brand-gold hover:bg-brand-gold/[0.04] rounded"
                  >
                    <span>{serviceNames[slug] || slug}</span>
                    <ArrowRight size={10} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Posts */}
          {post.relatedPosts.length > 0 && (
            <div>
              <span className="tech-label block mb-4">
                Artículos relacionados
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {post.relatedPosts.map((slug) => {
                  const related = blogPosts[slug];
                  if (!related) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/blog/${slug}`}
                      className="glass-card p-5 rounded-lg group block"
                    >
                      <span className="text-[9px] font-mono tracking-widest text-brand-gold uppercase block mb-2">
                        {related.hero.category}
                      </span>
                      <h3 className="text-sm font-display font-light text-brand-light uppercase tracking-wide group-hover:text-brand-gold transition-colors duration-300 leading-snug">
                        <BrandText>{related.hero.h1}</BrandText>
                      </h3>
                      <span className="text-[9px] font-mono text-brand-light/30 mt-2 block">
                        {related.hero.readTime} de lectura
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="blog-cta relative z-10 border-t border-white/[0.05] py-24">
        <div className="max-w-3xl mx-auto px-6 md:px-12 text-center">
          <span className="tech-label block mb-4">¿Te interesa?</span>
          <h2 className="text-2xl md:text-4xl font-display font-light uppercase tracking-wide text-brand-light mb-4">
            <BrandText>Hablemos de tu proyecto</BrandText>
          </h2>
          <p className="text-sm font-serif italic text-brand-light/50 mb-8 max-w-xl mx-auto leading-relaxed">
            Cuéntanos qué tienes en mente y te asesoramos sin compromiso.
          </p>
          <a
            href={createWhatsAppLink(whatsAppMessage)}
            target="_blank"
            rel="noopener noreferrer"
            className="ca-button inline-flex items-center gap-2"
          >
            <MessageCircle size={14} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default BlogPostLayout;
