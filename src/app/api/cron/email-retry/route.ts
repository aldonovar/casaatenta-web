import {
  claimNotificationEmail,
  claimReceiptEmail,
  contactNotificationEmail,
  contactReceiptEmail,
  newsletterConfirmationEmail,
  newsletterWelcomeEmail,
  sendEmail,
  type ClaimEmailData,
  type ContactEmailData,
} from "@/lib/server/email";
import { sanitizeDeliveryError } from "@/lib/quotation-email/core";
import { getContactInbox, getCronSecret, getSiteUrl } from "@/lib/server/env";
import {
  MAX_QUOTATION_ALERT_ATTEMPTS,
  processQuotationIncidentAlert,
  QUOTATION_ALERT_CLAIM_LEASE_MS,
} from "@/lib/server/quotation-alert";
import {
  createNewsletterConfirmationToken,
  createUnsubscribeToken,
  hashToken,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/server/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_RETRIES = 5;
const BATCH_SIZE = 20;
const CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;
const MIN_CONFIRMATION_VALIDITY_MS = 5 * 60 * 1000;

type RetryState = {
  email_retry_count: number;
};

function retryMetadata(row: RetryState, complete: boolean) {
  if (complete) {
    return {
      email_retry_count: 0,
      email_retry_after: null,
      last_email_error: null,
    };
  }

  const retryCount = Math.min(row.email_retry_count + 1, MAX_RETRIES);
  const delayMinutes = Math.min(24 * 60, 15 * 2 ** (retryCount - 1));
  return {
    email_retry_count: retryCount,
    email_retry_after: new Date(
      Date.now() + delayMinutes * 60_000,
    ).toISOString(),
    last_email_error: "resend_delivery_failed",
  };
}

async function safeSend(operation: () => Promise<string>, reference: string) {
  try {
    return await operation();
  } catch (error) {
    console.error(`[email-retry:${reference}]`, error);
    return null;
  }
}

async function retryQuotationAlerts() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const staleClaimCutoff = new Date(
    Date.now() - QUOTATION_ALERT_CLAIM_LEASE_MS,
  ).toISOString();
  const fields =
    "id, svix_id, event_type, email_id, event_created_at, received_at" as const;
  const [retryableResult, staleResult] = await Promise.all([
    supabase
      .from("email_events")
      .select(fields)
      .in("alert_status", ["pending", "failed"])
      .lt("alert_attempt_count", MAX_QUOTATION_ALERT_ATTEMPTS)
      .lte("alert_retry_after", now)
      .order("received_at", { ascending: true })
      .limit(BATCH_SIZE),
    supabase
      .from("email_events")
      .select(fields)
      .eq("alert_status", "processing")
      .lt("alert_attempt_count", MAX_QUOTATION_ALERT_ATTEMPTS)
      .lte("alert_claimed_at", staleClaimCutoff)
      .order("received_at", { ascending: true })
      .limit(BATCH_SIZE),
  ]);
  if (retryableResult.error || staleResult.error) {
    throw retryableResult.error || staleResult.error;
  }
  const rows = [...(retryableResult.data || []), ...(staleResult.data || [])]
    .sort((left, right) => left.received_at.localeCompare(right.received_at))
    .slice(0, BATCH_SIZE);

  let completed = 0;
  for (const row of rows) {
    try {
      const result = await processQuotationIncidentAlert({
        emailEventId: row.id,
        svixId: row.svix_id,
        eventType: row.event_type,
        resendEmailId: row.email_id,
        occurredAt: row.event_created_at,
      });
      if (result.status === "sent" || result.status === "already_sent") {
        completed += 1;
      }
    } catch (error) {
      console.error(
        `[email-retry:quotation-alert:${row.id}] ${sanitizeDeliveryError(error)}`,
      );
    }
  }

  return { attempted: rows.length, completed };
}

function formatLimaDate(value: string) {
  return new Intl.DateTimeFormat("es-PE", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Lima",
  }).format(new Date(value));
}

