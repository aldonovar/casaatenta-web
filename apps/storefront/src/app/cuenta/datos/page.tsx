import type { Metadata } from "next";
import Link from "next/link";
import { DatabaseZap } from "lucide-react";
import { PrivacyRequestForm } from "@/components/PrivacyRequestForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { formatStoreDate } from "@/lib/order-presentation";

export const metadata: Metadata = {
  title: "Mis datos personales",
  robots: { index: false, follow: false },
};

const typeLabels: Record<string, string> = {
  access: "Acceso",
  rectification: "Rectificación",
  deletion: "Eliminación",
  opposition: "Oposición",
  revocation: "Revocación",
  portability: "Portabilidad",
};

const statusLabels: Record<string, string> = {
  received: "Recibida",
  identity_review: "Verificando identidad",
  in_progress: "En atención",
  completed: "Completada",
  rejected: "Observada",
  cancelled: "Cancelada",
};

export default async function AccountDataPage() {
  let requests: Array<{
    id: string;
    request_type: string;
    status: string;
    requested_at: string;
    resolved_at: string | null;
  }> = [];

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("store_privacy_requests")
      .select("id,request_type,status,requested_at,resolved_at")
      .order("requested_at", { ascending: false })
      .limit(25);
    if (error) console.error("store_privacy_requests_lookup_error", error.code);
    requests = (data || []) as typeof requests;
  }

  return (
    <>
      <div className="account-page-title">
        <span className="eyebrow">Privacidad</span>
        <h1>Mis datos personales</h1>
        <p>
          Solicita acceso, rectificación, eliminación, oposición, revocación o
          portabilidad. Revisa antes nuestra <Link href="/legal/privacidad">Política de Privacidad</Link>.
        </p>
      </div>
      <div className="privacy-request-grid">
        <PrivacyRequestForm />
        <section className="privacy-request-history">
          <h2>Historial de solicitudes</h2>
          {requests.length === 0 ? (
            <div className="privacy-request-empty"><DatabaseZap size={27} /><p>No hay solicitudes registradas.</p></div>
          ) : (
            <ol>
              {requests.map((request) => (
                <li key={request.id}>
                  <div><strong>{typeLabels[request.request_type] || request.request_type}</strong><span>{statusLabels[request.status] || request.status}</span></div>
                  <time>{formatStoreDate(request.requested_at)}</time>
                  <small>{request.id}</small>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>
    </>
  );
}
