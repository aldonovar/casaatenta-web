import { createWhatsAppLink } from "./contact";

export type ServiceId = "exterior" | "acabados" | "luz" | "smart";

export interface Service {
  id: ServiceId;
  eyebrow: string;
  title: string;
  description: string;
  bullets: string[];
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  tags: string[];
}

export interface ProcessStepData {
  number: string;
  title: string;
  description: string;
}

export interface FeaturedBlock {
  title: string;
  description: string;
}

export interface FeaturedService {
  id: ServiceId;
  eyebrow: string;
  title: string;
  subtitle: string;
  blocks: FeaturedBlock[];
  cta: string;
  href: string;
  image: string;
  imageAlt: string;
  tags: string[];
  note?: string;
}

export interface ProofItem {
  label: string;
  image: string;
  imageAlt: string;
}

export const services: Service[] = [
  {
    id: "exterior",
    eyebrow: "Casa Atenta Exterior",
    title: "Terrazas Atentas",
    description:
      "Pérgolas, techos corredizos, sombra, luz y protección para usar mejor tu exterior.",
    bullets: [
      "Pérgolas sol y sombra",
      "Techos corredizos",
      "Cortavientos",
      "Iluminación exterior",
    ],
    cta: "Cotizar terraza",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar mi terraza y agendar una visita técnica."
    ),
    image: "/backgrounds/casestudy.png",
    imageAlt: "Terraza residencial con pérgola, madera cálida e iluminación puntual.",
    tags: ["Sombra", "Cubierta", "Luz exterior"],
  },
  {
    id: "acabados",
    eyebrow: "Casa Atenta Acabados",
    title: "Acabados Atentos",
    description:
      "Pintura y acabados para muros, puertas, madera, muebles, metal y fachadas.",
    bullets: ["Muros", "Puertas", "Madera", "Muebles y metal"],
    cta: "Cotizar acabados",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar pintura y acabados para mi casa."
    ),
    image: "/backgrounds/beforeafter.png",
    imageAlt: "Comparativa de superficie residencial antes y después de una intervención.",
    tags: ["Resane", "Pintura", "Madera"],
  },
  {
    id: "luz",
    eyebrow: "Casa Atenta Luz",
    title: "Luz Atenta",
    description:
      "Escenas de iluminación interior y exterior según rutina, material y momento.",
    bullets: ["Dicroicos", "Apliques", "Sensores", "Escenas"],
    cta: "Diseñar iluminación",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero diseñar iluminación inteligente para mi hogar."
    ),
    image: "/backgrounds/circadian.png",
    imageAlt: "Dormitorio residencial con luz cálida, sombras naturales y luminarias indirectas.",
    tags: ["Escenas", "Sensores", "Ambientes"],
  },
  {
    id: "smart",
    eyebrow: "Casa Atenta Smart",
    title: "Smart Home por etapas",
    description:
      "Luces, accesos, sensores, WhatsApp y OpenClaw para automatizar lo que más usas.",
    bullets: ["Luces", "Sensores", "WhatsApp", "OpenClaw"],
    cta: "Planificar automatización",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero planificar automatización por etapas para mi casa."
    ),
    image: "/backgrounds/specialties.png",
    imageAlt: "Sistema técnico de control residencial con líneas de conexión discretas.",
    tags: ["OpenClaw", "WhatsApp", "Rutinas"],
  },
];

export const processSteps: ProcessStepData[] = [
  {
    number: "01",
    title: "Visita técnica",
    description:
      "Medimos, revisamos superficie, estructura, uso y condiciones reales.",
  },
  {
    number: "02",
    title: "Propuesta clara",
    description:
      "Definimos materiales, acabado, recorrido, luminarias o automatización según el servicio.",
  },
  {
    number: "03",
    title: "Ejecución cuidada",
    description:
      "Protegemos, instalamos, aplicamos o configuramos con orden y control.",
  },
  {
    number: "04",
    title: "Entrega y acompañamiento",
    description:
      "Probamos funcionamiento, revisamos detalles y dejamos recomendaciones de mantenimiento.",
  },
];

