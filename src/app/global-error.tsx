"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  return (
    <html lang="es" className={inter.className}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#07111D",
          color: "#F4F0E8",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            textAlign: "center",
            maxWidth: "420px",
            padding: "2rem",
          }}
        >
          {/* Logo simple */}
          <svg
            viewBox="0 0 560 560"
            style={{
              width: "80px",
              height: "80px",
              margin: "0 auto 2rem",
              fill: "none",
              stroke: "#D8B36A",
            }}
          >
            <circle cx="280" cy="280" r="165" strokeWidth="20" strokeLinecap="round" />
            <circle cx="280" cy="280" r="120" strokeWidth="5" strokeLinecap="round" />
            <path d="M 221 262 L 280 229 L 339 262" strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M 280 295 L 280 347" strokeWidth="11" strokeLinecap="round" />
          </svg>

          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 300,
              letterSpacing: "0.05em",
              marginBottom: "0.75rem",
            }}
          >
            Error inesperado
          </h1>
          <p
            style={{
              fontSize: "0.875rem",
              fontWeight: 300,
              lineHeight: 1.6,
              color: "#A0ADB8",
              marginBottom: "2rem",
            }}
          >
            Ocurrió un error crítico. Puedes intentar recargar la página.
          </p>

          <button
            onClick={() => unstable_retry()}
            style={{
              background: "transparent",
              border: "1px solid rgba(216, 179, 106, 0.4)",
              color: "#D8B36A",
              padding: "0.75rem 1.5rem",
              borderRadius: "9999px",
              fontSize: "0.875rem",
              cursor: "pointer",
              letterSpacing: "0.05em",
              transition: "all 0.3s",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(216, 179, 106, 0.1)";
              e.currentTarget.style.borderColor = "rgba(216, 179, 106, 0.6)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.borderColor = "rgba(216, 179, 106, 0.4)";
            }}
          >
            Reintentar
          </button>
        </div>
      </body>
    </html>
  );
}
