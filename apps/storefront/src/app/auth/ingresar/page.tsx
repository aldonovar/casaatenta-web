import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Ingresar", robots: { index: false, follow: false } };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;
  return <section className="auth-page"><div className="auth-page__art"><div><span>Tu equipo, bajo control.</span><h2>Pedidos, garantía y soporte en un solo lugar.</h2><p>Activa 2FA para proteger cambios de dirección, correo y operaciones sensibles.</p></div></div><AuthForm mode="login" next={next} /></section>;
}
