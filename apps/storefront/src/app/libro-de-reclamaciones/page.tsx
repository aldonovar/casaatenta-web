import type { Metadata } from "next";
import { ArrowRight, BookOpenCheck, ShieldCheck } from "lucide-react";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";

const pageTitle = "Libro de Reclamaciones";
const pageDescription =
  "Acceso permanente al Libro de Reclamaciones virtual de Casa Atenta.";
const canonicalUrl = absoluteStoreUrl("/libro-de-reclamaciones");

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: storeConfig.name,
    title: pageTitle,
    description: pageDescription,
    url: canonicalUrl,
  },
  robots: { index: true, follow: true },
};

export default function StoreClaimsPage() {
  const claimsUrl = new URL("/reclamaciones", storeConfig.marketingUrl).toString();

  return (
    <div className="store-claims-page">
      <section>
        <span className="store-claims-page__icon"><BookOpenCheck size={36} /></span>
        <span className="eyebrow">Atención al consumidor</span>
        <h1>Libro de Reclamaciones</h1>
        <p>
          El Libro virtual de Casa Atenta es único para la web principal y la
          tienda. No necesitas una cuenta ni haber iniciado sesión para registrar
          un reclamo o una queja y recibir una copia con código correlativo.
        </p>
        <a className="button button--primary" href={claimsUrl}>
          Abrir el Libro de Reclamaciones <ArrowRight size={17} />
        </a>
        <small><ShieldCheck size={15} /> Tu registro se conserva en el sistema central de Casa Atenta.</small>
      </section>
    </div>
  );
}
