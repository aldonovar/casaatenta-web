"use client";

import Image from "next/image";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { Check, KeyRound, LoaderCircle, ShieldCheck, Smartphone, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type Factor = { id: string; friendly_name?: string | null; status: string; created_at: string };

export function MfaSecurityPanel() {
  const [factors, setFactors] = useState<Factor[]>([]);
  const [factorId, setFactorId] = useState("");
  const [qr, setQr] = useState("");
  const [code, setCode] = useState("");
  const configured = isSupabaseConfigured();
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadFactors = useCallback(async () => {
    if (!configured) return;
    const { data, error: listError } = await createClient().auth.mfa.listFactors();
    if (listError) setError(listError.message);
    setFactors((data?.totp || []) as Factor[]);
    setLoading(false);
  }, [configured]);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadFactors(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadFactors]);

  async function startEnrollment() {
    setError(""); setMessage(""); setLoading(true);
    const supabase = createClient();
    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: `Casa Atenta · ${new Date().toLocaleDateString("es-PE")}`,
    });
    setLoading(false);
    if (enrollError) return setError(enrollError.message);
    setFactorId(data.id);
    setQr(data.totp.qr_code);
  }

  async function verifyEnrollment(event: FormEvent) {
    event.preventDefault();
    if (!factorId) return;
    setLoading(true); setError("");
    const { error: verifyError } = await createClient().auth.mfa.challengeAndVerify({ factorId, code });
    setLoading(false);
    if (verifyError) return setError("El código no es válido. Revisa la hora del dispositivo e inténtalo de nuevo.");
    setQr(""); setFactorId(""); setCode(""); setMessage("Autenticación en dos pasos activada.");
    await createClient().auth.refreshSession();
    await loadFactors();
  }

  async function removeFactor(id: string) {
    setLoading(true); setError(""); setMessage("");
    const { error: removeError } = await createClient().auth.mfa.unenroll({ factorId: id });
    setLoading(false);
    if (removeError) return setError("Primero verifica esta sesión con 2FA y vuelve a intentarlo.");
    setMessage("Autenticador eliminado.");
    await createClient().auth.refreshSession();
    await loadFactors();
  }

  if (!configured) {
    return <div className="security-setup"><ShieldCheck size={25} /><div><strong>2FA preparado, pendiente de credenciales</strong><p>Configura Supabase Auth y habilita TOTP para activar este panel.</p></div></div>;
  }

  return (
    <div className="mfa-panel">
      <div className="mfa-panel__head"><span><KeyRound size={21} /></span><div><h3>Autenticación en dos pasos</h3><p>Usa una aplicación TOTP como Google Authenticator, 1Password o Authy.</p></div></div>
      {loading && factors.length === 0 ? <LoaderCircle className="spin" size={22} /> : (
        <>
          {factors.filter((factor) => factor.status === "verified").map((factor) => (
            <div className="factor-row" key={factor.id}><span><Smartphone size={20} /></span><p><strong>{factor.friendly_name || "Aplicación de autenticación"}</strong><small>Verificado · {new Date(factor.created_at).toLocaleDateString("es-PE")}</small></p><b><Check size={13} /> Activo</b><button onClick={() => removeFactor(factor.id)} aria-label="Eliminar autenticador"><Trash2 size={16} /></button></div>
          ))}
          {!qr && <button className="button button--outline" onClick={startEnrollment} disabled={loading}>Añadir autenticador</button>}
          {qr && (
            <form className="mfa-enrollment" onSubmit={verifyEnrollment}>
              <div className="mfa-enrollment__qr"><Image src={qr} alt="Código QR para configurar el autenticador" width={180} height={180} unoptimized /></div>
              <div><span className="eyebrow">Paso final</span><h4>Escanea y confirma</h4><p>Escanea el QR y escribe el código de seis dígitos para finalizar.</p><input value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))} inputMode="numeric" autoComplete="one-time-code" placeholder="000000" required /><button className="button button--primary" disabled={loading || code.length !== 6}>Activar 2FA</button></div>
            </form>
          )}
          {error && <div className="form-error">{error}</div>}
          {message && <div className="form-success">{message}</div>}
        </>
      )}
    </div>
  );
}
