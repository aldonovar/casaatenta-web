import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3, Rss } from "lucide-react";
import { allBlogSlugs, blogPosts } from "@/data/blog-posts";
import {
  formatBlogDate,
  getBlogPostUrl,
  getReadingTimeMinutes,
  safeJsonLd,
} from "@/lib/blog";
import { BLOG_URL } from "@/lib/urls";
import { BrandText } from "@/components/BrandText";

const posts = allBlogSlugs
  .map((slug) => blogPosts[slug])
  .sort(
    (a, b) =>
      new Date(b.hero.date).getTime() - new Date(a.hero.date).getTime(),
  );

export default function BlogIndexPage() {
  const [featured, ...remainingPosts] = posts;
  const categories = [...new Set(posts.map((post) => post.hero.category))];
  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${BLOG_URL}/#blog`,
    url: BLOG_URL,
    name: "Casa Atenta Editorial",
    description:
      "Guías técnicas sobre terrazas, cubiertas, iluminación y automatización residencial.",
    inLanguage: "es-PE",
    publisher: {
      "@type": "Organization",
      name: "Casa Atenta",
      url: "https://www.casa-atenta.com",
    },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.hero.h1,
      url: getBlogPostUrl(post.slug),
      datePublished: post.hero.date,
      articleSection: post.hero.category,
    })),
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-ca-bg-deep pb-24 pt-32 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(blogJsonLd) }}
      />
      <div className="architectural-grid pointer-events-none absolute inset-0 opacity-[.045]" />

      <section className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid gap-10 border-b border-ca-border pb-14 lg:grid-cols-[1fr_22rem] lg:items-end">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[.24em] text-brand-gold">
              Casa Atenta / Editorial
            </span>
            <h1 className="mt-6 max-w-5xl font-display text-[clamp(3.4rem,9vw,8.6rem)] font-light uppercase leading-[.86] tracking-[-.035em] text-brand-light">
              <BrandText>Ideas para un hogar que responde.</BrandText>
            </h1>
          </div>
          <div className="lg:border-l lg:border-ca-border lg:pl-8">
            <p className="font-serif text-xl italic leading-relaxed text-ca-text-secondary">
              Criterios de diseño, decisiones técnicas y guías claras para terrazas, cubiertas, iluminación y automatización residencial.
            </p>
            <Link
              href={`${BLOG_URL}/feed.xml`}
              className="mt-6 inline-flex items-center gap-2 font-mono text-[8px] uppercase tracking-[.18em] text-brand-gold"
            >
              <Rss size={12} /> Suscribirse por RSS
            </Link>
          </div>
        </div>

        <nav className="flex flex-wrap gap-2 py-7" aria-label="Temas del blog">
          {categories.map((category) => (
            <span key={category} className="rounded-full border border-ca-border px-4 py-2 font-mono text-[8px] uppercase tracking-[.14em] text-ca-text-secondary">
              {category}
            </span>
          ))}
        </nav>

        {featured && (
          <article className="group grid overflow-hidden rounded-2xl border border-ca-border bg-ca-bg-card/55 lg:grid-cols-[1.15fr_.85fr]">
            <Link href={getBlogPostUrl(featured.slug)} className="relative min-h-80 overflow-hidden lg:min-h-[32rem]" aria-label={`Leer ${featured.hero.h1}`}>
              <Image
                src={featured.hero.image}
                alt={featured.hero.imageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover opacity-80 transition duration-700 group-hover:scale-[1.025]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07111d]/70 via-transparent to-transparent" />
              <span className="absolute left-5 top-5 rounded-full border border-white/20 bg-[#07111d]/65 px-4 py-2 font-mono text-[8px] uppercase tracking-[.16em] text-[#f4f0e8] backdrop-blur-md">
                Lectura destacada
              </span>
            </Link>
            <div className="flex flex-col justify-between p-7 md:p-10 lg:p-12">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-[.2em] text-brand-gold">{featured.hero.category}</span>
                <h2 className="mt-5 font-display text-3xl font-light uppercase leading-[1.02] text-brand-light md:text-4xl">
                  <Link href={getBlogPostUrl(featured.slug)}>{featured.hero.h1}</Link>
                </h2>
                <p className="mt-6 text-sm font-light leading-7 text-ca-text-secondary">{featured.hero.subtitle}</p>
              </div>
              <div className="mt-10 border-t border-ca-border pt-6">
                <div className="flex flex-wrap items-center gap-5 text-[9px] text-ca-text-muted">
                  <span className="flex items-center gap-2"><CalendarDays size={12} className="text-brand-gold" />{formatBlogDate(featured.hero.date)}</span>
                  <span className="flex items-center gap-2"><Clock3 size={12} className="text-brand-gold" />{getReadingTimeMinutes(featured)} min</span>
                </div>
                <Link href={getBlogPostUrl(featured.slug)} className="mt-7 inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.18em] text-brand-gold">
                  Leer guía completa <ArrowRight size={13} className="transition group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </article>
        )}

        <div className="mt-14 flex items-end justify-between gap-6">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[.22em] text-brand-gold">Biblioteca</span>
            <h2 className="mt-4 font-display text-3xl font-light uppercase text-brand-light md:text-4xl">Guías recientes</h2>
          </div>
          <span className="font-mono text-[8px] uppercase tracking-[.16em] text-ca-text-muted">{posts.length} publicaciones</span>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {remainingPosts.map((post) => (
            <article key={post.slug} className="group flex min-h-full flex-col overflow-hidden rounded-xl border border-ca-border bg-ca-bg-card/45 transition hover:-translate-y-1 hover:border-brand-gold/40">
              <Link href={getBlogPostUrl(post.slug)} className="relative aspect-[16/9] overflow-hidden">
                <Image src={post.hero.image} alt={post.hero.imageAlt} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover opacity-65 transition duration-700 group-hover:scale-[1.03] group-hover:opacity-80" />
              </Link>
              <div className="flex flex-1 flex-col p-6">
                <span className="font-mono text-[8px] uppercase tracking-[.18em] text-brand-gold">{post.hero.category}</span>
                <h3 className="mt-4 font-display text-xl font-light uppercase leading-snug text-brand-light transition group-hover:text-brand-gold">
                  <Link href={getBlogPostUrl(post.slug)}>{post.hero.h1}</Link>
                </h3>
                <p className="mt-4 line-clamp-3 text-xs font-light leading-6 text-ca-text-secondary">{post.hero.subtitle}</p>
                <div className="mt-auto flex items-center justify-between border-t border-ca-border pt-5 text-[8px] text-ca-text-muted">
                  <time dateTime={post.hero.date}>{formatBlogDate(post.hero.date)}</time>
                  <span>{getReadingTimeMinutes(post)} min</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
