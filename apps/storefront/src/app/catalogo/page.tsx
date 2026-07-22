import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { CatalogClient, type CatalogSortMode } from "@/components/CatalogClient";
import { categories, products } from "@/data/catalog";

export const metadata: Metadata = {
  title: "Catálogo de herramientas y maquinaria",
  description:
    "Explora herramientas Dongcheng por categoría, modelo, aplicación y plataforma de batería.",
  alternates: { canonical: "/catalogo" },
};

type CatalogPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function CatalogPage({ searchParams }: CatalogPageProps) {
  const params = await searchParams;
  const initialQuery = (one(params.q) || "").slice(0, 100);
  const requestedCategory = one(params.categoria) || "";
  const initialCategory = categories.some((item) => item.slug === requestedCategory)
    ? requestedCategory
    : "";
  const requestedUse = one(params.uso) || "";
  const initialUse = ["construccion", "metalmecanica", "instalacion", "taller"].includes(requestedUse)
    ? requestedUse
    : "";
  const initialOffers = one(params.ofertas) === "true";
  const initialFeatured = one(params.destacados) === "true";
  const initialAvailable = one(params.disponibles) === "true";
  const initialQuoted = one(params.cotizar) === "true";
  const requestedSort = one(params.orden) || "featured";
  const initialSort: CatalogSortMode = ["featured", "price-asc", "price-desc", "name"].includes(requestedSort)
    ? requestedSort as CatalogSortMode
    : "featured";
  return (
    <>
      <section className="catalog-hero">
        <div className="store-container">
          <nav className="breadcrumbs" aria-label="Migas de pan">
            <Link href="/"><Home size={14} /> Inicio</Link><ChevronRight size={13} /><span>Catálogo</span>
          </nav>
          <div className="catalog-hero__copy">
            <span className="eyebrow">Catálogo técnico</span>
            <h1>Herramientas para cada trabajo.</h1>
            <p>Filtra por familia, disponibilidad o modelo. Cada ficha separa herramienta, kit, batería y accesorios para comprar sin dudas.</p>
          </div>
        </div>
      </section>
      <section className="store-container catalog-section">
        <CatalogClient
          key={`${initialQuery}|${initialCategory}|${initialUse}|${initialOffers}|${initialFeatured}|${initialAvailable}|${initialQuoted}|${initialSort}`}
          products={products}
          initialQuery={initialQuery}
          initialCategory={initialCategory}
          initialUse={initialUse}
          initialOffers={initialOffers}
          initialFeatured={initialFeatured}
          initialAvailable={initialAvailable}
          initialQuoted={initialQuoted}
          initialSort={initialSort}
        />
      </section>
    </>
  );
}
