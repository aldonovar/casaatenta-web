"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BLOG_URL, SITE_URL } from "@/lib/urls";
import { BrandText } from "./BrandText";
import { Logo } from "./Logo";
import { MoonIcon, SunIcon } from "./icons/AnimatedIcons";

const STORE_URL =
  process.env.NEXT_PUBLIC_STORE_URL || "https://tienda.casa-atenta.com";

const items = [
  ["Automatización", "/servicios/smart-homes"],
  ["Servicios", "/servicios"],
  ["Tienda", STORE_URL],
  ["Proyectos", "/proyectos"],
  ["Proceso", "/proceso"],
  ["Nosotros", "/nosotros"],
  ["Editorial", BLOG_URL],
  ["Contacto", "/contacto"],
] as const;

function isActive(pathname: string, href: string, blogSurface: boolean) {
  if (href === BLOG_URL) return blogSurface;
  if (href === "/servicios") return pathname === "/servicios";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const blogSurface = pathname.startsWith("/blog");

  const siteHref = (href: string) =>
    href.startsWith("/") && blogSurface ? `${SITE_URL}${href}` : href;

  useEffect(() => {
    const saved = localStorage.getItem("casa-atenta-theme");
    const next =
      saved === "light" ||
      (!saved && matchMedia("(prefers-color-scheme: light)").matches);

    document.documentElement.classList.toggle("light", next);
    const frame = requestAnimationFrame(() => setLight(next));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update();
    addEventListener("scroll", update, { passive: true });
    return () => removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const desktop = matchMedia("(min-width: 1280px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!open) return;

    const bodyOverflow = document.body.style.overflow;
    const htmlOverscroll = document.documentElement.style.overscrollBehavior;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overscrollBehavior = "none";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overscrollBehavior = htmlOverscroll;
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      if (wasOpen.current) buttonRef.current?.focus();
      wasOpen.current = false;
      return;
    }

    wasOpen.current = true;
    const frame = requestAnimationFrame(() =>
      panelRef.current?.querySelector<HTMLElement>("a, button")?.focus(),
    );

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;

      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a, button, [tabindex]:not([tabindex="-1"])',
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

    addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const toggleTheme = () => {
    const next = !light;
    document.documentElement.classList.toggle("light", next);
    localStorage.setItem("casa-atenta-theme", next ? "light" : "dark");
    setLight(next);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 px-4 transition-all duration-300 sm:px-5 md:px-10 lg:px-16 ${
          scrolled || open
            ? "border-b border-ca-border/40 bg-ca-glass-bg/90 py-3 shadow-[0_12px_36px_rgba(0,0,0,.16)] backdrop-blur-xl"
            : "py-4 sm:py-5"
        }`}
      >
        <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2 sm:gap-6">
          <Link
            href={blogSurface ? SITE_URL : "/"}
            aria-label="Casa Atenta"
            className="relative z-[60] shrink-0"
          >
            <Logo className="h-8 w-auto sm:h-9 md:h-11" />
          </Link>

          <nav aria-label="Navegación principal" className="hidden items-center gap-6 xl:flex">
            {items.map(([label, href]) => (
              <Link
                key={href}
                href={siteHref(href)}
                aria-current={isActive(pathname, href, blogSurface) ? "page" : undefined}
                className={`font-mono text-[9px] uppercase tracking-[.18em] transition ${
                  isActive(pathname, href, blogSurface)
                    ? "text-brand-gold"
                    : "text-ca-text/70 hover:text-ca-text"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="relative z-[60] flex shrink-0 items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={light ? "Usar tema oscuro" : "Usar tema claro"}
              className="grid h-10 w-10 place-items-center rounded-full border border-ca-border bg-ca-glass-bg/40 backdrop-blur-md transition hover:border-brand-gold hover:text-brand-gold"
            >
              {light ? <MoonIcon size={16} /> : <SunIcon size={16} />}
            </button>
            <button
              ref={buttonRef}
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Cerrar menú" : "Abrir menú"}
              className="flex h-10 items-center gap-2 rounded-full border border-ca-border bg-ca-glass-bg/40 px-3 font-mono text-[9px] uppercase tracking-[.16em] backdrop-blur-md xl:hidden sm:gap-3 sm:px-4 sm:tracking-[.18em]"
            >
              <span className="hidden min-[360px]:inline">{open ? "Cerrar" : "Menú"}</span>
              <span className="flex w-5 flex-col gap-1.5" aria-hidden="true">
                <i className={`h-px bg-current transition ${open ? "translate-y-[3.5px] rotate-45" : ""}`} />
                <i className={`h-px bg-current transition ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <button
        type="button"
        aria-label="Cerrar menú"
        tabIndex={open ? 0 : -1}
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-30 bg-[#02070c]/70 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        id="mobile-menu"
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Navegación principal"
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 right-0 z-40 h-[100dvh] w-full max-w-md overflow-y-auto overscroll-contain border-l border-ca-border bg-ca-bg-deep/98 px-5 pb-[calc(1.5rem+env(safe-area-inset-bottom))] pt-[calc(6.5rem+env(safe-area-inset-top))] shadow-2xl backdrop-blur-2xl transition-[transform,opacity] duration-500 ease-[cubic-bezier(.22,1,.36,1)] sm:px-6 sm:pt-[calc(7rem+env(safe-area-inset-top))] xl:hidden ${
          open
            ? "pointer-events-auto translate-x-0 opacity-100"
            : "pointer-events-none translate-x-full opacity-0"
        }`}
      >
        <div className="architectural-grid pointer-events-none absolute inset-0 opacity-[.05]" />
        <div className="relative flex min-h-full flex-col">
          <span className="font-mono text-[9px] uppercase tracking-[.22em] text-brand-gold">
            Casa Atenta / Tu hogar responde
          </span>
          <nav aria-label="Menú móvil" className="mt-6 grid sm:mt-8">
            {items.map(([label, href], index) => (
              <Link
                key={href}
                href={siteHref(href)}
                onClick={() => setOpen(false)}
                aria-current={isActive(pathname, href, blogSurface) ? "page" : undefined}
                className={`flex min-h-12 items-center justify-between gap-4 border-b border-ca-border/40 py-3 font-display text-[1.35rem] font-light uppercase sm:py-3.5 sm:text-2xl ${
                  isActive(pathname, href, blogSurface) ? "text-brand-gold" : "text-ca-text"
                }`}
              >
                <BrandText>{label}</BrandText>
                <span className="shrink-0 font-mono text-[8px] text-ca-text/40">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </Link>
            ))}
          </nav>
          <div className="mt-auto border-t border-ca-border/40 pt-6 text-xs leading-6 text-ca-text-secondary">
            <p>
              Automatización, iluminación, accesos, terrazas y cubiertas según infraestructura y alcance.
            </p>
            <Link
              href={siteHref("/contacto")}
              onClick={() => setOpen(false)}
              className="mt-5 inline-flex border-b border-brand-gold/60 pb-2 font-mono text-[9px] uppercase tracking-[.18em] text-brand-gold"
            >
              Solicitar evaluación ↗
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
