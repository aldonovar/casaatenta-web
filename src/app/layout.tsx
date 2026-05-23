import type { Metadata } from "next";
import { Inter, Syne, Cormorant_Garamond } from "next/font/google";
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
  title: "CΛSΛ ΛTENTΛ | Arquitectura de Automatización Residencial",
  description: "Diseñamos residencias de alta gama donde la tecnología se disuelve por completo en la arquitectura. Sin cables, sin polución visual.",
  keywords: ["domotica peru", "automatizacion residencial lima", "smart home peru", "casa inteligente", "arquitectura inteligente", "pergolados lima", "iluminacion inteligente peru"],
  authors: [{ name: "Casa Atenta" }],
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
      <body className="min-h-full flex flex-col bg-brand-dark text-brand-light">
        <ClientWrapper>
          {children}
        </ClientWrapper>
      </body>
    </html>
  );
}
