import type { ReactNode } from "react";
import { AccountNav } from "@/components/AccountNav";
import { requireAal2 } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AccountLayout({ children }: { children: ReactNode }) {
  if (isSupabaseConfigured()) await requireAal2("/cuenta");
  else if (process.env.STORE_MODE === "live") {
    throw new Error("Supabase Auth es obligatorio en STORE_MODE=live.");
  }
  return <section className="account-page"><div className="store-container account-layout"><AccountNav /><div className="account-content">{children}</div></div></section>;
}
