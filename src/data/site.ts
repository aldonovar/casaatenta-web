import { createWhatsAppLink } from "@/constants/contact";

export const siteMeta = {
  name: "Casa Atenta",
  title: "Casa Atenta | Terrazas, techos corredizos y domótica en Lima",
  description: "Diseño y ejecución de terrazas, techos Sol y Sombra fijos y corredizos, iluminación, mantenimiento y automatización residencial en Lima.",
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
    eyebrow: "Diseño y ejecución residencial · Lima",
    title: "Terrazas, cubiertas y control del hogar.",
    subtitle: "Medimos el espacio, definimos estructura y cubierta, integramos iluminación y resolvemos cada encuentro para el uso diario.",
    primaryCta: "Enviar foto y medidas",
    secondaryCta: "Revisar servicios",
    image: "/media/hero/hero-desktop-01.webp",
    imageAlt: "Propuesta visual de terraza con estructura, cubierta e iluminación integrada.",
  },
  walk: {
    label: "Recorrido de proyecto",
    title: "DEL ESTADO ACTUAL AL ACABADO.",
    subtitle: "Acceso, estructura, control de luz y uso del espacio al final del día.",
  },
  lenses: {
    label: "Lecturas del proyecto",
    title: "UN ESPACIO, CUATRO ESCALAS.",
    subtitle: "Vista general, planta, perspectiva baja y detalle de encuentro antes de fabricar.",
  },
  services: {
    label: "Servicios",
    title: "SISTEMAS PARA EXTERIORES Y HOGAR.",
    subtitle: "Cubiertas, estructuras, iluminación, acabados y automatización según medidas, orientación y uso.",
  },
  controller: {
    label: "Configuración de uso",
    title: "CUATRO AJUSTES PARA UN MISMO ESPACIO.",
    subtitle: "Cubierta, iluminación y control según la hora, la actividad y el nivel de apertura requerido.",
  },
  halfReality: {
    label: "Estado actual / propuesta",
    title: "LA COMPARACIÓN USA LA MISMA CÁMARA.",
    subtitle: "El encuadre se mantiene para revisar estructura, cubierta, iluminación y acabado sin exagerar el cambio.",
  },
  cases: {
    label: "Propuestas y obras",
    title: "CADA IMAGEN INDICA SU ESTADO.",
    subtitle: "Propuestas visuales, avances y obras terminadas se presentan con clasificación explícita.",
  },
  method: {
    label: "Proceso de trabajo",
    title: "MEDICIÓN, DISEÑO Y MONTAJE.",
    subtitle: "La visita técnica define apoyos, niveles, recorrido de cubierta, puntos eléctricos y secuencia de instalación.",
  },
  about: {
    label: "Dirección y ejecución",
    title: "COORDINACIÓN TÉCNICA Y VISUAL.",
    subtitle: "La propuesta, el alcance y la ejecución se coordinan desde el inicio para mantener continuidad entre estructura, cubierta, iluminación y acabado.",
  },
  finalCta: {
    title: "ENVÍANOS UNA FOTO Y LAS MEDIDAS DISPONIBLES.",
    subtitle: "Con esa información indicamos el tipo de cubierta, el accionamiento y los datos necesarios para evaluar el espacio.",
  },
};

export const walkSteps = [
  { number: "01", title: "Acceso", text: "Revisamos circulación, apoyos y relación con la vivienda antes de definir la estructura.", image: "/media/cinematic-walk/entrada-01.png", imageAlt: "Referencia visual de acceso residencial.", visualLabel: "REFERENCIA VISUAL" },
  { number: "02", title: "Iluminación", text: "Los puntos de luz se ubican según estructura, altura y zonas de permanencia.", image: "/media/cinematic-walk/luz-03.png", imageAlt: "Propuesta visual de iluminación integrada.", visualLabel: "PROPUESTA VISUAL" },
  { number: "03", title: "Cubierta", text: "La sombra depende del recorrido solar, la apertura disponible y el sistema fijo o corredizo.", image: "/media/cinematic-walk/terraza-02.png", imageAlt: "Propuesta visual de terraza con cubierta.", visualLabel: "PROPUESTA VISUAL" },
  { number: "04", title: "Uso nocturno", text: "La escena final combina iluminación funcional, niveles controlados y recorridos despejados.", image: "/media/cinematic-walk/escena-04.png", imageAlt: "Propuesta visual de terraza de noche.", visualLabel: "PROPUESTA VISUAL" },
];

