import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = { robots: { index: false, follow: false } };

type PageProps = {
  searchParams: Promise<{ token?: string | string[] }>;
};

export default async function NewsletterUnsubscribePage({ searchParams }: PageProps) {
  const rawToken = (await searchParams).token;
  const token = typeof rawToken === "string" ? rawToken : "";
  if (token.length < 20 || token.length > 200) {
    redirect("/newsletter/enlace-invalido");
  }

  const action = `/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}&redirect=1`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-ca-bg-deep px-6 text-ca-text">
      <div className="glass-panel max-w-xl p-8 text-center md:p-12">
        <p className="font-mono text-[10px] uppercase tracking-[.25em] text-brand-gold">
          Newsletter
        </p>
        <h1 className="mt-5 font-display text-4xl font-light uppercase">
          Cancelar suscripción
        </h1>
        <p className="mt-6 text-sm leading-7 text-ca-text-secondary">
          Confirma que deseas dejar de recibir novedades de Casa Atenta. Los correos
          transaccionales relacionados con una solicitud o un reclamo no se verán afectados.
        </p>
        <form action={action} method="post" className="mt-8">
          <button
            type="submit"
            className="inline-flex min-h-12 items-center border border-brand-gold px-6 font-mono text-[10px] font-semibold uppercase tracking-[.2em] text-brand-gold"
          >
            Darme de baja
          </button>
        </form>
      </div>
    </main>
  );
}
