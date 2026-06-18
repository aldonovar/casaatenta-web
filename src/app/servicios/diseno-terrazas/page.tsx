import type { Metadata } from "next";
import { getServicePage } from "@/data/services-pages";
import ServicePageLayout from "@/components/ServicePageLayout";
import { notFound } from "next/navigation";

const data = getServicePage("diseno-terrazas")!;

export const metadata: Metadata = {
  title: data.seo.title,
  description: data.seo.description,
  keywords: data.seo.keywords,
};

export default function DisenoTerrazasPage() {
  if (!data) notFound();
  return <ServicePageLayout data={data} />;
}
