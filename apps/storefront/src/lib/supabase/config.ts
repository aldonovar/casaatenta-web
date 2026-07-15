export const supabasePublicConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  publishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "",
};

export function isSupabaseConfigured() {
  return Boolean(
    supabasePublicConfig.url && supabasePublicConfig.publishableKey,
  );
}

export function requireSupabasePublicConfig() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      "Falta configurar NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );
  }
  return supabasePublicConfig;
}
