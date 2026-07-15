"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Filter, Search, SlidersHorizontal, X } from "lucide-react";
import { categories, products } from "@/data/catalog";
import { ProductCard } from "./ProductCard";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

type SortMode = "featured" | "price-asc" | "price-desc" | "name";

type CatalogClientProps = {
  initialQuery?: string;
  initialCategory?: string;
  initialOffers?: boolean;
  initialFeatured?: boolean;
  initialUse?: string;
};

export function CatalogClient({
  initialQuery = "",
  initialCategory = "",
  initialOffers = false,
  initialFeatured = false,
  initialUse = "",
}: CatalogClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [useCase, setUseCase] = useState(initialUse);
  const [featuredOnly, setFeaturedOnly] = useState(initialFeatured);
  const [offersOnly, setOffersOnly] = useState(initialOffers);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [quotedOnly, setQuotedOnly] = useState(false);
  const [sort, setSort] = useState<SortMode>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterSheetRef = useRef<HTMLElement>(null);

  useBodyScrollLock(filtersOpen);

  useEffect(() => {
    if (!filtersOpen) return;
    const frame = requestAnimationFrame(() =>
      filterSheetRef.current?.querySelector<HTMLElement>("button, input, select, a")?.focus(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };
    addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  const filtered = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase("es");
    const matches = products.filter((product) => {
      const haystack = [
        product.name,
        product.shortName,
        product.model,
        product.sku,
        product.brand,
        ...product.searchTerms,
      ]
        .join(" ")
        .toLocaleLowerCase("es");

      if (normalized && !haystack.includes(normalized)) return false;
      if (category && product.category !== category) return false;
      if (useCase) {
        const useCategories: Record<string, string[]> = {
          construccion: ["perforacion-demolicion", "corte-desbaste"],
          metalmecanica: ["taller-industria", "corte-desbaste"],
          instalacion: ["inalambricas", "corte-desbaste"],
          taller: ["taller-industria", "limpieza", "baterias-accesorios"],
        };
        if (!(useCategories[useCase] || []).includes(product.category)) return false;
      }
      if (offersOnly && !(product.compareAtMinor && product.priceMinor)) return false;
      if (availableOnly && product.stock <= 0) return false;
      if (quotedOnly && product.priceMinor !== null) return false;
      if (featuredOnly && !product.featured) return false;
      return true;
    });

    return matches.sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "es");
      if (sort === "price-asc") return (a.priceMinor ?? Number.MAX_SAFE_INTEGER) - (b.priceMinor ?? Number.MAX_SAFE_INTEGER);
      if (sort === "price-desc") return (b.priceMinor ?? -1) - (a.priceMinor ?? -1);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [availableOnly, category, featuredOnly, offersOnly, query, quotedOnly, sort, useCase]);

  const activeCount = Number(Boolean(category)) + Number(Boolean(useCase)) + Number(featuredOnly) + Number(offersOnly) + Number(availableOnly) + Number(quotedOnly);

  function clearFilters() {
    setCategory("");
    setUseCase("");
    setFeaturedOnly(false);
    setOffersOnly(false);
    setAvailableOnly(false);
    setQuotedOnly(false);
    setQuery("");
  }

  const filterContent = (
    <>
      <div className="catalog-filter__head">
        <div><SlidersHorizontal size={17} /><strong>Filtrar catálogo</strong></div>
        {activeCount > 0 && <button onClick={clearFilters}>Limpiar</button>}
      </div>
      <div className="catalog-filter__group">
        <h3>Categoría</h3>
        <label className="filter-radio">
          <input type="radio" name="category" checked={!category} onChange={() => setCategory("")} />
          <span>Todo el catálogo</span><small>{products.length}</small>
        </label>
        {categories.map((item) => {
          const count = products.filter((product) => product.category === item.slug).length;
          return (
            <label className="filter-radio" key={item.slug}>
              <input
                type="radio"
                name="category"
                checked={category === item.slug}
                onChange={() => setCategory(item.slug)}
              />
              <span>{item.shortName}</span><small>{count}</small>
            </label>
          );
        })}
      </div>
      <div className="catalog-filter__group">
        <h3>Disponibilidad</h3>
        <label className="filter-check">
          <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
          <i><Check size={12} /></i><span>Con stock inicial</span>
        </label>
        <label className="filter-check">
          <input type="checkbox" checked={quotedOnly} onChange={(event) => setQuotedOnly(event.target.checked)} />
          <i><Check size={12} /></i><span>Próximos ingresos</span>
        </label>
      </div>
      <div className="catalog-filter__group">
        <h3>Promociones</h3>
        <label className="filter-check">
          <input type="checkbox" checked={offersOnly} onChange={(event) => setOffersOnly(event.target.checked)} />
          <i><Check size={12} /></i><span>Con precio comparativo</span>
        </label>
      </div>
      <div className="catalog-filter__tip">
        <strong>¿Necesitas ayuda?</strong>
        <p>Cuéntanos el material, diámetro y frecuencia de uso. Te orientamos sin costo.</p>
        <a href="/ayuda#asesoria">Pedir asesoría →</a>
      </div>
    </>
  );

  return (
    <div className="catalog-layout">
      <aside className="catalog-filter">{filterContent}</aside>

      <div className="catalog-results">
        <div className="catalog-toolbar">
          <label className="catalog-inline-search">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filtrar por nombre, modelo o SKU"
            />
            {query && <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda"><X size={15} /></button>}
          </label>
          <button
            type="button"
            className="catalog-mobile-filter"
            onClick={() => setFiltersOpen(true)}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filter-sheet"
          >
            <Filter size={17} /> Filtros {activeCount > 0 && <b>{activeCount}</b>}
          </button>
          <span className="catalog-results__count"><strong>{filtered.length}</strong> resultados</span>
          <label className="catalog-sort">
            <span>Ordenar por</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as SortMode)}>
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre A–Z</option>
            </select>
            <ChevronDown size={15} />
          </label>
        </div>

        {category && (
          <div className="catalog-active-filter">
            <span>{categories.find((item) => item.slug === category)?.name}</span>
            <button type="button" onClick={() => setCategory("")}><X size={13} /> Quitar</button>
          </div>
        )}
        {useCase && (
          <div className="catalog-active-filter">
            <span>Uso: {useCase.replaceAll("-", " ")}</span>
            <button type="button" onClick={() => setUseCase("")}><X size={13} /> Quitar</button>
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="product-grid catalog-product-grid">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="catalog-empty">
            <span><Search size={30} /></span>
            <h2>No encontramos ese equipo</h2>
            <p>Prueba con el modelo, el tipo de trabajo o restablece los filtros.</p>
            <button className="button button--dark" onClick={clearFilters}>Ver todo el catálogo</button>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`catalog-filter-backdrop ${filtersOpen ? "is-open" : ""}`}
        onClick={() => setFiltersOpen(false)}
        aria-label="Cerrar filtros"
        tabIndex={filtersOpen ? 0 : -1}
      />
      <aside
        id="catalog-filter-sheet"
        ref={filterSheetRef}
        className={`catalog-filter-sheet ${filtersOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros del catálogo"
        aria-hidden={!filtersOpen}
        inert={!filtersOpen}
      >
        <div className="catalog-filter-sheet__top">
          <strong>Filtros</strong>
          <button type="button" className="icon-button" onClick={() => setFiltersOpen(false)} aria-label="Cerrar filtros"><X size={18} /></button>
        </div>
        <div className="catalog-filter-sheet__body">{filterContent}</div>
        <div className="catalog-filter-sheet__bottom">
          <button type="button" className="button button--primary" onClick={() => setFiltersOpen(false)}>
            Ver {filtered.length} resultados
          </button>
        </div>
      </aside>
    </div>
  );
}
