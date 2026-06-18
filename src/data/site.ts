import { createWhatsAppLink } from "@/constants/contact";

export const siteMeta = {
  name: "Casa Atenta",
  title:
    "Casa Atenta | Diseno residencial inteligente y automatizacion para hogares que responden",
  description:
    "Casa Atenta integra domotica, iluminacion, accesos, terrazas, acabados y escenas inteligentes para transformar la forma en que tu hogar responde.",
  domain: "https://casa-atenta.com",
  locale: "es_PE",
};

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Cinematic Walk", href: "/#cinematic-walk" },
  { label: "Servicios", href: "/#servicios" },
  { label: "Casos", href: "/#casos" },
  { label: "Metodo", href: "/#metodo" },
  { label: "Contacto", href: "/contacto" },
];

export const socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/casaatenta/" },
  { label: "TikTok", href: "https://www.tiktok.com/@casaatenta" },
  { label: "Facebook", href: "https://www.facebook.com/casaatenta" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/casaatenta" },
];

export const homeCopy = {
  hero: {
    eyebrow: "Arte + automatizacion residencial",
    title: "La casa responde.",
    subtitle:
      "Disenamos escenas para hogares que responden: luz, sombra, accesos, terrazas y superficies integradas a la forma real de vivir.",
    primaryCta: "Agendar visita tecnica",
    secondaryCta: "Ver recorrido",
    image: "/backgrounds/hero.png",
    imageAlt:
      "Escena residencial nocturna con luz calida, textura mineral y atmosfera silenciosa.",
  },
  walk: {
    label: "Cinematic Walk",
    title: "No mostramos espacios. Los recorremos.",
    subtitle:
      "Cada tramo revela una decision: entrada, luz, sombra, superficie y escena. La navegacion debe sentirse como una casa que se activa.",
  },
  lenses: {
    label: "Creative Lenses",
    title: "Angulos, overlays y realidad para leer mejor cada decision.",
    subtitle:
      "Half-render, plano cenital, perspectiva baja y detalle material ayudan a visualizar antes de intervenir.",
  },
  services: {
    label: "Servicios como escenas",
    title: "Lo que la casa aprende a hacer.",
    subtitle:
      "Integramos luz, control, accesos, superficies y escenas para que cada espacio funcione con mas intencion.",
  },
  controller: {
    label: "Scene Controller",
    title: "Una escena no enciende luces. Ordena el momento.",
    subtitle:
      "El mismo espacio cambia de lectura cuando ajustas intensidad, temperatura, seguridad y uso.",
  },
  halfReality: {
    label: "Half-render / half-reality",
    title: "Antes de construir, la escena ya existe.",
    subtitle:
      "Propuesta visual, estructura, luz, uso y ejecucion aparecen en una misma lectura antes de intervenir.",
  },
  cases: {
    label: "Escenas resueltas",
    title: "Trabajo real, criterio visible.",
    subtitle:
      "Los casos finales deben reemplazarse por evidencia fotografica real. Mientras tanto, cada bloque se presenta como caso tipo, sin fingir ejecuciones no confirmadas.",
  },
  method: {
    label: "Metodo Casa Atenta",
    title: "Del diagnostico a la escena.",
    subtitle:
      "Leemos, proponemos, integramos, ejecutamos y activamos con una visita tecnica como punto de partida.",
  },
  about: {
    label: "Fundadores",
    title: "Casa Atenta nace de una pregunta: y si el hogar pudiera responder mejor?",
    subtitle:
      "Fundada por Jhon Febres y Alexis Espiritu, Casa Atenta une criterio tecnico, sensibilidad visual y ejecucion residencial para crear hogares donde la luz, el acceso, la seguridad y los acabados funcionan como parte de una misma escena.",
  },
  finalCta: {
    title: "Tu hogar puede responder mejor.",
    subtitle:
      "Agenda una visita tecnica y disenemos una solucion a tu medida.",
  },
};

export const walkSteps = [
  {
    number: "01",
    title: "Entrada",
    text: "La llegada empieza antes del timbre.",
    image: "/backgrounds/manifesto.png",
  },
  {
    number: "02",
    title: "Luz",
    text: "La luz reconoce el momento.",
    image: "/backgrounds/circadian.png",
  },
  {
    number: "03",
    title: "Sombra",
    text: "La sombra tambien se diseña.",
    image: "/backgrounds/casestudy.png",
  },
  {
    number: "04",
    title: "Escena",
    text: "La tecnologia desaparece. La experiencia queda.",
    image: "/backgrounds/cta.png",
  },
];

export const lenses = [
  {
    title: "Half-render / half-reality",
    text: "Una mitad propone. La otra prueba.",
    image: "/backgrounds/beforeafter.png",
  },
  {
    title: "Plano cenital",
    text: "El recorrido se entiende desde arriba.",
    image: "/backgrounds/manifesto.png",
  },
  {
    title: "Perspectiva baja",
    text: "La estructura se lee desde el cuerpo.",
    image: "/backgrounds/hero_architecture.png",
  },
  {
    title: "Macro detalle",
    text: "El detalle sostiene la escena.",
    image: "/backgrounds/specialties.png",
  },
];

