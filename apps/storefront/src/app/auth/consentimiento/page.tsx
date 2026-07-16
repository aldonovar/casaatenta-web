import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { LegalConsentForm } from "@/components/LegalConsentForm";
import { requireUser, storeSessionMeetsMfaPolicy } from "@/lib/auth/dal";
import { getLegalConsentPath, getSafeInternalPath } from "@/lib/auth/redirect";
import { createClient } from "@/lib/supabase/server";
import { STORE_LEGAL_VERSIONS } from "@/lib/store-legal";
import { hasCurrentStoreAccountLegalAcceptances } from "@/lib/store-legal-consent";

export const metadata: Metadata = {
  title: "Consentimiento de cuenta",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function LegalConsentPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: requestedNext } = await searchParams;
  const next = getSafeInternalPath(requestedNext);
  const user = await requireUser(getLegalConsentPath(next));
  if (!(await storeSessionMeetsMfaPolicy())) {
    redirect(
      `/auth/mfa?next=${encodeURIComponent(getLegalConsentPath(next))}`,
    );
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

  if (!error && hasCurrentStoreAccountLegalAcceptances(data || [])) {
    redirect(next);
  }

  if (error) {
    console.error("store_legal_acceptance_lookup_error", error.code);
  }

  return (
    <section className="auth-simple-page">
      <LegalConsentForm next={next} />
    </section>
  );
}