async function retryContacts() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: rows, error } = await supabase
    .from("contact_submissions")
    .select(
      "id, source, name, email, phone, service, location, measures, message, project_data, resend_notification_id, resend_confirmation_id, email_retry_count",
    )
    .in("status", ["received", "email_failed"])
    .lt("email_retry_count", MAX_RETRIES)
    .lte("email_retry_after", now)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);
  if (error) throw error;

  let completed = 0;
  for (const row of rows || []) {
    const emailData: ContactEmailData = {
      id: row.id as string,
      source: row.source as string,
      name: row.name as string,
      email: row.email as string,
      phone: row.phone as string,
      service: (row.service as string | null) || null,
      location: (row.location as string | null) || null,
      measures: (row.measures as string | null) || null,
      message: (row.message as string | null) || null,
      projectData: (row.project_data || {}) as Record<string, string>,
    };
    const inbox = getContactInbox();
    const notification = contactNotificationEmail(emailData);
    const receipt = contactReceiptEmail(emailData.name, emailData.id);
    const notificationId =
      (row.resend_notification_id as string | null) ||
      (await safeSend(
        () =>
          sendEmail(
            {
              to: inbox,
              replyTo: emailData.email,
              ...notification,
              tags: [
                { name: "category", value: "contact-notification" },
                { name: "source", value: emailData.source },
              ],
            },
            `contact-notification/${emailData.id}`,
          ),
        `contact-notification/${emailData.id}`,
      ));
    const receiptId =
      (row.resend_confirmation_id as string | null) ||
      (await safeSend(
        () =>
          sendEmail(
            {
              to: emailData.email,
              replyTo: inbox,
              ...receipt,
              tags: [{ name: "category", value: "contact-receipt" }],
            },
            `contact-receipt/${emailData.id}`,
          ),
        `contact-receipt/${emailData.id}`,
      ));
    const complete = Boolean(notificationId && receiptId);

    const { error: updateError } = await supabase
      .from("contact_submissions")
      .update({
        status: complete ? "notified" : "email_failed",
        resend_notification_id: notificationId,
        resend_confirmation_id: receiptId,
        ...retryMetadata(row as RetryState, complete),
      })
      .eq("id", emailData.id)
      .in("status", ["received", "email_failed"]);
    if (updateError) throw updateError;
    if (complete) completed += 1;
  }

  return { attempted: rows?.length || 0, completed };
}

async function retryClaims() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: rows, error } = await supabase
    .from("consumer_claims")
    .select(
      "id, code, full_name, document_type, document_number, email, phone, address, is_minor, minor_guardian, minor_guardian_address, minor_guardian_phone, minor_guardian_email, claim_type, good_type, product_description, claimed_amount, claim_detail, consumer_request, created_at, resend_notification_id, resend_receipt_id, email_retry_count",
    )
    .in("status", ["received", "email_failed"])
    .lt("email_retry_count", MAX_RETRIES)
    .lte("email_retry_after", now)
    .order("created_at", { ascending: true })
    .limit(BATCH_SIZE);
  if (error) throw error;

  let completed = 0;
  for (const row of rows || []) {
    const emailData: ClaimEmailData = {
      id: row.id as string,
      code: row.code as string,
      fullName: row.full_name as string,
      documentType: row.document_type as string,
      documentNumber: row.document_number as string,
      email: row.email as string,
      phone: row.phone as string,
      address: row.address as string,
      isMinor: row.is_minor as boolean,
      minorGuardian: (row.minor_guardian as string | null) || null,
      minorGuardianAddress:
        (row.minor_guardian_address as string | null) || null,
      minorGuardianPhone: (row.minor_guardian_phone as string | null) || null,
      minorGuardianEmail: (row.minor_guardian_email as string | null) || null,
      claimType: row.claim_type as string,
      goodType: row.good_type as string,
      productDescription: row.product_description as string,
      claimedAmount:
        row.claimed_amount === null ? null : Number(row.claimed_amount),
      claimDetail: row.claim_detail as string,
      consumerRequest: row.consumer_request as string,
      createdAt: formatLimaDate(row.created_at as string),
    };
    const inbox = getContactInbox();
    const notification = claimNotificationEmail(emailData);
    const receipt = claimReceiptEmail(emailData);
    const notificationId =
      (row.resend_notification_id as string | null) ||
      (await safeSend(
        () =>
          sendEmail(
            {
              to: inbox,
              replyTo: emailData.email,
              ...notification,
              tags: [{ name: "category", value: "consumer-claim" }],
            },
            `claim-notification/${emailData.id}`,
          ),
        `claim-notification/${emailData.id}`,
      ));
    const receiptId =
      (row.resend_receipt_id as string | null) ||
      (await safeSend(
        () =>
          sendEmail(
            {
              to: emailData.email,
              replyTo: inbox,
              ...receipt,
              tags: [{ name: "category", value: "claim-receipt" }],
            },
            `claim-receipt/${emailData.id}`,
          ),
        `claim-receipt/${emailData.id}`,
      ));
    const complete = Boolean(notificationId && receiptId);

    const { error: updateError } = await supabase
      .from("consumer_claims")
      .update({
        status: complete ? "notified" : "email_failed",
        resend_notification_id: notificationId,
        resend_receipt_id: receiptId,
        ...retryMetadata(row as RetryState, complete),
      })
      .eq("id", emailData.id)
      .in("status", ["received", "email_failed"]);
    if (updateError) throw updateError;
    if (complete) completed += 1;
  }

  return { attempted: rows?.length || 0, completed };
}

