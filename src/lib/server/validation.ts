import "server-only";

import { z } from "zod";

const normalizedEmail = z
  .email("Ingresa un correo electrónico válido.")
  .max(254)
  .transform((email) => email.trim().toLowerCase());
const requiredText = (min: number, max: number) =>
  z.string().trim().min(min).max(max);
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value || null);
const phone = requiredText(7, 30).regex(
  /^[+()\-\s\d]{7,30}$/,
  "Ingresa un teléfono válido.",
);
const optionalEmail = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    normalizedEmail.optional(),
  )
  .transform((value) => value ?? null);
const optionalPhone = z
  .preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? undefined : value,
    phone.optional(),
  )
  .transform((value) => value ?? null);
const protectedFields = {
  turnstileToken: z.string().min(1).max(2048),
  website: z.string().max(0).optional().default(""),
};
const MAX_CLAIMED_AMOUNT = 9_999_999_999.99;
const claimedAmount = z
  .union([z.string().trim().max(20), z.number().finite().nonnegative()])
  .optional()
  .refine(
    (value) => {
      if (value === undefined || value === "") return true;

      const normalizedValue =
        typeof value === "number" ? value.toString() : value;

      return (
        /^\d+(?:\.\d{1,2})?$/.test(normalizedValue) &&
        Number(normalizedValue) <= MAX_CLAIMED_AMOUNT
      );
    },
    {
      message:
        "Ingresa un monto de hasta 9,999,999,999.99 y con un m\u00e1ximo de 2 decimales.",
    },
  )
  .transform((value) =>
    value === "" || value === undefined ? null : Number(value),
  );

export const contactSubmissionSchema = z.object({
  source: z.enum(["contact", "quote", "configurator"]),
  name: requiredText(2, 120),
  email: normalizedEmail,
  phone,
  service: optionalText(120),
  location: optionalText(160),
  measures: optionalText(240),
  message: optionalText(4000),
  projectData: z.record(z.string(), z.string().max(240)).optional().default({}),
  privacyConsent: z.literal(true),
  ...protectedFields,
});

export const consumerClaimSchema = z
  .object({
    fullName: requiredText(2, 160),
    documentType: z.enum(["DNI", "CE", "RUC", "Pasaporte"]),
    documentNumber: requiredText(5, 20),
    email: normalizedEmail,
    phone,
    address: requiredText(5, 300),
    isMinor: z.boolean(),
    minorGuardian: optionalText(160),
    minorGuardianAddress: optionalText(300),
    minorGuardianPhone: optionalPhone,
    minorGuardianEmail: optionalEmail,
    goodType: z.enum(["Producto", "Servicio"]),
    claimType: z.enum(["Reclamo", "Queja"]),
    productDescription: requiredText(3, 500),
    claimedAmount,
    claimDetail: requiredText(10, 6000),
    consumerRequest: requiredText(5, 4000),
    privacyConsent: z.literal(true),
    claimTermsConsent: z.literal(true),
    ...protectedFields,
  })
  .superRefine((claim, context) => {
    if (!claim.isMinor) return;

    const requiredGuardianFields = [
      ["minorGuardian", claim.minorGuardian],
      ["minorGuardianAddress", claim.minorGuardianAddress],
      ["minorGuardianPhone", claim.minorGuardianPhone],
      ["minorGuardianEmail", claim.minorGuardianEmail],
    ] as const;

    for (const [field, value] of requiredGuardianFields) {
      if (!value) {
        context.addIssue({
          code: "custom",
          path: [field],
          message: "Este dato del representante es obligatorio.",
        });
      }
    }
  });

export const newsletterSubscriptionSchema = z.object({
  email: normalizedEmail,
  name: optionalText(120),
  source: z.string().trim().min(1).max(80).default("website"),
  privacyConsent: z.literal(true),
  ...protectedFields,
});

export async function readJsonBody(request: Request, maxBytes = 24_000) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    throw new Error("UNSUPPORTED_MEDIA_TYPE");
  }

  const declaredLength = Number(request.headers.get("content-length") || 0);
  if (declaredLength > maxBytes) throw new Error("PAYLOAD_TOO_LARGE");

  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    throw new Error("PAYLOAD_TOO_LARGE");
  }

  return JSON.parse(text) as unknown;
}
