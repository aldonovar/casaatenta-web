import "server-only";

import { getStoreLegalProviderSnapshot } from "./store-config";
import { STORE_LEGAL_VERSIONS } from "./store-legal";
import {
  privacyDocument,
  purchaseTermsDocument,
} from "./store-legal-documents";
import { getStoreLegalEvidenceSha256 } from "./store-legal-hash";

export type StoreLegalAcceptanceRecord = {
  document_type: string;
  document_version: string;
  document_sha256: string;
};

export function getCurrentStoreAccountLegalAcceptances(userId: string) {
  const providerSnapshot = getStoreLegalProviderSnapshot();

  return [
    {
      user_id: userId,
      document_type: "privacy_notice",
      document_version: STORE_LEGAL_VERSIONS.privacy,
      document_sha256: getStoreLegalEvidenceSha256(privacyDocument),
      provider_snapshot: providerSnapshot,
      source: "account_onboarding",
      locale: "es-PE",
    },
    {
      user_id: userId,
      document_type: "account_terms",
      document_version: STORE_LEGAL_VERSIONS.accountTerms,
      document_sha256: getStoreLegalEvidenceSha256(purchaseTermsDocument),
      provider_snapshot: providerSnapshot,
      source: "account_onboarding",
      locale: "es-PE",
    },
  ] as const;
}

export function hasCurrentStoreAccountLegalAcceptances(
  records: readonly StoreLegalAcceptanceRecord[],
) {
  const accepted = new Set(
    records.map(
      (record) =>
        `${record.document_type}:${record.document_version}:${record.document_sha256.trim()}`,
    ),
  );
  const current = getCurrentStoreAccountLegalAcceptances("current-user");

  return current.every((document) =>
    accepted.has(
      `${document.document_type}:${document.document_version}:${document.document_sha256}`,
    ),
  );
}
