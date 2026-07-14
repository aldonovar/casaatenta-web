import { jsonResponse, routeError } from "@/lib/server/api";
import {
  CLAIM_TERMS_VERSION,
  PRIVACY_CONSENT_VERSION,
} from "@/lib/server/consent";
import {
  claimNotificationEmail,
  claimReceiptEmail,
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
  consumerClaimSchema,
  readJsonBody,
} from "@/lib/server/validation";

export const runtime = "nodejs";

const EMAIL_RECOVERY_GRACE_MS = 5 * 60 * 1000;
const FIRST_RETRY_DELAY_MS = 15 * 60 * 1000;

export async function POST(request: Request) {
  try {
    const rawBody = await readJsonBody(request, 32_000);

    if (
      rawBody &&
      typeof rawBody === "object" &&
      "website" in rawBody &&
      rawBody.website
    ) {
      return jsonResponse({ success: true });
    }

    const claim = consumerClaimSchema.parse(rawBody);
    const turnstile = await verifyTurnstile(
      claim.turnstileToken,
      request,
      "consumer_claim",
    );
    if (!turnstile.valid) {
      return jsonResponse(
        { error: "No pudimos completar la verificación de seguridad." },
        400,
      );
    }

    const fingerprint = getRequestFingerprint(request);
    const withinLimit = await checkRateLimit(
      fingerprint,
      "consumer_claim",
      3,
      24 * 60 * 60,
    );

    if (!withinLimit) {
      return jsonResponse(
        { error: "Alcanzaste el límite temporal de registros. Escríbenos a info@casa-atenta.com." },
        429,
      );
    }

    const recipientWithinLimit = await checkRateLimit(
      getValueFingerprint("email", claim.email),
      "claim_recipient",
      3,
      24 * 60 * 60,
    );
    if (!recipientWithinLimit) {
      return jsonResponse(
        { error: "Este correo alcanzó el límite temporal de registros." },
        429,
      );
    }

    const supabase = getSupabaseAdmin();
    const { data: stored, error: insertError } = await supabase
      .from("consumer_claims")
      .insert({
        full_name: claim.fullName,
        document_type: claim.documentType,
        document_number: claim.documentNumber,
        email: claim.email,
        phone: claim.phone,
        address: claim.address,
        is_minor: claim.isMinor,
        minor_guardian: claim.minorGuardian,
        minor_guardian_address: claim.minorGuardianAddress,
        minor_guardian_phone: claim.minorGuardianPhone,
        minor_guardian_email: claim.minorGuardianEmail,
        claim_type: claim.claimType,
        good_type: claim.goodType,
        product_description: claim.productDescription,
        claimed_amount: claim.claimedAmount,
        claim_detail: claim.claimDetail,
        consumer_request: claim.consumerRequest,
        request_fingerprint: fingerprint,
        turnstile_hostname: turnstile.hostname,
        privacy_consent_at: new Date().toISOString(),
        privacy_consent_version: PRIVACY_CONSENT_VERSION,
        claim_terms_consent_at: new Date().toISOString(),
        claim_terms_version: CLAIM_TERMS_VERSION,
        // La gracia evita competir con los envíos iniciales y deja una marca
        // recuperable si el update de estado posterior no llega a persistir.
        email_retry_after: new Date(
          Date.now() + EMAIL_RECOVERY_GRACE_MS,
        ).toISOString(),
      })
      .select("id, code, created_at")
      .single();

    if (insertError || !stored) throw insertError || new Error("No se guardó el reclamo.");

    const createdAt = new Intl.DateTimeFormat("es-PE", {
      dateStyle: "long",
      timeStyle: "short",
      timeZone: "America/Lima",
    }).format(new Date(stored.created_at as string));
    const emailData = {
      id: stored.id as string,
      code: stored.code as string,
      fullName: claim.fullName,
      documentType: claim.documentType,
      documentNumber: claim.documentNumber,
      email: claim.email,
      phone: claim.phone,
      address: claim.address,
      isMinor: claim.isMinor,
      minorGuardian: claim.minorGuardian,
      minorGuardianAddress: claim.minorGuardianAddress,
      minorGuardianPhone: claim.minorGuardianPhone,
      minorGuardianEmail: claim.minorGuardianEmail,
      claimType: claim.claimType,
      goodType: claim.goodType,
      productDescription: claim.productDescription,
      claimedAmount: claim.claimedAmount,
      claimDetail: claim.claimDetail,
      consumerRequest: claim.consumerRequest,
      createdAt,
    };
    const notification = claimNotificationEmail(emailData);
    const receipt = claimReceiptEmail(emailData);
    const inbox = getContactInbox();
    const [notificationResult, receiptResult] = await Promise.allSettled([
      sendEmail(
        {
          to: inbox,
          replyTo: claim.email,
          ...notification,
          tags: [{ name: "category", value: "consumer-claim" }],
        },
        `claim-notification/${stored.id}`,
      ),
      sendEmail(
        {
          to: claim.email,
          replyTo: inbox,
          ...receipt,
          tags: [{ name: "category", value: "claim-receipt" }],
        },
        `claim-receipt/${stored.id}`,
      ),
    ]);

    const notificationId =
      notificationResult.status === "fulfilled" ? notificationResult.value : null;
    const receiptId =
      receiptResult.status === "fulfilled" ? receiptResult.value : null;
    const emailFailed = !notificationId || !receiptId;

    const { error: updateError } = await supabase
      .from("consumer_claims")
      .update({
        status: emailFailed ? "email_failed" : "notified",
        resend_notification_id: notificationId,
        resend_receipt_id: receiptId,
        email_retry_count: 0,
        email_retry_after: emailFailed
          ? new Date(Date.now() + FIRST_RETRY_DELAY_MS).toISOString()
          : null,
        last_email_error: emailFailed ? "resend_delivery_failed" : null,
      })
      .eq("id", stored.id)
      .eq("status", "received");

    if (updateError) console.error(`[claim:${stored.id}] no se actualizó el estado de correo.`);
    if (emailFailed) console.error(`[claim:${stored.id}] uno o más correos no se enviaron.`);

    return jsonResponse(
      {
        success: true,
        code: stored.code,
        createdAt: stored.created_at,
      },
      201,
    );
  } catch (error) {
    return routeError(error, "claims");
  }
}
