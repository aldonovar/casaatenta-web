export type ProductCategorySlug =
  | "inalambricas"
  | "perforacion-demolicion"
  | "corte-desbaste"
  | "taller-industria"
  | "limpieza"
  | "baterias-accesorios";

export type ProductCategory = {
  slug: ProductCategorySlug;
  name: string;
  shortName: string;
  description: string;
  useCase: string;
  accent: string;
};

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductImage = {
  src: string;
  alt: string;
  label: string;
};

export type StoreProduct = {
  id: string;
  slug: string;
  sku: string;
  model: string;
  brand: "Dongcheng";
  name: string;
  shortName: string;
  category: ProductCategorySlug;
  priceMinor: number | null;
  compareAtMinor: number | null;
  stock: number;
  stockLabel: string;
  badge?: string;
  featured?: boolean;
  newArrival?: boolean;
  description: string;
  highlights: string[];
  includes: string[];
  specs: ProductSpec[];
  compatibility?: string;
  warranty: string;
  shippingClass: "standard" | "heavy";
  tone: "blue" | "cyan" | "amber" | "steel" | "navy" | "mint";
  searchTerms: string[];
  media: ProductImage[];
};

type CatalogProduct = Omit<StoreProduct, "media">;

const productViewLabels = [
  "Vista principal",
  "Detalle del producto",
  "Vista adicional",
] as const;

function createProductMedia(
  slug: string,
  productName: string,
  count = 3,
): ProductImage[] {
  return productViewLabels.slice(0, count).map((label, index) => ({
    src: `/products/${slug}/${String(index + 1).padStart(2, "0")}.webp`,
    alt: `${productName}. ${label}.`,
    label,
  }));
}

const productMediaBySlug: Record<string, ProductImage[]> = {
  "amoladora-inalambrica-dcsm04-125pfk-20v": createProductMedia(
    "amoladora-inalambrica-dcsm04-125pfk-20v",
    "Amoladora angular inalámbrica Dongcheng DCSM04-125PFK",
  ),
  "martillo-demoledor-dzg10-sds-max-1500w": createProductMedia(
    "martillo-demoledor-dzg10-sds-max-1500w",
    "Martillo demoledor Dongcheng DZG10",
  ),
  "taladro-magnetico-djc02-23-1600w": createProductMedia(
    "taladro-magnetico-djc02-23-1600w",
    "Taladro magnético Dongcheng DJC02-23",
  ),
  "aspiradora-industrial-dvc30-30l-1200w": createProductMedia(
    "aspiradora-industrial-dvc30-30l-1200w",
    "Aspiradora industrial Dongcheng DVC30",
  ),
  "compresora-silenciosa-dqe1200-30l": createProductMedia(
    "compresora-silenciosa-dqe1200-30l",
    "Compresora silenciosa Dongcheng DQE1200/30L",
  ),
  "martillo-demoledor-dzg06-6s-1400w": createProductMedia(
    "martillo-demoledor-dzg06-6s-1400w",
    "Martillo demoledor Dongcheng DZG06-6S",
  ),
  "multiherramienta-dcmd20em-20v-brushless": createProductMedia(
    "multiherramienta-dcmd20em-20v-brushless",
    "Multiherramienta oscilante Dongcheng DCMD20EM",
  ),
  "bateria-dongcheng-ffbl2040-20v-4ah": createProductMedia(
    "bateria-dongcheng-ffbl2040-20v-4ah",
    "Batería Dongcheng FFBL2040",
  ),
  "bateria-dongcheng-ffbl2050-20v-5ah": createProductMedia(
    "bateria-dongcheng-ffbl2050-20v-5ah",
    "Batería Dongcheng FFBL2050",
  ),
  "bateria-dongcheng-ffbl2060-20v-6ah": createProductMedia(
    "bateria-dongcheng-ffbl2060-20v-6ah",
    "Batería Dongcheng FFBL2060",
  ),
  "llave-impacto-dcpb698-20v-brushless": createProductMedia(
    "llave-impacto-dcpb698-20v-brushless",
    "Llave de impacto Dongcheng DCPB698FK",
  ),
  "sierra-circular-dcmy02-185-20v-brushless": createProductMedia(
    "sierra-circular-dcmy02-185-20v-brushless",
    "Sierra circular Dongcheng DCMY02-185BM",
    1,
  ),
  "lijadora-roto-orbital-dsa02-125-125mm": createProductMedia(
    "lijadora-roto-orbital-dsa02-125-125mm",
    "Lijadora roto orbital Dongcheng DSA02-125",
  ),
  "taladro-percutor-dcjz03-13em-20v-120nm": createProductMedia(
    "taladro-percutor-dcjz03-13em-20v-120nm",
    "Taladro percutor Dongcheng DCJZ03-13EM",
    1,
  ),
  "llave-impacto-dcpb1218fk-20v-1218nm": createProductMedia(
    "llave-impacto-dcpb1218fk-20v-1218nm",
    "Llave de impacto Dongcheng DCPB1218FK",
  ),
  "combo-dckit26am-taladro-atornillador-impacto-20v": createProductMedia(
    "combo-dckit26am-taladro-atornillador-impacto-20v",
    "Combo inalámbrico Dongcheng DCKIT26AM",
  ),
  "amoladora-angular-dsm03-115s-950w": createProductMedia(
    "amoladora-angular-dsm03-115s-950w",
    "Amoladora angular Dongcheng DSM03-115S",
  ),
  "electrosierra-dccs40161h2s-40v-16": createProductMedia(
    "electrosierra-dccs40161h2s-40v-16",
    "Electrosierra Dongcheng DCCS40161H2S",
  ),
};

