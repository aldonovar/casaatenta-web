import type { Metadata } from "next";
import { StoreLegalDocumentView } from "@/components/StoreLegalDocument";
import { privacyDocument } from "@/lib/store-legal-documents";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";

const pageTitle = "Política de Privacidad de la Tienda";
const canonicalUrl = absoluteStoreUrl("/legal/privacidad");

export const metadata: Metadata = {
  title: pageTitle,
  description: privacyDocument.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: storeConfig.name,
    title: pageTitle,
    description: privacyDocument.description,
    url: canonicalUrl,
  },
};

export default function StorePrivacyPage() {
  return <StoreLegalDocumentView document={privacyDocument} />;
}
