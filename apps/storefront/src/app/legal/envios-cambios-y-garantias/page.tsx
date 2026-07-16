import type { Metadata } from "next";
import { StoreLegalDocumentView } from "@/components/StoreLegalDocument";
import { fulfilmentDocument } from "@/lib/store-legal-documents";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";

const pageTitle = "Entregas, Cambios, Devoluciones y Garantías";
const canonicalUrl = absoluteStoreUrl("/legal/envios-cambios-y-garantias");

export const metadata: Metadata = {
  title: pageTitle,
  description: fulfilmentDocument.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: storeConfig.name,
    title: pageTitle,
    description: fulfilmentDocument.description,
    url: canonicalUrl,
  },
};

export default function StoreFulfilmentPage() {
  return <StoreLegalDocumentView document={fulfilmentDocument} />;
}
