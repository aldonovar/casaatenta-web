import { STORE_LEGAL_UPDATED_AT, STORE_LEGAL_VERSIONS } from "./store-legal";

export type StoreLegalSection = {
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  links?: readonly { label: string; href: string }[];
};

export type StoreLegalDocument = {
  title: string;
  eyebrow: string;
  description: string;
  version: string;
  updatedAt: string;
  sections: readonly StoreLegalSection[];
};

export const privacyDocument: StoreLegalDocument = {
  title: "Política de Privacidad de la Tienda",
  eyebrow: "Datos personales",
  description:
    "Cómo Casa Atenta trata los datos de cuentas, compras, pagos, entregas, garantías y atención posventa.",
  version: STORE_LEGAL_VERSIONS.privacy,
  updatedAt: STORE_LEGAL_UPDATED_AT,
  sections: [
    {
      title: "1. Responsable y alcance",
      paragraphs: [
        "CASA ATENTA, operada por Jhon Bryan Febres Urbano, persona natural con negocio, RUC 10742914599, es responsable del tratamiento descrito en esta política. El domicilio, correo y teléfono oficiales aparecen en el bloque de identificación de esta página.",
        "Esta política cubre tienda.casa-atenta.com, las cuentas de cliente, pedidos, pagos, despacho, comprobantes, garantías, reclamos y solicitudes sobre datos personales. No sustituye las políticas propias de servicios externos a los que el usuario decida acceder.",
      ],
    },
    {
      title: "2. Datos que tratamos",
      paragraphs: [
        "Según la interacción, podemos tratar nombres, correo, teléfono, credenciales administradas por Supabase Auth, identidad de Google asociada por OAuth, DNI/CE/RUC, dirección y referencias de entrega, datos de facturación, historial de pedidos, seriales, garantías, comunicaciones y reclamos.",
        "Casa Atenta no recibe ni almacena el número completo de tarjeta ni el CVV. Openpay tokeniza esos datos y puede generar identificadores técnicos para prevención de fraude. También tratamos registros de seguridad, sesión, dirección IP seudonimizada, agente de usuario y evidencia de consentimientos cuando resulte necesario y proporcional.",
      ],
    },
    {
      title: "3. Finalidades y base de tratamiento",
      paragraphs: [
        "Los datos necesarios para crear una cuenta, autenticar al usuario, preparar una compra, cobrar, entregar, emitir el comprobante, atender una garantía o responder un reclamo se tratan para ejecutar la relación solicitada y cumplir obligaciones legales. Negarse a proporcionar un campo marcado como obligatorio puede impedir completar esa operación.",
        "La seguridad, prevención de fraude, auditoría e investigación de incidentes se realizan para proteger al usuario, la plataforma y las transacciones. Las comunicaciones publicitarias requieren una autorización separada, opcional, revocable y nunca condicionan la compra.",
      ],
    },
    {
      title: "4. Proveedores, destinatarios y transferencias",
      paragraphs: [
        "Podemos encargar operaciones limitadas a Vercel y Cloudflare (infraestructura y seguridad), Supabase (base de datos y autenticación), Google (identidad OAuth cuando se elige), Openpay (pago y antifraude), Resend (correo transaccional) y al proveedor de comprobantes electrónicos que se contrate. Transportistas y técnicos reciben únicamente los datos necesarios para la entrega o posventa.",
        "Algunos proveedores pueden procesar información fuera del Perú. Casa Atenta debe documentar esos flujos, aplicar contratos y medidas apropiadas, comunicar las transferencias que correspondan y mantener actualizado el registro de bancos de datos antes de activar la operación comercial.",
      ],
    },
    {
      title: "5. Conservación y eliminación",
      paragraphs: [
        "Los datos de cuenta se conservan mientras permanezca activa y durante el periodo necesario para resolver obligaciones pendientes. Pedidos, pagos, comprobantes, garantías y reclamos se conservan durante los plazos legales, tributarios y de prescripción aplicables; la evidencia del Libro de Reclamaciones se mantiene al menos dos años.",
        "Los registros de interacción lógica y seguridad se conservan por el periodo definido en el Documento de Seguridad, con un mínimo operativo de dos años cuando la normativa aplicable lo exija. Finalizado cada plazo, la información se elimina, anonimiza o bloquea de manera controlada, salvo obligación de conservación.",
      ],
    },
    {
      title: "6. Derechos y solicitudes",
      paragraphs: [
        "El titular puede solicitar información, acceso, actualización, rectificación, cancelación o supresión, oposición, revocación y, cuando corresponda, portabilidad. El trámite es gratuito; pediremos solo la verificación de identidad proporcional para evitar entregar datos a terceros.",
        "La solicitud se presenta al correo de privacidad o al domicilio publicado. Si la respuesta no resulta satisfactoria, el titular puede acudir ante la Autoridad Nacional de Protección de Datos Personales. Casa Atenta publicará además un canal específico para exportación y eliminación de cuenta antes del lanzamiento comercial.",
      ],
      links: [
        { label: "Autoridad Nacional de Protección de Datos Personales", href: "https://www.gob.pe/anpd" },
        { label: "Registro Nacional de Protección de Datos Personales", href: "https://www.gob.pe/8060" },
      ],
    },
    {
      title: "7. Seguridad e incidentes",
      paragraphs: [
        "Aplicamos cifrado en tránsito, control de acceso por funciones, políticas de seguridad por fila, verificación de sesión, autenticación multifactor opcional, registros de auditoría y minimización de datos. Ninguna medida elimina por completo el riesgo, por lo que se mantienen procedimientos de detección, contención, recuperación y notificación de incidentes dentro de los plazos aplicables.",
      ],
    },
    {
      title: "8. Menores, automatización y cambios",
      paragraphs: [
        "La tienda no está dirigida a menores de edad. Openpay puede evaluar señales automatizadas de riesgo; una alerta no debe privar al consumidor de solicitar revisión humana por los canales de soporte.",
        "Toda modificación material genera una nueva versión. Cuando el cambio requiera aceptación, la cuenta o el checkout solicitarán una acción expresa y conservarán la versión aceptada.",
      ],
    },
  ],
};

