import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Boxes, KeyRound, MapPin, PackageSearch, ShieldCheck } from "lucide-react";
import { getCurrentUser, requireUser } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const user = isSupabaseConfigured() ? await requireUser() : await getCurrentUser();
  const name = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "cliente";
  return (
    <>
      <div className="account-welcome"><div><span className="eyebrow">Panel personal</span><h1>Hola, {name}.</h1><p>Desde aquí puedes seguir pedidos, administrar entregas y proteger tu cuenta.</p></div>{!isSupabaseConfigured() && <span className="account-preview-badge">Vista de preparación</span>}</div>
      <div className="account-stats"><div><PackageSearch size={20} /><strong>0</strong><span>Pedidos activos</span></div><div><Boxes size={20} /><strong>0</strong><span>Equipos registrados</span></div><div><ShieldCheck size={20} /><strong>—</strong><span>Garantías activas</span></div></div>
      <div className="account-actions">
        <Link href="/cuenta/pedidos"><span><PackageSearch size={22} /></span><div><h2>Pedidos y seguimiento</h2><p>Revisa estado, entrega, comprobantes y devoluciones.</p></div><ArrowRight size={18} /></Link>
        <Link href="/cuenta/direcciones"><span><MapPin size={22} /></span><div><h2>Direcciones</h2><p>Guarda obras, talleres y puntos de recepción.</p></div><ArrowRight size={18} /></Link>
        <Link href="/cuenta/seguridad"><span><KeyRound size={22} /></span><div><h2>Seguridad y 2FA</h2><p>Protege cambios sensibles con un autenticador.</p></div><ArrowRight size={18} /></Link>
      </div>
    </>
  );
}
