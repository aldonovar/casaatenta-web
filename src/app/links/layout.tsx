import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Casa Atenta | Conexiones Oficiales & Tarjeta Digital",
  description:
    "Directorio oficial de Casa Atenta. Accede a nuestra tienda virtual, proyectos de iluminación y domótica invisible, cotizador interactivo y atención directa.",
  openGraph: {
    title: "Casa Atenta | Conexiones Oficiales & Tarjeta Digital",
    description:
      "Directorio oficial de Casa Atenta. Accede a nuestra tienda virtual, proyectos, blog, cotizador y atención directa por WhatsApp.",
    url: "https://www.casa-atenta.com/links",
    siteName: "Casa Atenta",
    images: [
      {
        url: "https://www.casa-atenta.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Casa Atenta - Conexiones Oficiales",
      },
    ],
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Atenta | Conexiones Oficiales & Tarjeta Digital",
    description:
      "Directorio oficial de Casa Atenta. Accede a nuestra tienda virtual, proyectos, blog, cotizador y atención directa por WhatsApp.",
  },
};

export default function LinksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
