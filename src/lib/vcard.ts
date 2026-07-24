export interface VCardData {
  name?: string;
  company?: string;
  title?: string;
  phone?: string;
  email?: string;
  website?: string;
  storeUrl?: string;
  address?: string;
  note?: string;
}

export const DEFAULT_CASA_ATENTA_VCARD: VCardData = {
  name: "Casa Atenta",
  company: "Casa Atenta",
  title: "Diseño Arquitectónico & Domótica Invisible",
  phone: "+51908550942",
  email: "info@casa-atenta.com",
  website: "https://www.casa-atenta.com",
  storeUrl: "https://tienda.casa-atenta.com",
  address: "Lima, Perú",
  note: "Soluciones de Techos Sol y Sombra, Iluminación Arquitectónica y Domótica Invisible para residencias premium.",
};

export function generateVCardString(data: VCardData = DEFAULT_CASA_ATENTA_VCARD): string {
  const vcardLines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${data.name}`,
    `ORG:${data.company}`,
    `TITLE:${data.title}`,
    `TEL;TYPE=CELL,VOICE,pref:${data.phone}`,
    `EMAIL;TYPE=INTERNET,WORK:${data.email}`,
    `URL;TYPE=WORK:${data.website}`,
    `URL;TYPE=STORE:${data.storeUrl}`,
    `ADR;TYPE=WORK:;;;${data.address};;;`,
    `NOTE:${data.note}`,
    "END:VCARD",
  ];

  return vcardLines.join("\r\n");
}

export function downloadVCard(data: VCardData = DEFAULT_CASA_ATENTA_VCARD, filename = "Casa_Atenta_Contacto.vcf"): void {
  const vcardString = generateVCardString(data);
  const blob = new Blob([vcardString], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
