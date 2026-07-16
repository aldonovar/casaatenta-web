const safeOrigin = "https://tienda.casa-atenta.invalid";

export function getSafeInternalPath(
  requested: string | null | undefined,
  fallback = "/cuenta",
) {
  if (
    !requested ||
    !requested.startsWith("/") ||
    requested.includes("\\") ||
    /[\u0000-\u001f\u007f]/.test(requested)
  ) {
    return fallback;
  }

  try {
    const resolved = new URL(requested, safeOrigin);
    if (resolved.origin !== safeOrigin) return fallback;
    return `${resolved.pathname}${resolved.search}${resolved.hash}`;
  } catch {
    return fallback;
  }
}

export function getLegalConsentPath(next: string | null | undefined) {
  const safeNext = getSafeInternalPath(next);
  if (safeNext.startsWith("/auth/consentimiento")) return safeNext;
  return `/auth/consentimiento?next=${encodeURIComponent(safeNext)}`;
}
