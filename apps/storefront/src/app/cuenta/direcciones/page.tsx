import type { Metadata } from "next";
import { AddressManager, type CustomerAddress } from "@/components/AddressManager";
import { requireUser } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mis direcciones",
  robots: { index: false, follow: false },
};

export default async function AddressesPage() {
  let addresses: CustomerAddress[] = [];
  let loadState: "ready" | "unconfigured" | "error" = "unconfigured";

  if (isSupabaseConfigured()) {
    await requireUser("/cuenta/direcciones");
    const { data, error } = await (await createClient())
      .from("customer_addresses")
      .select("id,label,recipient_name,phone,address_line_1,address_line_2,department,province,district,postal_code,reference,is_default")
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("store_addresses_lookup_error", error.code);
      loadState = "error";
    } else {
      addresses = (data || []) as CustomerAddress[];
      loadState = "ready";
    }
  }

  return <AddressManager initialAddresses={addresses} loadState={loadState} />;
}
