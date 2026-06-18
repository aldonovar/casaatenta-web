import { createWhatsAppLink } from "@/constants/contact";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
}

export interface SubService {
  title: string;
  description: string;
  details: string[];
}

export interface ServicePageData {
  slug: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    eyebrow: string;
    h1: string;
    subtitle: string;
    image: string;
    imageAlt: string;
  };
  intro: string;
  benefits: ServiceBenefit[];
  process: {
    title: string;
    steps: string[];
  };
  materials?: string[];
  subServices?: SubService[];
  faqs: ServiceFAQ[];
  cta: {
    label: string;
    href: string;
    whatsappMessage: string;
  };
  relatedServices: string[];
}

export const servicePages: Record<string, ServicePageData> = {
  "techos-sol-y-sombra": {
    slug: "techos-sol-y-sombra",
    seo: {
      title: "Techos Sol y Sombra | Diseño e instalación para terrazas | Casa Atenta",
      description:
        "Diseñamos e instalamos techos sol y sombra para terrazas, patios y espacios exteriores en Lima. Mejora sombra, estética y confort con Casa Atenta.",
      keywords: [
        "techos sol y sombra Lima",
        "techos sol y sombra para terrazas",
        "pérgolas sol y sombra Lima",
        "techos exteriores Lima",
        "sombra para terraza",
        "cubierta exterior residencial",
      ],
    },
    hero: {
      eyebrow: "Espacios diseñados",
      h1: "Techos Sol y Sombra diseñados para vivir mejor tu terraza.",
      subtitle:
        "Diseñamos e instalamos techos sol y sombra para terrazas, patios y zonas exteriores, cuidando proporción, resistencia, sombra, estética y mantenimiento.",
      image: "/backgrounds/casestudy.png",
      imageAlt:
        "Terraza residencial con techo sol y sombra, luz cálida filtrada y vegetación.",
    },
    intro:
      "Un techo sol y sombra bien diseñado no solo protege del sol. Ordena la luz, define el uso del espacio exterior y eleva la percepción arquitectónica de tu terraza. En Casa Atenta trabajamos cada proyecto con visita técnica, materiales adecuados y un criterio de diseño que cuida proporción, sombra y resistencia.",
    benefits: [
      {
        title: "Sombra funcional",
        description:
          "Regulación de luz solar según orientación, uso y horario para mayor confort.",
      },
      {
        title: "Mejor uso de terraza",
        description:
          "Tu espacio exterior se convierte en un ambiente habitable más horas al día.",
      },
      {
        title: "Estética arquitectónica",
        description:
          "Diseño que cuida proporciones, materiales y acabados para una presencia visual superior.",
      },
      {
        title: "Integración con iluminación",
        description:
          "Posibilidad de incorporar luminarias y escenas para uso nocturno.",
      },
      {
        title: "Automatización futura",
        description:
          "Estructura preparada para motorización o integración con sistemas inteligentes.",
      },
      {
        title: "Mayor valor del espacio",
        description:
          "Una terraza bien cubierta aumenta la percepción de valor y el disfrute de tu propiedad.",
      },
    ],
    process: {
      title: "Cómo trabajamos tu techo sol y sombra",
      steps: [
        "Diagnóstico del espacio exterior y orientación solar.",
        "Propuesta visual con materiales, proporciones y acabados definidos.",
        "Cotización clara con desglose de materiales e instalación.",
        "Ejecución cuidada con protección del entorno.",
        "Entrega, pruebas de resistencia y recomendaciones de mantenimiento.",
      ],
    },
    materials: [
      "Madera tratada",
      "Aluminio anodizado",
      "Policarbonato premium",
      "Acero estructural",
      "Bambú procesado",
      "Tela tensada UV",
    ],
    faqs: [
      {
        question: "¿Qué es un techo sol y sombra?",
        answer:
          "Es una estructura de cobertura parcial diseñada para filtrar la luz solar, generar sombra controlada y proteger espacios exteriores sin cerrarlos completamente. Puede ser de madera, aluminio, policarbonato u otros materiales según el diseño y el uso.",
      },
      {
        question: "¿Cuánto demora la instalación?",
        answer:
          "Depende del tamaño y complejidad del proyecto. Un techo sol y sombra estándar para terraza puede instalarse en 3 a 7 días hábiles, incluyendo estructura y acabados.",
      },
      {
        question: "¿Qué materiales se pueden usar?",
        answer:
          "Trabajamos con madera tratada, aluminio anodizado, acero, policarbonato y tela tensada, según las condiciones del espacio, el presupuesto y el acabado deseado.",
      },
      {
        question: "¿Pueden integrar iluminación?",
        answer:
          "Sí. Podemos incorporar luminarias empotradas, tiras LED o spots direccionales para que tu terraza funcione también de noche.",
      },
      {
        question: "¿Necesitan visita técnica?",
        answer:
          "Sí. Realizamos una visita técnica para medir, evaluar estructura existente, orientación solar y condiciones del espacio antes de proponer.",
      },
      {
        question: "¿Trabajan en departamentos?",
        answer:
          "Sí, trabajamos en balcones y terrazas de departamentos en Lima. Evaluamos las condiciones estructurales y de reglamento del edificio.",
      },
      {
        question: "¿La cotización incluye instalación?",
        answer:
          "Sí, nuestras cotizaciones incluyen materiales, mano de obra e instalación completa. No hay costos ocultos.",
      },
    ],
    cta: {
      label: "Cotizar mi techo sol y sombra",
      whatsappMessage:
        "Hola Casa Atenta, quiero cotizar un techo sol y sombra. Tengo fotos y medidas aproximadas de mi espacio.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, quiero cotizar un techo sol y sombra. Tengo fotos y medidas aproximadas de mi espacio."
      ),
    },
    relatedServices: [
      "diseno-terrazas",
      "iluminacion-inteligente",
    ],
  },

  "diseno-terrazas": {
    slug: "diseno-terrazas",
    seo: {
      title: "Diseño de Terrazas | Terrazas modernas y funcionales | Casa Atenta",
      description:
        "Diseñamos terrazas modernas, cómodas y funcionales con iluminación, sombra, distribución y acabados a medida. Cotiza tu terraza con Casa Atenta.",
      keywords: [
        "diseño de terrazas Lima",
        "terrazas modernas Lima",
        "diseño terraza exterior",
        "terraza con iluminación",
        "terraza con pérgola Lima",
        "remodelación de terrazas",
      ],
    },
    hero: {
      eyebrow: "Espacios diseñados",
      h1: "Diseño de terrazas para disfrutar más tu hogar.",
      subtitle:
        "Convertimos terrazas en ambientes funcionales y agradables, combinando distribución, iluminación, materiales, mobiliario y detalles de uso.",
      image: "/backgrounds/casestudy.png",
      imageAlt:
        "Terraza moderna con distribución pensada, iluminación cálida y mobiliario exterior.",
    },
    intro:
      "Una terraza bien diseñada no solo se ve mejor. Se usa más, se comparte más y se convierte en una extensión real del hogar. En Casa Atenta diseñamos terrazas desde el diagnóstico del espacio hasta la configuración final de luz, sombra y uso.",
    benefits: [
      {
        title: "Distribución inteligente",
        description:
          "Zonificación clara entre áreas de descanso, social y circulación.",
      },
      {
        title: "Sombra y protección",
        description:
          "Integración de techos, pérgolas y cortavientos según orientación y clima.",
      },
      {
        title: "Iluminación diseñada",
        description:
          "Luminarias seleccionadas para uso diurno y nocturno, con posibilidad de escenas.",
      },
      {
        title: "Materiales a medida",
        description:
          "Pisos, revestimientos y acabados que resisten exterior y elevan la estética.",
      },
      {
        title: "Mobiliario integrado",
        description:
          "Propuestas de mobiliario y jardineras que complementan el diseño general.",
      },
      {
        title: "Automatización opcional",
        description:
          "Preparación para integrar iluminación inteligente, sensores o control desde WhatsApp.",
      },
    ],
    process: {
      title: "Cómo diseñamos tu terraza",
      steps: [
        "Diagnóstico del espacio: medidas, orientación, estructura y uso actual.",
        "Propuesta de distribución y concepto visual.",
        "Selección de materiales, acabados e iluminación.",
        "Cotización detallada y aprobación.",
        "Ejecución coordinada con protección del entorno.",
        "Entrega con configuración de iluminación y recomendaciones de uso.",
      ],
    },
    faqs: [
      {
        question: "¿Puedo rediseñar mi terraza sin obra mayor?",
        answer:
          "Sí. Muchos proyectos de terraza se resuelven con mobiliario, iluminación, sombra y acabados sin necesidad de obra estructural.",
      },
      {
        question: "¿Trabajan con terrazas pequeñas?",
        answer:
          "Sí. Un buen diseño aprovecha mejor el espacio disponible, sin importar el tamaño.",
      },
      {
        question: "¿Incluyen mobiliario exterior?",
        answer:
          "Podemos proponer e integrar mobiliario exterior como parte de la propuesta de diseño.",
      },
      {
        question: "¿Cuánto tiempo toma el proyecto completo?",
        answer:
          "Depende del alcance. Un rediseño integral de terraza puede tomar de 2 a 4 semanas, incluyendo propuesta, aprobación y ejecución.",
      },
      {
        question: "¿Pueden integrar plantas y jardineras?",
        answer:
          "Sí, incluimos propuestas de vegetación y jardineras como parte del diseño integral.",
      },
    ],
    cta: {
      label: "Diseñar mi terraza",
      whatsappMessage:
        "Hola Casa Atenta, quiero mejorar o diseñar mi terraza. Me gustaría recibir orientación y cotización.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, quiero mejorar o diseñar mi terraza. Me gustaría recibir orientación y cotización."
      ),
    },
    relatedServices: [
      "techos-sol-y-sombra",
      "iluminacion-inteligente",
    ],
  },

  "iluminacion-inteligente": {
    slug: "iluminacion-inteligente",
    seo: {
      title: "Iluminación Inteligente | Luces inteligentes y escenas | Casa Atenta",
      description:
        "Instalamos y configuramos luces inteligentes para crear escenas, ambientes y rutinas controlables desde el celular o asistentes. Casa Atenta, Lima.",
      keywords: [
        "iluminación inteligente Lima",
        "luces inteligentes Lima",
        "escenas de iluminación",
        "iluminación smart home",
        "control de luces inteligente",
        "iluminación automatizada Lima",
      ],
    },
    hero: {
      eyebrow: "Hogares inteligentes",
      h1: "Iluminación inteligente para cada momento del día.",
      subtitle:
        "Instalamos y configuramos luces inteligentes para crear escenas, ambientes y rutinas controlables desde el celular o asistentes compatibles.",
      image: "/backgrounds/circadian.png",
      imageAlt:
        "Ambiente residencial con iluminación cálida regulable y sensores de presencia.",
    },
    intro:
      "La iluminación es la capa más sensible de un hogar inteligente. Define cómo se ve, se siente y se usa cada espacio. En Casa Atenta diseñamos iluminación con criterio técnico y estético: escenas para la mañana, la reunión, el descanso y la seguridad, controlables desde tu celular.",
    benefits: [
      {
        title: "Una luz para cada momento",
        description:
          "Escenas personalizadas para cocinar, descansar, recibir visitas o trabajar.",
      },
      {
        title: "Control desde el celular",
        description:
          "Encender, apagar, atenuar y cambiar escenas desde tu smartphone.",
      },
      {
        title: "Rutinas automatizadas",
        description:
          "Luces que se encienden al amanecer, se atenúan de noche o se activan por presencia.",
      },
      {
        title: "Ahorro energético",
        description:
          "Luminarias LED eficientes con regulación de intensidad para reducir consumo.",
      },
      {
        title: "Integración con asistentes",
        description:
          "Compatible con Alexa, Google Home y asistentes de voz populares.",
      },
      {
        title: "Confort visual y circadiano",
        description:
          "Alineamos la iluminación con tu ritmo biológico para mejorar el descanso y la productividad.",
      },
    ],
    process: {
      title: "Cómo diseñamos tu iluminación inteligente",
      steps: [
        "Diagnóstico de espacios, circuitos eléctricos y uso actual.",
        "Propuesta de escenas, luminarias y sistema de control.",
        "Cotización detallada con equipos y configuración.",
        "Instalación y configuración de luminarias y escenas.",
        "Entrega con capacitación sobre uso del sistema.",
      ],
    },
    faqs: [
      {
        question: "¿Necesito cambiar toda mi instalación eléctrica?",
        answer:
          "No necesariamente. Muchas soluciones de iluminación inteligente funcionan con la instalación existente. Evaluamos tu caso en la visita técnica.",
      },
      {
        question: "¿Qué marcas de luminarias usan?",
        answer:
          "Trabajamos con marcas reconocidas como Philips Hue, Lutron, Yeelight y otras según disponibilidad y compatibilidad con tu sistema.",
      },
      {
        question: "¿Puedo controlar las luces por voz?",
        answer:
          "Sí, las escenas se pueden controlar mediante Alexa, Google Assistant u otros asistentes compatibles.",
      },
      {
        question: "¿Funciona si no tengo internet?",
        answer:
          "Las luminarias siguen funcionando con interruptores físicos. El control inteligente requiere conexión Wi-Fi estable.",
      },
      {
        question: "¿Pueden integrar iluminación exterior?",
        answer:
          "Sí, diseñamos iluminación inteligente tanto interior como exterior, incluyendo terrazas, jardines y accesos.",
      },
    ],
    cta: {
      label: "Diseñar mi iluminación inteligente",
      whatsappMessage:
        "Hola Casa Atenta, quiero diseñar iluminación inteligente para mi hogar. Me gustaría recibir orientación.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, quiero diseñar iluminación inteligente para mi hogar. Me gustaría recibir orientación."
      ),
    },
    relatedServices: [
      "smart-homes",
      "diseno-terrazas",
      "mantenimiento-general",
    ],
  },

  "smart-homes": {
    slug: "smart-homes",
    seo: {
      title: "Smart Homes | Automatización del hogar y luces inteligentes | Casa Atenta",
      description:
        "Automatiza tu hogar con luces inteligentes, sensores, escenas, asistentes y control desde el celular. Casa Atenta integra diseño y domótica.",
      keywords: [
        "smart homes Lima",
        "domótica Lima",
        "automatización del hogar Lima",
        "casa inteligente Perú",
        "domótica para departamentos",
        "smart home por etapas",
      ],
    },
    hero: {
      eyebrow: "Hogares inteligentes",
      h1: "Smart homes pensadas para la vida real.",
      subtitle:
        "Integramos dispositivos inteligentes para mejorar confort, control, seguridad y eficiencia en el hogar, empezando por lo que más usas.",
      image: "/backgrounds/specialties.png",
      imageAlt:
        "Sistema de automatización residencial con nodos de control y escenas visuales.",
    },
    intro:
      "Una casa inteligente no debería ser difícil de usar. En Casa Atenta integramos tecnología útil, discreta y escalable para que tu hogar responda mejor a tu rutina. Empezamos por lo esencial y escalamos según tus necesidades.",
    benefits: [
      {
        title: "Control desde el celular",
        description:
          "Gestiona luces, sensores y escenas desde tu smartphone, estés donde estés.",
      },
      {
        title: "Escenas personalizadas",
        description:
          "Configura ambientes completos: modo cine, modo reunión, modo noche.",
      },
      {
        title: "Rutinas automáticas",
        description:
          "Tu hogar se adapta a tu horario: luces al amanecer, seguridad al salir.",
      },
      {
        title: "Mayor comodidad",
        description:
          "Menos interruptores, menos pasos, más control con menos esfuerzo.",
      },
      {
        title: "Seguridad integrada",
        description:
          "Sensores de movimiento, apertura y presencia para mayor tranquilidad.",
      },
      {
        title: "Escalabilidad por fases",
        description:
          "Empieza con una sola habitación y expande la automatización gradualmente a todo tu hogar.",
      },
    ],
    process: {
      title: "Cómo implementamos tu smart home",
      steps: [
        "Diagnóstico de necesidades, rutinas y prioridades del hogar.",
        "Propuesta técnica con dispositivos, escenas y control.",
        "Cotización detallada por etapa de implementación.",
        "Instalación y configuración de dispositivos y escenas.",
        "Capacitación y acompañamiento post-instalación.",
      ],
    },
    faqs: [
      {
        question: "¿Necesito renovar toda mi casa para hacerla inteligente?",
        answer:
          "No. La automatización se implementa por etapas. Puedes empezar con iluminación inteligente en una habitación y expandir según tus necesidades.",
      },
      {
        question: "¿Qué pasa si se va la luz o el internet?",
        answer:
          "Los dispositivos siguen funcionando con interruptores físicos. Al restaurar la conexión, el sistema recupera su configuración automáticamente.",
      },
      {
        question: "¿Es seguro tener una casa conectada?",
        answer:
          "Sí. Utilizamos protocolos seguros y redes separadas para dispositivos inteligentes, con configuración adecuada de seguridad.",
      },
      {
        question: "¿Funciona en departamentos?",
        answer:
          "Sí. La mayoría de soluciones smart home son inalámbricas y no requieren obra civil, ideal para departamentos.",
      },
      {
        question: "¿Cuánto cuesta automatizar una casa?",
        answer:
          "Depende del alcance. Una primera etapa con iluminación inteligente puede empezar desde un presupuesto accesible. Cotizamos según tus prioridades.",
      },
    ],
    cta: {
      label: "Planificar mi smart home",
      whatsappMessage:
        "Hola Casa Atenta, quiero automatizar mi hogar con luces inteligentes y control desde el celular.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, quiero automatizar mi hogar con luces inteligentes y control desde el celular."
      ),
    },
    relatedServices: [
      "iluminacion-inteligente",
      "diseno-terrazas",
      "mantenimiento-general",
    ],
  },

  "mantenimiento-general": {
    slug: "mantenimiento-general",
    seo: {
      title: "Mantenimiento General | Cuidado continuo para hogares y terrazas | Casa Atenta",
      description:
        "Servicio de mantenimiento general para hogares, terrazas y espacios residenciales con atención ordenada, criterio técnico y cuidado visual.",
      keywords: [
        "mantenimiento general Lima",
        "mantenimiento residencial Lima",
        "mantenimiento de hogares",
        "reparaciones del hogar Lima",
        "mejoras residenciales",
        "mantenimiento de terrazas",
      ],
    },
    hero: {
      eyebrow: "Cuidado continuo",
      h1: "Mantenimiento general con criterio de diseño.",
      subtitle:
        "Mantener un hogar también es cuidar cómo se ve, cómo funciona y cómo se siente. Atendemos mejoras y ajustes con orden, claridad y atención al detalle.",
      image: "/backgrounds/beforeafter.png",
      imageAlt:
        "Superficie residencial antes y después de una intervención de mantenimiento.",
    },
    intro:
      "El mantenimiento no es solo reparar lo que falla. Es cuidar la percepción de tu hogar: superficies limpias, acabados cuidados, sistemas que funcionan y un espacio que se siente bien. En Casa Atenta atendemos mejoras y mantenimiento con criterio técnico y visual.",
    benefits: [
      {
        title: "Criterio técnico y visual",
        description:
          "No solo reparamos. Cuidamos que cada intervención mantenga la estética y el diseño del espacio.",
      },
      {
        title: "Atención ordenada",
        description:
          "Diagnóstico claro, propuesta con alcance definido y ejecución organizada sin molestias.",
      },
      {
        title: "Versatilidad profesional",
        description:
          "Desde calibración de luminarias y pintura premium hasta acabados finos y mueblería.",
      },
      {
        title: "Protección del entorno",
        description:
          "Trabajamos con rigurosa protección de pisos, muebles y superficies durante la intervención.",
      },
      {
        title: "Transparencia sin sorpresas",
        description:
          "Cotizaciones claras con desglose de materiales, mano de obra y tiempos de entrega.",
      },
      {
        title: "Acompañamiento post-servicio",
        description:
          "Seguimiento pos-intervención para asegurar la calidad y satisfacción absoluta.",
      },
    ],
    process: {
      title: "Cómo atendemos tu mantenimiento",
      steps: [
        "Diagnóstico detallado del espacio y las necesidades reportadas.",
        "Propuesta con alcance técnico, materiales y cronograma.",
        "Cotización transparente y aprobación formal del plan.",
        "Ejecución con protección exhaustiva, orden y limpieza diaria.",
        "Entrega formal con revisión final y recomendaciones de cuidado.",
      ],
    },
    subServices: [
      {
        title: "Configuración de luminarias",
        description:
          "Calibración e instalación de sistemas de iluminación residencial. Ajustamos la temperatura, intensidad y ubicación de cada punto de luz para crear atmósferas que resalten la arquitectura de tu hogar.",
        details: [
          "Instalación de luminarias LED técnicas y decorativas",
          "Calibración y homologación de temperatura de color",
          "Configuración de switches, dimmers y escenas base",
          "Optimización de circuitos y consumo energético",
        ],
      },
      {
        title: "Pintura",
        description:
          "Aplicación premium de pintura en interiores y exteriores. Utilizamos técnicas avanzadas de preparación de superficies y pinturas de alta calidad resistentes a la humedad y el clima para asegurar acabados impecables.",
        details: [
          "Preparación y resane profundo de muros y techos",
          "Aplicación de pintura lavable de alto tránsito y gran acabado",
          "Tratamientos preventivos antihumedad y sellado acrílico",
          "Asesoría en combinación cromática arquitectónica",
        ],
      },
      {
        title: "Acabados y detalles",
        description:
          "Refinamiento y reparación de superficies, molduras, zócalos y revestimientos. Cuidamos cada encuentro de material, asegurando juntas limpias y transiciones perfectas en pisos, paredes y techos.",
        details: [
          "Reparación de juntas, fraguas y encuentros de muros",
          "Instalación y reparación de zócalos, molduras y perfiles",
          "Tratamiento y sellado de superficies de piedra y terrazo",
          "Detalles estéticos finos en uniones y remates",
        ],
      },
      {
        title: "Mueblería y mobiliario",
        description:
          "Ajuste, restauración y mantenimiento de carpintería y mobiliario fijo o móvil. Mantenemos la madera, cerrajería y herrajes en óptimo estado de funcionamiento y presentación.",
        details: [
          "Ajuste, calibración y cambio de bisagras y correderas",
          "Mantenimiento y laqueado de decks y muebles de madera",
          "Restauración de acabados superficiales y pulido",
          "Instalación y ajuste de cerrajería y tiradores premium",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Qué tipo de mantenimiento ofrecen?",
        answer:
          "Ofrecemos configuración de luminarias, pintura arquitectónica, acabados y detalles de revestimientos, así como mantenimiento y ajuste de carpintería y mueblería fina.",
      },
      {
        question: "¿Tienen un monto mínimo de servicio?",
        answer:
          "Evaluamos cada caso. Para intervenciones muy pequeñas, podemos agrupar necesidades en una sola visita técnica para hacer el servicio eficiente.",
      },
      {
        question: "¿Coordinan horarios especiales?",
        answer:
          "Sí. Coordinamos los horarios según disponibilidad y necesidades del cliente para interferir lo menos posible con la rutina de tu hogar.",
      },
      {
        question: "¿Ofrecen planes de mantenimiento preventivo?",
        answer:
          "Sí, diseñamos planes de mantenimiento periódico semestral o anual para asegurar que las instalaciones y acabados de tu hogar se mantengan impecables.",
      },
    ],
    cta: {
      label: "Solicitar mantenimiento",
      whatsappMessage:
        "Hola Casa Atenta, necesito ayuda con mantenimiento o mejoras en mi hogar.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, necesito ayuda con mantenimiento o mejoras en mi hogar."
      ),
    },
    relatedServices: [
      "diseno-terrazas",
      "techos-sol-y-sombra",
      "iluminacion-inteligente",
    ],
  },
};

export const allServiceSlugs = Object.keys(servicePages);

export function getServicePage(slug: string): ServicePageData | undefined {
  return servicePages[slug];
}