function usableConfirmationExpiry(value: unknown) {
  const parsed = typeof value === "string" ? new Date(value) : null;
  if (
    parsed &&
    Number.isFinite(parsed.getTime()) &&
    parsed.getTime() > Date.now() + MIN_CONFIRMATION_VALIDITY_MS
  ) {
    return parsed.toISOString();
  }

  return new Date(Date.now() + CONFIRMATION_TTL_MS).toISOString();
}

async function retryNewsletterConfirmations() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: rows, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      "id, email, name, confirmation_token_hash, confirmation_expires_at, email_retry_count",
    )
    .eq("status", "pending")
    .is("resend_confirmation_id", null)
    .lt("email_retry_count", MAX_RETRIES)
    .lte("email_retry_after", now)
    .order("consent_at", { ascending: true })
    .limit(BATCH_SIZE);
  if (error) throw error;

  let completed = 0;
  for (const row of rows || []) {
    const subscriberId = row.id as string;
    const expiresAt = usableConfirmationExpiry(row.confirmation_expires_at);
    const token = createNewsletterConfirmationToken(subscriberId, expiresAt);
    const tokenHash = hashToken(token);
    const currentTokenHash = row.confirmation_token_hash as string | null;

    if (currentTokenHash !== tokenHash) {
      // Esta rotación vuelve recuperables los registros históricos cuyo token
      // aleatorio solo quedó almacenado como hash. El guardado sucede antes
      // del envío y está protegido con comparación optimista para que dos
      // ejecuciones del cron no generen enlaces válidos distintos.
      const baseUpdate = supabase
        .from("newsletter_subscribers")
        .update({
          confirmation_token_hash: tokenHash,
          confirmation_expires_at: expiresAt,
        })
        .eq("id", subscriberId)
        .eq("status", "pending")
        .is("resend_confirmation_id", null);
      const guardedUpdate = currentTokenHash
        ? baseUpdate.eq("confirmation_token_hash", currentTokenHash)
        : baseUpdate.is("confirmation_token_hash", null);
      const { data: rotated, error: rotateError } = await guardedUpdate
        .select("id")
        .maybeSingle();
      if (rotateError) throw rotateError;
      if (!rotated) continue;
    }

    const confirmation = newsletterConfirmationEmail(
      (row.name as string | null) || null,
      token,
    );
    const confirmationId = await safeSend(
      () =>
        sendEmail(
          {
            to: row.email as string,
            replyTo: getContactInbox(),
            ...confirmation,
            tags: [{ name: "category", value: "newsletter-confirmation" }],
          },
          `newsletter-confirmation/${subscriberId}/${tokenHash.slice(0, 12)}`,
        ),
      `newsletter-confirmation/${subscriberId}`,
    );
    const complete = Boolean(confirmationId);

    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        resend_confirmation_id: confirmationId,
        ...retryMetadata(row as RetryState, complete),
      })
      .eq("id", subscriberId)
      .eq("status", "pending")
      .eq("confirmation_token_hash", tokenHash)
      .is("resend_confirmation_id", null);
    if (updateError) throw updateError;
    if (complete) completed += 1;
  }

  return { attempted: rows?.length || 0, completed };
}

