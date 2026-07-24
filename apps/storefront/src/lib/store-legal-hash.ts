import "server-only";

import { createHash } from "node:crypto";
import type { StoreLegalDocument } from "./store-legal-documents";
import {
  getStoreLegalProviderSnapshot,
  type StoreLegalProviderSnapshot,
} from "./store-config";

export type StoreLegalEvidence = {
  document: StoreLegalDocument;
  provider: StoreLegalProviderSnapshot;
};

export function getStoreLegalEvidence(
  document: StoreLegalDocument,
): StoreLegalEvidence {
  return {
    document,
    provider: getStoreLegalProviderSnapshot(),
  };
}

export function getStoreLegalEvidenceSha256(document: StoreLegalDocument) {
  return createHash("sha256")
    .update(JSON.stringify(getStoreLegalEvidence(document)), "utf8")
    .digest("hex");
}
