import type { Metadata } from "next";
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
  title: "C\u039BS\u039B \u039BTENT\u039B | Servicios residenciales",
  description:
    "Estructura, acabados, luz y automatizacion residencial en Lima con visita tecnica, propuesta clara y ejecucion cuidada.",
  keywords: [
    "pergolas lima",
    "terrazas lima",
    "pintura residencial lima",
    "acabados residenciales",
    "iluminacion inteligente peru",
    "automatizacion residencial lima",
    "smart home peru",
  ],
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
      <body className="flex min-h-full flex-col bg-ca-bg-deep text-ca-text">
        <ClientWrapper>{children}</ClientWrapper>
      </body>
    </html>
  );
}
