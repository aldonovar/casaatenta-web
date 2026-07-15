import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

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
  if (error) return null;
  return data;
}

export async function requireAal2(next = "/cuenta") {
  const user = await requireUser(next);
  const aal = await getAuthenticatorLevel();
  if (aal?.currentLevel === "aal1" && aal.nextLevel === "aal2") {
    redirect(`/auth/mfa?next=${encodeURIComponent(next)}`);
  }
  return user;
}
