"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Check,
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { categories, type StoreProduct } from "@/data/catalog";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { ProductCard } from "./ProductCard";

export type CatalogSortMode = "featured" | "price-asc" | "price-desc" | "name";

type CatalogClientProps = {
  products: StoreProduct[];
  initialQuery?: string;
  initialCategory?: string;
  initialOffers?: boolean;
  initialFeatured?: boolean;
  initialAvailable?: boolean;
  initialQuoted?: boolean;
  initialUse?: string;
  initialSort?: CatalogSortMode;
};

const useCases = [
  { value: "construccion", label: "Construcción y obra" },
  { value: "metalmecanica", label: "Metalmecánica" },
  { value: "instalacion", label: "Instalación y acabados" },
  { value: "taller", label: "Taller y mantenimiento" },
] as const;

const focusableSelector = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

export function CatalogClient({
  products,
  initialQuery = "",
  initialCategory = "",
  initialOffers = false,
  initialFeatured = false,
  initialAvailable = false,
  initialQuoted = false,
  initialUse = "",
  initialSort = "featured",
}: CatalogClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState(initialCategory);
  const [useCase, setUseCase] = useState(initialUse);
  const [featuredOnly, setFeaturedOnly] = useState(initialFeatured);
  const [offersOnly, setOffersOnly] = useState(initialOffers);
  const [availableOnly, setAvailableOnly] = useState(initialAvailable);
  const [quotedOnly, setQuotedOnly] = useState(initialQuoted);
  const [sort, setSort] = useState<CatalogSortMode>(initialSort);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const filterPanelRef = useRef<HTMLElement>(null);
  const filterTriggerRef = useRef<HTMLButtonElement>(null);

  useBodyScrollLock(filtersOpen && isMobileViewport);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const updateViewport = () => {
      setIsMobileViewport(media.matches);
      if (!media.matches) setFiltersOpen(false);
    };

    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    if (!filtersOpen || !isMobileViewport) return;

    const panel = filterPanelRef.current;
    const frame = requestAnimationFrame(() => {
      panel?.querySelector<HTMLElement>("[data-filter-close]")?.focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setFiltersOpen(false);
        return;
      }
      if (event.key !== "Tab" || !panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(focusableSelector),
      ).filter((element) => element.offsetParent !== null);
      if (focusable.length === 0) {
        event.preventDefault();
        panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
      filterTriggerRef.current?.focus();
    };
  }, [filtersOpen, isMobileViewport]);

  useEffect(() => {
    const url = new URL(window.location.href);
    const setParam = (name: string, value: string) => {
      if (value) url.searchParams.set(name, value);
      else url.searchParams.delete(name);
    };

    setParam("q", query.trim());
    setParam("categoria", category);
    setParam("uso", useCase);
    setParam("ofertas", offersOnly ? "true" : "");
    setParam("destacados", featuredOnly ? "true" : "");
    setParam("disponibles", availableOnly ? "true" : "");
    setParam("cotizar", quotedOnly ? "true" : "");
    setParam("orden", sort === "featured" ? "" : sort);

    const search = url.searchParams.toString();
    window.history.replaceState(
      null,
      "",
      `${url.pathname}${search ? `?${search}` : ""}${url.hash}`,
    );
  }, [availableOnly, category, featuredOnly, offersOnly, query, quotedOnly, sort, useCase]);

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
      if (sort === "price-asc") {
        return (a.priceMinor ?? Number.MAX_SAFE_INTEGER) - (b.priceMinor ?? Number.MAX_SAFE_INTEGER);
      }
      if (sort === "price-desc") return (b.priceMinor ?? -1) - (a.priceMinor ?? -1);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [availableOnly, category, featuredOnly, offersOnly, query, quotedOnly, sort, useCase]);

  const activeCount =
    Number(Boolean(category)) +
    Number(Boolean(useCase)) +
    Number(featuredOnly) +
    Number(offersOnly) +
    Number(availableOnly) +
    Number(quotedOnly);

  function clearFilters() {
    setCategory("");
    setUseCase("");
    setFeaturedOnly(false);
    setOffersOnly(false);
    setAvailableOnly(false);
    setQuotedOnly(false);
    setQuery("");
  }

  const activeFilters = [
    category
      ? {
          key: "category",
          label: categories.find((item) => item.slug === category)?.name || category,
          clear: () => setCategory(""),
        }
      : null,
    useCase
      ? {
          key: "use",
          label: `Uso: ${useCases.find((item) => item.value === useCase)?.label || useCase}`,
          clear: () => setUseCase(""),
        }
      : null,
    availableOnly
      ? { key: "available", label: "Con stock", clear: () => setAvailableOnly(false) }
      : null,
    quotedOnly
      ? { key: "quoted", label: "Próximos ingresos", clear: () => setQuotedOnly(false) }
      : null,
    offersOnly
      ? { key: "offers", label: "Con oferta", clear: () => setOffersOnly(false) }
      : null,
    featuredOnly
      ? { key: "featured", label: "Destacados", clear: () => setFeaturedOnly(false) }
      : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="catalog-layout">
      <aside
        id="catalog-filter-panel"
        ref={filterPanelRef}
        className={`catalog-filter ${filtersOpen ? "is-open" : ""}`}
        role={isMobileViewport ? "dialog" : undefined}
        aria-modal={isMobileViewport ? true : undefined}
        aria-labelledby="catalog-filter-title"
        aria-hidden={isMobileViewport ? !filtersOpen : undefined}
        inert={isMobileViewport && !filtersOpen ? true : undefined}
        tabIndex={-1}
      >
        <form className="catalog-filter__form" onSubmit={(event) => event.preventDefault()}>
          <div className="catalog-filter__head">
            <div id="catalog-filter-title">
              <SlidersHorizontal size={17} />
              <strong>Filtrar catálogo</strong>
            </div>
            <span className="catalog-filter__head-actions">
              {activeCount > 0 && <button type="button" onClick={clearFilters}>Limpiar</button>}
              <button
                type="button"
                className="icon-button catalog-filter__close"
                data-filter-close
                onClick={() => setFiltersOpen(false)}
                aria-label="Cerrar filtros"
              >
                <X size={18} />
              </button>
            </span>
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
            <label className="catalog-filter__select-label" htmlFor="catalog-use-case">Tipo de trabajo</label>
            <span className="catalog-filter__select-wrap">
              <select id="catalog-use-case" value={useCase} onChange={(event) => setUseCase(event.target.value)}>
                <option value="">Todos los trabajos</option>
                {useCases.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
              </select>
              <ChevronDown size={15} />
            </span>
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
            <h3>Selección</h3>
            <label className="filter-check">
              <input type="checkbox" checked={offersOnly} onChange={(event) => setOffersOnly(event.target.checked)} />
              <i><Check size={12} /></i><span>Con precio comparativo</span>
            </label>
            <label className="filter-check">
              <input type="checkbox" checked={featuredOnly} onChange={(event) => setFeaturedOnly(event.target.checked)} />
              <i><Check size={12} /></i><span>Equipos destacados</span>
            </label>
          </div>

          <div className="catalog-filter__tip">
            <strong>¿Necesitas ayuda?</strong>
            <p>Cuéntanos el material, diámetro y frecuencia de uso. Te orientamos sin costo.</p>
            <a href="/ayuda#asesoria">Pedir asesoría →</a>
          </div>
        </form>

        <div className="catalog-filter__mobile-bottom">
          <button type="button" className="button button--primary" onClick={() => setFiltersOpen(false)}>
            Ver {filtered.length} {filtered.length === 1 ? "resultado" : "resultados"}
          </button>
        </div>
      </aside>

      <div className="catalog-results">
        <div className="catalog-toolbar">
          <label className="catalog-inline-search">
            <span className="sr-only">Buscar en el catálogo</span>
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nombre, modelo o SKU"
              autoComplete="off"
              aria-describedby="catalog-results-status"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Limpiar búsqueda">
                <X size={15} />
              </button>
            )}
          </label>
          <button
            ref={filterTriggerRef}
            type="button"
            className="catalog-mobile-filter"
            onClick={() => setFiltersOpen(true)}
            aria-expanded={filtersOpen}
            aria-controls="catalog-filter-panel"
          >
            <Filter size={17} /> Filtros {activeCount > 0 && <b>{activeCount}</b>}
          </button>
          <span
            id="catalog-results-status"
            className="catalog-results__count"
            aria-live="polite"
            aria-atomic="true"
          >
            <strong>{filtered.length}</strong> {filtered.length === 1 ? "resultado" : "resultados"}
          </span>
          <label className="catalog-sort">
            <span>Ordenar por</span>
            <select value={sort} onChange={(event) => setSort(event.target.value as CatalogSortMode)}>
              <option value="featured">Destacados</option>
              <option value="price-asc">Menor precio</option>
              <option value="price-desc">Mayor precio</option>
              <option value="name">Nombre A–Z</option>
            </select>
            <ChevronDown size={15} aria-hidden="true" />
          </label>
        </div>

        {activeFilters.length > 0 && (
          <div className="catalog-active-filters" aria-label="Filtros activos">
            {activeFilters.map((filter) => (
              <span className="catalog-active-filter" key={filter.key}>
                <span>{filter.label}</span>
                <button type="button" onClick={filter.clear} aria-label={`Quitar filtro ${filter.label}`}>
                  <X size={13} /> Quitar
                </button>
              </span>
            ))}
          </div>
        )}

        {filtered.length > 0 ? (
          <div className="product-grid catalog-product-grid" aria-label="Productos encontrados">
            {filtered.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="catalog-empty">
            <span><Search size={30} /></span>
            <h2>No encontramos ese equipo</h2>
            <p>Prueba con el modelo, el tipo de trabajo o restablece los filtros.</p>
            <button type="button" className="button button--dark" onClick={clearFilters}>Ver todo el catálogo</button>
          </div>
        )}
      </div>

      <button
        type="button"
        className={`catalog-filter-backdrop ${filtersOpen ? "is-open" : ""}`}
        onClick={() => setFiltersOpen(false)}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  );
}
