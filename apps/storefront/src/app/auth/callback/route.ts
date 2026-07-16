import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { getSafeInternalPath } from "@/lib/auth/redirect";

function privateRedirect(url: URL) {
  const response = NextResponse.redirect(url);
  response.headers.set(
    "Cache-Control",
    "private, no-cache, no-store, must-revalidate, max-age=0",
  );
  response.headers.set("Expires", "0");
  response.headers.set("Pragma", "no-cache");
  return response;
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeInternalPath(searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return privateRedirect(new URL("/auth/ingresar?error=config", origin));
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: aal, error: aalError } =
        await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
      if (aalError) {
        return privateRedirect(
          new URL("/auth/ingresar?error=session-security", origin),
        );
      }
      if (aal?.currentLevel === "aal1" && aal.nextLevel === "aal2") {
        return privateRedirect(
          new URL(`/auth/mfa?next=${encodeURIComponent(next)}`, origin),
        );
      }
      return privateRedirect(new URL(next, origin));
    }
  }

  return privateRedirect(new URL("/auth/ingresar?error=callback", origin));
}
