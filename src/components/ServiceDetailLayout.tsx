import Link from "next/link";
import type { ServicePageData } from "@/data/services-pages";
import { BrandText } from "./BrandText";
import { ServiceMotionExperience } from "./ServiceMotionExperience";
import { ServiceMotionGraphics } from "./ServiceMotionGraphics";
import { ZenitPageHero } from "./ZenitPageHero";

type ServiceDetailLayoutProps = {
  data: ServicePageData;
};

export default function ServiceDetailLayout({
  data,
}: ServiceDetailLayoutProps) {
  return (
    <main className="min-h-screen bg-transparent text-ca-text">
      <ZenitPageHero
        number="S1"
        eyebrow={data.hero.eyebrow}
        title={data.hero.h1}
        description={data.hero.subtitle}
        variant="service"
        action={{ label: data.cta.label, href: data.cta.href, external: true }}
        secondary={{ label: "Todos los servicios", href: "/servicios" }}
        meta={["Levantamiento", "Propuesta", "Materiales", "Instalación"]}
      />

      <section className="relative px-6 py-24 lg:px-10">
        <div className="architectural-grid absolute inset-0 opacity-[0.05]" />
        <div className="relative mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand-gold">
              Alcance
            </span>
            <p className="mt-6 text-lg font-light leading-8 text-ca-text-secondary">
              {data.intro}
            </p>
            <div className="mt-10 glass-panel p-4 sm:p-6">
              <ServiceMotionGraphics
                slug={data.slug}
                className="mx-auto max-w-[520px]"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:col-span-7">
            {data.benefits.map((benefit, index) => (
              <article
                key={benefit.title}
                className="glass-card min-h-[240px] p-7"
              >
                <span className="font-mono text-[9px] text-brand-gold">
                  0{index + 1}
                </span>
                <h2 className="mt-8 font-display text-xl font-light uppercase">
                  <BrandText>{benefit.title}</BrandText>
                </h2>
                <p className="mt-4 text-sm leading-7 text-ca-text-secondary">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ServiceMotionExperience slug={data.slug} />

      <section className="border-y border-ca-border bg-ca-bg-surface/65 px-6 py-24 backdrop-blur-xl lg:px-10">
        <div className="mx-auto grid max-w-[1440px] gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand-gold">
              Proceso
            </span>
            <h2 className="mt-6 font-display text-4xl font-light uppercase md:text-5xl">
              <BrandText>{data.process.title}</BrandText>
            </h2>
          </div>
          <ol className="lg:col-span-7">
            {data.process.steps.map((step, index) => (
              <li
                key={step}
                className="grid grid-cols-[48px_1fr] border-t border-ca-border py-5 text-sm leading-7 text-ca-text-secondary"
              >
                <span className="font-mono text-brand-gold">0{index + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {data.materials?.length ? (
        <section className="px-6 py-20 lg:px-10">
          <div className="mx-auto max-w-[1440px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand-gold">
              Materiales y componentes
            </span>
            <div className="mt-7 flex flex-wrap gap-3">
              {data.materials.map((material) => (
                <span
                  key={material}
                  className="glass-card px-4 py-3 font-mono text-[9px] uppercase tracking-[0.16em] text-ca-text-secondary"
                >
                  {material}
                </span>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="border-t border-ca-border px-6 py-24 lg:px-10">
        <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.26em] text-brand-gold">
              Preguntas frecuentes
            </span>
            <h2 className="mt-6 font-display text-4xl font-light uppercase">
              <BrandText>Datos antes de decidir.</BrandText>
            </h2>
          </div>
          <div className="lg:col-span-8">
            {data.faqs.map((faq, index) => (
              <details
                key={faq.question}
                className="group border-t border-ca-border py-5"
              >
                <summary className="cursor-pointer list-none text-sm uppercase tracking-[0.08em]">
                  <span className="mr-4 font-mono text-brand-gold">
                    0{index + 1}
                  </span>
                  {faq.question}
                </summary>
                <p className="mt-4 max-w-3xl pl-10 text-sm leading-7 text-ca-text-secondary">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-16 flex max-w-[1440px] flex-wrap gap-4 border-t border-ca-border pt-8">
          <Link
            href="/servicios"
            className="inline-flex min-h-12 items-center border border-ca-border bg-ca-glass-bg/35 px-6 font-mono text-[10px] uppercase tracking-[0.2em] backdrop-blur-xl"
          >
            Todos los servicios ↗
          </Link>
          <Link
            href="/contacto"
            className="inline-flex min-h-12 items-center bg-brand-gold px-6 font-mono text-[10px] font-semibold uppercase tracking-[0.2em] text-[#07111d]"
          >
            Evaluar mi espacio ↗
          </Link>
        </div>
      </section>
    </main>
  );
}
