import type { Metadata, Viewport } from "next";
import { Inter, Syne } from "next/font/google";
import type { ReactNode } from "react";
import { StoreShell } from "@/components/StoreShell";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const socialImage = absoluteStoreUrl(
  "/products/amoladora-inalambrica-dcsm04-125pfk-20v/01.webp",
);

export const metadata: Metadata = {
  metadataBase: new URL(storeConfig.url),
  title: {
    default: "Casa Atenta Tienda | Herramientas y maquinaria profesional",
    template: "%s | Casa Atenta Tienda",
  },
  description: storeConfig.description,
  applicationName: storeConfig.name,
  alternates: { canonical: absoluteStoreUrl("/") },
  openGraph: {
    type: "website",
    locale: "es_PE",
    siteName: storeConfig.name,
    title: "Casa Atenta Tienda",
    description: storeConfig.description,
    url: storeConfig.url,
    images: [{ url: socialImage, alt: "Herramientas profesionales en Casa Atenta Tienda" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casa Atenta Tienda | Herramientas profesionales",
    description: storeConfig.description,
    images: [socialImage],
  },
  robots: { index: !storeConfig.preview, follow: !storeConfig.preview },
};

export const viewport: Viewport = {
  themeColor: "#071521",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: storeConfig.name,
    url: storeConfig.url,
    email: storeConfig.supportEmail,
    areaServed: "PE",
    currenciesAccepted: "PEN",
  };

  return (
    <html lang="es" className={`${inter.variable} ${syne.variable}`}>
      <body>
        <a href="#contenido" className="skip-link">Saltar al contenido</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <div id="contenido">
          <StoreShell>{children}</StoreShell>
        </div>
      </body>
    </html>
  );
}
