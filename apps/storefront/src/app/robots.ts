import type { MetadataRoute } from "next";
import { storeConfig } from "@/lib/store-config";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/auth/", "/cuenta/", "/checkout", "/carrito", "/api/"] }],
    sitemap: `${storeConfig.url}/sitemap.xml`,
    host: storeConfig.url,
  };
}
