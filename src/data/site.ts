import { createWhatsAppLink } from "@/constants/contact";

export const siteMeta = {
  name: "Casa Atenta",
  title: "Casa Atenta | Diseño residencial inteligente y automatización para hogares que responden",
  description: "Casa Atenta diseña e integra domótica, iluminación inteligente, terrazas, pérgolas, acabados residenciales y automatización del hogar en Lima. Tu casa responde.",
  domain: "https://casa-atenta.com",
  locale: "es_PE",
};

export const navigation = [
  { label: "Inicio", href: "/" },
  { label: "Diseño", href: "/diseno" },
  { label: "Nosotros", href: "/nosotros" },
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
    eyebrow: "Arte + automatización residencial",
    title: "La casa responde.",
    subtitle: "Diseño residencial inteligente, domótica y atmósferas que se adaptan a tu forma de vivir.",
    primaryCta: "Agendar visita técnica",
    secondaryCta: "Ver recorrido",
    image: "/backgrounds/hero.png",
    imageAlt: "Escena residencial nocturna con luz cálida, textura mineral y atmósfera silenciosa.",
  },
  walk: {
    label: "Cinematic Walk",
    title: "CINEMATIC WALK.",
    subtitle: "Cada recorrido revela una decisión: luz, sombra, acceso, escena y uso.",
  },
  lenses: {
    label: "Creative Lenses",
    title: "CREATIVE LENSES.",
    subtitle: "Half-render, realidad, plano y detalle para visualizar antes de intervenir.",
  },
  services: {
    label: "Servicios",
    title: "LO QUE LA CASA APRENDE A HACER.",
    subtitle: "Integramos luz, control, accesos, superficies y escenas para que cada espacio funcione con más intención.",
  },
  controller: {
    label: "Scene Controller",
    title: "Una escena no enciende luces. Ordena el momento.",
    subtitle: "El mismo espacio cambia de lectura cuando ajustas intensidad, temperatura, seguridad y uso.",
  },
  halfReality: {
    label: "Half-render / half-reality",
    title: "Antes de construir, la escena ya existe.",
    subtitle: "Propuesta visual, estructura, luz, uso y ejecución aparecen en una misma lectura antes de intervenir.",
  },
  cases: {
    label: "Propuestas de integración",
    title: "Diseño conceptual, ingeniería exacta.",
    subtitle: "Estudios y propuestas técnicas que proyectan el estándar de calidad, precisión constructiva e ingeniería invisible que podemos diseñar para tu hogar.",
  },
  method: {
    label: "Método Casa Atenta",
    title: "Del diagnóstico a la escena.",
    subtitle: "Leemos, proponemos, integramos, ejecutamos y activamos con una visita técnica como punto de partida.",
  },
  about: {
    label: "Fundadores",
    title: "¿Y si el hogar pudiera responder mejor?",
    subtitle: "Fundada por Jhon Febres y Alexis Espíritu, Casa Atenta une criterio técnico, sensibilidad visual y ejecución residencial para crear hogares donde la luz, el acceso, la seguridad y los acabados funcionan como parte de una misma escena.",
  },
  finalCta: {
    title: "TU HOGAR PUEDE RESPONDER MEJOR.",
    subtitle: "Agenda una visita técnica y diseñemos una solución a tu medida.",
  },
};

export const walkSteps = [
  {
    number: "01",
    title: "Entrada",
    text: "La llegada empieza antes del timbre.",
    image: "/media/cinematic-walk/entrada-01.png",
  },
  {
    number: "02",
    title: "Luz",
    text: "La luz reconoce el momento.",
    image: "/media/cinematic-walk/luz-03.png",
  },
  {
    number: "03",
    title: "Sombra",
    text: "La sombra también se diseña.",
    image: "/media/cinematic-walk/terraza-02.png",
  },
  {
    number: "04",
    title: "Escena",
    text: "La tecnología desaparece. La experiencia queda.",
    image: "/media/cinematic-walk/escena-04.png",
  },
];

export const lenses = [
  {
    title: "Half-render / half-reality",
    text: "Una mitad propone. La otra prueba.",
    image: "/media/creative-lenses/half-render-reality-01.png",
  },
  {
    title: "Plano cenital",
    text: "El recorrido se entiende desde arriba.",
    image: "/media/creative-lenses/plano-cenital-01.png",
  },
  {
    title: "Perspectiva baja",
    text: "La estructura se lee desde el cuerpo.",
    image: "/media/creative-lenses/perspectiva-baja-01.png",
  },
  {
    title: "Macro detalle",
    text: "El detalle sostiene la escena.",
    image: "/media/creative-lenses/macro-detalle-01.png",
  },
];

