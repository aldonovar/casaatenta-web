export interface BlogPost {
  slug: string;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
  hero: {
    h1: string;
    subtitle: string;
    image: string;
    imageAlt: string;
    date: string;
    readTime: string;
    category: string;
  };
  sections: BlogSection[];
  faqs: { question: string; answer: string }[];
  relatedServices: string[];
  relatedPosts: string[];
}

export interface BlogSection {
  heading: string;
  content: string;
  list?: string[];
}

export const blogPosts: Record<string, BlogPost> = {
  "como-elegir-techo-sol-y-sombra": {
    slug: "como-elegir-techo-sol-y-sombra",
    seo: {
      title: "Cómo elegir un techo sol y sombra para tu terraza | Casa Atenta",
      description:
        "Guía completa para elegir el techo sol y sombra ideal para tu terraza. Materiales, orientación, presupuesto y recomendaciones técnicas.",
      keywords: [
        "cómo elegir techo sol y sombra",
        "techo sol y sombra para terraza",
        "tipos de techos sol y sombra",
        "materiales techo exterior",
        "sombra para terraza Lima",
      ],
    },
    hero: {
      h1: "Cómo elegir un techo sol y sombra para tu terraza",
      subtitle:
        "Una guía clara para tomar la mejor decisión: materiales, orientación, presupuesto y criterios de diseño.",
      image: "/backgrounds/casestudy.png",
      imageAlt:
        "Terraza con techo sol y sombra de madera con luz cálida filtrada.",
      date: "2026-06-15",
      readTime: "6 min",
      category: "Espacios exteriores",
    },
    sections: [
      {
        heading: "¿Qué es un techo sol y sombra?",
        content:
          "Un techo sol y sombra es una estructura de cobertura parcial diseñada para filtrar la luz solar directa, generar sombra controlada y proteger espacios exteriores sin cerrarlos por completo. A diferencia de un techo convencional, permite el paso de aire y luz, creando un ambiente agradable para terrazas, patios y jardines.",
      },
      {
        heading: "Factores clave para elegir el techo correcto",
        content:
          "Antes de elegir un techo sol y sombra, hay varios factores que debes considerar para asegurarte de que la inversión sea la correcta:",
        list: [
          "Orientación solar: ¿hacia dónde mira tu terraza? La orientación determina cuántas horas de sol recibe y qué tipo de protección necesitas.",
          "Uso del espacio: ¿lo usarás para reuniones, descanso, comidas o trabajo? El uso define la cantidad de sombra y ventilación necesaria.",
          "Materiales disponibles: madera, aluminio, policarbonato, tela tensada. Cada material tiene ventajas en durabilidad, estética y mantenimiento.",
          "Presupuesto: define un rango realista. Un buen techo sol y sombra es una inversión que incrementa el valor de tu propiedad.",
          "Estética general: el techo debe integrarse con el estilo de tu hogar, no parecer un añadido improvisado.",
        ],
      },
      {
        heading: "Tipos de materiales más comunes",
        content:
          "Los materiales más utilizados en Lima para techos sol y sombra son:",
        list: [
          "Madera tratada: calidez visual, alta estética, requiere mantenimiento periódico.",
          "Aluminio anodizado: ligero, resistente a la corrosión, bajo mantenimiento.",
          "Policarbonato: permite paso de luz, protege de la lluvia, opción económica.",
          "Tela tensada con protección UV: flexible, moderna, ideal para espacios que buscan ligereza visual.",
          "Acero con acabado anticorrosivo: máxima resistencia, ideal para estructuras de gran tamaño.",
        ],
      },
      {
        heading: "¿Cuándo conviene invertir en un techo sol y sombra?",
        content:
          "Si tienes una terraza, balcón, azotea o patio que usas menos de lo que podrías por el sol directo, un techo sol y sombra puede transformar ese espacio en un ambiente habitable. En Lima, donde el sol puede ser intenso especialmente en verano, contar con sombra controlada te permite aprovechar tu exterior durante más horas del día.",
      },
      {
        heading: "Recomendaciones finales",
        content:
          "Antes de comprar o instalar un techo sol y sombra, te recomendamos:",
        list: [
          "Solicita una visita técnica para que un profesional evalúe tu espacio.",
          "No elijas solo por precio. Considera durabilidad, estética y mantenimiento.",
          "Piensa en el futuro: ¿podrías necesitar iluminación integrada o motorización?",
          "Compara al menos 2 o 3 propuestas antes de decidir.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta un techo sol y sombra en Lima?",
        answer:
          "El precio varía según tamaño, material y diseño. Un proyecto estándar puede ir desde S/ 2,500 hasta S/ 15,000 o más para diseños premium con madera y acabados especiales.",
      },
      {
        question: "¿Necesito permiso municipal?",
        answer:
          "Depende del tipo de estructura y las regulaciones de tu municipalidad. Para estructuras livianas generalmente no se requiere, pero es recomendable consultar.",
      },
    ],
    relatedServices: ["techos-sol-y-sombra", "diseno-terrazas", "pergolas"],
    relatedPosts: ["ideas-para-terrazas-modernas"],
  },

  "ideas-para-terrazas-modernas": {
    slug: "ideas-para-terrazas-modernas",
    seo: {
      title: "Ideas para diseñar una terraza moderna en Lima | Casa Atenta",
      description:
        "Inspírate con ideas para diseñar una terraza moderna y funcional en Lima. Distribución, materiales, iluminación y sombra para tu espacio exterior.",
      keywords: [
        "ideas terrazas modernas Lima",
        "diseño de terrazas modernas",
        "terraza moderna departamento",
        "decoración terraza exterior",
        "terraza con iluminación Lima",
      ],
    },
    hero: {
      h1: "Ideas para diseñar una terraza moderna en Lima",
      subtitle:
        "Inspiración práctica para convertir tu terraza en un espacio funcional, estético y agradable.",
      image: "/backgrounds/casestudy.png",
      imageAlt: "Terraza moderna con mobiliario exterior, plantas y luz cálida.",
      date: "2026-06-10",
      readTime: "7 min",
      category: "Diseño de terrazas",
    },
    sections: [
      {
        heading: "Tu terraza puede ser mucho más",
        content:
          "Una terraza no es solo un espacio residual del plano. Es una extensión de tu hogar que, bien diseñada, puede convertirse en tu lugar favorito para descansar, recibir visitas, trabajar al aire libre o simplemente desconectar. En Lima, donde la mayoría de los días permiten estar al exterior, aprovechar tu terraza es una decisión inteligente.",
      },
      {
        heading: "Distribuye antes de decorar",
        content:
          "El error más común es empezar por los muebles. Antes de comprar una sola pieza, define las zonas de tu terraza:",
        list: [
          "Zona social: mesa, sillas, bancos. Para reuniones, cenas o cafés.",
          "Zona de descanso: hamaca, tumbona, cojines de piso. Para lectura y relax.",
          "Zona de circulación: pasillos libres que permitan moverse sin obstáculos.",
          "Zona verde: jardineras, macetas o plantas trepadoras que aporten frescura.",
        ],
      },
      {
        heading: "Materiales que funcionan en exterior",
        content:
          "No todo material sirve para exterior, especialmente en Lima donde la humedad costera puede afectar ciertos acabados:",
        list: [
          "Deck de madera plástica (WPC): resiste sol, humedad y no necesita barnizado.",
          "Porcelanato exterior antideslizante: elegante y de fácil limpieza.",
          "Concreto pulido: moderno, industrial y de bajo mantenimiento.",
          "Piedra natural: rústica, resistente, ideal para estilos mediterráneos.",
        ],
      },
      {
        heading: "Iluminación: el secreto de las terrazas que se usan de noche",
        content:
          "Una terraza sin iluminación pierde la mitad de su potencial. La clave está en combinar diferentes tipos de luz:",
        list: [
          "Luz ambiental: tiras LED en jardineras, barandas o perímetros.",
          "Luz focal: spots o apliques para resaltar plantas o texturas.",
          "Luz funcional: sobre la mesa de comedor o zona de preparación.",
          "Luz decorativa: velas, faroles o guirnaldas para momentos especiales.",
        ],
      },
      {
        heading: "Sombra: imprescindible en Lima",
        content:
          "Un techo sol y sombra, pérgola o toldo no es un lujo en Lima: es una necesidad para usar tu terraza durante el día. Elige una opción que combine protección solar con estética y que permita ventilación natural.",
      },
    ],
    faqs: [
      {
        question: "¿Cuánto cuesta rediseñar una terraza?",
        answer:
          "Depende del tamaño y el alcance. Un rediseño puede ir desde mejoras de mobiliario e iluminación hasta una intervención completa con estructura, acabados y automatización.",
      },
      {
        question: "¿Puedo rediseñar la terraza de mi departamento?",
        answer:
          "Sí. Las terrazas de departamentos se pueden mejorar con mobiliario, iluminación, plantas y cubiertas livianas sin afectar la estructura del edificio.",
      },
    ],
    relatedServices: ["diseno-terrazas", "techos-sol-y-sombra", "iluminacion-inteligente"],
    relatedPosts: ["como-elegir-techo-sol-y-sombra"],
  },

  "como-empezar-con-domotica": {
    slug: "como-empezar-con-domotica",
    seo: {
      title: "Qué es una casa inteligente y cómo empezar | Casa Atenta",
      description:
        "Guía práctica para empezar con domótica en tu hogar. Qué es, cómo funciona, por dónde empezar y cuánto cuesta una casa inteligente en Lima.",
      keywords: [
        "cómo empezar con domótica",
        "qué es una casa inteligente",
        "domótica para principiantes",
        "smart home por dónde empezar",
        "domótica en Lima",
      ],
    },
    hero: {
      h1: "Qué es una casa inteligente y cómo empezar",
      subtitle:
        "Una guía sin tecnicismos para entender la domótica y dar el primer paso hacia un hogar más cómodo.",
      image: "/backgrounds/specialties.png",
      imageAlt: "Sistema de automatización residencial con dispositivos integrados.",
      date: "2026-06-05",
      readTime: "8 min",
      category: "Smart homes",
    },
    sections: [
      {
        heading: "¿Qué es una casa inteligente?",
        content:
          "Una casa inteligente (smart home) es un hogar donde dispositivos como luces, sensores, cerraduras, cámaras y electrodomésticos se conectan entre sí y se pueden controlar de forma remota desde un celular, un asistente de voz o incluso desde WhatsApp. No se trata de tener la casa del futuro, sino de hacer más cómodo, seguro y eficiente lo que ya haces todos los días.",
      },
      {
        heading: "¿Por dónde empezar?",
        content:
          "No necesitas automatizar toda tu casa de golpe. De hecho, es mejor empezar con algo pequeño y útil. Las mejores opciones para empezar son:",
        list: [
          "Iluminación inteligente: foquitos o tiras LED que se controlan desde el celular. Puedes cambiar intensidad, color y crear escenas.",
          "Asistente de voz: un Amazon Echo (Alexa) o Google Nest te permite controlar dispositivos con la voz.",
          "Sensor de movimiento: ideal para encender luces automáticamente en pasillos, escaleras o baños.",
          "Enchufe inteligente: convierte cualquier aparato en 'inteligente' controlando su encendido y apagado desde el celular.",
        ],
      },
      {
        heading: "¿Cuánto cuesta empezar?",
        content:
          "La domótica no tiene por qué ser cara. Un kit básico de iluminación inteligente puede costar entre S/ 200 y S/ 800. Un asistente de voz se consigue desde S/ 150. Lo importante es empezar con lo que más impacto tiene en tu rutina diaria y escalar gradualmente.",
      },
      {
        heading: "Errores comunes al empezar",
        content:
          "Evita estos errores frecuentes al iniciar tu proyecto de smart home:",
        list: [
          "Comprar dispositivos de marcas incompatibles entre sí.",
          "No tener una red Wi-Fi estable (la base de todo sistema inteligente).",
          "Querer automatizar todo de golpe sin definir prioridades.",
          "No considerar la ubicación de enchufes y puntos eléctricos.",
          "Ignorar la seguridad de red y contraseñas de dispositivos.",
        ],
      },
      {
        heading: "¿Necesitas ayuda profesional?",
        content:
          "Si quieres ir más allá de lo básico — integrar escenas, sensores, control por WhatsApp o automatizar rutinas completas — un equipo especializado puede diseñar una solución a tu medida, empezando por lo que más usas y escalando según tu presupuesto.",
      },
    ],
    faqs: [
      {
        question: "¿La domótica funciona sin internet?",
        answer:
          "Los dispositivos básicos pueden funcionar con Bluetooth, pero para control remoto y escenas avanzadas necesitas Wi-Fi estable.",
      },
      {
        question: "¿Es difícil de usar?",
        answer:
          "No. Las apps de control son intuitivas y los asistentes de voz hacen que la interacción sea natural. Con WhatsApp es aún más sencillo.",
      },
    ],
    relatedServices: ["smart-homes", "iluminacion-inteligente", "automatizacion-whatsapp"],
    relatedPosts: ["controlar-luces-por-whatsapp", "casa-inteligente-en-lima"],
  },

  "controlar-luces-por-whatsapp": {
    slug: "controlar-luces-por-whatsapp",
    seo: {
      title: "Cómo controlar luces por WhatsApp | Automatización del hogar | Casa Atenta",
      description:
        "Descubre cómo controlar las luces de tu hogar desde WhatsApp. Automatización conversacional para casas inteligentes en Lima.",
      keywords: [
        "controlar luces por WhatsApp",
        "automatización WhatsApp hogar",
        "luces inteligentes WhatsApp",
        "chatbot domótica",
        "control del hogar WhatsApp",
      ],
    },
    hero: {
      h1: "Cómo controlar las luces de tu hogar desde WhatsApp",
      subtitle:
        "Todo el control de tu iluminación inteligente desde la app que ya usas todos los días.",
      image: "/backgrounds/specialties.png",
      imageAlt: "Conversación de WhatsApp controlando luces inteligentes del hogar.",
      date: "2026-05-28",
      readTime: "5 min",
      category: "Automatización",
    },
    sections: [
      {
        heading: "¿Por qué WhatsApp?",
        content:
          "En Perú, más del 90% de usuarios de smartphone usan WhatsApp todos los días. Es la app más natural para comunicarse. ¿Por qué no usar esa misma interfaz para hablar con tu casa? En lugar de descargar otra app que olvidas en una semana, el control del hogar se integra en tu rutina diaria de forma transparente.",
      },
      {
        heading: "¿Cómo funciona?",
        content:
          "El sistema conecta tus dispositivos inteligentes (luces, sensores, enchufes) con un chatbot conversacional en WhatsApp. Tú envías un mensaje como 'Enciende la sala' y el sistema ejecuta la acción. Así de simple.",
        list: [
          "Envías un mensaje de texto o de voz a tu número de Casa Atenta.",
          "El chatbot interpreta tu solicitud usando inteligencia artificial.",
          "Se ejecuta la acción en tus dispositivos inteligentes.",
          "Recibes una confirmación en el mismo chat.",
        ],
      },
      {
        heading: "Ejemplos de comandos",
        content:
          "Estos son algunos de los comandos que puedes usar:",
        list: [
          "'Activa modo terraza' — Enciende luces cálidas y activa la escena exterior.",
          "'Apaga todas las luces' — Apagado general de iluminación.",
          "'Enciende la sala' — Enciende solo las luces de la sala.",
          "'Activa modo noche' — Reduce iluminación y activa sensores de seguridad.",
          "'¿Hay movimiento en la terraza?' — Consulta el estado de un sensor.",
          "'Programa las luces a las 7 pm' — Programa encendido automático.",
        ],
      },
      {
        heading: "¿Qué necesitas para empezar?",
        content:
          "Para controlar tu hogar desde WhatsApp necesitas:",
        list: [
          "Dispositivos inteligentes compatibles instalados en tu hogar.",
          "Conexión Wi-Fi estable.",
          "Configuración del sistema de integración por parte de Casa Atenta.",
          "Un número de WhatsApp asociado a tu hogar.",
        ],
      },
      {
        heading: "Funcionalidades: qué está disponible y qué viene",
        content:
          "Es importante ser transparentes sobre el estado de las funcionalidades:",
        list: [
          "Disponible hoy: control de luces, escenas básicas, encendido/apagado.",
          "En implementación: sensores de movimiento, programación avanzada.",
          "En evaluación: integración con cámaras, cerraduras y electrodomésticos.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿El servicio tiene costo mensual?",
        answer:
          "Los detalles de costos se definen según el alcance de tu instalación. Consultamos en la visita técnica.",
      },
      {
        question: "¿Pueden acceder otras personas a mi sistema?",
        answer:
          "Solo los números de teléfono autorizados pueden enviar comandos. El sistema tiene control de acceso.",
      },
    ],
    relatedServices: ["automatizacion-whatsapp", "iluminacion-inteligente", "smart-homes"],
    relatedPosts: ["como-empezar-con-domotica", "casa-inteligente-en-lima"],
  },

  "casa-inteligente-en-lima": {
    slug: "casa-inteligente-en-lima",
    seo: {
      title: "Casa inteligente en Lima: guía completa de domótica | Casa Atenta",
      description:
        "Todo lo que necesitas saber sobre domótica en Lima. Costos, beneficios, tecnologías disponibles y cómo implementar una casa inteligente en Perú.",
      keywords: [
        "casa inteligente Lima",
        "domótica Lima",
        "smart home Perú",
        "domótica para departamentos Lima",
        "automatización residencial Lima",
      ],
    },
    hero: {
      h1: "Casa inteligente en Lima: lo que necesitas saber",
      subtitle:
        "Una guía realista sobre domótica en Perú: qué funciona, cuánto cuesta y cómo empezar sin complicaciones.",
      image: "/backgrounds/specialties.png",
      imageAlt: "Hogar inteligente moderno con control de luces y sensores en Lima.",
      date: "2026-05-20",
      readTime: "9 min",
      category: "Smart homes",
    },
    sections: [
      {
        heading: "El estado de la domótica en Lima",
        content:
          "La domótica en Lima ha crecido significativamente en los últimos años. Cada vez más hogares incorporan dispositivos inteligentes como focos controlables, asistentes de voz y sensores. Sin embargo, la mayoría de instalaciones son parciales y fragmentadas: un foco aquí, un enchufe allá, sin una visión integrada. La oportunidad está en diseñar sistemas que funcionen juntos.",
      },
      {
        heading: "Beneficios reales de una casa inteligente",
        content:
          "Más allá del factor 'wow', una casa inteligente ofrece beneficios concretos:",
        list: [
          "Comodidad: controla luces, temperatura y dispositivos sin levantarte.",
          "Seguridad: sensores, cámaras y alertas que te avisan si algo pasa.",
          "Ahorro: luces que se apagan solas, horarios optimizados, menos desperdicio.",
          "Rutinas: tu casa se adapta a tu horario, no al revés.",
          "Control remoto: revisa y controla tu hogar desde cualquier lugar.",
        ],
      },
      {
        heading: "¿Cuánto cuesta una casa inteligente en Lima?",
        content:
          "Los costos varían enormemente según el alcance. Una referencia general:",
        list: [
          "Kit básico (iluminación + asistente): desde S/ 500.",
          "Automatización parcial (2-3 habitaciones): desde S/ 2,000.",
          "Automatización integral: desde S/ 5,000 en adelante, según tamaño.",
          "Integración premium con WhatsApp y escenas: cotización personalizada.",
        ],
      },
      {
        heading: "Tecnologías disponibles en Perú",
        content:
          "En Lima se puede acceder a las principales tecnologías de smart home:",
        list: [
          "Philips Hue, LIFX, Yeelight para iluminación inteligente.",
          "Amazon Alexa y Google Home para control de voz.",
          "Sensores Zigbee y Wi-Fi para movimiento y apertura.",
          "Cerraduras inteligentes con código o huella digital.",
          "Integración por WhatsApp con sistemas de automatización conversacional.",
        ],
      },
      {
        heading: "Consejos para implementar domótica en Lima",
        content:
          "Si estás considerando hacer tu casa inteligente en Lima, ten en cuenta:",
        list: [
          "Invierte primero en un buen router y red Wi-Fi estable.",
          "Define qué quieres resolver: comodidad, seguridad, eficiencia.",
          "Empieza por una habitación o un sistema y expande gradualmente.",
          "Busca asesoría profesional para integrar dispositivos correctamente.",
          "Considera la automatización por WhatsApp como una interfaz natural.",
        ],
      },
    ],
    faqs: [
      {
        question: "¿La domótica funciona en departamentos?",
        answer:
          "Sí. La mayoría de dispositivos smart son inalámbricos y no requieren obra civil, lo que los hace ideales para departamentos.",
      },
      {
        question: "¿Necesito contratar a un profesional?",
        answer:
          "Para lo básico puedes empezar solo. Para integración de escenas, sensores y control avanzado, un profesional asegura que todo funcione correctamente.",
      },
    ],
    relatedServices: ["smart-homes", "automatizacion-whatsapp", "iluminacion-inteligente"],
    relatedPosts: ["como-empezar-con-domotica", "controlar-luces-por-whatsapp"],
  },
};

export const allBlogSlugs = Object.keys(blogPosts);

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts[slug];
}
