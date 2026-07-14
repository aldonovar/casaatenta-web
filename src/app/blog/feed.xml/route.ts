import { allBlogSlugs, blogPosts } from "@/data/blog-posts";
import { getBlogPostUrl } from "@/lib/blog";
import { BLOG_URL } from "@/lib/urls";

export const dynamic = "force-static";

function xml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = allBlogSlugs
    .map((slug) => blogPosts[slug])
    .sort(
      (a, b) =>
        new Date(b.hero.date).getTime() - new Date(a.hero.date).getTime(),
    );
  const latestDate = posts[0]?.hero.date || new Date().toISOString();
  const items = posts
    .map((post) => {
      const url = getBlogPostUrl(post.slug);
      return `
    <item>
      <title>${xml(post.hero.h1)}</title>
      <link>${xml(url)}</link>
      <guid isPermaLink="true">${xml(url)}</guid>
      <description>${xml(post.seo.description)}</description>
      <category>${xml(post.hero.category)}</category>
      <pubDate>${new Date(`${post.hero.date}T13:00:00Z`).toUTCString()}</pubDate>
    </item>`;
    })
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Casa Atenta Editorial</title>
    <link>${BLOG_URL}</link>
    <description>Guías técnicas para terrazas, cubiertas, iluminación y automatización residencial.</description>
    <language>es-PE</language>
    <lastBuildDate>${new Date(`${latestDate}T13:00:00Z`).toUTCString()}</lastBuildDate>
    <atom:link href="${BLOG_URL}/feed.xml" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
