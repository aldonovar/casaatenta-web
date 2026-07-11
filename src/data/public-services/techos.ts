import { createWhatsAppLink } from "@/constants/contact";
import type { PublicServicePageData } from "../public-service-types";

export const techosService: PublicServicePageData = {
  slug: "techos-sol-y-sombra",
  seo: { title: "Techos Sol y Sombra en Lima | Casa Atenta", description: "Diseño, fabricación e instalación de cubiertas fijas y corredizas para terrazas en Lima.", keywords: ["techos sol y sombra Lima", "techo corredizo terraza", "cubierta para terraza"] },
  hero: { eyebrow: "Cubiertas para exterior", h1: "Techos Sol y Sombra definidos según medidas, apoyos y apertura.", subtitle: "Estructura metálica, cubierta fija o corrediza, iluminación y accionamiento manual o motorizado según el espacio.", image: "/media/cinematic-walk/terraza-02.png", imageAlt: "Propuesta visual de terraza con estructura y cubierta Sol y Sombra." },
  intro: "La visita técnica permite revisar niveles, apoyos, recorrido de apertura, ingreso de materiales y puntos eléctricos antes de definir la solución.",
  benefits: [
    { title: "Cubierta fija o corrediza", description: "La apertura se define según uso, radiación, ventilación y área disponible." },
    { title: "Accionamiento definido", description: "Polea, gancho o motor según dimensiones, frecuencia de uso y acceso." },
    { title: "Estructura a medida", description: "Perfiles, apoyos y encuentros se resuelven según la vivienda existente." },
    { title: "Iluminación integrada", description: "Los puntos de luz se coordinan con la estructura antes de fabricar." }
  ],
  process: { title: "De la medición al montaje.", steps: ["Levantamiento de medidas, niveles y apoyos.", "Definición de cubierta, recorrido y accionamiento.", "Cotización con alcance, materiales, plazo y condiciones.", "Fabricación de perfiles y componentes.", "Montaje, pruebas de apertura y revisión de acabados."] },
  materials: ["Estructura metálica", "Policarbonato según especificación", "Listonería según propuesta", "Polea o gancho", "Motor cuando corresponde", "Pintura y protección anticorrosiva"],
  faqs: [
    { question: "¿Puede ser corredizo?", answer: "Sí. El recorrido y el tipo de accionamiento se determinan después de medir el área y revisar los apoyos." },
    { question: "¿Puede incluir motor?", answer: "Sí, cuando las dimensiones, el peso y la instalación eléctrica permiten una motorización segura." },
    { question: "¿Las lamas orientables son estándar?", answer: "No. Se consideran una solución especial y requieren evaluación específica de estructura, mecanismo y presupuesto." },
    { question: "¿Se necesita visita técnica?", answer: "Sí. Las medidas, niveles, accesos y condiciones de montaje definen el alcance final." }
  ],
  cta: { label: "Enviar foto y medidas", href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar un techo Sol y Sombra. Les envío fotos, medidas y distrito.") }
};
