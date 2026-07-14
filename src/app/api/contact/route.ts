import { jsonResponse, routeError } from "@/lib/server/api";
import { PRIVACY_CONSENT_VERSION } from "@/lib/server/consent";
import {
  contactNotificationEmail,
  contactReceiptEmail,
  sendEmail,
} from "@/lib/server/email";
import { getContactInbox } from "@/lib/server/env";
import {
  checkRateLimit,
  getRequestFingerprint,
  getValueFingerprint,
} from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/server/supabase";
import { verifyTurnstile } from "@/lib/server/turnstile";
import {
  contactSubmissionSchema,
  readJsonBody,
} from "@/lib/server/validation";

export const runtime = "nodejs";

const EMAIL_RECOVERY_GRACE_MS = 5 * 60 * 1000;
const FIRST_RETRY_DELAY_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const rawBody = await readJsonBody(request);

    if (
      rawBody &&
      typeof rawBody === "object" &&
      "website" in rawBody &&
      rawBody.website
    ) {
      return jsonResponse({ success: true });
    }

    const submission = contactSubmissionSchema.parse(rawBody);
    const turnstile = await verifyTurnstile(
      submission.turnstileToken,
      request,
      "contact_form",
    );
    if (!turnstile.valid) {
      return jsonResponse(
        { error: "No pudimos verificar que seas una persona. Recarga e intenta nuevamente." },
        400,
      );
    }

    const fingerprint = getRequestFingerprint(request);
    const withinLimit = await checkRateLimit(
      fingerprint,
      "contact_form",
      5,
      60 * 60,
    );

    if (!withinLimit) {
      return jsonResponse(
        { error: "Alcanzaste el límite temporal de solicitudes. Intenta más tarde." },
        429,
      );
    }

    const recipientWithinLimit = await checkRateLimit(
      getValueFingerprint("email", submission.email),
      "contact_recipient",
      3,
      24 * 60 * 60,
    );
    if (!recipientWithinLimit) {
      return jsonResponse(
        { error: "Este correo alcanzó el límite temporal de solicitudes." },
        429,
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: stored, error: insertError } = await supabase
      .from("contact_submissions")
      .insert({
        source: submission.source,
        name: submission.name,
        email: submission.email,
        phone: submission.phone,
        service: submission.service,
        location: submission.location,
        measures: submission.measures,
        message: submission.message,
        project_data: submission.projectData,
        request_fingerprint: fingerprint,
        turnstile_hostname: turnstile.hostname,
        privacy_consent_at: new Date().toISOString(),
        privacy_consent_version: PRIVACY_CONSENT_VERSION,
        // Evita que una ejecución del cron que coincida con este POST compita
        // con los envíos iniciales, pero permite recuperar un update perdido.
        email_retry_after: new Date(
          Date.now() + EMAIL_RECOVERY_GRACE_MS,
        ).toISOString(),
      })
      .select("id")
      .single();

    if (insertError || !stored) throw insertError || new Error("No se guardó el registro.");

    const emailData = {
      id: stored.id as string,
      name: submission.name,
      email: submission.email,
      phone: submission.phone,
      source: submission.source,
      service: submission.service,
      location: submission.location,
      measures: submission.measures,
      message: submission.message,
      projectData: submission.projectData,
    };
    const notification = contactNotificationEmail(emailData);
    const receipt = contactReceiptEmail(submission.name, stored.id as string);
    const inbox = getContactInbox();
    const [notificationResult, receiptResult] = await Promise.allSettled([
      sendEmail(
        {
          to: inbox,
          replyTo: submission.email,
          ...notification,
          tags: [
            { name: "category", value: "contact-notification" },
            { name: "source", value: submission.source },
          ],
        },
        `contact-notification/${stored.id}`,
      ),
      sendEmail(
        {
          to: submission.email,
          replyTo: inbox,
          ...receipt,
          tags: [{ name: "category", value: "contact-receipt" }],
        },
        `contact-receipt/${stored.id}`,
      ),
    ]);

    const notificationId =
      notificationResult.status === "fulfilled" ? notificationResult.value : null;
    const confirmationId =
      receiptResult.status === "fulfilled" ? receiptResult.value : null;
    const emailFailed = !notificationId || !confirmationId;

    const { error: updateError } = await supabase
      .from("contact_submissions")
      .update({
        status: emailFailed ? "email_failed" : "notified",
        resend_notification_id: notificationId,
        resend_confirmation_id: confirmationId,
        email_retry_count: 0,
        email_retry_after: emailFailed
          ? new Date(Date.now() + FIRST_RETRY_DELAY_MS).toISOString()
          : null,
        last_email_error: emailFailed ? "resend_delivery_failed" : null,
      })
      .eq("id", stored.id)
      .eq("status", "received");

    if (updateError) console.error(`[contact:${stored.id}] no se actualizó el estado de correo.`);
    if (emailFailed) console.error(`[contact:${stored.id}] uno o más correos no se enviaron.`);

    return jsonResponse({ success: true, reference: stored.id }, 201);
  } catch (error) {
    return routeError(error, "contact");
  }
}
