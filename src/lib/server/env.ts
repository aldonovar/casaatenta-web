import "server-only";

import {
  QUOTATION_FROM,
  QUOTATION_REPLY_TO,
  parseQuotationTestRecipients,
} from "@/lib/quotation-email/core";

export class ConfigurationError extends Error {
  constructor(variable: string) {
    super(`Falta configurar la variable de entorno ${variable}.`);
    this.name = "ConfigurationError";
  }
}

export const CASA_ATENTA_SUPABASE_PROJECT_REF = "vywtnakijogqoiumnqaa";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new ConfigurationError(name);
  return value;
}

function requiredSecret(name: string, minimum = 32) {
  const value = required(name);
  if (
    value.length < minimum ||
    /^(?:replace|change|your[_-]|example|dummy|test[_-])/iu.test(value)
  ) {
    throw new ConfigurationError(
      `${name} (usa un secreto aleatorio real de al menos ${minimum} caracteres)`,
    );
  }
  return value;
}

export function getSupabaseConfig() {
  const secretKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!secretKey) throw new ConfigurationError("SUPABASE_SECRET_KEY");

  const rawUrl = required("SUPABASE_URL");
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new ConfigurationError("SUPABASE_URL (URL inválida)");
  }
  const expectedHostname = `${CASA_ATENTA_SUPABASE_PROJECT_REF}.supabase.co`;
  if (url.protocol !== "https:" || url.hostname !== expectedHostname) {
    throw new ConfigurationError(
      `SUPABASE_URL (debe pertenecer al proyecto Casa Atenta ${CASA_ATENTA_SUPABASE_PROJECT_REF})`,
    );
  }

  return { url: url.origin, secretKey };
}

export function getResendConfig() {
  return {
    apiKey: required("RESEND_API_KEY"),
    from: required("RESEND_FROM_EMAIL"),
    inbox: getContactInbox(),
  };
}

export function getQuotationResendConfig() {
  const config = getResendConfig();
  const quotationFrom =
    process.env.QUOTATION_RESEND_FROM_EMAIL?.trim() || QUOTATION_FROM;
  if (quotationFrom !== QUOTATION_FROM) {
    throw new ConfigurationError(
      `QUOTATION_RESEND_FROM_EMAIL (debe ser exactamente ${QUOTATION_FROM})`,
    );
  }

  return {
    ...config,
    from: quotationFrom,
    replyTo: QUOTATION_REPLY_TO,
  };
}

export function getQuotationAdminConfig() {
  const accessToken = requiredSecret("QUOTATION_ADMIN_ACCESS_TOKEN");
  const sessionSecret = requiredSecret("QUOTATION_ADMIN_SESSION_SECRET");
  if (accessToken === sessionSecret) {
    throw new ConfigurationError(
      "QUOTATION_ADMIN_SESSION_SECRET (debe ser independiente del token de acceso)",
    );
  }

  return { accessToken, sessionSecret };
}

export function getQuotationAuditSecret() {
  return requiredSecret("QUOTATION_AUDIT_SECRET");
}

export function getQuotationTestRecipients() {
  try {
    return parseQuotationTestRecipients(required("QUOTATION_TEST_RECIPIENTS"));
  } catch (error) {
    if (error instanceof ConfigurationError) throw error;
    throw new ConfigurationError(
      "QUOTATION_TEST_RECIPIENTS (lista válida separada por comas)",
    );
  }
}

export function isQuotationProductionEnabled() {
  return process.env.QUOTATION_PRODUCTION_ENABLED?.trim() === "true";
}

export function getResendWebhookSecret() {
  const secret = requiredSecret("RESEND_WEBHOOK_SECRET", 30);
  if (!/^whsec_[A-Za-z0-9_+/=-]{24,}$/u.test(secret)) {
    throw new ConfigurationError(
      "RESEND_WEBHOOK_SECRET (debe ser un secreto whsec_ válido de Resend)",
    );
  }
  return secret;
}

export function getContactInbox() {
  return process.env.CONTACT_INBOX?.trim() || "info@casa-atenta.com";
}

export function getTurnstileConfig() {
  const siteUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.casa-atenta.com",
  );
  const configuredHostnames = process.env.TURNSTILE_ALLOWED_HOSTNAMES?.split(
    ",",
  )
    .map((hostname) => hostname.trim().toLowerCase())
    .filter(Boolean);

  return {
    secretKey: required("TURNSTILE_SECRET_KEY"),
    allowedHostnames:
      configuredHostnames && configuredHostnames.length > 0
        ? configuredHostnames
        : [siteUrl.hostname.toLowerCase()],
  };
}

export function getRateLimitSecret() {
  const secret = required("RATE_LIMIT_SECRET");
  if (secret.length < 32) {
    throw new Error("RATE_LIMIT_SECRET debe tener al menos 32 caracteres.");
  }
  return secret;
}

export function getNewsletterTokenSecret() {
  const secret = required("NEWSLETTER_TOKEN_SECRET");
  if (secret.length < 32) {
    throw new Error(
      "NEWSLETTER_TOKEN_SECRET debe tener al menos 32 caracteres.",
    );
  }
  return secret;
}

export function getCronSecret() {
  const secret = required("CRON_SECRET");
  if (secret.length < 32) {
    throw new Error("CRON_SECRET debe tener al menos 32 caracteres.");
  }
  return secret;
}

export function getSiteUrl() {
  return new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.casa-atenta.com",
  );
}
