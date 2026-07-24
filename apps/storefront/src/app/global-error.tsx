"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalStoreError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("store_global_error", error);
  }, [error]);

  return (
    <html lang="es">
      <body style={{ margin: 0, background: "#eef2f4", color: "#071521", fontFamily: "Arial, sans-serif" }}>
        <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "24px" }}>
          <section style={{ width: "min(100%, 620px)", padding: "40px", border: "1px solid #d8e1e5", background: "white", textAlign: "center" }}>
            <p style={{ color: "#147fc2", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Casa Atenta Tienda</p>
            <h1 style={{ margin: "12px 0", fontSize: "clamp(32px, 7vw, 58px)", lineHeight: 1 }}>Necesitamos recargar la tienda.</h1>
            <p style={{ color: "#526671", lineHeight: 1.7 }}>No se completó la interfaz. Puedes reintentar sin volver a enviar ningún pago.</p>
            <button type="button" onClick={() => unstable_retry()} style={{ marginTop: "18px", border: 0, padding: "14px 20px", color: "white", background: "#147fc2", fontWeight: 800, cursor: "pointer" }}>
              Intentar nuevamente
            </button>
            <p><Link href="/" style={{ color: "#0b587f", fontWeight: 700 }}>Volver al inicio</Link></p>
            {error.digest && <small style={{ color: "#70838c" }}>Referencia: {error.digest}</small>}
          </section>
        </main>
      </body>
    </html>
  );
}
