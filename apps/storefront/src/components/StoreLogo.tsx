import Link from "next/link";

export function StoreLogo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="store-logo" aria-label="Casa Atenta Tienda, inicio">
      <svg viewBox="0 0 64 64" aria-hidden="true" className="store-logo__mark">
        <circle cx="32" cy="32" r="23" />
        <circle cx="32" cy="32" r="16" className="store-logo__fine" />
        <path d="M22.5 30.5 32 25l9.5 5.5M32 35v8" />
      </svg>
      {!compact && (
        <span className="store-logo__type">
          <strong>CASA ATENTA</strong>
          <small>TIENDA TÉCNICA</small>
        </span>
      )}
    </Link>
  );
}
