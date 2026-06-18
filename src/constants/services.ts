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
      "Pergolas, techos corredizos, sombra, luz y proteccion para usar mejor tu exterior.",
    bullets: [
      "Pergolas sol y sombra",
      "Techos corredizos",
      "Cortavientos",
      "Iluminacion exterior",
    ],
    cta: "Cotizar terraza",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar mi terraza y agendar una visita tecnica."
    ),
    image: "/backgrounds/casestudy.png",
    imageAlt: "Terraza residencial con pergola, madera calida e iluminacion puntual.",
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
    imageAlt: "Comparativa de superficie residencial antes y despues de una intervencion.",
    tags: ["Resane", "Pintura", "Madera"],
  },
  {
    id: "luz",
    eyebrow: "Casa Atenta Luz",
    title: "Luz Atenta",
    description:
      "Escenas de iluminacion interior y exterior segun rutina, material y momento.",
    bullets: ["Dicroicos", "Apliques", "Sensores", "Escenas"],
    cta: "Diseñar iluminacion",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero diseñar iluminacion inteligente para mi hogar."
    ),
    image: "/backgrounds/circadian.png",
    imageAlt: "Dormitorio residencial con luz calida, sombras naturales y luminarias indirectas.",
    tags: ["Escenas", "Sensores", "Ambientes"],
  },
  {
    id: "smart",
    eyebrow: "Casa Atenta Smart",
    title: "Smart Home por etapas",
    description:
      "Luces, accesos, sensores, WhatsApp y OpenClaw para automatizar lo que mas usas.",
    bullets: ["Luces", "Sensores", "WhatsApp", "OpenClaw"],
    cta: "Planificar automatizacion",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero planificar automatizacion por etapas para mi casa."
    ),
    image: "/backgrounds/specialties.png",
    imageAlt: "Sistema tecnico de control residencial con lineas de conexion discretas.",
    tags: ["OpenClaw", "WhatsApp", "Rutinas"],
  },
];

export const processSteps: ProcessStepData[] = [
  {
    number: "01",
    title: "Visita tecnica",
    description:
      "Medimos, revisamos superficie, estructura, uso y condiciones reales.",
  },
  {
    number: "02",
    title: "Propuesta clara",
    description:
      "Definimos materiales, acabado, recorrido, luminarias o automatizacion segun el servicio.",
  },
  {
    number: "03",
    title: "Ejecucion cuidada",
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
    eyebrow: "Linea principal",
    title: "Terrazas Atentas: tu exterior como un ambiente mas de la casa.",
    subtitle:
      "Diseñamos pergolas, techos corredizos, sombra, luz y proteccion para que patios, balcones y azoteas se usen mas horas al dia.",
    blocks: [
      {
        title: "Pergola fija / sol y sombra",
        description:
          "Estructura, cubierta y orientacion pensadas antes de ejecutar.",
      },
      {
        title: "Techo corredizo manual / motorizado",
        description:
          "Control de sol, lluvia y ventilacion con recorrido revisado en visita.",
      },
      {
        title: "Iluminacion exterior / cortaviento",
        description:
          "Luminarias reales, vidrio y escenas para uso nocturno sin exceso visual.",
      },
    ],
    cta: "Cotizar mi terraza",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar mi terraza con pergola, cubierta o iluminacion."
    ),
    image: "/backgrounds/casestudy.png",
    imageAlt: "Terraza local con pergola, cubierta y luz exterior calida.",
    tags: ["Pergola", "Techo corredizo", "Cortaviento"],
  },
  {
    id: "acabados",
    eyebrow: "Renovacion visible",
    title: "Acabados Atentos: pintura y renovacion por superficie.",
    subtitle:
      "Muros, puertas, madera, muebles, cocinas, metal y fachadas con preparacion adecuada y acabado definido antes de ejecutar.",
    blocks: [
      {
        title: "Muros",
        description: "Mate, satinado o latex segun transito, limpieza y luz.",
      },
      {
        title: "Puertas y madera",
        description: "Lacado, gloss, barniz, laca o DD segun uso real.",
      },
      {
        title: "Muebles, metal y fachada",
        description:
          "Refinish, acrilico, portones, rejas, garajes, resane y proteccion.",
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
    title: "Luz Atenta: escenas para cada momento del dia.",
    subtitle:
      "Diseñamos iluminacion interior y exterior con luminarias reales, escenas utiles y control simple.",
    blocks: [
      {
        title: "Entrada segura",
        description: "Apliques, sensores y horarios para llegada y circulacion.",
      },
      {
        title: "Terraza nocturna",
        description: "Spots, luces de jardin y escenas calidas sin invadir.",
      },
      {
        title: "Cocina, descanso y perimetro",
        description:
          "Dicroicos, luz funcional y temperaturas segun tarea o rutina.",
      },
    ],
    cta: "Diseñar iluminacion inteligente",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero diseñar escenas de iluminacion inteligente."
    ),
    image: "/backgrounds/circadian.png",
    imageAlt: "Ambiente interior con luz calida, sombra natural y control de escena.",
    tags: ["Dicroicos", "Apliques", "Spots", "Sensores"],
  },
  {
    id: "smart",
    eyebrow: "Producto escalable",
    title: "Casa Atenta Smart: automatizacion por etapas.",
    subtitle:
      "Empezamos por lo que mas usas: luces, accesos, sensores, horarios y escenas. Luego escalamos hacia una casa mas conectada.",
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
        title: "Pergolas, seguridad y accesos",
        description:
          "Sistemas motorizados, sensores, cerraduras y soporte por etapas.",
      },
    ],
    cta: "Planificar automatizacion",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero planificar automatizacion por etapas para mi hogar."
    ),
    image: "/backgrounds/specialties.png",
    imageAlt: "Panel tecnico abstracto de automatizacion residencial con nodos sutiles.",
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
    imageAlt: "Ambiente interior renovado con iluminacion calida.",
  },
  {
    label: "Madera",
    image: "/backgrounds/cta.png",
    imageAlt: "Detalle residencial con madera y acabado calido.",
  },
  {
    label: "Pergola",
    image: "/backgrounds/casestudy.png",
    imageAlt: "Pergola residencial con estructura y luces puntuales.",
  },
  {
    label: "Metal",
    image: "/backgrounds/specialties.png",
    imageAlt: "Detalle tecnico de metal y sistema integrado.",
  },
];