export const purchaseTermsDocument: StoreLegalDocument = {
  title: "Términos de la Cuenta y de Compra",
  eyebrow: "Contrato electrónico",
  description:
    "Condiciones para usar una cuenta, realizar pedidos y contratar productos en Casa Atenta Tienda.",
  version: STORE_LEGAL_VERSIONS.purchaseTerms,
  updatedAt: STORE_LEGAL_UPDATED_AT,
  sections: [
    {
      title: "1. Proveedor y aceptación",
      paragraphs: [
        "El proveedor es Jhon Bryan Febres Urbano, persona natural con negocio que opera bajo el nombre comercial CASA ATENTA, RUC 10742914599. Sus datos completos de contacto y domicilio figuran en esta página y en el Libro de Reclamaciones.",
        "Estos términos se aceptan mediante una casilla no premarcada. La navegación por sí sola no constituye aceptación de una compra. El sistema registra la versión, huella del documento, fecha del servidor y pedido asociado; el cliente puede conservar o imprimir una copia.",
      ],
    },
    {
      title: "2. Cuenta y seguridad",
      paragraphs: [
        "La cuenta es personal. El usuario debe proporcionar datos veraces, proteger sus credenciales y avisar accesos no reconocidos. Puede ingresar con correo y contraseña, enlace temporal o un proveedor de identidad habilitado. La autenticación multifactor puede exigirse para operaciones sensibles.",
        "Casa Atenta puede bloquear temporalmente una sesión por riesgo o abuso, sin eliminar pedidos ni derechos del consumidor. La eliminación de cuenta no borra información que deba conservarse por obligaciones comerciales, tributarias, de seguridad o defensa de derechos.",
      ],
    },
    {
      title: "3. Productos, precio y disponibilidad",
      paragraphs: [
        "Cada ficha debe identificar modelo, configuración del kit, precio final en soles con IGV, stock, garantía y restricciones relevantes. Las fotografías son referenciales cuando se indique; prevalece el modelo y contenido exacto descrito en el pedido.",
        "Un producto sin precio, stock, contenido o aprobación comercial no puede cobrarse. Las promociones deben informar vigencia, unidades, restricciones y condiciones. El servidor vuelve a validar precio, cupón y stock antes de crear la orden.",
      ],
    },
    {
      title: "4. Formación del pedido",
      paragraphs: [
        "El carrito es una selección preliminar. Antes de pagar se muestra el resumen con productos, cantidades, descuentos, envío e importe total. El pedido queda formado cuando la plataforma confirma la operación y asigna un número de orden; si el pago queda pendiente, se informará su estado.",
        "Casa Atenta no sustituirá un modelo sin autorización. Si un error evidente de precio o disponibilidad impide cumplir, informará al consumidor y devolverá íntegramente cualquier importe cobrado por el mismo medio, sin limitar los demás derechos que correspondan.",
      ],
    },
    {
      title: "5. Pago y comprobante",
      paragraphs: [
        "Los pagos con tarjeta se tokenizan y procesan mediante Openpay. Casa Atenta no solicita el CVV por correo, chat o teléfono. Una validación antifraude puede dejar la operación pendiente de revisión; el consumidor recibirá instrucciones y no deberá repetir el pago hasta obtener confirmación.",
        "Antes de habilitar ventas, Casa Atenta integrará la emisión de boleta o factura electrónica y su puesta a disposición conforme a SUNAT. La factura requiere RUC y razón social válidos. Reembolsos y notas de crédito seguirán el estado real del pago y del comprobante.",
      ],
    },
    {
      title: "6. Entrega, cambios y garantía",
      paragraphs: [
        "La tarifa y ventana final de entrega deben mostrarse antes del pago. Las condiciones operativas, cambios, devoluciones y garantía forman parte de estos términos y se encuentran en el documento enlazado desde el checkout.",
        "Ninguna política voluntaria reduce los derechos por falta de idoneidad, defecto, producto distinto, información incorrecta o incumplimiento. No existe una exigencia general de mantener sellado un producto defectuoso para solicitar una solución.",
      ],
    },
    {
      title: "7. Cancelaciones y reembolsos",
      paragraphs: [
        "Una cancelación solicitada antes del despacho se evaluará según el estado real de preparación y las obligaciones aplicables. Cuando corresponda reembolso, Casa Atenta informará el importe, medio y fecha de procesamiento; el plazo de abono final también depende de la entidad financiera.",
        "No se presenta como derecho general un plazo de arrepentimiento de siete días para toda compra online. Esto no afecta soluciones obligatorias por incumplimiento ni una política voluntaria más favorable que Casa Atenta publique expresamente.",
      ],
    },
    {
      title: "8. Atención, reclamos y ley aplicable",
      paragraphs: [
        "El soporte, la política de devoluciones y el Libro de Reclamaciones son canales complementarios. Registrar un reclamo no impide acudir a Indecopi ni ejercer otro derecho. Casa Atenta responde el Libro dentro del plazo legal aplicable.",
        "Se aplica la legislación peruana y las reglas de competencia que protegen al consumidor. Estos términos no imponen una renuncia anticipada a autoridades, fueros o derechos irrenunciables.",
      ],
      links: [
        { label: "Código de Protección y Defensa del Consumidor", href: "https://diariooficial.elperuano.pe/Normas/obtenerDocumento?idNorma=17" },
        { label: "Indecopi", href: "https://www.gob.pe/indecopi" },
      ],
    },
  ],
};

