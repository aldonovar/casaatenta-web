export interface PublicServiceBenefit { title: string; description: string }
export interface PublicServiceFAQ { question: string; answer: string }
export interface PublicServicePageData {
  slug: string;
  seo: { title: string; description: string; keywords: string[] };
  hero: { eyebrow: string; h1: string; subtitle: string; image: string; imageAlt: string };
  intro: string;
  benefits: PublicServiceBenefit[];
  process: { title: string; steps: string[] };
  materials?: string[];
  faqs: PublicServiceFAQ[];
  cta: { label: string; href: string };
}
