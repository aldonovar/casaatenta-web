import type { Metadata } from "next";
import { siteMeta } from "@/data/site";
import { SITE_URL } from "@/lib/urls";
import { Cormorant_Garamond, Inter, Syne } from "next/font/google";
import "./globals.css";
import { ClientWrapper } from "../components/ClientWrapper";

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

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: siteMeta.title,
    template: "%s | Casa Atenta",
  },
  description: siteMeta.description,
  keywords: [
    "pérgolas lima",
    "terrazas lima",
    "pintura residencial lima",
    "acabados residenciales",
    "iluminación inteligente perú",
    "automatización residencial lima",
    "smart home perú",
    "domótica lima",
  ],
  applicationName: siteMeta.name,
  authors: [{ name: "Casa Atenta", url: SITE_URL }],
  creator: "Casa Atenta",
  publisher: "Casa Atenta",
  category: "Diseño y automatización residencial",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    locale: siteMeta.locale,
    url: SITE_URL,
    siteName: siteMeta.name,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [
      {
        url: "/media/hero/hero-desktop-01.webp",
        alt: "Terraza residencial diseñada por Casa Atenta con iluminación integrada",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: ["/media/hero/hero-desktop-01.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${inter.variable} ${syne.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ca-bg-deep text-ca-text">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
