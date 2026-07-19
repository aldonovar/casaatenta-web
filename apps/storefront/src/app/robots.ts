import type { MetadataRoute } from "next";
import { storeConfig } from "@/lib/store-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: storeConfig.preview
      ? [{ userAgent: "*", disallow: "/" }]
      : [{ userAgent: "*", allow: "/", disallow: ["/auth/", "/cuenta/", "/checkout", "/carrito", "/seguimiento", "/api/"] }],
    sitemap: `${storeConfig.url}/sitemap.xml`,
    host: storeConfig.url,
  };
}
