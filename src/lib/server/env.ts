import "server-only";

export class ConfigurationError extends Error {
  constructor(variable: string) {
    super(`Falta configurar la variable de entorno ${variable}.`);
    this.name = "ConfigurationError";
  }
}

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new ConfigurationError(name);
  return value;
}

export function getSupabaseConfig() {
  const secretKey =
    process.env.SUPABASE_SECRET_KEY?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!secretKey) throw new ConfigurationError("SUPABASE_SECRET_KEY");

  return {
    url: required("SUPABASE_URL"),
    secretKey,
  };
}

export function getResendConfig() {
  return {
    apiKey: required("RESEND_API_KEY"),
    from: required("RESEND_FROM_EMAIL"),
    inbox: getContactInbox(),
  };
}

export function getResendWebhookSecret() {
  return required("RESEND_WEBHOOK_SECRET");
}

export function getContactInbox() {
  return process.env.CONTACT_INBOX?.trim() || "info@casa-atenta.com";
}

export function getTurnstileConfig() {
  const siteUrl = new URL(
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.casa-atenta.com",
  );
  const configuredHostnames = process.env.TURNSTILE_ALLOWED_HOSTNAMES
    ?.split(",")
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
    throw new Error("NEWSLETTER_TOKEN_SECRET debe tener al menos 32 caracteres.");
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
