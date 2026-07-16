import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getLegalConsentPath } from "@/lib/auth/redirect";
import { STORE_LEGAL_VERSIONS } from "@/lib/store-legal";
import { hasCurrentStoreAccountLegalAcceptances } from "@/lib/store-legal-consent";

export const getCurrentUser = cache(async () => {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  if (claimsError || !claimsData?.claims?.sub) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user;
});

export async function requireUser(next = "/cuenta") {
  const user = await getCurrentUser();
  if (!user) redirect(`/auth/ingresar?next=${encodeURIComponent(next)}`);
  return user;
}

export async function getAuthenticatorLevel() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (error) throw new Error("No pudimos verificar el nivel de seguridad de la sesión.");
  return data;
}

export async function storeSessionMeetsMfaPolicy() {
  if (!isSupabaseConfigured()) return false;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    "store_session_meets_mfa_policy",
  );
  if (error) {
    throw new Error("No pudimos verificar la política MFA de la sesión.");
  }
  return data === true;
}

export async function requireAal2(next = "/cuenta") {
  const user = await requireUser(next);
  if (!(await storeSessionMeetsMfaPolicy())) {
    redirect(`/auth/mfa?next=${encodeURIComponent(next)}`);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("store_legal_acceptances")
    .select("document_type,document_version,document_sha256")
    .eq("user_id", user.id)
    .in("document_version", [
      STORE_LEGAL_VERSIONS.privacy,
      STORE_LEGAL_VERSIONS.accountTerms,
    ]);
  if (error) {
    throw new Error("No pudimos verificar los consentimientos de la cuenta.");
  }

  if (!hasCurrentStoreAccountLegalAcceptances(data || [])) {
    redirect(getLegalConsentPath(next));
  }
  return user;
}
