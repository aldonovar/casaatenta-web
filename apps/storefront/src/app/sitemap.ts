import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: storeConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${storeConfig.url}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${storeConfig.url}/ayuda`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${storeConfig.url}/legal/privacidad`, lastModified: now, changeFrequency: "yearly", priority: 0.35 },
    { url: `${storeConfig.url}/legal/terminos-de-compra`, lastModified: now, changeFrequency: "yearly", priority: 0.35 },
    { url: `${storeConfig.url}/legal/envios-cambios-y-garantias`, lastModified: now, changeFrequency: "yearly", priority: 0.35 },
    { url: `${storeConfig.url}/legal/cookies`, lastModified: now, changeFrequency: "yearly", priority: 0.25 },
    { url: `${storeConfig.url}/libro-de-reclamaciones`, lastModified: now, changeFrequency: "yearly", priority: 0.55 },
    ...products.map((product) => ({ url: `${storeConfig.url}/producto/${product.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: product.featured ? 0.85 : 0.7 })),
  ];
}
