import type { Metadata } from "next";
import { requireUser } from "@/lib/auth/dal";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import { AddressManager, type CustomerAddress } from "@/components/AddressManager";

export const metadata: Metadata = { title: "Mis direcciones", robots: { index: false, follow: false } };

export default async function AddressesPage() {
  let addresses: CustomerAddress[] = [];
  if (isSupabaseConfigured()) {
    await requireUser("/cuenta/direcciones");
    const { data } = await (await createClient()).from("customer_addresses").select("id,label,recipient_name,phone,address_line_1,address_line_2,department,province,district,postal_code,reference,is_default").order("is_default", { ascending: false }).order("created_at", { ascending: false });
    addresses = (data || []) as CustomerAddress[];
  }
  return <AddressManager initialAddresses={addresses} />;
}