export const fulfilmentDocument: StoreLegalDocument = {
  title: "Entregas, Cambios, Devoluciones y Garantías",
  eyebrow: "Operación y posventa",
  description:
    "Reglas para recibir, revisar y solicitar atención por un producto de Casa Atenta Tienda.",
  version: STORE_LEGAL_VERSIONS.fulfilment,
  updatedAt: STORE_LEGAL_UPDATED_AT,
  sections: [
    {
      title: "1. Cobertura y tarifa de entrega",
      paragraphs: [
        "El checkout debe mostrar el destino cubierto, la tarifa final y la ventana estimada antes del pago. Si el peso, dimensiones o provincia requieren cotización, no se cobrará hasta que el consumidor conozca y acepte el importe. No se añadirán cargos obligatorios después de confirmar el pedido.",
        "El cliente debe facilitar dirección, referencia y contacto correctos. Un cambio solicitado después del despacho puede generar un costo adicional previamente informado y aceptado.",
      ],
    },
    {
      title: "2. Recepción e incidencias de entrega",
      paragraphs: [
        "Al recibir, se recomienda revisar modelo, cantidad, golpes visibles, sellos y accesorios, y dejar constancia de cualquier incidencia. Esta recomendación facilita la investigación, pero no elimina derechos por defectos ocultos o falta de idoneidad.",
        "Si el producto llega dañado, incompleto o distinto, el cliente debe contactar soporte con el número de pedido y evidencia disponible. Casa Atenta coordinará diagnóstico, recojo o solución sin imponer una carga desproporcionada.",
      ],
    },
    {
      title: "3. Derechos por incumplimiento o defecto",
      paragraphs: [
        "Cuando el producto no sea idóneo, sea defectuoso, no corresponda a lo ofrecido o una entrega tardía haya perdido utilidad, se aplicarán los remedios previstos por la normativa: reparación, sustitución, nueva ejecución, reducción, devolución u otra solución que corresponda al caso.",
        "La evaluación considera el uso normal, instrucciones, seguridad y oferta publicada. No puede condicionarse automáticamente la atención de un defecto a conservar el producto sellado o todo el empaque.",
      ],
    },
    {
      title: "4. Cambio voluntario por preferencia",
      paragraphs: [
        "Un cambio por preferencia, compatibilidad o elección equivocada solo existe si la ficha o campaña lo ofrece expresamente. En ese caso se informarán plazo, estado admisible, accesorios, costos logísticos y exclusiones antes de comprar. Esta política voluntaria es independiente de los derechos por defecto o incumplimiento.",
      ],
    },
    {
      title: "5. Procedimiento y diagnóstico",
      paragraphs: [
        "La solicitud se inicia por soporte indicando pedido, modelo, serial y problema. Casa Atenta entrega constancia, instrucciones de traslado y plazo estimado. El diagnóstico técnico debe explicar el resultado y no puede cobrar costos no informados previamente.",
        "Cuando corresponda un reembolso, se confirmará por escrito el importe y medio. Si interviene el emisor de la tarjeta, se distinguirá la fecha de procesamiento de Casa Atenta del plazo bancario de visualización.",
      ],
    },
    {
      title: "6. Garantía",
      paragraphs: [
        "Cada SKU habilitado debe mostrar garantía aplicable, responsable, alcance, plazo, red técnica y exclusiones válidas. La garantía comercial del fabricante o vendedor se suma a la protección legal y no puede reducirla.",
        "Daños por uso contrario a instrucciones, alteraciones no autorizadas o consumibles agotados se evalúan con sustento técnico. La sola apertura necesaria para comprobar un defecto no autoriza a rechazar automáticamente la atención.",
      ],
    },
  ],
};