export const lenses = [
  { title: "Estado / propuesta", text: "Mismo encuadre para revisar el cambio planteado.", image: "/media/creative-lenses/half-render-reality-01.png", imageAlt: "Comparación conceptual de intervención.", visualLabel: "COMPARACIÓN CONCEPTUAL" },
  { title: "Vista cenital", text: "Distribución, apoyos, circulación y área cubierta vistos en planta.", image: "/media/creative-lenses/plano-cenital-01.png", imageAlt: "Vista cenital de propuesta para terraza.", visualLabel: "PROPUESTA VISUAL" },
  { title: "Perspectiva baja", text: "Altura, perfiles y encuentro de la cubierta con la casa.", image: "/media/creative-lenses/perspectiva-baja-01.png", imageAlt: "Perspectiva baja de estructura exterior.", visualLabel: "PROPUESTA VISUAL" },
  { title: "Detalle de unión", text: "Perfil, fijación, remate y continuidad entre materiales.", image: "/media/creative-lenses/macro-detalle-01.png", imageAlt: "Detalle de unión y acabado.", visualLabel: "REFERENCIA DE DETALLE" },
];

export const servicesData = [
  {
    id: "terrazas", title: "Techos y terrazas",
    text: "Estructuras a medida con cubiertas fijas o corredizas, policarbonato, iluminación integrada y remates coordinados con la vivienda.",
    includes: ["Estructura metálica", "Cubierta fija", "Corredizo manual", "Corredizo motorizado"],
    cta: "Enviar medidas de mi terraza",
    href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar un techo o terraza. Les envío una foto y las medidas disponibles."),
    image: "/media/cinematic-walk/terraza-02.png", imageAlt: "Propuesta visual de terraza con estructura y cubierta.", visualLabel: "PROPUESTA VISUAL", motionSlug: "techos-sol-y-sombra",
  },
  {
    id: "iluminacion", title: "Iluminación y escenas",
    text: "Distribución de puntos, temperatura de color, encendidos por zonas y escenas programadas para interior y exterior.",
    includes: ["Puntos de luz", "Regulación", "Sensores", "Escenas"],
    cta: "Revisar puntos de luz",
    href: createWhatsAppLink("Hola Casa Atenta, quiero revisar la iluminación de mi espacio y definir puntos, escenas o sensores."),
    image: "/media/creative-lenses/luz-sombra-01.png", imageAlt: "Referencia visual de iluminación residencial.", visualLabel: "REFERENCIA VISUAL", motionSlug: "iluminacion-inteligente",
  },
  {
    id: "domotica", title: "Domótica y conectividad",
    text: "Control de luces, sensores, escenas y dispositivos desde una red local estable, con integración por WhatsApp cuando el proyecto lo permite.",
    includes: ["Red local", "Hubs", "Sensores", "Control por WhatsApp"],
    cta: "Planificar automatización",
    href: createWhatsAppLink("Hola Casa Atenta, quiero planificar automatización por etapas para mi hogar."),
    image: "/media/creative-lenses/half-render-reality-01.png", imageAlt: "Composición conceptual de domótica residencial.", visualLabel: "DIAGRAMA CONCEPTUAL", motionSlug: "smart-homes",
  },
  {
    id: "mantenimiento", title: "Mantenimiento y acabados",
    text: "Correcciones, pintura, madera, metal y acabados para resolver superficies, alineaciones y encuentros visibles.",
    includes: ["Pintura", "Metal", "Madera", "Correcciones"],
    cta: "Describir el mantenimiento",
    href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar un trabajo de mantenimiento o acabados. Les envío fotos del estado actual."),
    image: "/media/creative-lenses/material-encuentro-01.png", imageAlt: "Referencia visual de materiales y acabados.", visualLabel: "REFERENCIA DE MATERIAL", motionSlug: "mantenimiento-general",
  },
  {
    id: "diseno", title: "Diseño de intervención",
    text: "Levantamiento de medidas, lectura solar, distribución y propuesta visual antes de fabricar o modificar el espacio.",
    includes: ["Medición", "Distribución", "Render", "Especificación"],
    cta: "Solicitar evaluación",
    href: createWhatsAppLink("Hola Casa Atenta, quiero evaluar una intervención y preparar una propuesta según mi espacio."),
    image: "/media/creative-lenses/plano-cenital-01.png", imageAlt: "Propuesta visual cenital de espacio exterior.", visualLabel: "PROPUESTA VISUAL", motionSlug: "diseno-terrazas",
  },
];