async function retryNewsletterWelcome() {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: rows, error } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, name, email_retry_count")
    .eq("status", "confirmed")
    .is("resend_welcome_id", null)
    .lt("email_retry_count", MAX_RETRIES)
    .lte("email_retry_after", now)
    .order("confirmed_at", { ascending: true })
    .limit(BATCH_SIZE);
  if (error) throw error;

  let completed = 0;
  for (const row of rows || []) {
    const token = createUnsubscribeToken(row.id as string);
    const oneClickUrl = new URL("/api/newsletter/unsubscribe", getSiteUrl());
    oneClickUrl.searchParams.set("token", token);
    const unsubscribePageUrl = new URL("/newsletter/cancelar", getSiteUrl());
    unsubscribePageUrl.searchParams.set("token", token);
    const welcome = newsletterWelcomeEmail(
      (row.name as string | null) || null,
      unsubscribePageUrl.href,
    );
    const welcomeId = await safeSend(
      () =>
        sendEmail(
          {
            to: row.email as string,
            replyTo: getContactInbox(),
            ...welcome,
            tags: [{ name: "category", value: "newsletter-welcome" }],
            headers: {
              "List-Unsubscribe": `<${oneClickUrl.href}>`,
              "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            },
          },
          `newsletter-welcome/${row.id}`,
        ),
      `newsletter-welcome/${row.id}`,
    );
    const complete = Boolean(welcomeId);

    const { error: updateError } = await supabase
      .from("newsletter_subscribers")
      .update({
        resend_welcome_id: welcomeId,
        ...retryMetadata(row as RetryState, complete),
      })
      .eq("id", row.id)
      .eq("status", "confirmed")
      .is("resend_welcome_id", null);
    if (updateError) throw updateError;
    if (complete) completed += 1;
  }

  return { attempted: rows?.length || 0, completed };
}

async function purgeExpiredSecurityData() {
  const supabase = getSupabaseAdmin();
  const now = Date.now();
  const fingerprintCutoff = new Date(now - 30 * 24 * 60 * 60_000).toISOString();
  const consentCutoff = new Date(now - 90 * 24 * 60 * 60_000).toISOString();
  const eventDeletionCutoff = new Date(
    now - 180 * 24 * 60 * 60_000,
  ).toISOString();
  const quotationAuditCutoff = new Date(
    now - 365 * 24 * 60 * 60_000,
  ).toISOString();

  const redactionResults = await Promise.all([
    supabase
      .from("contact_submissions")
      .update({ request_fingerprint: null })
      .not("request_fingerprint", "is", null)
      .lt("created_at", fingerprintCutoff),
    supabase
      .from("consumer_claims")
      .update({ request_fingerprint: null })
      .not("request_fingerprint", "is", null)
      .lt("created_at", fingerprintCutoff),
    supabase
      .from("newsletter_consent_events")
      .update({ request_fingerprint: null })
      .not("request_fingerprint", "is", null)
      .lt("created_at", consentCutoff),
    supabase
      .from("email_events")
      .update({ recipient_email: null, payload: {} })
      .lt("received_at", fingerprintCutoff),
  ]);
  const error = redactionResults.find((result) => result.error)?.error;
  if (error) throw error;

  const deletionResults = await Promise.all([
    supabase
      .from("email_events")
      .delete()
      .lt("received_at", eventDeletionCutoff),
    supabase
      .from("quotation_email_deliveries")
      .delete()
      .lt("created_at", quotationAuditCutoff),
  ]);
  const deletionError = deletionResults.find((result) => result.error)?.error;
  if (deletionError) throw deletionError;
  return { completed: true };
}

export async function GET(request: Request) {
  let cronSecret: string;
  try {
    cronSecret = getCronSecret();
  } catch (error) {
    console.error("[email-retry] CRON_SECRET no está configurado.", error);
    return Response.json(
      { error: "Servicio no configurado." },
      { status: 503 },
    );
  }

  if (request.headers.get("authorization") !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const [
      contacts,
      claims,
      newsletterConfirmations,
      newsletter,
      quotationAlerts,
      retention,
    ] = await Promise.all([
      retryContacts(),
      retryClaims(),
      retryNewsletterConfirmations(),
      retryNewsletterWelcome(),
      retryQuotationAlerts(),
      purgeExpiredSecurityData(),
    ]);
    return Response.json(
      {
        success: true,
        contacts,
        claims,
        newsletterConfirmations,
        newsletter,
        quotationAlerts,
        retention,
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    console.error("[email-retry]", error);
    return Response.json(
      { error: "No se completó el ciclo de reintentos." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}
