import type { Metadata } from "next";
import { AuthForm } from "@/components/AuthForm";

export const metadata: Metadata = { title: "Crear cuenta", robots: { index: false, follow: false } };

export default function RegisterPage() {
  return <section className="auth-page"><div className="auth-page__art auth-page__art--register"><div><span>Compra con respaldo.</span><h2>Cada máquina conserva su historia.</h2><p>Pedidos, comprobantes, seriales, garantías y atención técnica asociados a tu cuenta.</p></div></div><AuthForm mode="register" /></section>;
}
