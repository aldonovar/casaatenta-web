import type { Metadata } from "next";
import { hasQuotationAdminSession } from "@/lib/server/quotation-admin-auth";
import {
  getQuotationTestRecipients,
  isQuotationProductionEnabled,
} from "@/lib/server/env";
import { QuotationEmailForm } from "./QuotationEmailForm";
import styles from "./quotation-admin.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Entrega de cotizaciones | Casa Atenta",
  robots: { index: false, follow: false, nocache: true },
  referrer: "no-referrer",
};

const loginErrors: Record<string, string> = {
  invalid: "El acceso no es válido.",
  rate: "Se alcanzó el límite de intentos. Espera 15 minutos.",
  unavailable:
    "La consola no está disponible hasta completar su configuración segura.",
};

export default async function QuotationAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const authenticated = await hasQuotationAdminSession();
  const { error } = await searchParams;

  if (!authenticated) {
    return (
      <main className={styles.loginPage}>
        <section
          className={styles.loginCard}
          aria-labelledby="admin-login-title"
        >
          <p className={styles.eyebrow}>Casa Atenta / operación privada</p>
          <h1 id="admin-login-title">Entrega de cotizaciones</h1>
          <p className={styles.lead}>
            Ingresa el token administrativo del proyecto. La sesión dura cuatro
            horas y nunca expone las credenciales de Resend o Supabase.
          </p>
          {error && loginErrors[error] ? (
            <p className={styles.errorBanner} role="alert">
              {loginErrors[error]}
            </p>
          ) : null}
          <form
            action="/api/admin/quotation-session"
            method="post"
            className={styles.loginForm}
          >
            <label htmlFor="accessToken">Token de acceso</label>
            <input
              id="accessToken"
              name="accessToken"
              type="password"
              minLength={32}
              maxLength={512}
              autoComplete="current-password"
              required
              autoFocus
            />
            <button type="submit">Abrir consola segura</button>
          </form>
          <p className={styles.securityNote}>
            Acceso restringido · sesión HttpOnly · auditoría server-side
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className={styles.adminPage}>
      <header className={styles.adminHeader}>
        <div>
          <p className={styles.eyebrow}>Casa Atenta / operación privada</p>
          <h1>Entrega de cotizaciones</h1>
          <p>
            Envíos separados, uno o dos adjuntos transitorios y trazabilidad
            individual en Resend y Supabase.
          </p>
        </div>
        <form action="/api/admin/quotation-session?logout=1" method="post">
          <button type="submit" className={styles.secondaryButton}>
            Cerrar sesión
          </button>
        </form>
      </header>

      <aside
        className={styles.documentWarning}
        aria-labelledby="pdf-review-title"
      >
        <div>
          <p className={styles.warningLabel}>Revisión documental pendiente</p>
          <h2 id="pdf-review-title">
            Revisa todos los documentos antes de cualquier operación.
          </h2>
        </div>
        <ul>
          <li>Compara partidas, subtotal, impuestos y total visible.</li>
          <li>Confirma que alcance, proyecto y ubicación coincidan.</li>
          <li>Revisa fotografías, autor y metadatos internos de cada PDF.</li>
        </ul>
      </aside>

      <QuotationEmailForm
        testRecipients={getQuotationTestRecipients()}
        productionEnabled={isQuotationProductionEnabled()}
      />
    </main>
  );
}
