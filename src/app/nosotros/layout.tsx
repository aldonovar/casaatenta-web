import type { Metadata } from "next";

const title = "Nosotros | Diseño, ejecución y automatización en Lima";
const description =
  "Conoce el enfoque de Casa Atenta para coordinar diseño, estructura, iluminación, acabados y automatización residencial desde una sola dirección.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/nosotros" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/nosotros",
    siteName: "Casa Atenta",
    title,
    description,
    images: ["/media/hero/hero-desktop-02.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/media/hero/hero-desktop-02.webp"],
  },
};

export default function NosotrosLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
