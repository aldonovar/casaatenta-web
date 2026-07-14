import type { Metadata } from "next";
import { BLOG_URL } from "@/lib/urls";

export const metadata: Metadata = {
  metadataBase: new URL(BLOG_URL),
  title: {
    default: "Casa Atenta Editorial | Guías para un hogar que responde",
    template: "%s | Casa Atenta Editorial",
  },
  description:
    "Guías técnicas sobre terrazas, cubiertas, iluminación, mantenimiento y automatización residencial en Lima.",
  applicationName: "Casa Atenta Editorial",
  authors: [{ name: "Equipo Casa Atenta", url: "https://www.casa-atenta.com/nosotros" }],
  creator: "Casa Atenta",
  publisher: "Casa Atenta",
  alternates: {
    canonical: BLOG_URL,
    types: {
      "application/rss+xml": `${BLOG_URL}/feed.xml`,
    },
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BLOG_URL,
    siteName: "Casa Atenta Editorial",
    title: "Casa Atenta Editorial | Ideas para un hogar que responde",
    description:
      "Criterios de diseño y guías claras para terrazas, cubiertas, iluminación y automatización residencial.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Atenta Editorial",
    description:
      "Guías técnicas para terrazas, cubiertas, iluminación y automatización residencial.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
