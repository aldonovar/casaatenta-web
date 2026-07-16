"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import {
  submitPrivacyRequest,
  type PrivacyRequestState,
} from "@/app/cuenta/datos/actions";

const initialState: PrivacyRequestState = { error: "", success: "" };

export function PrivacyRequestForm() {
  const [state, action, pending] = useActionState(
    submitPrivacyRequest,
    initialState,
  );

  return (
    <form action={action} className="privacy-request-form">
      <label className="field">
        <span>Tipo de solicitud</span>
        <select name="request_type" required defaultValue="access">
          <option value="access">Acceso a mis datos</option>
          <option value="rectification">Rectificación</option>
          <option value="deletion">Eliminación de cuenta y datos</option>
          <option value="opposition">Oposición a un tratamiento</option>
          <option value="revocation">Revocación de consentimiento</option>
          <option value="portability">Portabilidad</option>
        </select>
      </label>
      <label className="field">
        <span>Detalle</span>
        <textarea
          name="details"
          rows={5}
          maxLength={4000}
          placeholder="Explica qué información o acción necesitas. No incluyas contraseñas ni datos de tarjeta."
        />
      </label>
      {state.error && <div className="form-error" role="alert">{state.error}</div>}
      {state.success && <div className="form-success" role="status">{state.success}</div>}
      <button className="button button--dark" disabled={pending}>
        {pending ? "Registrando…" : "Registrar solicitud"}<ArrowRight size={17} />
      </button>
    </form>
  );
}
