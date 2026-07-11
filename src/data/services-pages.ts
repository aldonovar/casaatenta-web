import type { PublicServiceBenefit, PublicServiceFAQ, PublicServicePageData } from "./public-service-types";
import { techosService } from "./public-services/techos";
import { terrazasService } from "./public-services/terrazas";
import { iluminacionService } from "./public-services/iluminacion";
import { domoticaService } from "./public-services/domotica";
import { mantenimientoService } from "./public-services/mantenimiento";

export type ServiceBenefit = PublicServiceBenefit;
export type ServiceFAQ = PublicServiceFAQ;
export interface SubService { title: string; description: string; details: string[] }
export type ServicePageData = PublicServicePageData & {
  subServices?: SubService[];
  relatedServices?: string[];
  cta: PublicServicePageData["cta"] & { whatsappMessage?: string };
};

export const servicePages: Record<string, ServicePageData> = {
  [techosService.slug]: techosService,
  [terrazasService.slug]: terrazasService,
  [iluminacionService.slug]: iluminacionService,
  [domoticaService.slug]: domoticaService,
  [mantenimientoService.slug]: mantenimientoService,
};

export const allServiceSlugs = Object.keys(servicePages);
export const getServicePage = (slug: string) => servicePages[slug];
