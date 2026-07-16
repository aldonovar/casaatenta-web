"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getLegalConsentPath, getSafeInternalPath } from "@/lib/auth/redirect";

type AuthMode = "login" | "register";

export function AuthForm({ mode, next = "/cuenta" }: { mode: AuthMode; next?: string }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const configured = isSupabaseConfigured();
  const safeNext = getSafeInternalPath(next);
  const consentPath = getLegalConsentPath(safeNext);

  async function googleSignIn() {
    setError("");
    if (!configured) return setError("Supabase Auth aún no está configurado en este entorno.");
    setPending(true);
    const supabase = createClient();
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(consentPath)}`;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });
    if (authError) {
      setError("No pudimos iniciar el acceso con Google. Intenta nuevamente.");
      setPending(false);
    }
  }

  async function emailLinkSignIn() {
    setError("");
    setMessage("");
    if (!configured) return setError("Supabase Auth aún no está configurado en este entorno.");
    const email = String(
      new FormData(formRef.current || undefined).get("email") || "",
    )
      .trim()
      .toLowerCase();
    if (!email) return setError("Ingresa primero el correo de tu cuenta.");

    setPending(true);
    try {
      await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, next: safeNext }),
      });
    } finally {
      setPending(false);
      setMessage(
        "Si el correo pertenece a una cuenta, recibirás un enlace temporal para ingresar.",
      );
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!configured) return setError("Supabase Auth aún no está configurado en este entorno.");

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "").trim();
    const password = String(form.get("password") || "");
    const fullName = String(form.get("full_name") || "").trim();
    if (
      mode === "register" &&
      (password.length < 12 ||
        !/[a-z]/.test(password) ||
        !/[A-Z]/.test(password) ||
        !/\d/.test(password) ||
        !/[^A-Za-z0-9]/.test(password))
    ) {
      return setError("Usa al menos 12 caracteres, con mayúscula, minúscula, número y símbolo.");
    }

    setPending(true);
    const supabase = createClient();
    try {
      if (mode === "register") {
        const { data, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(consentPath)}`,
          },
        });
        if (authError) throw authError;
        if (!data.session) {
          setMessage("Revisa tu correo para confirmar la cuenta y continuar.");
          return;
        }
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;
      }

      const { data: aal, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalError) {
        throw new Error("No pudimos verificar la seguridad de la sesión.");
      }
      if (aal?.currentLevel === "aal1" && aal.nextLevel === "aal2") {
        router.push(`/auth/mfa?next=${encodeURIComponent(consentPath)}`);
      } else {
        router.push(consentPath);
      }
      router.refresh();
    } catch (caught) {
      console.error(
        "store_auth_flow_error",
        caught instanceof Error ? caught.name : "unknown",
      );
      setError(
        mode === "login"
          ? "No pudimos validar el correo y la contraseña. Revisa los datos o recupera tu acceso."
          : "No pudimos crear la cuenta. Revisa los datos o intenta con otro método.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="auth-card">
      <div className="auth-card__heading">
        <span className="eyebrow">Cuenta Casa Atenta</span>
        <h1>{mode === "login" ? "Qué bueno verte." : "Crea tu cuenta."}</h1>
        <p>{mode === "login" ? "Accede a pedidos, comprobantes y garantía." : "Compra más rápido y mantén cada equipo bajo control."}</p>
      </div>

      <button type="button" className="google-button" onClick={googleSignIn} disabled={pending}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.9h5.4a4.6 4.6 0 0 1-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.4Z"/><path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1a5.8 5.8 0 0 1-5.5-4H3.2v2.6A10 10 0 0 0 12 22Z"/><path fill="#FBBC05" d="M6.5 14a6 6 0 0 1 0-4V7.4H3.2a10 10 0 0 0 0 9.2L6.5 14Z"/><path fill="#EA4335" d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.9-2.8A9.7 9.7 0 0 0 3.2 7.4L6.5 10A5.8 5.8 0 0 1 12 5.9Z"/></svg>
        Continuar con Google
      </button>
      <div className="auth-divider"><span>o con correo</span></div>

      <form ref={formRef} onSubmit={submit} className="auth-form">
        {mode === "register" && <label className="field"><span>Nombre completo</span><input name="full_name" autoComplete="name" required placeholder="Tu nombre" /></label>}
        <label className="field"><span>Correo</span><div className="auth-input"><Mail size={17} /><input name="email" type="email" autoComplete="email" required placeholder="nombre@correo.com" /></div></label>
        <label className="field"><span>Contraseña</span><div className="auth-input"><LockKeyhole size={17} /><input name="password" type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} minLength={mode === "register" ? 12 : undefined} required placeholder={mode === "register" ? "12+ caracteres y un símbolo" : "Tu contraseña"} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label="Mostrar u ocultar contraseña">{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
        {mode === "login" && <div className="auth-form__options"><span>Sesión protegida en este dispositivo</span><Link href="/auth/recuperar">Olvidé mi contraseña</Link></div>}
        {error && <div className="form-error" role="alert">{error}</div>}
        {message && <div className="form-success" role="status">{message}</div>}
        <button className="button button--primary" disabled={pending}>{pending ? "Procesando…" : mode === "login" ? "Ingresar" : "Crear mi cuenta"}<ArrowRight size={17} /></button>
        {mode === "login" && (
          <button
            className="auth-magic-link"
            type="button"
            onClick={emailLinkSignIn}
            disabled={pending}
          >
            <Mail size={16} /> Ingresar con un enlace enviado por correo
          </button>
        )}
      </form>

      <p className="auth-card__legal">
        Al continuar podrás revisar y aceptar la <Link href="/legal/privacidad">Política de Privacidad</Link> y los <Link href="/legal/terminos-de-compra">Términos de la cuenta y compra</Link> vigentes.
      </p>

      <p className="auth-card__switch">
        {mode === "login" ? "¿Aún no tienes cuenta?" : "¿Ya tienes una cuenta?"}{" "}
        <Link href={mode === "login" ? "/auth/registro" : "/auth/ingresar"}>{mode === "login" ? "Regístrate" : "Ingresa"}</Link>
      </p>
      <div className="auth-card__security"><ShieldCheck size={17} /><span>Sesiones seguras, verificación de correo y 2FA con autenticador.</span></div>
    </div>
  );
}
