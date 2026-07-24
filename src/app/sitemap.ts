import { MetadataRoute } from "next";
import { allServiceSlugs } from "@/data/services-pages";
import { SITE_URL } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    { path: "", changeFrequency: "weekly", priority: 1 },
    { path: "/servicios", changeFrequency: "monthly", priority: 0.9 },
    { path: "/proyectos", changeFrequency: "monthly", priority: 0.8 },
    { path: "/proceso", changeFrequency: "monthly", priority: 0.8 },
    { path: "/nosotros", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contacto", changeFrequency: "monthly", priority: 0.8 },
    { path: "/cotiza", changeFrequency: "monthly", priority: 0.7 },
    { path: "/configurador", changeFrequency: "monthly", priority: 0.7 },
    {
      path: "/preguntas-frecuentes",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { path: "/privacidad", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terminos", changeFrequency: "yearly", priority: 0.3 },
    { path: "/reclamaciones", changeFrequency: "yearly", priority: 0.4 },
  ] as const;

  const sitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  allServiceSlugs.forEach((slug) => {
    sitemapEntries.push({
      url: `${SITE_URL}/servicios/${slug}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  });

  return sitemapEntries;
}
