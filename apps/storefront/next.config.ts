import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV !== "production";
const isStorePreview =
  (process.env.NEXT_PUBLIC_STORE_MODE || "preview") !== "live";

function originOf(value: string | undefined) {
  if (!value) return null;
  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const supabaseOrigin = originOf(process.env.NEXT_PUBLIC_SUPABASE_URL);
const connectSources = [
  "'self'",
  supabaseOrigin,
  "https://api.openpay.pe",
  "https://sandbox-api.openpay.pe",
  "https://challenges.cloudflare.com",
  ...(isDevelopment ? ["ws:", "http://127.0.0.1:54321"] : []),
].filter(Boolean);

const imageSources = [
  "'self'",
  "data:",
  "blob:",
  supabaseOrigin,
].filter(Boolean);

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""} https://js.openpay.pe https://challenges.cloudflare.com`,
  "style-src 'self' 'unsafe-inline'",
  `img-src ${imageSources.join(" ")}`,
  "font-src 'self' data:",
  `connect-src ${connectSources.join(" ")}`,
  "frame-src 'self' https://js.openpay.pe https://api.openpay.pe https://sandbox-api.openpay.pe https://challenges.cloudflare.com",
  "form-action 'self' https://api.openpay.pe https://sandbox-api.openpay.pe",
  "worker-src 'self' blob:",
  "media-src 'self'",
  "manifest-src 'self'",
  ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const securityHeaders = [
      { key: "Content-Security-Policy", value: contentSecurityPolicy },
      ...(isStorePreview
        ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
        : []),
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
      {
        key: "Permissions-Policy",
        value:
          "camera=(), microphone=(), geolocation=(self), payment=(self), browsing-topics=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=31536000; includeSubDomains",
      },
    ];

    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/checkout/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
      {
        source: "/cuenta/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
      {
        source: "/seguimiento/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/api/auth/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/api/orders/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/api/cron/:path*",
        headers: [{ key: "Cache-Control", value: "private, no-store, max-age=0" }],
      },
    ];
  },
};

export default nextConfig;
