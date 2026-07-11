import { createWhatsAppLink } from "@/constants/contact";
import type { PublicServicePageData } from "../public-service-types";

export const terrazasService: PublicServicePageData = {
  slug: "diseno-terrazas",
  seo: { title: "Diseño de terrazas en Lima | Casa Atenta", description: "Propuestas para terrazas con distribución, cubierta, iluminación y materiales definidos según el espacio.", keywords: ["diseño de terrazas Lima", "terraza con techo", "remodelación de terraza"] },
  hero: { eyebrow: "Diseño de intervención", h1: "Distribución, sombra y acabados antes de fabricar.", subtitle: "Levantamiento, lectura del espacio, propuesta visual y definición técnica para terrazas residenciales.", image: "/media/creative-lenses/plano-cenital-01.png", imageAlt: "Propuesta visual cenital de distribución para terraza." },
  intro: "El diseño parte de cómo se usa el área, por dónde se circula, dónde cae el sol y qué elementos existentes deben conservarse o corregirse.",
  benefits: [
    { title: "Distribución clara", description: "Se ordenan permanencia, circulación, mesa, parrilla y áreas técnicas." },
    { title: "Cubierta coordinada", description: "La sombra se define junto con apoyos, alturas y relación con la casa." },
    { title: "Materiales compatibles", description: "Se eligen acabados según exposición, mantenimiento y continuidad visual." },
    { title: "Decisiones previas", description: "La propuesta permite revisar encuentros y proporciones antes de ejecutar." }
  ],
  process: { title: "Diseño con información del lugar.", steps: ["Registro fotográfico y medidas.", "Lectura de circulación, uso y orientación.", "Propuesta de distribución y cubierta.", "Definición de materiales, iluminación y remates.", "Presupuesto y secuencia de ejecución."] },
  materials: ["Perfiles metálicos", "Madera o listonería según propuesta", "Policarbonato", "Iluminación exterior", "Pintura para exterior", "Revestimientos según alcance"],
  faqs: [
    { question: "¿Trabajan sobre una terraza existente?", answer: "Sí. Se revisa qué puede conservarse, qué debe corregirse y cómo integrar la nueva intervención." },
    { question: "¿La propuesta incluye imágenes?", answer: "Puede incluir una representación visual cuando el alcance lo requiere. Cada imagen se identifica como propuesta, referencia o avance." },
    { question: "¿Se puede ejecutar por etapas?", answer: "Sí, siempre que estructura, instalaciones y secuencia queden definidas desde el inicio." }
  ],
  cta: { label: "Evaluar mi terraza", href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar el diseño de mi terraza. Les envío fotos, medidas, distrito y cómo uso el espacio.") }
};
