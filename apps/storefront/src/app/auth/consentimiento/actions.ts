"use server";

import { redirect } from "next/navigation";
import { getCurrentUser, storeSessionMeetsMfaPolicy } from "@/lib/auth/dal";
import { getLegalConsentPath, getSafeInternalPath } from "@/lib/auth/redirect";
import { getCurrentStoreAccountLegalAcceptances } from "@/lib/store-legal-consent";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export type LegalConsentState = { error: string };

export async function acceptCurrentLegalDocuments(
  _previousState: LegalConsentState,
  formData: FormData,
): Promise<LegalConsentState> {
  const next = getSafeInternalPath(String(formData.get("next") || ""));
  if (formData.get("accepted") !== "yes") {
    return { error: "Debes leer y aceptar ambos documentos para continuar." };
  }

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/auth/ingresar?next=${encodeURIComponent(next)}`);
  }

  let meetsMfaPolicy;
  try {
    meetsMfaPolicy = await storeSessionMeetsMfaPolicy();
  } catch {
    return {
      error:
        "No pudimos verificar la seguridad de tu sesión. Vuelve a ingresar e intenta nuevamente.",
    };
  }
  if (!meetsMfaPolicy) {
    redirect(
      `/auth/mfa?next=${encodeURIComponent(getLegalConsentPath(next))}`,
    );
  }

  try {
    const { error } = await getSupabaseAdmin()
      .from("store_legal_acceptances")
      .upsert(getCurrentStoreAccountLegalAcceptances(user.id), {
        onConflict:
          "user_id,document_type,document_version,document_sha256",
        ignoreDuplicates: true,
      });
    if (error) throw error;
  } catch (caught) {
    console.error(
      "store_legal_acceptance_error",
      typeof caught === "object" && caught && "code" in caught
        ? String(caught.code)
        : "unavailable",
    );
    return {
      error:
        "No pudimos registrar tu aceptación de forma segura. Intenta nuevamente o contacta a soporte.",
    };
  }

  redirect(next);
}