export const categories: ProductCategory[] = [
  {
    slug: "inalambricas",
    name: "Herramientas inalámbricas",
    shortName: "Inalámbricas",
    description:
      "Plataformas de 12 V y 20 V para trabajar con libertad y compartir baterías compatibles.",
    useCase: "Montaje, instalación y obra",
    accent: "#168bd2",
  },
  {
    slug: "perforacion-demolicion",
    name: "Perforación y demolición",
    shortName: "Perforación",
    description:
      "Rotomartillos, demoledores y perforación especializada para concreto, acero y albañilería.",
    useCase: "Concreto y obra pesada",
    accent: "#e09432",
  },
  {
    slug: "corte-desbaste",
    name: "Corte, desbaste y acabado",
    shortName: "Corte y desbaste",
    description:
      "Amoladoras, sierras, lijadoras y equipos para preparación precisa de superficies.",
    useCase: "Metal, madera y acabados",
    accent: "#4c78a8",
  },
  {
    slug: "taller-industria",
    name: "Taller e industria",
    shortName: "Taller",
    description:
      "Compresoras, taladros magnéticos y maquinaria para producción y mantenimiento.",
    useCase: "Metalmecánica y taller",
    accent: "#6d7681",
  },
  {
    slug: "limpieza",
    name: "Limpieza profesional",
    shortName: "Limpieza",
    description:
      "Aspiración de polvo y agua para obra, taller, mantenimiento y entrega final.",
    useCase: "Obra limpia y mantenimiento",
    accent: "#2c9b9b",
  },
  {
    slug: "baterias-accesorios",
    name: "Baterías y accesorios",
    shortName: "Accesorios",
    description:
      "Baterías, cargadores, consumibles y repuestos organizados por compatibilidad real.",
    useCase: "Autonomía y continuidad",
    accent: "#8aa43b",
  },
];

