import { createWhatsAppLink } from "@/constants/contact";
import type { PublicServicePageData } from "../public-service-types";

export const domoticaService: PublicServicePageData = {
  slug: "smart-homes",
  seo: { title: "Domótica residencial en Lima | Casa Atenta", description: "Automatización por etapas para iluminación, sensores, accesos y rutinas residenciales.", keywords: ["domótica residencial Lima", "automatización del hogar", "sensores y escenas"] },
  hero: { eyebrow: "Domótica aplicada", h1: "Control por etapas sobre una infraestructura estable.", subtitle: "Iluminación, sensores, accesos y rutinas integrados según compatibilidad, red disponible y prioridad de uso.", image: "/media/creative-lenses/half-render-reality-01.png", imageAlt: "Composición conceptual de automatización residencial." },
  intro: "La automatización se plantea desde funciones concretas. Primero se revisa red, alimentación, equipos existentes y compatibilidad entre dispositivos.",
  benefits: [
    { title: "Implementación gradual", description: "El sistema puede crecer por zonas y prioridades sin sobredimensionar la primera etapa." },
    { title: "Funciones concretas", description: "Cada sensor, escena o control responde a una necesidad identificada." },
    { title: "Compatibilidad revisada", description: "Se evalúan protocolos, alimentación, red y dispositivos antes de integrar." },
    { title: "Control local y remoto", description: "El tipo de acceso depende de la plataforma, la red y los equipos seleccionados." }
  ],
  process: { title: "Automatización según infraestructura.", steps: ["Inventario de equipos, red y puntos disponibles.", "Definición de funciones y prioridades.", "Selección de dispositivos compatibles.", "Instalación y configuración por zonas.", "Pruebas, documentación y explicación de uso."] },
  materials: ["Hub o controlador compatible", "Sensores", "Actuadores o relés", "Interruptores compatibles", "Red local", "Protecciones eléctricas"],
  faqs: [
    { question: "¿Se puede empezar por una sola zona?", answer: "Sí. Iluminación, acceso o sensores pueden implementarse por etapas si la infraestructura lo permite." },
    { question: "¿Todo funciona por WhatsApp?", answer: "No necesariamente. La forma de control depende de la plataforma y de las integraciones disponibles para cada proyecto." },
    { question: "¿Trabajan con equipos existentes?", answer: "Se revisa compatibilidad antes de proponer. Algunos equipos pueden integrarse y otros requerir reemplazo." }
  ],
  cta: { label: "Planificar automatización", href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar automatización para mi hogar. Les indico las funciones que necesito y los equipos existentes.") }
};
