"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";
import { allBlogSlugs, blogPosts } from "@/data/blog-posts";

gsap.registerPlugin(ScrollTrigger);

export default function BlogIndexPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".blog-card",
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".blog-grid",
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

  // Sort posts by date, newest first
  const sortedSlugs = [...allBlogSlugs].sort((a, b) => {
    const dateA = new Date(blogPosts[a].hero.date);
    const dateB = new Date(blogPosts[b].hero.date);
    return dateB.getTime() - dateA.getTime();
  });

  return (
    <div
      ref={containerRef}
      className="bg-ca-bg-deep min-h-screen pt-36 pb-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />

      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        {/* Header */}
        <div className="mb-20">
          <SectionHeading
            number="—"
            label="Blog"
            title="Ideas, guías y tendencias"
            subtitle="Contenido práctico sobre diseño residencial, terrazas, domótica y automatización para tu hogar en Lima."
          />
        </div>

        {/* Blog Grid */}
        <div className="blog-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedSlugs.map((slug) => {
            const post = blogPosts[slug];
            return (
              <Link
                key={slug}
                href={`/blog/${slug}`}
                className="blog-card glass-card p-7 rounded-lg group flex flex-col justify-between"
              >
                {/* Category */}
                <div>
                  <span className="text-[9px] font-mono tracking-widest text-brand-gold uppercase block mb-3">
                    {post.hero.category}
                  </span>

                  {/* Title */}
                  <h2 className="text-base md:text-lg font-display font-light uppercase tracking-wide text-brand-light leading-snug mb-3 group-hover:text-brand-gold transition-colors duration-300">
                    <BrandText>{post.hero.h1}</BrandText>
                  </h2>

                  {/* Subtitle */}
                  <p className="text-xs font-light text-brand-light/45 leading-relaxed mb-6 line-clamp-3">
                    {post.hero.subtitle}
                  </p>
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.05] pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-[9px] font-mono tracking-widest text-brand-light/30 uppercase">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} className="text-brand-gold/50" />
                      {formatDate(post.hero.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={10} className="text-brand-gold/50" />
                      {post.hero.readTime}
                    </span>
                  </div>
                  <ArrowRight
                    size={14}
                    className="text-brand-light/20 group-hover:text-brand-gold group-hover:translate-x-1 transition-all duration-300"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