export const services = [
  {
    id: "atmosferas",
    title: "Atmosferas inteligentes",
    text: "Iluminacion, escenas y control para que cada ambiente responda al uso, la hora y el momento.",
    includes: ["Escenas", "Sensores", "Control simple", "Rutinas"],
    cta: "Disenar iluminacion para mi casa",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero disenar iluminacion y escenas inteligentes para mi casa."
    ),
    image: "/backgrounds/circadian.png",
  },
  {
    id: "terrazas",
    title: "Terrazas y pergolas",
    text: "Sombra, luz, cubierta y uso exterior disenados para que la terraza funcione de dia y de noche.",
    includes: ["Pergolas", "Techos corredizos", "Cortaviento", "Luz exterior"],
    cta: "Cotizar mi terraza",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar una terraza o pergola y agendar visita tecnica."
    ),
    image: "/backgrounds/casestudy.png",
  },
  {
    id: "accesos",
    title: "Accesos y seguridad",
    text: "La entrada cambia antes del timbre: presencia, cerraduras, sensores, portones y fachada.",
    includes: ["Cerraduras", "Sensores", "Portones", "Presencia"],
    cta: "Revisar mi acceso",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero revisar accesos, seguridad o fachada de mi hogar."
    ),
    image: "/backgrounds/specialties.png",
  },
  {
    id: "superficies",
    title: "Superficies y acabados",
    text: "Muros, puertas, frentes, portones y acabados que ordenan la lectura del espacio.",
    includes: ["Pintura", "Madera", "Metal", "Frentes"],
    cta: "Cotizar pintura y acabados",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar pintura, superficies o acabados."
    ),
    image: "/backgrounds/beforeafter.png",
  },
  {
    id: "conectividad",
    title: "Conectividad invisible",
    text: "La inteligencia solo funciona cuando la conexion desaparece: redes, hubs, estabilidad y soporte.",
    includes: ["Redes", "Hubs", "Integracion", "Escalabilidad"],
    cta: "Planificar automatizacion",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero planificar automatizacion por etapas para mi hogar."
    ),
    image: "/backgrounds/hero_architecture.png",
  },
];

export const sceneModes = [
  {
    id: "dia",
    label: "Dia",
    title: "Lectura clara",
    text: "La terraza trabaja con sombra, circulacion y superficies legibles.",
    color: "rgba(244, 240, 232, 0.12)",
  },
  {
    id: "tarde",
    label: "Tarde",
    title: "Transicion calida",
    text: "La luz baja y las escenas preparan el uso social sin sobreiluminar.",
    color: "rgba(216, 168, 94, 0.18)",
  },
  {
    id: "noche",
    label: "Noche",
    title: "Pausa exterior",
    text: "Spots, jardineras y apliques definen recorridos y permanencia.",
    color: "rgba(8, 18, 32, 0.44)",
  },
  {
    id: "seguridad",
    label: "Seguridad",
    title: "Presencia activa",
    text: "Accesos, sensores y horarios responden sin convertir la casa en tablero.",
    color: "rgba(96, 126, 146, 0.18)",
  },
];

export const caseStudies = [
  {
    title: "Una terraza. Tres atmosferas.",
    type: "Caso tipo / terraza residencial",
    problem:
      "El espacio exterior existia, pero no respondia al uso nocturno ni a reuniones.",
    decision:
      "Integrar sombra, luz calida, jardineras, escenas y control de ambiente.",
    result:
      "Un exterior que funciona para pausa, reunion y noche.",
    image: "/backgrounds/casestudy.png",
    services: ["Iluminacion exterior", "Pergola", "Escenas"],
  },
  {
    title: "La superficie tambien comunica.",
    type: "Caso tipo / acabados",
    problem:
      "Muros y frentes se veian cansados aunque la distribucion aun funcionaba.",
    decision:
      "Preparar superficie, definir acabado y renovar sin rehacer todo.",
    result:
      "Una lectura mas limpia del mismo espacio.",
    image: "/backgrounds/beforeafter.png",
    services: ["Pintura", "Madera", "Metal"],
  },
  {
    title: "La luz reconoce el momento.",
    type: "Caso tipo / escena interior",
    problem:
      "El ambiente tenia una sola intensidad para usos distintos.",
    decision:
      "Separar llegada, descanso, reunion y seguridad con escenas simples.",
    result:
      "Un espacio que cambia sin cambiar de forma.",
    image: "/backgrounds/circadian.png",
    services: ["Dicroicos", "Apliques", "Sensores"],
  },
];

export const methodSteps = [
  {
    number: "01",
    title: "Diagnostico",
    text: "Leemos el espacio, el uso y las posibilidades reales.",
  },
  {
    number: "02",
    title: "Propuesta visual",
    text: "Traducimos decisiones en una escena clara antes de ejecutar.",
  },
  {
    number: "03",
    title: "Integracion",
    text: "Coordinamos luz, control, materiales y acabados.",
  },
  {
    number: "04",
    title: "Ejecucion",
    text: "Cuidamos el detalle para que tecnologia y superficie se integren.",
  },
  {
    number: "05",
    title: "Activacion",
    text: "Configuramos escenas, accesos y rutinas.",
  },
  {
    number: "06",
    title: "Acompanamiento",
    text: "Dejamos una casa que puede seguir adaptandose.",
  },
];

export const contactFields = [
  "Nombre",
  "WhatsApp",
  "Distrito / ciudad",
  "Tipo de espacio",
  "Servicio de interes",
  "El espacio ya existe o esta en proyecto",
  "Deseas automatizacion, acabados o ambos",
  "Mensaje",
];
