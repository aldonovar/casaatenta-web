import type { Metadata } from "next";
import { StoreLegalDocumentView } from "@/components/StoreLegalDocument";
import { purchaseTermsDocument } from "@/lib/store-legal-documents";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";

const pageTitle = "Términos de la Cuenta y de Compra";
const canonicalUrl = absoluteStoreUrl("/legal/terminos-de-compra");

export const metadata: Metadata = {
  title: pageTitle,
  description: purchaseTermsDocument.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: storeConfig.name,
    title: pageTitle,
    description: purchaseTermsDocument.description,
    url: canonicalUrl,
  },
};

export default function StorePurchaseTermsPage() {
  return <StoreLegalDocumentView document={purchaseTermsDocument} />;
}
