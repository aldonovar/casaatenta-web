"use client";

import { FormEvent, useEffect, useState } from "react";
import { KeyRound, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSafeInternalPath } from "@/lib/auth/redirect";

export function MfaChallenge({ next = "/cuenta" }: { next?: string }) {
  const router = useRouter();
  const configured = isSupabaseConfigured();
  const safeNext = getSafeInternalPath(next);
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(
    configured ? "" : "Supabase Auth no está configurado.",
  );
  const [loading, setLoading] = useState(configured);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();
    supabase.auth.mfa.listFactors().then(({ data, error: listError }) => {
      if (listError) setError(listError.message);
      const factor = data?.totp.find((item) => item.status === "verified");
      if (!factor) setError("No encontramos un autenticador verificado en esta cuenta.");
      else setFactorId(factor.id);
      setLoading(false);
    });
  }, [configured]);

  async function verify(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (!factorId) return;
    setLoading(true);
    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({ factorId, code });
    setLoading(false);
    if (verifyError) return setError("El código no es válido o ya expiró.");
    router.push(safeNext);
    router.refresh();
  }

  return (
    <div className="auth-card auth-card--mfa">
      <span className="mfa-icon"><KeyRound size={28} /></span>
      <h1>Verificación en dos pasos</h1>
      <p>Ingresa el código de seis dígitos de tu aplicación de autenticación.</p>
      <form onSubmit={verify} className="mfa-form">
        <input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" aria-label="Código de autenticación" required />
        {error && <div className="form-error">{error}</div>}
        <button className="button button--primary" disabled={loading || code.length !== 6}>{loading ? <LoaderCircle className="spin" size={17} /> : null} Verificar y continuar</button>
      </form>
    </div>
  );
}
