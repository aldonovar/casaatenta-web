"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChevronRight,
  Headphones,
  Menu,
  Search,
  ShoppingBag,
  UserRound,
  X,
} from "lucide-react";
import { categories } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { useCart } from "./CartProvider";
import { StoreLogo } from "./StoreLogo";

export function StoreHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { itemCount, openDrawer, hydrated } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useBodyScrollLock(menuOpen);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setMenuOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      if (wasOpen.current) triggerRef.current?.focus();
      wasOpen.current = false;
      return;
    }

    wasOpen.current = true;
    const frame = requestAnimationFrame(() =>
      menuRef.current?.querySelector<HTMLElement>("a, button, input")?.focus(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = menuRef.current?.querySelectorAll<HTMLElement>(
        'a, button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    const query = search.trim();
    router.push(query ? `/catalogo?q=${encodeURIComponent(query)}` : "/catalogo");
    setMenuOpen(false);
  }

  return (
    <header className="store-header">
      <div className="announcement-bar">
        <div className="store-container announcement-bar__inner">
          <span>Despacho coordinado en Lima y envíos a todo el Perú</span>
          <div>
            <a href={storeConfig.whatsapp} target="_blank" rel="noreferrer">
              <Headphones size={14} /> Asesoría técnica
            </a>
            <a href={storeConfig.marketingUrl}>Casa Atenta proyectos ↗</a>
          </div>
        </div>
      </div>

      <div className="store-header__main">
        <div className="store-container store-header__main-inner">
          <button
            ref={triggerRef}
            type="button"
            className="header-mobile-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <StoreLogo />
          <form className="store-search" role="search" onSubmit={submitSearch}>
            <Search size={19} aria-hidden="true" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Busca por herramienta, modelo o trabajo…"
              aria-label="Buscar en el catálogo"
            />
            <button type="submit">Buscar</button>
          </form>
          <div className="store-header__actions">
            <Link href="/auth/ingresar" className="header-action" aria-label="Mi cuenta">
              <UserRound size={21} />
              <span><small>Hola, ingresa</small><strong>Mi cuenta</strong></span>
            </Link>
            <button
              type="button"
              data-cart-trigger
              className="header-action header-action--cart"
              onClick={openDrawer}
              aria-label={`Abrir carrito${hydrated ? `, ${itemCount} productos` : ""}`}
            >
              <span className="header-action__icon">
                <ShoppingBag size={21} />
                {hydrated && itemCount > 0 && <b>{itemCount}</b>}
              </span>
              <span><small>Tu selección</small><strong>Carrito</strong></span>
            </button>
          </div>
        </div>
      </div>

      <nav className="store-nav" aria-label="Categorías principales">
        <div className="store-container store-nav__inner">
          <Link href="/catalogo" className="store-nav__all"><Menu size={16} /> Todo el catálogo</Link>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.slug} href={`/catalogo?categoria=${category.slug}`}>
              {category.shortName}
            </Link>
          ))}
          <Link href="/catalogo?ofertas=true" className="store-nav__sale">Ofertas</Link>
          <Link href="/ayuda">Ayuda</Link>
        </div>
      </nav>

      <div
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menú de la tienda"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <div className="mobile-menu__head">
          <StoreLogo />
          <button type="button" className="icon-button" onClick={() => setMenuOpen(false)} aria-label="Cerrar menú">
            <X size={21} />
          </button>
        </div>
        <form className="mobile-menu__search" onSubmit={submitSearch}>
          <Search size={18} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="¿Qué máquina necesitas?"
            aria-label="Buscar en la tienda"
          />
        </form>
        <nav aria-label="Menú móvil">
          <Link href="/auth/ingresar" onClick={() => setMenuOpen(false)}>
            Ingresar / Mi cuenta <ChevronRight size={17} />
          </Link>
          <Link href="/catalogo" onClick={() => setMenuOpen(false)}>
            Todo el catálogo <ChevronRight size={17} />
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/catalogo?categoria=${category.slug}`}
              onClick={() => setMenuOpen(false)}
            >
              {category.name} <ChevronRight size={17} />
            </Link>
          ))}
          <Link href="/cuenta/pedidos" onClick={() => setMenuOpen(false)}>
            Mis pedidos <ChevronRight size={17} />
          </Link>
          <Link href="/ayuda" onClick={() => setMenuOpen(false)}>
            Ayuda y posventa <ChevronRight size={17} />
          </Link>
          <a href={storeConfig.marketingUrl} onClick={() => setMenuOpen(false)}>
            Casa Atenta · Proyectos y servicios ↗
          </a>
        </nav>
      </div>
      <button
        type="button"
        className={`mobile-menu-backdrop ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(false)}
        aria-label="Cerrar menú"
        tabIndex={menuOpen ? 0 : -1}
      />
    </header>
  );
}
