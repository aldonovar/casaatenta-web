"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function StoreError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("store_route_error", error);
  }, [error]);

  return (
    <section className="store-state-page" role="alert">
      <div>
        <span className="store-state-page__icon is-error"><AlertTriangle size={31} /></span>
        <span className="eyebrow">No se perdió tu selección</span>
        <h1>No pudimos cargar esta sección.</h1>
        <p>Puede ser una interrupción temporal. Intenta nuevamente o vuelve al catálogo.</p>
        <div className="store-state-page__actions">
          <button className="button button--primary" type="button" onClick={() => unstable_retry()}>
            <RotateCcw size={17} /> Intentar nuevamente
          </button>
          <Link href="/catalogo" className="button button--outline">Volver al catálogo</Link>
        </div>
        {error.digest && <small>Referencia técnica: {error.digest}</small>}
      </div>
    </section>
  );
}
