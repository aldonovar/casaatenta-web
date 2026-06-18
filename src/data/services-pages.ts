import { createWhatsAppLink } from "@/constants/contact";

export interface ServiceFAQ {
  question: string;
  answer: string;
}

export interface ServiceBenefit {
  title: string;
  description: string;
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
      title:
        "Techos Sol y Sombra en Lima | Diseño e instalación para terrazas | Casa Atenta",
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
      "Policarbonato",
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
      "pergolas",
      "iluminacion-inteligente",
    ],
  },

  "diseno-terrazas": {
    slug: "diseno-terrazas",
    seo: {
      title:
        "Diseño de terrazas en Lima | Terrazas modernas y funcionales | Casa Atenta",
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
      "pergolas",
      "iluminacion-inteligente",
    ],
  },

  pergolas: {
    slug: "pergolas",
    seo: {
      title:
        "Pérgolas en Lima | Diseño e instalación de pérgolas residenciales | Casa Atenta",
      description:
        "Diseñamos e instalamos pérgolas para terrazas, patios y jardines en Lima. Estructura, sombra y estética con criterio arquitectónico.",
      keywords: [
        "pérgolas Lima",
        "pérgolas para terrazas",
        "pérgolas de madera Lima",
        "pérgolas de aluminio",
        "estructuras exteriores Lima",
        "pérgolas residenciales",
      ],
    },
    hero: {
      eyebrow: "Estructuras exteriores",
      h1: "Pérgolas que ordenan el espacio y elevan tu exterior.",
      subtitle:
        "Creamos estructuras que generan sombra, definen zonas y elevan la presencia arquitectónica del ambiente exterior.",
      image: "/backgrounds/casestudy.png",
      imageAlt: "Pérgola residencial con estructura de madera e iluminación cálida.",
    },
    intro:
      "Una pérgola no es solo una cubierta. Es una decisión arquitectónica que ordena el espacio, genera sombra útil y eleva la percepción visual de todo el exterior. En Casa Atenta diseñamos pérgolas con criterio estructural, estético y funcional.",
    benefits: [
      {
        title: "Diseño con intención",
        description:
          "No solo instalamos. Diseñamos la pérgola como parte de la composición del espacio.",
      },
      {
        title: "Sombra controlada",
        description:
          "Orientación y separación de lamas calculadas para el confort real del espacio.",
      },
      {
        title: "Presencia arquitectónica",
        description:
          "Estructura que mejora la lectura visual del exterior y agrega carácter.",
      },
      {
        title: "Materiales duraderos",
        description:
          "Madera tratada, aluminio o acero según el estilo y las condiciones del espacio.",
      },
      {
        title: "Integración con iluminación",
        description:
          "Spots, tiras LED o luminarias colgantes para uso nocturno.",
      },
      {
        title: "Preparada para automatización",
        description:
          "Estructura compatible con motorización futura o integración con sistemas inteligentes.",
      },
    ],
    process: {
      title: "Cómo diseñamos tu pérgola",
      steps: [
        "Visita técnica para evaluar el espacio y la estructura existente.",
        "Propuesta de diseño con proporciones, materiales y acabados.",
        "Cotización detallada con desglose completo.",
        "Fabricación e instalación coordinada.",
        "Entrega con revisión de acabados y recomendaciones.",
      ],
    },
    materials: [
      "Madera tornillo tratada",
      "Aluminio anodizado",
      "Acero con acabado anticorrosivo",
      "Madera plástica (WPC)",
      "Policarbonato alveolar",
    ],
    faqs: [
      {
        question: "¿Qué diferencia hay entre una pérgola y un techo sol y sombra?",
        answer:
          "Una pérgola es una estructura más abierta, con vigas y lamas que filtran la luz. Un techo sol y sombra puede incluir cubiertas más cerradas. Ambos se diseñan según el uso y la orientación del espacio.",
      },
      {
        question: "¿Cuánto dura la instalación de una pérgola?",
        answer:
          "Generalmente entre 5 y 10 días hábiles, dependiendo del tamaño, material y complejidad del diseño.",
      },
      {
        question: "¿Pueden motorizar la pérgola?",
        answer:
          "Sí, ofrecemos opciones de motorización para lamas y cubiertas, con integración a control remoto o automatización.",
      },
      {
        question: "¿Trabajan en azoteas y balcones?",
        answer:
          "Sí, evaluamos las condiciones estructurales del espacio para proponer una solución segura y estética.",
      },
    ],
    cta: {
      label: "Cotizar mi pérgola",
      whatsappMessage:
        "Hola Casa Atenta, quiero cotizar una pérgola para mi espacio exterior. Me gustaría agendar una visita técnica.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, quiero cotizar una pérgola para mi espacio exterior. Me gustaría agendar una visita técnica."
      ),
    },
    relatedServices: [
      "techos-sol-y-sombra",
      "diseno-terrazas",
      "iluminacion-inteligente",
    ],
  },

  "iluminacion-inteligente": {
    slug: "iluminacion-inteligente",
    seo: {
      title:
        "Iluminación Inteligente en Lima | Luces inteligentes y escenas | Casa Atenta",
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
        title: "Posibilidad de control por WhatsApp",
        description:
          "Integración con nuestro sistema de automatización conversacional.",
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
          "Trabajamos con marcas reconocidas como Philips Hue, LIFX, Yeelight y otras según disponibilidad y compatibilidad con tu sistema.",
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
      "automatizacion-whatsapp",
      "diseno-terrazas",
    ],
  },

  "smart-homes": {
    slug: "smart-homes",
    seo: {
      title:
        "Smart Homes en Lima | Automatización del hogar y luces inteligentes | Casa Atenta",
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
        title: "Escalabilidad",
        description:
          "Empieza con una habitación y expande la automatización gradualmente.",
      },
      {
        title: "Integración con asistentes",
        description:
          "Compatible con Alexa, Google Home y otros asistentes de voz.",
      },
      {
        title: "Control por WhatsApp",
        description:
          "Posibilidad de integrar control conversacional desde WhatsApp.",
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
      "automatizacion-whatsapp",
      "diseno-terrazas",
    ],
  },

  "automatizacion-whatsapp": {
    slug: "automatizacion-whatsapp",
    seo: {
      title:
        "Automatización del hogar por WhatsApp | Casa inteligente conversacional | Casa Atenta",
      description:
        "Controla luces, escenas y rutinas de tu hogar desde WhatsApp. Casa Atenta desarrolla automatización conversacional para hogares inteligentes.",
      keywords: [
        "automatización por WhatsApp",
        "control de luces por WhatsApp",
        "domótica WhatsApp",
        "casa inteligente WhatsApp",
        "chatbot domótica",
        "automatización conversacional hogar",
      ],
    },
    hero: {
      eyebrow: "Innovación Casa Atenta",
      h1: "Controla tu hogar desde WhatsApp.",
      subtitle:
        "Tu hogar no necesita otra app olvidada en el teléfono. Puede responder desde el canal que ya usas todos los días.",
      image: "/backgrounds/specialties.png",
      imageAlt:
        "Interfaz de control de hogar inteligente desde conversación de WhatsApp.",
    },
    intro:
      "Llevamos el control del hogar a una interfaz que ya usas todos los días: WhatsApp. Activa escenas, consulta estados y controla dispositivos mediante mensajes simples. Sin apps adicionales, sin complicaciones.",
    benefits: [
      {
        title: "Sin apps adicionales",
        description:
          "Controla tu hogar desde WhatsApp, la app que ya usas todos los días.",
      },
      {
        title: "Comandos naturales",
        description:
          "Escribe como hablas: 'Enciende la sala', 'Activa modo noche'.",
      },
      {
        title: "Escenas completas",
        description:
          "Activa ambientes completos con un solo mensaje.",
      },
      {
        title: "Consulta de estados",
        description:
          "Pregunta si hay movimiento, si las luces están encendidas o la temperatura actual.",
      },
      {
        title: "Programación de rutinas",
        description:
          "Programa las luces a las 7 pm o activa la seguridad al salir.",
      },
      {
        title: "Acceso remoto",
        description:
          "Controla tu casa desde cualquier lugar con conexión a internet.",
      },
    ],
    process: {
      title: "Cómo funciona la automatización por WhatsApp",
      steps: [
        "Evaluamos tus dispositivos inteligentes instalados o por instalar.",
        "Configuramos el sistema de integración y el chatbot conversacional.",
        "Definimos escenas, comandos y rutinas según tu uso real.",
        "Activamos el control y te capacitamos en los comandos disponibles.",
        "Acompañamiento para ajustar y expandir funcionalidades.",
      ],
    },
    faqs: [
      {
        question: "¿Qué puedo controlar desde WhatsApp?",
        answer:
          "Luces, escenas, sensores de movimiento, estados de dispositivos y rutinas programadas. Las funcionalidades dependen de los dispositivos instalados en tu hogar.",
      },
      {
        question: "¿Es seguro controlar mi casa por WhatsApp?",
        answer:
          "Sí. El sistema utiliza autenticación y encriptación. Solo los números autorizados pueden enviar comandos al hogar.",
      },
      {
        question: "¿Funciona con cualquier dispositivo inteligente?",
        answer:
          "Funciona con dispositivos compatibles con los protocolos de integración que manejamos. Evaluamos la compatibilidad en la visita técnica.",
      },
      {
        question: "¿Necesito tener internet en mi casa?",
        answer:
          "Sí, el control por WhatsApp requiere una conexión a internet estable en el hogar.",
      },
      {
        question: "¿Qué pasa si envío un comando incorrecto?",
        answer:
          "El chatbot te responde con opciones válidas y confirmaciones antes de ejecutar acciones críticas.",
      },
    ],
    cta: {
      label: "Explorar automatización por WhatsApp",
      whatsappMessage:
        "Hola Casa Atenta, me interesa controlar mi hogar desde WhatsApp. Quiero saber qué opciones tienen disponibles.",
      href: createWhatsAppLink(
        "Hola Casa Atenta, me interesa controlar mi hogar desde WhatsApp. Quiero saber qué opciones tienen disponibles."
      ),
    },
    relatedServices: [
      "smart-homes",
      "iluminacion-inteligente",
      "mantenimiento-general",
    ],
  },

  "mantenimiento-general": {
    slug: "mantenimiento-general",
    seo: {
      title: "Mantenimiento general para hogares en Lima | Casa Atenta",
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
          "No solo reparamos. Cuidamos que cada intervención mantenga la estética del espacio.",
      },
      {
        title: "Atención ordenada",
        description:
          "Diagnóstico claro, propuesta con alcance definido y ejecución organizada.",
      },
      {
        title: "Versatilidad",
        description:
          "Desde resane y pintura hasta ajustes eléctricos, carpintería y acabados.",
      },
      {
        title: "Protección del entorno",
        description:
          "Trabajamos con protección de pisos, muebles y superficies durante la intervención.",
      },
      {
        title: "Transparencia",
        description:
          "Cotizaciones claras con desglose de materiales, mano de obra y tiempos.",
      },
      {
        title: "Acompañamiento",
        description:
          "Seguimiento post-intervención para asegurar la calidad del trabajo.",
      },
    ],
    process: {
      title: "Cómo atendemos tu mantenimiento",
      steps: [
        "Diagnóstico del espacio y las necesidades reportadas.",
        "Propuesta con alcance, materiales y cronograma.",
        "Cotización clara y aprobación.",
        "Ejecución con protección y orden.",
        "Entrega con revisión y recomendaciones de cuidado.",
      ],
    },
    faqs: [
      {
        question: "¿Qué tipo de mantenimiento ofrecen?",
        answer:
          "Pintura, resane, carpintería básica, ajustes eléctricos, plomería menor, limpieza de superficies y mejoras estéticas generales.",
      },
      {
        question: "¿Tienen un monto mínimo de servicio?",
        answer:
          "Evaluamos cada caso. Para intervenciones muy pequeñas, podemos agrupar necesidades en una sola visita técnica.",
      },
      {
        question: "¿Trabajan los fines de semana?",
        answer:
          "Coordinamos horarios según disponibilidad y necesidades del cliente, incluyendo fines de semana cuando es necesario.",
      },
      {
        question: "¿Pueden hacer mantenimiento preventivo recurrente?",
        answer:
          "Sí, ofrecemos planes de mantenimiento periódico para mantener tu hogar en óptimas condiciones.",
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
