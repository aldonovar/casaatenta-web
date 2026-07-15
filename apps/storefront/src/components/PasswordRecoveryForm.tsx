"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function PasswordRecoveryForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured()) {
      return setError("Supabase Auth aún no está configurado.");
    }
    const email = String(new FormData(event.currentTarget).get("email") || "")
      .trim()
      .toLowerCase();
    setPending(true);
    const { error: recoveryError } = await createClient().auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent("/auth/restablecer")}`,
      },
    );
    setPending(false);
    if (recoveryError) return setError(recoveryError.message);
    // The same response is shown for registered and unknown addresses.
    setSent(true);
  }

  return (
    <div className="auth-card">
      <div className="auth-card__heading">
        <span className="eyebrow">Recuperación segura</span>
        <h1>Recupera tu acceso.</h1>
        <p>Te enviaremos un enlace temporal si el correo pertenece a una cuenta.</p>
      </div>
      {sent ? (
        <div className="form-success" role="status">
          Revisa tu bandeja de entrada y spam. El enlace expira por seguridad.
        </div>
      ) : (
        <form onSubmit={submit} className="auth-form">
          <label className="field">
            <span>Correo de tu cuenta</span>
            <div className="auth-input"><Mail size={17} /><input name="email" type="email" autoComplete="email" required /></div>
          </label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button--primary" disabled={pending}>
            {pending ? "Enviando…" : "Enviar enlace"}<ArrowRight size={17} />
          </button>
        </form>
      )}
      <p className="auth-card__switch"><Link href="/auth/ingresar">Volver a ingresar</Link></p>
    </div>
  );
}

export function PasswordUpdateForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [updated, setUpdated] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!isSupabaseConfigured()) return setError("Supabase Auth no está configurado.");
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirmation = String(form.get("confirmation") || "");
    if (password.length < 10) return setError("Usa al menos 10 caracteres.");
    if (password !== confirmation) return setError("Las contraseñas no coinciden.");

    setPending(true);
    const { error: updateError } = await createClient().auth.updateUser({ password });
    setPending(false);
    if (updateError) return setError("El enlace expiró o la sesión no es válida. Solicita uno nuevo.");
    setUpdated(true);
  }

  return (
    <div className="auth-card">
      <div className="auth-card__heading">
        <span className="eyebrow">Nueva contraseña</span>
        <h1>Protege tu cuenta.</h1>
        <p>Usa una frase larga y distinta a las de otros servicios.</p>
      </div>
      {updated ? (
        <div className="form-success" role="status">Contraseña actualizada. <Link href="/auth/ingresar">Ingresa nuevamente.</Link></div>
      ) : (
        <form onSubmit={submit} className="auth-form">
          <label className="field"><span>Nueva contraseña</span><div className="auth-input"><LockKeyhole size={17} /><input name="password" type="password" autoComplete="new-password" minLength={10} required /></div></label>
          <label className="field"><span>Confirmar contraseña</span><div className="auth-input"><LockKeyhole size={17} /><input name="confirmation" type="password" autoComplete="new-password" minLength={10} required /></div></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button--primary" disabled={pending}>{pending ? "Actualizando…" : "Guardar contraseña"}<ArrowRight size={17} /></button>
        </form>
      )}
    </div>
  );
}