export const servicesData = [
  {
    id: "atmosferas",
    title: "Atmósferas inteligentes",
    text: "Iluminación, escenas y control para que cada ambiente responda al uso, la hora y el momento.",
    includes: ["Iluminación inteligente", "Escenas", "Sensores", "Eficiencia"],
    cta: "Diseñar iluminación",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero diseñar iluminación y escenas inteligentes para mi casa."
    ),
    image: "/media/creative-lenses/luz-sombra-01.png",
  },
  {
    id: "terrazas",
    title: "Terrazas y pérgolas",
    text: "Sombra, luz, cubierta y uso exterior diseñados para que la terraza funcione de día y de noche.",
    includes: ["Pérgolas fijas", "Techos corredizos", "Cortavientos", "Iluminación exterior"],
    cta: "Cotizar mi terraza",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar una terraza o pérgola y agendar visita técnica."
    ),
    image: "/media/cinematic-walk/terraza-02.png",
  },
  {
    id: "accesos",
    title: "Accesos y seguridad",
    text: "La entrada cambia antes del timbre: presencia, cerraduras, sensores, portones y fachada.",
    includes: ["Cerraduras", "Control de accesos", "Portones", "Seguridad"],
    cta: "Revisar mi acceso",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero revisar accesos, seguridad o fachada de mi hogar."
    ),
    image: "/media/cinematic-walk/entrada-01.png",
  },
  {
    id: "superficies",
    title: "Superficies y acabados",
    text: "Muros, puertas, frentes, portones y acabados que ordenan la lectura del espacio.",
    includes: ["Pintura", "Muros", "Madera y lacado", "Renovación"],
    cta: "Cotizar pintura y acabados",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero cotizar pintura, superficies o acabados."
    ),
    image: "/media/creative-lenses/material-encuentro-01.png",
  },
  {
    id: "conectividad",
    title: "Conectividad invisible",
    text: "La inteligencia solo funciona cuando la conexión desaparece: redes, hubs, estabilidad y soporte.",
    includes: ["Redes", "Hubs", "Integración", "Soporte estable"],
    cta: "Planificar automatización",
    href: createWhatsAppLink(
      "Hola Casa Atenta, quiero planificar automatización por etapas para mi hogar."
    ),
    image: "/media/creative-lenses/half-render-reality-01.png",
  },
];

export const sceneModes = [
  {
    id: "dia",
    label: "Día",
    title: "Lectura clara",
    text: "La terraza trabaja con sombra, circulación y superficies legibles.",
    temp: "22.8°C",
    lux: "780 lx",
    audio: "Frecuencia Neutra",
    color: "rgba(244, 240, 232, 0.08)",
  },
  {
    id: "tarde",
    label: "Tarde",
    title: "Transición cálida",
    text: "La luz baja y las escenas preparan el uso social sin sobreiluminar.",
    temp: "21.8°C",
    lux: "150 lx",
    audio: "Acústica Orgánica",
    color: "rgba(216, 168, 94, 0.15)",
  },
  {
    id: "noche",
    label: "Noche",
    title: "Pausa exterior",
    text: "Spots, jardineras y apliques definen recorridos y zonas de permanencia.",
    temp: "19.8°C",
    lux: "8 lx",
    audio: "Audio por Resonancia",
    color: "rgba(8, 18, 32, 0.45)",
  },
  {
    id: "seguridad",
    label: "Seguridad",
    title: "Presencia activa",
    text: "Accesos, sensores y horarios responden sin convertir la casa en tablero.",
    temp: "20.5°C",
    lux: "0.2 lx",
    audio: "Silencio Absoluto",
    color: "rgba(96, 126, 146, 0.2)",
  },
];

export const caseStudies = [
  {
    title: "Una terraza. Tres atmósferas.",
    type: "Propuesta de Diseño / Terraza",
    problem: "El espacio exterior existía, pero no respondía al uso nocturno ni a reuniones.",
    decision: "Integrar sombra, luz cálida, jardineras, escenas y control de ambiente.",
    result: "Un exterior flexible que funciona para descanso, reuniones y vida nocturna al aire libre.",
    image: "/media/cases/terraza-inteligente/after.png",
    services: ["Iluminación exterior", "Pérgola", "Escenas"],
  },
  {
    title: "La cocina como centro visual.",
    type: "Propuesta de Diseño / Cocina",
    problem: "La iluminación de la cocina era plana, sin jerarquía entre preparación y permanencia.",
    decision: "Integrar luz lineal bajo reposteros, automatizar sensores y regular escenas de cocción/cena.",
    result: "Una cocina que cambia de zona de trabajo a espacio de convivencia con un solo cambio de escena.",
    image: "/media/cases/cocina-renovada/after.png",
    services: ["Iluminación lineal", "Sensores de presencia", "Automatización"],
  },
  {
    title: "Accesos y presencia exterior.",
    type: "Propuesta de Diseño / Fachada y Acceso",
    problem: "La llegada se sentía desconectada del interior, requiriendo llaves físicas en zonas oscuras.",
    decision: "Integrar cerradura biométrica, iluminación de bienvenida perimetral y cámara discreta.",
    result: "Un acceso que reconoce a los habitantes y activa la iluminación de bienvenida automáticamente.",
    image: "/media/cases/fachada-acceso/after.png",
    services: ["Cerraduras biométricas", "Iluminación perimetral", "Cámaras discretas"],
  },
];

export const methodSteps = [
  {
    number: "01",
    title: "Diagnóstico",
    text: "Leemos el espacio, el uso y las posibilidades reales.",
  },
  {
    number: "02",
    title: "Propuesta visual",
    text: "Traducimos decisiones en una escena clara antes de ejecutar.",
  },
  {
    number: "03",
    title: "Integración",
    text: "Coordinamos luz, control, materiales y acabados.",
  },
  {
    number: "04",
    title: "Ejecución",
    text: "Cuidamos el detalle para que tecnología y superficie se integren.",
  },
  {
    number: "05",
    title: "Activación",
    text: "Configuramos escenas, accesos y rutinas.",
  },
  {
    number: "06",
    title: "Acompañamiento",
    text: "Dejamos una casa que puede seguir adaptándose.",
  },
];
