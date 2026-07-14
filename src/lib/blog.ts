import type { BlogPost } from "@/data/blog-posts";
import { blogUrl, siteUrl } from "@/lib/urls";

export const BLOG_AUTHOR = {
  name: "Equipo Casa Atenta",
  url: siteUrl("/nosotros"),
} as const;

export function getBlogPostUrl(slug: string) {
  return blogUrl(`/${slug}`);
}

export function getReadingTimeMinutes(post: BlogPost) {
  const words = [
    post.hero.h1,
    post.hero.subtitle,
    ...post.sections.flatMap((section) => [
      section.heading,
      section.content,
      ...(section.list || []),
    ]),
    ...post.faqs.flatMap((faq) => [faq.question, faq.answer]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;

  return Math.max(1, Math.ceil(words / 210));
}

export function getWordCount(post: BlogPost) {
  return [
    post.hero.h1,
    post.hero.subtitle,
    ...post.sections.flatMap((section) => [
      section.heading,
      section.content,
      ...(section.list || []),
    ]),
  ]
    .join(" ")
    .trim()
    .split(/\s+/).length;
}

export function getSpeechChunks(post: BlogPost) {
  return [
    `${post.hero.h1}. ${post.hero.subtitle}`,
    ...post.sections.map((section) =>
      [section.heading, section.content, ...(section.list || [])].join(". "),
    ),
  ];
}

export function headingId(heading: string) {
  return heading
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatBlogDate(date: string) {
  return new Intl.DateTimeFormat("es-PE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function safeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
