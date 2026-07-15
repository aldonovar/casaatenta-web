export type CatalogSource = {
  kind: "manufacturer" | "supplier" | "commercial-reference";
  publisher: string;
  label: string;
  url: string;
  version?: string;
  verifiedFields: string[];
  note?: string;
};

const supplierCatalog: CatalogSource = {
  kind: "supplier",
  publisher: "Uyustools Perú",
  label: "Catálogo Dongcheng — herramientas eléctricas e inalámbricas",
  url: "https://uyustools.com.pe/catalogos/",
  version: "Edición Perú 2025",
  verifiedFields: ["modelo", "ficha técnica", "contenido del kit", "funciones"],
  note: "Fuente de alcance local aportada por el proveedor.",
};

const manufacturerCatalog: CatalogSource = {
  kind: "manufacturer",
  publisher: "Jiangsu Dongcheng Power Tools Co., Ltd.",
  label: "Catálogo internacional Dongcheng",
  url: "https://www.dongchengtool.com/es/club/download/detail/1471762978859663361?name=C%C3%81TALOGO",
  version: "2025.04",
  verifiedFields: ["marca", "familia", "plataforma"],
  note: "La configuración del kit puede variar según el mercado.",
};

const modelSources: Record<string, CatalogSource[]> = {
  DZG10: [
    {
      kind: "manufacturer",
      publisher: "DongCheng Tools",
      label: "Ficha oficial DZG10",
      url: "https://www.dongchengtool.com/product/detail/1646897210349",
      verifiedFields: ["1500 W", "16 J", "SDS-Max", "10.4 kg"],
      note: "La ficha oficial prevalece para peso y especificación base.",
    },
  ],
  DCPB698FK: [
    {
      kind: "manufacturer",
      publisher: "DongCheng Tools",
      label: "Ficha oficial DCPB698 (tipo FK)",
      url: "https://www.dongcheng-tools.com/product/20v-max-brushless-cordless-impact-wrench-3.html",
      verifiedFields: ["20 V Max", "motor brushless", "750 W", "torque de apriete"],
      note: "El torque de apriete y el torque de arranque se muestran por separado.",
    },
  ],
  "DJC02-23": [
    {
      kind: "commercial-reference",
      publisher: "Gamaq Perú",
      label: "Ficha local del taladro magnético DJC02-23",
      url: "https://gamaq.pe/producto/taladro-magnetico-dongcheng-1600w-djc02-23/",
      verifiedFields: ["modelo", "potencia", "capacidad", "garantía local referencial"],
      note: "El precio publicado por terceros no constituye el precio de Casa Atenta.",
    },
  ],
  "DCJZ03-13EM": [
    {
      kind: "commercial-reference",
      publisher: "Gamaq Perú",
      label: "Ficha local DCJZ03-13EM",
      url: "https://gamaq.pe/producto/taladro-percutor-inalambrico-dongcheng-1-2%E2%80%B3-dcjz03-13em/",
      verifiedFields: ["20 V", "120 Nm", "diámetros de perforación", "contenido del kit"],
      note: "Se contrasta con el catálogo del proveedor antes de publicarlo.",
    },
  ],
  DCKIT26AM: [
    {
      kind: "commercial-reference",
      publisher: "Oechsle Perú",
      label: "Ficha comercial DCKIT26AM",
      url: "https://www.oechsle.pe/combo-kit-dongcheng-industrial-dckit26am-taladro-percutor-y-atornillador-de-impacto-20v-brushless-1001700997/p",
      verifiedFields: ["modelo", "voltaje", "tipo de kit"],
      note: "La configuración final debe coincidir con el lote del proveedor.",
    },
  ],
  DCPB1218FK: [
    {
      kind: "commercial-reference",
      publisher: "Gamaq Perú",
      label: "Referencia local DCPB1218FK",
      url: "https://gamaq.pe/producto/llave-de-impacto-1-2-1218-nm-20-v-dongcheng-dcpb1218fk/",
      verifiedFields: ["modelo", "20 V", "torque nominal"],
      note: "Encastre y contenido del kit quedan pendientes de validación documental.",
    },
  ],
  "DSM03-115S": [
    {
      kind: "commercial-reference",
      publisher: "Dongcheng Perú",
      label: "Configuración local DSM03-115S",
      url: "https://dongchengperu.com/producto/amoladora-esmeril-angular-4-5-dongcheng-dsm03-115s-950w-11800rpm/",
      verifiedFields: ["modelo", "potencia", "diámetro", "velocidad"],
      note: "No debe confundirse con DSM03-115 sin sufijo, que tiene otra ficha.",
    },
  ],
  DCCS40161H2S: [
    {
      kind: "manufacturer",
      publisher: "DongCheng Tools",
      label: "Ficha oficial global DCCS40161H2S",
      url: "https://www.dongchengtool.com/product/detail/1732083575003",
      verifiedFields: ["modelo", "40 V", "barra de 16 pulgadas", "motor brushless"],
      note: "La ficha global actual indica un kit distinto al catálogo Perú 2025; la batería se aprueba por lote.",
    },
    {
      kind: "commercial-reference",
      publisher: "Dongcheng Perú",
      label: "Configuración local DCCS40161H2S",
      url: "https://dongchengperu.com/producto/electrosierra-motosierra-inalambrica-industrial-16-dongcheng-dccs40161h2s-40v-2bat-x-5ah-brushless/",
      verifiedFields: ["modelo", "40 V", "barra de 16 pulgadas", "kit 2 × 5 Ah"],
      note: "Precio y disponibilidad de terceros no se trasladan a Casa Atenta.",
    },
  ],
  "DCSM04-125PFK": [
    {
      kind: "commercial-reference",
      publisher: "Dongcheng Perú",
      label: "Configuración local DCSM04-125PFK",
      url: "https://dongchengperu.com/producto/amoladora-angular-inalambrica-5-dongcheng-dcsm04-125pfk-20v-2bat-x-5ah-brushless/",
      verifiedFields: ["modelo", "20 V", "kit 2 × 5 Ah"],
      note: "Precio de terceros solo para contraste de mercado.",
    },
  ],
  "DCMY02-185BM": [
    {
      kind: "manufacturer",
      publisher: "DongCheng Tools",
      label: "Ficha oficial DCMY02-185BM",
      url: "https://www.dongchengtool.com/product/detail/1642205994951",
      verifiedFields: ["20 V", "185 mm", "65 mm a 90°", "45 mm a 45°"],
      note: "La configuración de baterías y cargador sigue dependiendo del lote peruano.",
    },
  ],
};

export function getCatalogSources(model: string) {
  return [supplierCatalog, manufacturerCatalog, ...(modelSources[model] || [])];
}

export const catalogDataPolicy = {
  technical: "Cada campo técnico se contrasta por modelo; una fuente genérica no aprueba por sí sola la configuración del kit.",
  commercial:
    "Precio, stock, garantía y fecha de entrega requieren aprobación de Casa Atenta por lote.",
} as const;
