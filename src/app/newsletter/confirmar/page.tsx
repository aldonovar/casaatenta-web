import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type PageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function NewsletterConfirmPage({ searchParams }: PageProps) {
  const rawToken = (await searchParams).token;
  const token = typeof rawToken === "string" ? rawToken : "";
  if (token.length < 20 || token.length > 200) {
    redirect("/newsletter/enlace-invalido");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ca-bg-deep px-6 text-ca-text">
      <div className="glass-panel max-w-xl p-8 text-center md:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[.25em] text-brand-gold">
          Newsletter
        </p>
        <h1 className="mt-5 font-display text-4xl font-light uppercase">
          Confirma tu suscripción
        </h1>
        <p className="mt-6 text-sm leading-7 text-ca-text-secondary">
          Pulsa el botón para confirmar que deseas recibir las novedades de Casa Atenta.
          Esta acción evita que un sistema automático confirme el registro por ti.
        </p>
        <form action="/api/newsletter/confirm" method="post" className="mt-8">
          <input type="hidden" name="token" value={token} />
          <button
            type="submit"
            className="inline-flex min-h-12 items-center bg-brand-gold px-6 font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-[#07111d]"
          >
            Confirmar suscripción
          </button>
        </form>
      </div>
    </main>
  );
}