// Catálogo de referencia para validar la experiencia. Los modelos y atributos
// provienen de oferta pública Dongcheng; precio, stock y garantía se confirman
// con el proveedor antes de activar NEXT_PUBLIC_STORE_MODE=live.
const catalogProducts: CatalogProduct[] = [
  {
    id: "0d74ff65-8f44-4af9-aadc-622d74c53103",
    slug: "amoladora-inalambrica-dcsm04-125pfk-20v",
    sku: "CA-DON-DCSM04-125PFK",
    model: "DCSM04-125PFK",
    brand: "Dongcheng",
    name: "Amoladora angular inalámbrica 5\" 20 V Brushless",
    shortName: "Amoladora inalámbrica 5\"",
    category: "corte-desbaste",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "Kit completo",
    featured: true,
    description:
      "Amoladora profesional sin escobillas con plataforma de 20 V, pensada para corte y desbaste donde la movilidad es crítica.",
    highlights: [
      "Motor brushless de menor mantenimiento",
      "Disco de 125 mm (5 pulgadas)",
      "Kit con dos baterías de 5 Ah",
    ],
    includes: ["Herramienta", "2 baterías 20 V 5 Ah", "Cargador", "Maletín"],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Diámetro", value: "125 mm / 5\"" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Baterías", value: "2 × 5 Ah" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "blue",
    searchTerms: ["amoladora", "esmeril", "angular", "20v", "brushless", "corte"],
  },
  {
    id: "6f497bc2-f9d7-451e-8650-03e98a0fcab1",
    slug: "martillo-demoledor-dzg10-sds-max-1500w",
    sku: "CA-DON-DZG10",
    model: "DZG10",
    brand: "Dongcheng",
    name: "Martillo demoledor SDS-Max 1500 W 16 J",
    shortName: "Demoledor SDS-Max 16 J",
    category: "perforacion-demolicion",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "Alto impacto",
    featured: true,
    description:
      "Equipo SDS-Max para demolición continua en concreto y albañilería, con energía de impacto orientada a obra pesada.",
    highlights: ["16 J de energía de impacto", "Portaherramientas SDS-Max", "Construcción para uso profesional"],
    includes: ["Martillo demoledor", "Empuñadura auxiliar", "Maletín", "Manual"],
    specs: [
      { label: "Potencia", value: "1500 W" },
      { label: "Impacto", value: "16 J" },
      { label: "Encaje", value: "SDS-Max" },
      { label: "Peso referencial", value: "10.4 kg" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "heavy",
    tone: "amber",
    searchTerms: ["martillo", "demoledor", "sds max", "concreto", "16j", "1500w"],
  },
  {
    id: "864f4db4-a349-46fe-bd50-fdd15dff6c39",
    slug: "taladro-magnetico-djc02-23-1600w",
    sku: "CA-DON-DJC02-23",
    model: "DJC02-23",
    brand: "Dongcheng",
    name: "Taladro magnético 1600 W",
    shortName: "Taladro magnético 1600 W",
    category: "taller-industria",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "Industrial",
    featured: true,
    description:
      "Taladro magnético para fabricación y montaje de estructuras metálicas, con base de alta sujeción y sistema de dos velocidades.",
    highlights: ["Fuerza magnética de 15 600 N", "Broca trepanadora de hasta 50 mm", "Perforación helicoidal de hasta 23 mm"],
    includes: ["Taladro magnético", "Sistema de refrigeración", "Cadena de seguridad", "Manual"],
    specs: [
      { label: "Potencia", value: "1600 W" },
      { label: "Fuerza magnética", value: "15 600 N" },
      { label: "Velocidades", value: "130–260 / 260–630 r/min" },
      { label: "Capacidad", value: "50 mm corona / 23 mm broca" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "heavy",
    tone: "steel",
    searchTerms: ["taladro", "magnético", "metalmecánica", "1600w"],
  },
  {
    id: "6904ae52-b25d-480e-91c7-fe21e366f8ea",
    slug: "aspiradora-industrial-dvc30-30l-1200w",
    sku: "CA-DON-DVC30",
    model: "DVC30",
    brand: "Dongcheng",
    name: "Aspiradora industrial polvo y agua 30 L 1200 W",
    shortName: "Aspiradora polvo/agua 30 L",
    category: "limpieza",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "Polvo + agua",
    featured: true,
    description:
      "Aspiración profesional para polvo y líquidos en obra, taller y mantenimiento, con depósito de 30 litros.",
    highlights: ["Trabajo en seco y húmedo", "Depósito de 30 L", "Formato móvil para taller y obra"],
    includes: ["Aspiradora", "Manguera", "Tubos", "Boquillas", "Filtro"],
    specs: [
      { label: "Potencia", value: "1200 W" },
      { label: "Capacidad", value: "30 L" },
      { label: "Aplicación", value: "Polvo y agua" },
      { label: "Alimentación", value: "Con cable" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "heavy",
    tone: "cyan",
    searchTerms: ["aspiradora", "industrial", "polvo", "agua", "30 litros"],
  },
  {
    id: "42b87baa-b3b1-47de-b329-21149fe8fba3",
    slug: "compresora-silenciosa-dqe1200-30l",
    sku: "CA-DON-DQE1200-30L",
    model: "DQE1200/30L",
    brand: "Dongcheng",
    name: "Compresora silenciosa sin aceite 30 L 1200 W",
    shortName: "Compresora silenciosa 30 L",
    category: "taller-industria",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "Sin aceite",
    featured: true,
    description:
      "Compresora compacta de operación silenciosa y libre de aceite para mantenimiento, acabados y trabajo de taller.",
    highlights: ["Motor de 1200 W", "Tanque de 30 L", "Sistema libre de aceite"],
    includes: ["Compresora ensamblada", "Ruedas", "Filtro", "Manual"],
    specs: [
      { label: "Potencia", value: "1200 W" },
      { label: "Tanque", value: "30 L" },
      { label: "Lubricación", value: "Sin aceite" },
      { label: "Aplicación", value: "Taller y mantenimiento" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "heavy",
    tone: "navy",
    searchTerms: ["compresora", "silenciosa", "30l", "sin aceite", "taller"],
  },
  {
    id: "fac52cb8-a029-47fa-a466-63a32f8c92cf",
    slug: "martillo-demoledor-dzg06-6s-1400w",
    sku: "CA-DON-DZG06-6S",
    model: "DZG06-6S",
    brand: "Dongcheng",
    name: "Martillo demoledor hexagonal 17 mm 1400 W",
    shortName: "Demoledor hexagonal 17 mm",
    category: "perforacion-demolicion",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "16.8 J",
    description:
      "Demoledor compacto para retiro de enchapes, apertura de canaletas y demolición controlada.",
    highlights: ["16.8 J de impacto", "Encaje hexagonal de 17 mm", "Relación potencia/peso para obra"],
    includes: ["Martillo", "Cincel", "Empuñadura", "Maletín"],
    specs: [
      { label: "Potencia", value: "1400 W" },
      { label: "Impacto", value: "16.8 J" },
      { label: "Encaje", value: "Hexagonal 17 mm" },
      { label: "Peso referencial", value: "6.8 kg" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "heavy",
    tone: "amber",
    searchTerms: ["martillo", "demoledor", "hexagonal", "17mm", "obra"],
  },
  {
    id: "ce5ca673-0851-4aca-bd65-030462869bd2",
    slug: "multiherramienta-dcmd20em-20v-brushless",
    sku: "CA-DON-DCMD20EM",
    model: "DCMD20EM",
    brand: "Dongcheng",
    name: "Multiherramienta oscilante 20 V Brushless",
    shortName: "Multiherramienta oscilante 20 V",
    category: "inalambricas",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: "2 baterías",
    newArrival: true,
    description:
      "Herramienta oscilante para corte de precisión, raspado y lijado en instalaciones y acabados.",
    highlights: ["Motor brushless", "Plataforma 20 V", "Kit con dos baterías de 4 Ah"],
    includes: ["Herramienta", "2 baterías 4 Ah", "Cargador", "Accesorios", "Maletín"],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Baterías", value: "2 × 4 Ah" },
      { label: "Uso", value: "Corte, raspado y lijado" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "blue",
    searchTerms: ["multitool", "multiherramienta", "oscilante", "20v", "brushless"],
  },
  ...([4, 5, 6] as const).map((capacity) => ({
    id:
      capacity === 4
        ? "f8a71c31-6efc-4f63-b9cf-3bcf8ca6c512"
        : capacity === 5
          ? "464fdfbf-c63d-4ec5-a35d-e57058fe5bce"
          : "5c6db192-7678-4a1d-a96d-61a8856efe6e",
    slug: `bateria-dongcheng-ffbl20${capacity}0-20v-${capacity}ah`,
    sku: `CA-DON-FFBL20${capacity}0`,
    model: `FFBL20${capacity}0`,
    brand: "Dongcheng" as const,
    name: `Batería de ion-litio 20 V Max ${capacity} Ah`,
    shortName: `Batería 20 V ${capacity} Ah`,
    category: "baterias-accesorios" as const,
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Precio y stock por confirmar",
    badge: `${capacity} Ah`,
    description: `Batería recargable de ${capacity} Ah para herramientas compatibles de la plataforma Dongcheng 20 V Max.`,
    highlights: [
      `Capacidad de ${capacity} Ah`,
      "Tecnología ion-litio",
      "Indicador y protecciones según versión",
    ],
    includes: ["Batería"],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Capacidad", value: `${capacity} Ah` },
      { label: "Química", value: "Ion-litio" },
      { label: "Tipo", value: "Batería deslizante" },
    ],
    compatibility:
      "Validar tabla de compatibilidad por modelo antes de la compra",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard" as const,
    tone: "mint" as const,
    searchTerms: ["batería", "20v", `${capacity}ah`, "repuesto", "inalámbrica"],
  })),
  {
    id: "37e4b47e-fdfa-4d5b-823b-75e8031f2ccc",
    slug: "llave-impacto-dcpb698-20v-brushless",
    sku: "CA-DON-DCPB698FK",
    model: "DCPB698FK",
    brand: "Dongcheng",
    name: "Llave de impacto inalámbrica 20 V Brushless 698 Nm",
    shortName: "Llave de impacto DCPB698FK",
    category: "inalambricas",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Próximo ingreso",
    badge: "20 V Max",
    newArrival: true,
    description:
      "Llave de impacto de alto torque para montaje, mantenimiento automotriz y estructuras.",
    highlights: ["Motor brushless de 750 W", "Cuatro niveles de velocidad", "Torque de arranque de hasta 910 Nm"],
    includes: ["Herramienta", "Configuración de baterías y cargador por confirmar por lote"],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Cuadrante", value: "12.7 mm / 1/2\"" },
      { label: "Torque de apriete", value: "Hasta 698 Nm" },
      { label: "Torque de arranque", value: "Hasta 910 Nm" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "blue",
    searchTerms: ["llave", "impacto", "dcpb698", "20v", "automotriz"],
  },
  {
    id: "d8f8c208-fb8d-4924-a239-0d15d0e900b6",
    slug: "sierra-circular-dcmy02-185-20v-brushless",
    sku: "CA-DON-DCMY02-185BM",
    model: "DCMY02-185BM",
    brand: "Dongcheng",
    name: "Sierra circular inalámbrica 185 mm 20 V Brushless",
    shortName: "Sierra circular 185 mm",
    category: "corte-desbaste",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Próximo ingreso",
    badge: "7 1/4\"",
    newArrival: true,
    description:
      "Sierra circular inalámbrica para cortes de obra y taller con disco de 185 mm y motor sin escobillas.",
    highlights: ["Disco de 185 mm", "Motor brushless", "Extracción de polvo compatible"],
    includes: ["Configuración de kit por confirmar"],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Disco", value: "185 mm / 7 1/4\"" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Corte máximo", value: "65 mm a 90° / 45 mm a 45°" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "steel",
    searchTerms: ["sierra", "circular", "185mm", "20v", "madera"],
  },
  {
    id: "c32866bb-3a59-48c7-a0ce-5a8d65e7fb65",
    slug: "lijadora-roto-orbital-dsa02-125-125mm",
    sku: "CA-DON-DSA02-125",
    model: "DSA02-125",
    brand: "Dongcheng",
    name: "Lijadora roto orbital 125 mm",
    shortName: "Lijadora roto orbital 125 mm",
    category: "corte-desbaste",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Próximo ingreso",
    badge: "Acabado",
    description:
      "Lijadora de 125 mm para preparación y terminación de madera, pintura y superficies.",
    highlights: ["Base de 125 mm", "Movimiento roto orbital", "Control de polvo"],
    includes: ["Configuración comercial por confirmar"],
    specs: [
      { label: "Diámetro", value: "125 mm" },
      { label: "Aplicación", value: "Lijado y acabado" },
      { label: "Extracción", value: "Colector de polvo" },
      { label: "Kit", value: "A definir" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "steel",
    searchTerms: ["lijadora", "orbital", "125mm", "acabado", "madera"],
  },
  {
    id: "23d069e2-1b54-4ad5-99a5-7a9de856e22d",
    slug: "taladro-percutor-dcjz03-13em-20v-120nm",
    sku: "CA-DON-DCJZ03-13EM",
    model: "DCJZ03-13EM",
    brand: "Dongcheng",
    name: "Taladro percutor inalámbrico 13 mm 20 V Brushless 120 Nm",
    shortName: "Taladro percutor 20 V 120 Nm",
    category: "inalambricas",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Configuración comercial pendiente",
    badge: "120 Nm",
    newArrival: true,
    description:
      "Taladro percutor sin escobillas para perforación y atornillado exigente, con tres modos de trabajo y mandril de 13 mm.",
    highlights: [
      "Torque máximo declarado de 120 Nm",
      "Dos velocidades y ajuste 24 + 2",
      "Capacidad en madera de hasta 45 mm",
    ],
    includes: [
      "Taladro percutor",
      "Mango auxiliar",
      "Gancho para cinturón",
      "Baterías, cargador y maletín según lote aprobado",
    ],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Mandril", value: "13 mm" },
      { label: "Velocidad", value: "0–500 / 0–2000 r/min" },
      { label: "Torque máximo", value: "120 Nm" },
      { label: "Perforación", value: "Acero 13 mm · Concreto 13 mm · Madera 45 mm" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max; validar batería incluida por lote",
    warranty: "Garantía y red de servicio por confirmar en la orden de compra del proveedor",
    shippingClass: "standard",
    tone: "blue",
    searchTerms: ["taladro", "percutor", "dcjz03", "120nm", "20v", "brushless"],
  },
  {
    id: "264ca881-dbe6-4af3-bf8e-b8d0ed22858b",
    slug: "llave-impacto-dcpb1218fk-20v-1218nm",
    sku: "CA-DON-DCPB1218FK",
    model: "DCPB1218FK",
    brand: "Dongcheng",
    name: "Llave de impacto inalámbrica 20 V Brushless 1218 Nm",
    shortName: "Llave de impacto 1218 Nm",
    category: "inalambricas",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Configuración comercial pendiente",
    badge: "Alto torque",
    newArrival: true,
    description:
      "Llave de impacto industrial de alto torque para mantenimiento de maquinaria, montaje de estructuras y trabajo automotriz pesado.",
    highlights: [
      "Torque máximo declarado de 1218 Nm",
      "Motor brushless",
      "Modos de velocidad e impacto seleccionables",
    ],
    includes: ["Herramienta", "Baterías, cargador, encastre y maletín por validar por lote"],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Torque máximo", value: "1218 Nm" },
      { label: "Aplicación", value: "Montaje y mantenimiento industrial" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max; confirmar encastre y batería del kit FK",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "navy",
    searchTerms: ["llave", "impacto", "1218nm", "dcpb1218", "industrial", "20v"],
  },
  {
    id: "3c8fee14-1b80-4325-858d-8dbc2d4e16f0",
    slug: "combo-dckit26am-taladro-atornillador-impacto-20v",
    sku: "CA-DON-DCKIT26AM",
    model: "DCKIT26AM",
    brand: "Dongcheng",
    name: "Combo 20 V Brushless: taladro percutor + atornillador de impacto",
    shortName: "Combo taladro + impacto 20 V",
    category: "inalambricas",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Contenido del lote por confirmar",
    badge: "Combo Pro",
    newArrival: true,
    description:
      "Kit combinado de plataforma 20 V para perforación, atornillado e instalación, organizado en maletín de transporte.",
    highlights: [
      "Dos herramientas brushless",
      "Plataforma compartida de 20 V",
      "Configuración orientada a instalación y obra",
    ],
    includes: [
      "Taladro percutor",
      "Atornillador de impacto",
      "Maletín",
      "Baterías y cargador según configuración aprobada",
    ],
    specs: [
      { label: "Voltaje", value: "20 V Max" },
      { label: "Herramientas", value: "2" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Configuración", value: "Validación final por lote" },
    ],
    compatibility: "Plataforma Dongcheng 20 V Max",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "blue",
    searchTerms: ["combo", "kit", "dckit26am", "taladro", "impacto", "20v"],
  },
  {
    id: "ce3e9f37-2a11-4745-8818-98d7af48d031",
    slug: "amoladora-angular-dsm03-115s-950w",
    sku: "CA-DON-DSM03-115S",
    model: "DSM03-115S",
    brand: "Dongcheng",
    name: "Amoladora angular 115 mm 950 W",
    shortName: "Amoladora 4 1/2\" 950 W",
    category: "corte-desbaste",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Condición comercial pendiente",
    badge: "Con cable",
    description:
      "Amoladora angular compacta para corte y desbaste de metal con disco de 115 mm y alimentación por cable.",
    highlights: ["Potencia declarada de 950 W", "Disco de 115 mm", "Formato compacto para taller"],
    includes: ["Amoladora", "Guarda", "Empuñadura auxiliar", "Llave"],
    specs: [
      { label: "Potencia", value: "950 W" },
      { label: "Diámetro", value: "115 mm / 4 1/2\"" },
      { label: "Velocidad", value: "11 800 r/min" },
      { label: "Alimentación", value: "Con cable" },
    ],
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "standard",
    tone: "steel",
    searchTerms: ["amoladora", "esmeril", "dsm03", "115mm", "950w", "cable"],
  },
  {
    id: "2090e79c-6c38-419c-bf1c-00bc82869592",
    slug: "electrosierra-dccs40161h2s-40v-16",
    sku: "CA-DON-DCCS40161H2S",
    model: "DCCS40161H2S",
    brand: "Dongcheng",
    name: "Electrosierra inalámbrica 16\" 40 V Brushless",
    shortName: "Electrosierra 16\" 40 V",
    category: "inalambricas",
    priceMinor: null,
    compareAtMinor: null,
    stock: 0,
    stockLabel: "Configuración comercial pendiente",
    badge: "2 × 20 V",
    newArrival: true,
    description:
      "Electrosierra brushless para poda y corte de madera que combina dos baterías de la plataforma 20 V para operar a 40 V.",
    highlights: [
      "Barra de 16 pulgadas",
      "Lubricación automática de cadena",
      "Sistema de freno y tensado sin herramientas",
    ],
    includes: ["Electrosierra", "Barra y cadena", "Baterías y cargadores según lote"],
    specs: [
      { label: "Voltaje", value: "40 V (20 V + 20 V)" },
      { label: "Barra", value: "16 pulgadas" },
      { label: "Motor", value: "Sin escobillas" },
      { label: "Configuración Perú 2025", value: "2 × 5 Ah; validar lote porque la ficha global actual difiere" },
    ],
    compatibility: "Opera con dos baterías compatibles Dongcheng 20 V Max del mismo tipo y estado",
    warranty: "Garantía exacta pendiente de homologación con proveedor",
    shippingClass: "heavy",
    tone: "mint",
    searchTerms: ["electrosierra", "motosierra", "16 pulgadas", "40v", "dcs40161", "poda"],
  },
];

export const products: StoreProduct[] = catalogProducts.map((product) => ({
  ...product,
  media: productMediaBySlug[product.slug] ?? [],
}));

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getProductsByCategory(category: ProductCategorySlug) {
  return products.filter((product) => product.category === category);
}

export function getRelatedProducts(product: StoreProduct, limit = 4) {
  return products
    .filter(
      (candidate) =>
        candidate.id !== product.id &&
        (candidate.category === product.category ||
          candidate.compatibility === product.compatibility),
    )
    .slice(0, limit);
}

export function discountPercent(product: StoreProduct) {
  if (!product.priceMinor || !product.compareAtMinor) return 0;
  return Math.round((1 - product.priceMinor / product.compareAtMinor) * 100);
}
