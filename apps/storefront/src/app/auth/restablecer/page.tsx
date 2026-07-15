import type { Metadata } from "next";
import { PasswordUpdateForm } from "@/components/PasswordRecoveryForm";

export const metadata: Metadata = {
  title: "Crear nueva contraseña",
  robots: { index: false, follow: false },
};

export default function ResetPasswordPage() {
  return <section className="auth-page"><div className="auth-page__art"><span>Acceso recuperado</span><h2>Una contraseña nueva, una sesión limpia.</h2></div><PasswordUpdateForm /></section>;
}
