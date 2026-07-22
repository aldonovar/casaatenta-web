import { ZodError } from "zod";
import {
  QUOTATION_MAX_PDF_BYTES,
  QuotationValidationError,
  createQuotationEmailDataSchema,
  quotationAttachmentFilename,
  sanitizeDeliveryError,
} from "@/lib/quotation-email/core";
import {
  assertQuotationAdminRequest,
  hasQuotationAdminSession,
} from "@/lib/server/quotation-admin-auth";
import { sendQuotationEmail } from "@/lib/server/quotation-email";
import {
  getQuotationTestRecipients,
  isQuotationProductionEnabled,
} from "@/lib/server/env";
import { checkRateLimit, getRequestFingerprint } from "@/lib/server/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_REQUEST_BYTES = QUOTATION_MAX_PDF_BYTES + 256 * 1024;
const MAX_METADATA_BYTES = 16 * 1024;

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export async function POST(request: Request) {
  if (!(await hasQuotationAdminSession())) {
    return json({ error: "Sesión administrativa no válida." }, 401);
  }

  try {
    assertQuotationAdminRequest(request);
  } catch {
    return json({ error: "Solicitud administrativa no válida." }, 403);
  }

  try {
    const allowed = await checkRateLimit(
      getRequestFingerprint(request),
      "quotation-email-send",
      10,
      60 * 60,
    );
    if (!allowed) {
      return json(
        { error: "Se alcanzó el límite de operaciones. Espera una hora." },
        429,
      );
    }
  } catch {
    return json({ error: "La protección de envíos no está disponible." }, 503);
  }

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().startsWith("multipart/form-data;")) {
    return json({ error: "Formato de solicitud no permitido." }, 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_REQUEST_BYTES) {
    return json({ error: "La solicitud excede el límite permitido." }, 413);
  }

  try {
    const formData = await request.formData();
    const rawMetadata = formData.get("metadata");
    const pdf = formData.get("pdf");
    if (
      typeof rawMetadata !== "string" ||
      new TextEncoder().encode(rawMetadata).byteLength > MAX_METADATA_BYTES
    ) {
      return json({ error: "Los datos de la cotización no son válidos." }, 400);
    }
    if (!(pdf instanceof File)) {
      return json({ error: "Selecciona el PDF de la cotización." }, 400);
    }
    if (pdf.size > QUOTATION_MAX_PDF_BYTES) {
      return json({ error: "El PDF supera el límite de 4 MiB." }, 413);
    }

    const data = createQuotationEmailDataSchema(
      getQuotationTestRecipients(),
      isQuotationProductionEnabled(),
    ).parse(JSON.parse(rawMetadata));
    const bytes = new Uint8Array(await pdf.arrayBuffer());
    const results = await sendQuotationEmail({
      data,
      pdf: {
        name: pdf.name,
        type: pdf.type,
        size: pdf.size,
        bytes,
      },
    });

    const failed = results.filter(
      (result) => result.status === "failed",
    ).length;
    const requiresReview = results.some((result) => result.requiresReview);
    const safelyAccepted = results.some((result) => !result.requiresReview);
    const status =
      failed === results.length
        ? 502
        : requiresReview && !safelyAccepted
          ? 409
          : requiresReview
            ? 207
            : 200;
    return json(
      {
        quotationNumber: data.quotationNumber,
        isTest: data.isTest,
        attachment: {
          name: quotationAttachmentFilename(data.quotationNumber),
          bytes: pdf.size,
          mime: "application/pdf",
        },
        results,
      },
      status,
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return json(
        {
          error: "Revisa los campos indicados.",
          fields: error.flatten().fieldErrors,
        },
        400,
      );
    }
    if (error instanceof SyntaxError) {
      return json({ error: "Los datos enviados no son JSON válido." }, 400);
    }
    if (error instanceof QuotationValidationError) {
      return json({ error: error.message, code: error.code }, 400);
    }

    console.error(`[quotation-email] ${sanitizeDeliveryError(error)}`);
    return json(
      {
        error:
          "No se pudo completar la operación. No vuelvas a enviarla hasta revisar el estado.",
      },
      500,
    );
  }
}