export const cookiesDocument: StoreLegalDocument = {
  title: "Política de Cookies y Almacenamiento Local",
  eyebrow: "Tecnologías necesarias",
  description:
    "Inventario de cookies, almacenamiento del carrito e identificadores técnicos de la tienda.",
  version: STORE_LEGAL_VERSIONS.cookies,
  updatedAt: STORE_LEGAL_UPDATED_AT,
  sections: [
    {
      title: "1. Tecnologías utilizadas",
      paragraphs: [
        "La tienda utiliza cookies de sesión de Supabase para autenticación y seguridad. El carrito se conserva en el almacenamiento local del navegador bajo la clave casa-atenta-store-cart-v1; contiene identificadores de producto y cantidades, no datos de tarjeta.",
        "Al abrir el checkout, Openpay puede generar un identificador de dispositivo y usar señales técnicas para tokenización y prevención de fraude. Su carga solo es necesaria en el flujo de pago.",
      ],
    },
    {
      title: "2. Finalidad y duración",
      paragraphs: [
        "Las cookies de autenticación mantienen y renuevan una sesión segura durante el periodo configurado. El carrito permanece hasta que el usuario lo vacíe, complete el pedido o elimine el almacenamiento del sitio. Los identificadores antifraude siguen la duración definida por Openpay y la normativa aplicable.",
      ],
    },
    {
      title: "3. Elección del usuario",
      paragraphs: [
        "No se han integrado cookies publicitarias ni analítica opcional en esta versión. Por ello no mostramos un banner que simule una elección inexistente. Bloquear cookies necesarias puede impedir iniciar sesión o pagar; el catálogo seguirá disponible cuando sea técnicamente posible.",
        "Si en el futuro se incorpora analítica o publicidad, se bloqueará antes de la autorización y se ofrecerán aceptar, rechazar y configurar con igual facilidad. La preferencia será granular, revocable y versionada.",
      ],
    },
    {
      title: "4. Gestión y contacto",
      paragraphs: [
        "El usuario puede borrar cookies y almacenamiento desde la configuración del navegador. Para cerrar la sesión de Casa Atenta debe usar también la opción Salir. Las preguntas sobre estas tecnologías se atienden en el correo de privacidad publicado.",
      ],
    },
  ],
};

export const storeLegalDocuments = {
  privacy: privacyDocument,
  purchaseTerms: purchaseTermsDocument,
  fulfilment: fulfilmentDocument,
  cookies: cookiesDocument,
} as const;
