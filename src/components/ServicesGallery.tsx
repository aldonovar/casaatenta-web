"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeCopy, servicesData } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";
import { ServiceMotionGraphics } from "./ServiceMotionGraphics";
import { WHATSAPP_LINK } from "@/constants/contact";

gsap.registerPlugin(ScrollTrigger);

export const ServicesGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const media = gsap.matchMedia();

    media.add("(min-width: 1024px)", () => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: container,
          pin: true,
          scrub: 0.85,
          start: "top top",
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
        },
      });

      gsap.fromTo(
        ".services-progress-bar",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.85,
          },
        },
      );

      return () => tween.kill();
    });

    media.add("(max-width: 1023px)", () => gsap.set(track, { x: 0 }));
    return () => media.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      id="servicios"
      className="relative w-full border-t border-ca-border bg-ca-bg-surface"
    >
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-32 md:px-16 lg:px-28">
        <SectionHeading
          number="04"
          label={homeCopy.services.label}
          title={homeCopy.services.title}
          subtitle={homeCopy.services.subtitle}
        />
      </div>

      <div className="relative w-full overflow-hidden">
        <div
          ref={trackRef}
          className="flex w-full flex-col lg:w-max lg:flex-row"
        >
          {servicesData.map((service, index) => (
            <section
              key={service.id}
              className="service-panel flex min-h-[760px] w-full flex-col items-center gap-12 border-b border-ca-border px-6 py-16 md:px-16 lg:h-[82vh] lg:min-h-[720px] lg:w-screen lg:flex-row lg:gap-20 lg:border-b-0 lg:px-28 lg:py-0"
            >
              <div className="group relative h-[48vh] min-h-[360px] w-full overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-deep shadow-2xl lg:h-[84%] lg:w-7/12">
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-cover opacity-38 transition duration-700 ease-out group-hover:scale-[1.025] group-hover:opacity-24"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ca-bg-deep via-ca-bg-deep/30 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
                  <ServiceMotionGraphics slug={service.motionSlug} decorative />
                </div>

                <span className="absolute left-5 top-5 z-10 border border-white/10 bg-ca-bg-deep/80 px-3 py-2 text-[8px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
                  {service.visualLabel}
                </span>
                <span className="absolute bottom-5 left-5 z-10 border border-ca-border bg-ca-bg-deep/80 px-4 py-2 text-[9px] font-mono uppercase tracking-[0.18em] text-ca-text backdrop-blur-md">
                  SERVICIO 0{index + 1}
                </span>
              </div>

              <div className="flex w-full flex-col items-start justify-center space-y-7 lg:w-5/12">
                <div className="flex w-full items-center justify-between border-b border-ca-border/40 pb-4">
                  <span className="text-[9px] font-mono uppercase tracking-[0.24em] text-ca-text/60">
                    CASA ATENTA / {service.title}
                  </span>
                  <span className="text-[10px] font-mono text-ca-text-secondary">
                    0{index + 1} / 0{servicesData.length}
                  </span>
                </div>

                <h3 className="text-3xl font-display font-light uppercase tracking-[0.05em] text-ca-text md:text-5xl">
                  <BrandText>{service.title}</BrandText>
                </h3>

                <p className="max-w-xl text-sm font-light leading-relaxed text-ca-text-secondary md:text-base">
                  {service.text}
                </p>

                <ul className="grid w-full grid-cols-1 gap-3 pt-1 sm:grid-cols-2">
                  {service.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 text-[9px] font-mono uppercase tracking-[0.14em] text-ca-text/80 sm:text-[10px]"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={service.href || WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 border-b border-ca-text/30 pb-2 pt-3 text-[10px] font-mono uppercase tracking-[0.22em] text-ca-text transition hover:border-ca-text"
                >
                  <BrandText>{service.cta}</BrandText>
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 z-20 hidden h-[2px] bg-ca-border/20 lg:block">
        <div className="services-progress-bar h-full w-full origin-left bg-brand-gold" />
      </div>
    </div>
  );
};

export default ServicesGallery;