export const featuredServices: FeaturedService[] = [
  {
    id: "exterior",
    eyebrow: "Línea principal",
    title: "Terrazas Atentas: tu exterior como un ambiente más de la casa.",
    subtitle:
      "Diseñamos pérgolas, techos corredizos, sombra, luz y protección para que patios, balcones y azoteas se usen más horas al día.",
    blocks: [
      {
        title: "Pérgola fija / sol y sombra",
        description:
          "Estructura, cubierta y orientación pensadas antes de ejecutar.",
      },
      {
        title: "Techo corredizo manual / motorizado",
        description:
          "Control de sol, lluvia y ventilación con recorrido revisado en visita.",
      },
      {
        title: "Iluminación exterior / cortaviento",
        description:
          "Luminarias reales, vidrio y escenas para uso nocturno sin exceso visual.",
      },
    ],
    cta: "Cotizar mi terraza",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar mi terraza con pérgola, cubierta o iluminación."
    ),
    image: "/backgrounds/casestudy.png",
    imageAlt: "Terraza local con pérgola, cubierta y luz exterior cálida.",
    tags: ["Pérgola", "Techo corredizo", "Cortaviento"],
  },
  {
    id: "acabados",
    eyebrow: "Renovación visible",
    title: "Acabados Atentos: pintura y renovación por superficie.",
    subtitle:
      "Muros, puertas, madera, muebles, cocinas, metal y fachadas con preparación adecuada y acabado definido antes de ejecutar.",
    blocks: [
      {
        title: "Muros",
        description: "Mate, satinado o látex según tránsito, limpieza y luz.",
      },
      {
        title: "Puertas y madera",
        description: "Lacado, gloss, barniz, laca o DD según uso real.",
      },
      {
        title: "Muebles, metal y fachada",
        description:
          "Refinish, acrílico, portones, rejas, garajes, resane y protección.",
      },
    ],
    cta: "Cotizar pintura y acabados",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar pintura y acabados por superficie."
    ),
    image: "/backgrounds/beforeafter.png",
    imageAlt: "Comparativa de acabados, muro y superficie intervenida.",
    tags: ["Mate", "Satinado", "Laca", "DD"],
  },
  {
    id: "luz",
    eyebrow: "Ambientes por uso",
    title: "Luz Atenta: escenas para cada momento del día.",
    subtitle:
      "Diseñamos iluminación interior y exterior con luminarias reales, escenas útiles y control simple.",
    blocks: [
      {
        title: "Entrada segura",
        description: "Apliques, sensores y horarios para llegada y circulación.",
      },
      {
        title: "Terraza nocturna",
        description: "Spots, luces de jardín y escenas cálidas sin invadir.",
      },
      {
        title: "Cocina, descanso y perímetro",
        description:
          "Dicroicos, luz funcional y temperaturas según tarea o rutina.",
      },
    ],
    cta: "Diseñar iluminación inteligente",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero diseñar escenas de iluminación inteligente."
    ),
    image: "/backgrounds/circadian.png",
    imageAlt: "Ambiente interior con luz cálida, sombra natural y control de escena.",
    tags: ["Dicroicos", "Apliques", "Spots", "Sensores"],
  },
  {
    id: "smart",
    eyebrow: "Producto escalable",
    title: "Casa Atenta Smart: automatización por etapas.",
    subtitle:
      "Empezamos por lo que más usas: luces, accesos, sensores, horarios y escenas. Luego escalamos hacia una casa más conectada.",
    blocks: [
      {
        title: "Control de luces",
        description: "Escenas y horarios desde una experiencia simple.",
      },
      {
        title: "WhatsApp / OpenClaw",
        description:
          "Rutinas conversacionales y sistema preparado para integraciones futuras.",
      },
      {
        title: "Pérgolas, seguridad y accesos",
        description:
          "Sistemas motorizados, sensores, cerraduras y soporte por etapas.",
      },
    ],
    cta: "Planificar automatización",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero planificar automatización por etapas para mi hogar."
    ),
    image: "/backgrounds/specialties.png",
    imageAlt: "Panel técnico abstracto de automatización residencial con nodos sutiles.",
    tags: ["Luces", "Sensores", "OpenClaw", "AtentaOS Home"],
    note:
      "Smart Home no empieza con toda la casa. Empieza con una rutina que vale la pena automatizar.",
  },
];

export const proofItems: ProofItem[] = [
  {
    label: "Puerta exterior",
    image: "/backgrounds/beforeafter.png",
    imageAlt: "Puerta exterior preparada para acabado.",
  },
  {
    label: "Muro interior",
    image: "/backgrounds/manifesto.png",
    imageAlt: "Muro interior con textura mineral y luz natural.",
  },
  {
    label: "Cocina",
    image: "/backgrounds/circadian.png",
    imageAlt: "Ambiente interior renovado con iluminación cálida.",
  },
  {
    label: "Madera",
    image: "/backgrounds/cta.png",
    imageAlt: "Detalle residencial con madera y acabado cálido.",
  },
  {
    label: "Pérgola",
    image: "/backgrounds/casestudy.png",
    imageAlt: "Pérgola residencial con estructura y luces puntuales.",
  },
  {
    label: "Metal",
    image: "/backgrounds/specialties.png",
    imageAlt: "Detalle técnico de metal y sistema integrado.",
  },
];
