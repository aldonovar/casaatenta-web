import { createWhatsAppLink } from "@/constants/contact";
import type { PublicServicePageData } from "../public-service-types";

export const mantenimientoService: PublicServicePageData = {
  slug: "mantenimiento-general",
  seo: { title: "Mantenimiento residencial en Lima | Casa Atenta", description: "Correcciones y mantenimiento en metal, madera, pintura y superficies residenciales.", keywords: ["mantenimiento residencial Lima", "mantenimiento de terrazas", "acabados y pintura"] },
  hero: { eyebrow: "Mantenimiento y acabados", h1: "Correcciones visibles resueltas con nivel, alineación y remate.", subtitle: "Pintura, metal, madera y superficies revisadas según estado actual, acceso y alcance definido.", image: "/media/creative-lenses/material-encuentro-01.png", imageAlt: "Referencia visual de materiales y encuentros de acabado." },
  intro: "El diagnóstico parte del estado real. Se revisan humedad, corrosión, desprendimientos, deformaciones, uniones y accesos antes de definir la reparación.",
  benefits: [
    { title: "Diagnóstico previo", description: "La intervención se define según causa, estado y compatibilidad de materiales." },
    { title: "Correcciones puntuales", description: "Se priorizan encuentros, bordes, niveles y superficies visibles." },
    { title: "Protección de elementos", description: "Metal, madera y pintura reciben preparación acorde al uso interior o exterior." },
    { title: "Alcance documentado", description: "Se especifica qué se corrige, qué se reemplaza y qué queda fuera del trabajo." }
  ],
  process: { title: "Revisar antes de intervenir.", steps: ["Registro del estado actual.", "Identificación de causa y alcance.", "Definición de materiales y preparación.", "Ejecución por zonas.", "Revisión de acabado y limpieza."] },
  materials: ["Pintura según superficie", "Protección anticorrosiva", "Selladores", "Madera y listonería", "Elementos de fijación", "Materiales de reparación"],
  faqs: [
    { question: "¿Atienden trabajos puntuales?", answer: "Sí, cuando el alcance puede definirse con claridad y la intervención es técnicamente viable." },
    { question: "¿Pueden reparar estructuras exteriores?", answer: "Se revisa el estado del metal, fijaciones, corrosión y estabilidad antes de confirmar el trabajo." },
    { question: "¿La evaluación puede hacerse con fotos?", answer: "Las fotos permiten una revisión inicial, pero algunos casos requieren visita para confirmar causa y alcance." }
  ],
  cta: { label: "Enviar fotos del estado actual", href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar un trabajo de mantenimiento. Les envío fotos, ubicación y una descripción del problema.") }
};
