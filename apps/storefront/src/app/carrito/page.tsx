import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { CartPageClient } from "@/components/CartPageClient";

export const metadata: Metadata = {
  title: "Carrito",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <section className="store-container cart-page">
      <nav className="breadcrumbs breadcrumbs--dark"><Link href="/"><Home size={14} /> Inicio</Link><ChevronRight size={13} /><span>Carrito</span></nav>
      <div className="page-title"><span className="eyebrow">Tu selección</span><h1>Carrito de compras</h1><p>Revisa modelos, cantidades y compatibilidad antes de continuar.</p></div>
      <CartPageClient />
    </section>
  );
}
