import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  MessageCircle,
  Tag,
} from "lucide-react";
import type { BlogPost } from "@/data/blog-posts";
import { blogPosts } from "@/data/blog-posts";
import {
  BLOG_AUTHOR,
  formatBlogDate,
  getBlogPostUrl,
  getReadingTimeMinutes,
  getSpeechChunks,
  headingId,
} from "@/lib/blog";
import { BLOG_URL, siteUrl } from "@/lib/urls";
import { createWhatsAppLink } from "@/constants/contact";
import { BrandText } from "./BrandText";
import { FAQAccordion } from "./FAQAccordion";
import { ShareToolbar } from "./blog/ShareToolbar";
import { VoiceReader } from "./blog/VoiceReader";

interface BlogPostLayoutProps {
  post: BlogPost;
}

const serviceNames: Record<string, string> = {
  "techos-sol-y-sombra": "Techos sol y sombra",
  "diseno-terrazas": "Diseño de terrazas",
  "smart-homes": "Smart homes",
  "iluminacion-inteligente": "Iluminación inteligente",
  "mantenimiento-general": "Mantenimiento general",
};

export function BlogPostLayout({ post }: BlogPostLayoutProps) {
  const articleUrl = getBlogPostUrl(post.slug);
  const readingMinutes = getReadingTimeMinutes(post);
  const whatsAppMessage = `Hola Casa Atenta, acabo de leer su artículo "${post.hero.h1}" y me gustaría recibir orientación.`;

  return (
    <main className="relative min-h-screen overflow-hidden bg-ca-bg-deep">
      <div className="architectural-grid pointer-events-none absolute inset-0 opacity-[.045]" />

      <header className="relative z-10 border-b border-ca-border/60 px-6 pb-14 pt-32 md:px-10 md:pb-20 md:pt-40">
        <div className="mx-auto max-w-6xl">
          <Link
            href={BLOG_URL}
            className="group inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[.22em] text-brand-gold transition hover:text-brand-gold-light"
          >
            <ArrowLeft size={12} className="transition-transform group-hover:-translate-x-1" />
            Casa Atenta Editorial
          </Link>

          <div className="mt-10 grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_18rem]">
            <div>
              <span className="tech-label block">{post.hero.category}</span>
              <h1 className="mt-5 max-w-5xl font-display text-[clamp(2.6rem,7vw,6.8rem)] font-light uppercase leading-[.94] tracking-[-.02em] text-brand-light">
                <BrandText>{post.hero.h1}</BrandText>
              </h1>
              <p className="mt-7 max-w-3xl font-serif text-xl italic leading-relaxed text-ca-text-secondary md:text-2xl">
                {post.hero.subtitle}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-5 border-t border-ca-border pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0 lg:grid-cols-1">
              <div>
                <dt className="font-mono text-[8px] uppercase tracking-[.18em] text-ca-text-muted">Publicado</dt>
                <dd className="mt-2 flex items-center gap-2 text-xs text-ca-text-secondary">
                  <CalendarDays size={13} className="text-brand-gold" />
                  <time dateTime={post.hero.date}>{formatBlogDate(post.hero.date)}</time>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[8px] uppercase tracking-[.18em] text-ca-text-muted">Lectura</dt>
                <dd className="mt-2 flex items-center gap-2 text-xs text-ca-text-secondary">
                  <Clock3 size={13} className="text-brand-gold" />
                  {readingMinutes} min · {BLOG_AUTHOR.name}
                </dd>
              </div>
            </dl>
          </div>

          <figure className="relative mt-12 aspect-[16/8] min-h-72 overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-primary md:mt-16">
            <Image
              src={post.hero.image}
              alt={post.hero.imageAlt}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 1152px"
              className="object-cover opacity-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/85 via-transparent to-transparent" />
            <figcaption className="absolute bottom-5 left-5 right-5 font-mono text-[8px] uppercase tracking-[.18em] text-white/65 md:bottom-7 md:left-7">
              {post.hero.imageAlt}
            </figcaption>
          </figure>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-6xl px-6 py-12 md:px-10 md:py-16">
        <VoiceReader chunks={getSpeechChunks(post)} />
        <div className="mt-7">
          <span className="mb-3 block font-mono text-[8px] uppercase tracking-[.18em] text-ca-text-muted">
            Comparte esta guía
          </span>
          <ShareToolbar title={post.hero.h1} url={articleUrl} />
        </div>
      </div>

      <div className="relative z-10 mx-auto grid max-w-6xl gap-14 px-6 pb-24 md:px-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-20">
        <article className="blog-prose min-w-0" itemScope itemType="https://schema.org/Article">
          {post.sections.map((section, index) => {
            const id = headingId(section.heading);
            return (
              <section key={id} id={id} className="scroll-mt-28 border-t border-ca-border/60 py-11 first:border-t-0 first:pt-0">
                <div className="mb-5 flex items-baseline gap-4">
                  <span className="font-mono text-[9px] tracking-[.18em] text-brand-gold" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h2 className="font-display text-2xl font-light uppercase leading-tight tracking-wide text-brand-light md:text-3xl">
                    <BrandText>{section.heading}</BrandText>
                  </h2>
                </div>
                <p className="text-[1.05rem] font-light leading-[1.9] text-ca-text-secondary md:text-lg">
                  {section.content}
                </p>
                {section.list && (
                  <ul className="mt-7 grid gap-4">
                    {section.list.map((item) => (
                      <li key={item} className="flex items-start gap-4 rounded-lg border border-ca-border/60 bg-ca-bg-card/45 p-4 text-sm font-light leading-7 text-ca-text-secondary">
                        <span className="mt-[.7rem] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" aria-hidden="true" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </article>

        <aside className="order-first min-w-0 lg:order-none" aria-label="Tabla de contenidos">
          <div className="lg:sticky lg:top-28">
            <span className="font-mono text-[9px] uppercase tracking-[.2em] text-brand-gold">En esta guía</span>
            <nav className="-mx-6 mt-5 flex snap-x gap-2 overflow-x-auto px-6 pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:block lg:overflow-visible lg:border-l lg:border-ca-border lg:px-0 lg:pb-0" aria-label="Contenido del artículo">
              {post.sections.map((section, index) => (
                <a
                  key={section.heading}
                  href={`#${headingId(section.heading)}`}
                  className="block max-w-[78vw] shrink-0 snap-start rounded-full border border-ca-border px-4 py-2.5 text-xs leading-5 text-ca-text-secondary transition hover:border-brand-gold hover:text-brand-gold lg:max-w-none lg:rounded-none lg:border-y-0 lg:border-r-0 lg:border-l-transparent lg:py-2"
                >
                  <span className="mr-2 font-mono text-[8px] text-ca-text-muted">{String(index + 1).padStart(2, "0")}</span>
                  {section.heading}
                </a>
              ))}
            </nav>
            <div className="mt-5 border-t border-ca-border pt-5 lg:mt-8 lg:pt-6">
              <span className="flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.16em] text-ca-text-muted">
                <Tag size={11} /> {post.hero.category}
              </span>
            </div>
          </div>
        </aside>
      </div>

      {post.faqs.length > 0 && (
        <section className="relative z-10 border-y border-ca-border/60 bg-ca-bg-card/35 px-6 py-20 md:px-10">
          <div className="mx-auto max-w-3xl">
            <span className="tech-label">Preguntas frecuentes</span>
            <h2 className="mt-4 font-display text-3xl font-light uppercase tracking-wide text-brand-light md:text-4xl">
              <BrandText>Respuestas directas</BrandText>
            </h2>
            <div className="mt-9">
              <FAQAccordion items={post.faqs} />
            </div>
          </div>
        </section>
      )}

      <section className="relative z-10 px-6 py-20 md:px-10">
        <div className="mx-auto max-w-6xl">
          {post.relatedPosts.length > 0 && (
            <div>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <span className="tech-label">Sigue explorando</span>
                  <h2 className="mt-4 font-display text-3xl font-light uppercase text-brand-light">
                    Lecturas relacionadas
                  </h2>
                </div>
                <Link href={BLOG_URL} className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[.18em] text-brand-gold sm:flex">
                  Ver todas <ArrowRight size={12} />
                </Link>
              </div>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {post.relatedPosts.map((slug) => {
                  const related = blogPosts[slug];
                  if (!related) return null;
                  return (
                    <Link key={slug} href={getBlogPostUrl(slug)} className="group rounded-xl border border-ca-border bg-ca-bg-card/50 p-6 transition hover:-translate-y-1 hover:border-brand-gold/45">
                      <span className="font-mono text-[8px] uppercase tracking-[.18em] text-brand-gold">{related.hero.category}</span>
                      <h3 className="mt-4 font-display text-xl font-light uppercase leading-snug text-brand-light transition group-hover:text-brand-gold">
                        {related.hero.h1}
                      </h3>
                      <span className="mt-5 flex items-center gap-2 text-xs text-ca-text-muted">
                        {getReadingTimeMinutes(related)} min de lectura <ArrowRight size={12} />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {post.relatedServices.length > 0 && (
            <div className="mt-14 border-t border-ca-border pt-9">
              <span className="mb-4 block font-mono text-[8px] uppercase tracking-[.18em] text-ca-text-muted">Servicios relacionados</span>
              <div className="flex flex-wrap gap-2">
                {post.relatedServices.map((slug) => (
                  <Link key={slug} href={siteUrl(`/servicios/${slug}`)} className="rounded-full border border-ca-border px-4 py-2 font-mono text-[8px] uppercase tracking-[.13em] text-ca-text-secondary transition hover:border-brand-gold hover:text-brand-gold">
                    {serviceNames[slug] || slug}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="relative z-10 border-t border-ca-border bg-[#06101b] px-6 py-24 text-center md:px-10">
        <div className="mx-auto max-w-3xl">
          <span className="tech-label">Llévalo a tu espacio</span>
          <h2 className="mt-5 font-display text-4xl font-light uppercase leading-tight text-[#f4f0e8] md:text-5xl">
            <BrandText>Conversemos sobre tu proyecto</BrandText>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#f4f0e8]/55">
            Envíanos una foto y las medidas disponibles. Te indicaremos qué información hace falta para evaluar el alcance.
          </p>
          <a href={createWhatsAppLink(whatsAppMessage)} target="_blank" rel="noopener noreferrer" className="ca-button mt-8">
            <MessageCircle size={14} /> Consultar por WhatsApp
          </a>
          <div className="mt-10 flex justify-center">
            <ShareToolbar title={post.hero.h1} url={articleUrl} compact />
          </div>
        </div>
      </section>
    </main>
  );
}

export default BlogPostLayout;
