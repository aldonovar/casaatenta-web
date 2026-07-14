import type { Metadata } from "next";
import { CotizaFormSection } from "@/components/CotizaFormSection";

export const metadata: Metadata = {
  title: "Cotiza tu proyecto | Casa Atenta",
  description:
    "Solicita una cotización personalizada para tu terraza, sol y sombra, domótica o iluminación inteligente en Lima, Perú.",
  keywords: [
    "cotización domótica Lima",
    "cotizar sol y sombra",
    "presupuesto terraza Lima",
    "visita técnica gratuita",
    "diseño inteligente Casa Atenta",
  ],
};

export default function CotizaPage() {
  return (
    <div className="pt-24 min-h-screen bg-ca-bg-deep flex flex-col justify-center">
      <CotizaFormSection source="quote" />
    </div>
  );
}
