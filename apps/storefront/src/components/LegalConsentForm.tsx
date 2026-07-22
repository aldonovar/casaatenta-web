"use client";

import Link from "next/link";
import { useActionState } from "react";
import { ArrowRight, FileCheck2, ShieldCheck } from "lucide-react";
import {
  acceptCurrentLegalDocuments,
  type LegalConsentState,
} from "@/app/auth/consentimiento/actions";
import { STORE_LEGAL_PATHS } from "@/lib/store-legal";

const initialState: LegalConsentState = { error: "" };

export function LegalConsentForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState(
    acceptCurrentLegalDocuments,
    initialState,
  );

  return (
    <div className="auth-card auth-card--consent">
      <span className="mfa-icon"><FileCheck2 size={29} /></span>
      <div className="auth-card__heading">
        <span className="eyebrow">Transparencia de cuenta</span>
        <h1>Antes de continuar.</h1>
        <p>
          Revisa cómo usamos tus datos y las reglas que protegen el acceso, los
          pedidos y la seguridad de tu cuenta.
        </p>
      </div>
      <form action={action} className="auth-form">
        <input type="hidden" name="next" value={next} />
        <label className="legal-consent-check">
          <input type="checkbox" name="accepted" value="yes" required />
          <span>
            He leído y acepto la{" "}
            <Link href={STORE_LEGAL_PATHS.privacy} target="_blank">
              Política de Privacidad
            </Link>{" "}
            y los{" "}
            <Link href={STORE_LEGAL_PATHS.purchaseTerms} target="_blank">
              Términos de la cuenta y compra
            </Link>.
          </span>
        </label>
        {state.error && <div className="form-error" role="alert">{state.error}</div>}
        <button className="button button--primary" disabled={pending}>
          {pending ? "Registrando…" : "Aceptar y continuar"}<ArrowRight size={17} />
        </button>
      </form>
      <div className="auth-card__security">
        <ShieldCheck size={17} />
        <span>Guardamos la versión aceptada y la hora del servidor.</span>
      </div>
    </div>
  );
}
