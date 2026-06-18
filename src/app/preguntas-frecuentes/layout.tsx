import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preguntas frecuentes | Casa Atenta",
  description:
    "Resolvemos tus dudas sobre diseño de terrazas, domótica, automatización por WhatsApp, proceso de trabajo y cotización en Lima.",
  keywords: [
    "preguntas frecuentes casa atenta",
    "FAQ domótica Lima",
    "preguntas terraza Lima",
    "cuánto cuesta domótica",
    "proceso diseño residencial",
  ],
};

export default function PreguntasFrecuentesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
