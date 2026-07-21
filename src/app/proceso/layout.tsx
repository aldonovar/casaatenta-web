import type { Metadata } from "next";

const title = "Proceso | De la evaluación a la entrega del proyecto";
const description =
  "Revisa cómo Casa Atenta mide, propone, presupuesta, fabrica, instala y entrega proyectos residenciales con alcance, materiales y tiempos definidos.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/proceso" },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: "/proceso",
    siteName: "Casa Atenta",
    title,
    description,
    images: ["/media/creative-lenses/plano-cenital-01.png"],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/media/creative-lenses/plano-cenital-01.png"],
  },
};

export default function ProcesoLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
