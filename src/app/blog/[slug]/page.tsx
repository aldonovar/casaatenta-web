import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostLayout } from "@/components/BlogPostLayout";
import { allBlogSlugs, getBlogPost } from "@/data/blog-posts";
import {
  BLOG_AUTHOR,
  getBlogPostUrl,
  getReadingTimeMinutes,
  getWordCount,
  safeJsonLd,
} from "@/lib/blog";
import { blogUrl, siteUrl } from "@/lib/urls";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return allBlogSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  const url = getBlogPostUrl(slug);
  const socialImage = blogUrl(`/${slug}/opengraph-image`);

  return {
    title: post.seo.title.replace(/\s*\|\s*Casa Atenta\s*$/i, ""),
    description: post.seo.description,
    keywords: post.seo.keywords,
    authors: [{ name: BLOG_AUTHOR.name, url: BLOG_AUTHOR.url }],
    category: post.hero.category,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      locale: "es_PE",
      url,
      siteName: "Casa Atenta Editorial",
      title: post.hero.h1,
      description: post.seo.description,
      publishedTime: `${post.hero.date}T08:00:00-05:00`,
      modifiedTime: `${post.hero.date}T08:00:00-05:00`,
      authors: [BLOG_AUTHOR.name],
      section: post.hero.category,
      tags: post.seo.keywords,
      images: [
        {
          url: socialImage,
          width: 1200,
          height: 630,
          alt: post.hero.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.hero.h1,
      description: post.seo.description,
      images: [socialImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const articleUrl = getBlogPostUrl(slug);
  const imageUrl = blogUrl(post.hero.image);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${articleUrl}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": articleUrl },
    headline: post.hero.h1,
    description: post.seo.description,
    image: [imageUrl],
    datePublished: `${post.hero.date}T08:00:00-05:00`,
    dateModified: `${post.hero.date}T08:00:00-05:00`,
    inLanguage: "es-PE",
    articleSection: post.hero.category,
    keywords: post.seo.keywords.join(", "),
    wordCount: getWordCount(post),
    timeRequired: `PT${getReadingTimeMinutes(post)}M`,
    author: {
      "@type": "Organization",
      name: BLOG_AUTHOR.name,
      url: BLOG_AUTHOR.url,
    },
    publisher: {
      "@type": "Organization",
      name: "Casa Atenta",
      url: siteUrl(),
      logo: {
        "@type": "ImageObject",
        url: siteUrl("/icon.png"),
      },
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Casa Atenta", item: siteUrl() },
      { "@type": "ListItem", position: 2, name: "Editorial", item: blogUrl() },
      { "@type": "ListItem", position: 3, name: post.hero.h1, item: articleUrl },
    ],
  };
  const faqJsonLd = post.faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(articleJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(breadcrumbJsonLd) }} />
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }} />
      )}
      <BlogPostLayout post={post} />
    </>
  );
}
