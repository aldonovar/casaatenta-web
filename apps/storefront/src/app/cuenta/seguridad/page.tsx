import type { Metadata } from "next";
import { MfaSecurityPanel } from "@/components/MfaSecurityPanel";
import { requireUser } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Seguridad de la cuenta", robots: { index: false, follow: false } };

export default async function SecurityPage() {
  if (isSupabaseConfigured()) await requireUser("/cuenta/seguridad");
  return <><div className="account-page-title"><span className="eyebrow">Protección</span><h1>Seguridad de la cuenta</h1><p>Activa un segundo factor para reducir el riesgo de accesos no autorizados.</p></div><MfaSecurityPanel /></>;
}