export const sceneModes = [
  { id: "dia", label: "Día", title: "Sombra para uso continuo", text: "La cubierta controla radiación directa sin oscurecer el ingreso hacia la vivienda.", temp: "Cubierta parcial o cerrada", lux: "Luz natural prioritaria", audio: "Control manual", color: "rgba(244,240,232,.08)" },
  { id: "tarde", label: "Tarde", title: "Apertura y luz cálida", text: "El corredizo libera parte del área mientras se encienden puntos suspendidos o perimetrales.", temp: "Apertura intermedia", lux: "Encendido por zonas", audio: "Gancho, polea o motor", color: "rgba(216,168,94,.15)" },
  { id: "noche", label: "Noche", title: "Iluminación de permanencia", text: "La luz se concentra en mesa, circulación y bordes, evitando sobreiluminar toda la terraza.", temp: "Cubierta según clima", lux: "Escena cálida regulada", audio: "Interruptor o escena", color: "rgba(8,18,32,.45)" },
  { id: "seguridad", label: "Seguridad", title: "Accesos y detección", text: "Sensores, horarios y luces de paso se coordinan con la red local y los puntos de acceso.", temp: "Cubierta cerrada", lux: "Luz de paso y perímetro", audio: "Sensores y automatización", color: "rgba(96,126,146,.2)" },
];

export const caseStudies = [
  { title: "Terraza con cubierta corrediza", type: "Propuesta visual / terraza", problem: "El área exterior recibe radiación directa y necesita ventilación y entrada de luz.", decision: "Plantear estructura a medida, cubierta corrediza e iluminación integrada.", result: "La imagen muestra una propuesta; la solución final depende de medidas y apoyos.", image: "/media/cases/terraza-inteligente/after.png", services: ["Estructura", "Cubierta corrediza", "Iluminación"] },
  { title: "Iluminación funcional de cocina", type: "Propuesta visual / iluminación", problem: "La iluminación general no diferencia preparación, circulación y permanencia.", decision: "Separar luz de trabajo, luz ambiental y encendidos por zona.", result: "La imagen representa una propuesta de jerarquía lumínica, no una obra ejecutada.", image: "/media/cases/cocina-renovada/after.png", services: ["Iluminación lineal", "Sensores", "Escenas"] },
  { title: "Acceso con iluminación y control", type: "Propuesta visual / acceso", problem: "La entrada requiere mejor lectura nocturna y control de acceso.", decision: "Integrar iluminación de paso, sensor y cerradura compatible.", result: "La imagen comunica el criterio; equipos y alcance se especifican tras la visita.", image: "/media/cases/fachada-acceso/after.png", services: ["Acceso", "Iluminación", "Sensores"] },
];

export const methodSteps = [
  { number: "01", title: "Levantamiento", text: "Tomamos medidas, niveles, apoyos, accesos y registro fotográfico." },
  { number: "02", title: "Propuesta", text: "Definimos distribución, estructura, cubierta, iluminación y accionamiento." },
  { number: "03", title: "Presupuesto", text: "Detallamos alcance, materiales, condiciones de pago y plazo estimado." },
  { number: "04", title: "Fabricación", text: "Preparamos perfiles, piezas, acabados y componentes antes del montaje." },
  { number: "05", title: "Instalación", text: "Montamos estructura, cubierta, iluminación y mecanismos según secuencia." },
  { number: "06", title: "Entrega", text: "Revisamos funcionamiento, acabado, limpieza y conformidad del cliente." },
];
