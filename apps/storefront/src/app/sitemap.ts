import type { MetadataRoute } from "next";
import { products } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: storeConfig.url, changeFrequency: "weekly", priority: 1 },
    { url: `${storeConfig.url}/catalogo`, changeFrequency: "daily", priority: 0.9 },
    { url: `${storeConfig.url}/ayuda`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${storeConfig.url}/legal/privacidad`, changeFrequency: "yearly", priority: 0.35 },
    { url: `${storeConfig.url}/legal/terminos-de-compra`, changeFrequency: "yearly", priority: 0.35 },
    { url: `${storeConfig.url}/legal/envios-cambios-y-garantias`, changeFrequency: "yearly", priority: 0.35 },
    { url: `${storeConfig.url}/legal/cookies`, changeFrequency: "yearly", priority: 0.25 },
    { url: `${storeConfig.url}/libro-de-reclamaciones`, changeFrequency: "yearly", priority: 0.55 },
    ...products.map((product) => ({ url: `${storeConfig.url}/producto/${product.slug}`, changeFrequency: "weekly" as const, priority: product.featured ? 0.85 : 0.7 })),
  ];
}
