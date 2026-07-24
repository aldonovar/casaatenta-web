import type { Metadata } from "next";
import { StoreLegalDocumentView } from "@/components/StoreLegalDocument";
import { cookiesDocument } from "@/lib/store-legal-documents";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";

const pageTitle = "Política de Cookies y Almacenamiento Local";
const canonicalUrl = absoluteStoreUrl("/legal/cookies");

export const metadata: Metadata = {
  title: pageTitle,
  description: cookiesDocument.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: storeConfig.name,
    title: pageTitle,
    description: cookiesDocument.description,
    url: canonicalUrl,
  },
};

export default function StoreCookiesPage() {
  return <StoreLegalDocumentView document={cookiesDocument} />;
}
