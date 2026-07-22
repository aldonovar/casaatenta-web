"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireAal2 } from "@/lib/auth/dal";
import { createClient } from "@/lib/supabase/server";

const requestSchema = z.object({
  requestType: z.enum([
    "access",
    "rectification",
    "deletion",
    "opposition",
    "revocation",
    "portability",
  ]),
  details: z.string().trim().max(4000),
});

export type PrivacyRequestState = { error: string; success: string };

export async function submitPrivacyRequest(
  _previousState: PrivacyRequestState,
  formData: FormData,
): Promise<PrivacyRequestState> {
  await requireAal2("/cuenta/datos");
  const parsed = requestSchema.safeParse({
    requestType: formData.get("request_type"),
    details: String(formData.get("details") || ""),
  });
  if (!parsed.success) {
    return { error: "Revisa el tipo y el detalle de la solicitud.", success: "" };
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_store_privacy_request", {
    p_request_type: parsed.data.requestType,
    p_details: parsed.data.details,
  });
  if (error) {
    console.error("store_privacy_request_error", error.code);
    return {
      error: error.message.includes("too_many_open")
        ? "Ya existen varias solicitudes abiertas. Contacta a soporte si necesitas añadir información."
        : "No pudimos registrar la solicitud. Intenta nuevamente.",
      success: "",
    };
  }

  revalidatePath("/cuenta/datos");
  return {
    error: "",
    success: "Solicitud registrada. Podrás seguir su estado en esta misma página.",
  };
}
