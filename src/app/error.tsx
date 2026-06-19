"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Casa Atenta] Error capturado:", error);
  }, [error]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      {/* Subtle glow accent */}
      <div className="absolute w-72 h-72 rounded-full bg-brand-gold/5 blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-8 max-w-lg">
        {/* Icon */}
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-ca-border/40 bg-ca-glass-bg/50 backdrop-blur-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-brand-gold"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <h1 className="font-display text-2xl font-light tracking-wide text-ca-text md:text-3xl">
            Algo salió mal
          </h1>
          <p className="text-sm font-light leading-relaxed text-ca-text-secondary max-w-md">
            Ocurrió un error inesperado al cargar esta página.
            Puedes intentar nuevamente o volver al inicio.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <button
            onClick={() => unstable_retry()}
            className="group inline-flex items-center gap-2 rounded-full border border-brand-gold/40 bg-brand-gold/10 px-6 py-3 text-sm font-medium tracking-wide text-brand-gold transition-all duration-300 hover:bg-brand-gold/20 hover:border-brand-gold/60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform duration-500 group-hover:-rotate-180"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Reintentar
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-ca-border/30 px-6 py-3 text-sm font-light tracking-wide text-ca-text-secondary transition-all duration-300 hover:border-ca-text/30 hover:text-ca-text"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
