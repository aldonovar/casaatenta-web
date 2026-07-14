import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function NewsletterInvalidLinkPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ca-bg-deep px-6 text-ca-text">
      <div className="glass-panel max-w-xl p-8 text-center md:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[.25em] text-brand-gold">Newsletter</p>
        <h1 className="mt-5 font-display text-4xl font-light uppercase">Enlace no válido</h1>
        <p className="mt-6 text-sm leading-7 text-ca-text-secondary">
          El enlace caducó, ya fue utilizado o no corresponde a una solicitud vigente.
        </p>
        <Link href="/" className="mt-8 inline-flex min-h-12 items-center border border-ca-border px-6 font-mono text-[10px] uppercase tracking-[.2em]">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
