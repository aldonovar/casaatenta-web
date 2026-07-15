import type { Metadata } from "next";
import { PasswordRecoveryForm } from "@/components/PasswordRecoveryForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default function RecoverPasswordPage() {
  return <section className="auth-page"><div className="auth-page__art"><span>Cuenta protegida</span><h2>Vuelve a tus pedidos y garantías.</h2></div><PasswordRecoveryForm /></section>;
}
