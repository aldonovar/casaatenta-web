import { createWhatsAppLink } from "@/constants/contact";
import type { PublicServicePageData } from "../public-service-types";

export const iluminacionService: PublicServicePageData = {
  slug: "iluminacion-inteligente",
  seo: { title: "Iluminación residencial en Lima | Casa Atenta", description: "Diseño de puntos de luz, regulación, sensores y escenas para interiores y exteriores.", keywords: ["iluminación residencial Lima", "iluminación de terrazas", "sensores de luz"] },
  hero: { eyebrow: "Iluminación y escenas", h1: "Luz funcional para uso, circulación y permanencia.", subtitle: "Puntos, encendidos, regulación y sensores coordinados con la arquitectura y la forma de uso.", image: "/media/cinematic-walk/luz-03.png", imageAlt: "Propuesta visual de iluminación cálida integrada en una terraza." },
  intro: "La iluminación se define según altura, superficies, zonas de trabajo, recorridos y nivel de luz ambiental disponible.",
  benefits: [
    { title: "Puntos bien ubicados", description: "Cada luminaria responde a una tarea, recorrido o zona de permanencia." },
    { title: "Encendidos por zonas", description: "Se separan circuitos para evitar iluminar todo el espacio al mismo tiempo." },
    { title: "Regulación y sensores", description: "Se incorporan cuando aportan control real y la instalación lo permite." },
    { title: "Integración con estructura", description: "Cableado y luminarias se coordinan antes del montaje de perfiles o acabados." }
  ],
  process: { title: "Iluminación definida antes de instalar.", steps: ["Revisión del espacio y puntos existentes.", "Definición de tareas, recorridos y zonas.", "Selección de tipo de luz y ubicación.", "Coordinación de cableado, controles y sensores.", "Instalación, pruebas y ajuste de escenas."] },
  materials: ["Luminarias según uso", "Cableado y canalización", "Interruptores y reguladores", "Sensores compatibles", "Fuentes y drivers", "Protección para exterior cuando corresponde"],
  faqs: [
    { question: "¿Pueden trabajar solo una terraza?", answer: "Sí. El alcance puede limitarse a un área específica y coordinarse con la estructura existente." },
    { question: "¿Incluyen sensores?", answer: "Sí, cuando son compatibles con el circuito y aportan una función concreta de paso, presencia o seguridad." },
    { question: "¿Pueden crear escenas?", answer: "Sí. Se definen combinaciones de encendido y regulación según el sistema instalado." }
  ],
  cta: { label: "Revisar mis puntos de luz", href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar la iluminación de mi espacio. Les envío fotos, medidas y los puntos existentes.") }
};
