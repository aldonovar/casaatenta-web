"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { railNavigation } from "@/data/navigation";

function currentHref(pathname: string) {
  if (pathname.startsWith("/servicios/smart-homes")) {
    return "/servicios/smart-homes";
  }

  return `/${pathname.split("/").filter(Boolean)[0] || ""}`;
}

export function PageRail() {
  const pathname = usePathname();
  const current = currentHref(pathname);
  const index = railNavigation.findIndex((item) => item.href === current);

  if (pathname === "/" || index < 0) return null;

  const next = railNavigation[(index + 1) % railNavigation.length];

  return (
    <aside className="pointer-events-none fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 2xl:block">
      <nav
        aria-label="Secciones principales"
        className="pointer-events-auto flex flex-col items-end gap-3"
      >
        {railNavigation.map(({ railNumber, label, href }) => {
          const active = href === current;

          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              aria-label={`${railNumber}. ${label}`}
              className="group flex items-center gap-3"
            >
              <span
                className={`overflow-hidden whitespace-nowrap font-mono text-[9px] uppercase tracking-[.18em] transition-all duration-300 ${
                  active
                    ? "w-auto translate-x-0 text-brand-gold"
                    : "w-0 translate-x-2 text-ca-text-secondary group-hover:w-auto group-hover:translate-x-0 group-hover:text-ca-text"
                }`}
              >
                {label}
              </span>
              <span
                aria-hidden="true"
                className={`grid h-8 w-8 place-items-center border font-mono text-[9px] transition ${
                  active
                    ? "border-brand-gold bg-brand-gold text-[#07111d]"
                    : "border-ca-border text-ca-text-secondary group-hover:border-brand-gold/60 group-hover:text-brand-gold"
                }`}
              >
                {railNumber}
              </span>
            </Link>
          );
        })}
      </nav>
      <Link
        href={next.href}
        className="pointer-events-auto mt-8 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[.18em] text-ca-text-secondary transition hover:text-brand-gold"
      >
        <span>Siguiente: {next.label}</span>
        <span
          aria-hidden="true"
          className="grid h-9 w-9 place-items-center border border-ca-border"
        >
          ↓
        </span>
      </Link>
    </aside>
  );
}

export default PageRail;
