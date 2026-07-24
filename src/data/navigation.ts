import { BLOG_URL } from "@/lib/urls";

export type NavigationItem = {
  id: string;
  label: string;
  href: string;
  railNumber?: string;
};

export const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL || "https://tienda.casa-atenta.com";

export const mainNavigation: readonly NavigationItem[] = [
  {
    id: "automation",
    label: "Automatización",
    href: "/servicios/smart-homes",
    railNumber: "01",
  },
  {
    id: "services",
    label: "Servicios",
    href: "/servicios",
    railNumber: "02",
  },
  { id: "store", label: "Tienda", href: STORE_URL },
  {
    id: "projects",
    label: "Proyectos",
    href: "/proyectos",
    railNumber: "03",
  },
  {
    id: "process",
    label: "Proceso",
    href: "/proceso",
    railNumber: "04",
  },
  {
    id: "about",
    label: "Nosotros",
    href: "/nosotros",
    railNumber: "05",
  },
  { id: "editorial", label: "Editorial", href: BLOG_URL },
  {
    id: "contact",
    label: "Contacto",
    href: "/contacto",
    railNumber: "06",
  },
] as const;

export const railNavigation = mainNavigation.filter(
  (item): item is NavigationItem & { railNumber: string } =>
    Boolean(item.railNumber),
);

export const legalNavigation = [
  { label: "Privacidad", href: "/privacidad" },
  { label: "Términos", href: "/terminos" },
  { label: "Libro de reclamaciones", href: "/reclamaciones" },
] as const;
