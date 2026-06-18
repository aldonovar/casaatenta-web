import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Ideas, guías y tendencias | Casa Atenta",
  description:
    "Artículos sobre diseño residencial, terrazas, domótica y automatización inteligente para hogares en Lima, Perú.",
  keywords: [
    "blog casa atenta",
    "diseño residencial Lima",
    "domótica blog",
    "terrazas modernas",
    "smart home Perú",
  ],
};

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
