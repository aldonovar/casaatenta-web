import Link from "next/link";

export const metadata = {
  title: "Página no encontrada | Casa Atenta",
  description: "La página que buscas no existe o ha sido movida.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Subtle glow accent */}
      <div className="absolute w-72 h-72 rounded-full bg-ca-deep-blue/20 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-lg">
        {/* 404 display */}
        <div className="relative">
          <span className="block font-display text-[8rem] font-light leading-none tracking-wider text-ca-text/[0.04] md:text-[10rem] select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full border border-ca-border/40 bg-ca-glass-bg/50 backdrop-blur-sm">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-8 w-8 text-ca-text-secondary"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            </div>
          </div>
        </div>

        {/* Text */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-light tracking-wide text-ca-text md:text-3xl">
            Página no encontrada
          </h1>
          <p className="text-sm font-light leading-relaxed text-ca-text-secondary max-w-md">
            La página que buscas no existe o ha sido movida.
            Puedes volver al inicio o explorar nuestros servicios.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-6 py-3 text-sm font-medium tracking-wide text-brand-gold transition-all duration-300 hover:bg-brand-gold/20 hover:border-brand-gold/60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
            >
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Volver al inicio
          </Link>

          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 rounded-full border border-ca-border/30 px-6 py-3 text-sm font-light tracking-wide text-ca-text-secondary transition-all duration-300 hover:border-ca-text/30 hover:text-ca-text"
          >
            Ver servicios
          </Link>
        </div>
      </div>
    </div>
  );
}
