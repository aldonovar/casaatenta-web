import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: storeConfig.url, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${storeConfig.url}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${storeConfig.url}/ayuda`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    ...products.map((product) => ({ url: `${storeConfig.url}/producto/${product.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: product.featured ? 0.85 : 0.7 })),
  ];
}
