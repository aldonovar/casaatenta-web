import type { MetadataRoute } from "next";
import { allBlogSlugs, blogPosts } from "@/data/blog-posts";
import { getBlogPostUrl } from "@/lib/blog";
import { BLOG_URL } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BLOG_URL,
      lastModified: new Date(
        Math.max(
          ...allBlogSlugs.map((slug) =>
            new Date(blogPosts[slug].hero.date).getTime(),
          ),
        ),
      ),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...allBlogSlugs.map((slug) => ({
      url: getBlogPostUrl(slug),
      lastModified: new Date(`${blogPosts[slug].hero.date}T00:00:00Z`),
      changeFrequency: "monthly" as const,
      priority: 0.8,
      images: [blogUrlForImage(blogPosts[slug].hero.image)],
    })),
  ];
}

function blogUrlForImage(path: string) {
  return `${BLOG_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
