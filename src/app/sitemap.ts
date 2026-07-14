import { MetadataRoute } from "next";
import { allServiceSlugs } from "@/data/services-pages";
import { allBlogSlugs } from "@/data/blog-posts";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.casa-atenta.com";

  // Static routes
  const staticRoutes = [
    "",
    "/nosotros",
    "/proyectos",
    "/proceso",
    "/soluciones",
    "/contacto",
    "/preguntas-frecuentes",
    "/cotiza",
    "/servicios",
    "/blog",
  ];

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Add services
  allServiceSlugs.forEach((slug) => {
    sitemapEntries.push({
      url: `${baseUrl}/servicios/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    });
  });

  // Add blog posts
  allBlogSlugs.forEach((slug) => {
    sitemapEntries.push({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  return sitemapEntries;
}
