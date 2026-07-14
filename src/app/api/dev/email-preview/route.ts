import {
  claimNotificationEmail,
  claimReceiptEmail,
  contactNotificationEmail,
  contactReceiptEmail,
  newsletterConfirmationEmail,
  newsletterWelcomeEmail,
} from "@/lib/server/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const contact = {
  id: "1d8e9d78-0a2e-4ca1-b42d-8e2b63eb7d12",
  name: "María Fernanda López",
  email: "maria@example.com",
  phone: "+51 999 888 777",
  source: "cotización",
  service: "Automatización residencial",
  location: "Miraflores, Lima",
  measures: "3.20 m × 2.70 m",
  message:
    "Quiero coordinar iluminación, accesos y dos rutinas nocturnas en la primera etapa.",
  projectData: {
    Ambientes: "Sala, ingreso y terraza",
    Infraestructura: "Red Wi-Fi y puntos eléctricos existentes",
  },
};

const claim = {
  id: "22ee9388-a3df-4e42-a539-218371e868a8",
  code: "CA-REC-2026-000128",
  fullName: "María Fernanda López",
  documentType: "DNI",
  documentNumber: "70000000",
  email: "maria@example.com",
  phone: "+51 999 888 777",
  address: "Av. Ejemplo 123, Miraflores, Lima",
  isMinor: false,
  minorGuardian: null,
  minorGuardianAddress: null,
  minorGuardianPhone: null,
  minorGuardianEmail: null,
  claimType: "Reclamo",
  goodType: "Servicio",
  productDescription: "Sistema de iluminación inteligente",
  claimedAmount: 3200,
  claimDetail: "La escena nocturna dejó de activar una de las luminarias de la terraza.",
  consumerRequest: "Solicito coordinar una inspección técnica y restablecer la automatización.",
  createdAt: "13 de julio de 2026, 4:30 p. m.",
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return new Response("Not found", { status: 404 });
  }

  const key = new URL(request.url).searchParams.get("template") || "contact-receipt";
  const templates = {
    "contact-notification": contactNotificationEmail(contact),
    "contact-receipt": contactReceiptEmail(contact.name, contact.id),
    "claim-notification": claimNotificationEmail(claim),
    "claim-receipt": claimReceiptEmail(claim),
    "newsletter-confirmation": newsletterConfirmationEmail(
      contact.name,
      "preview-token-not-valid",
    ),
    "newsletter-welcome": newsletterWelcomeEmail(
      contact.name,
      "https://www.casa-atenta.com/newsletter/baja-confirmada",
    ),
  } satisfies Record<string, { html: string }>;
  const template = templates[key as keyof typeof templates];

  if (!template) {
    return Response.json(
      { error: "Plantilla desconocida", templates: Object.keys(templates) },
      { status: 400 },
    );
  }

  return new Response(template.html, {
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy":
        "default-src 'none'; style-src 'unsafe-inline'; img-src https: data:; base-uri 'none'; form-action 'none'",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
