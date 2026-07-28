import assert from "node:assert/strict";
import test from "node:test";
import {
  QUOTATION_FROM,
  QUOTATION_MAX_PDF_BYTES,
  QUOTATION_REPLY_TO,
  QuotationValidationError,
  type QuotationEmailData,
} from "../../src/lib/quotation-email/core";
import {
  QuotationProviderError,
  deliverQuotationRecipients,
  sendQuotationWithTimeout,
  type QuotationDeliveryDependencies,
  type QuotationProviderPayload,
} from "../../src/lib/quotation-email/delivery";

const data: QuotationEmailData = {
  treatment: "Dra.",
  clientName: "Elena Vargas",
  quotationNumber: "DEMO-0001",
  project: "Cobertura de terraza",
  location: "Miraflores, Lima",
  total: 5_000,
  recipients: ["internal-one@example.com"],
  isTest: true,
  productionDocumentConfirmed: false,
};

const bytes = new TextEncoder().encode("%PDF-1.4\ntest");
const pdf = {
  name: "quotation.pdf",
  type: "application/pdf",
  size: bytes.byteLength,
  bytes,
};
const contractBytes = new TextEncoder().encode("%PDF-1.4\ncontract");
const contractPdf = {
  name: "CONTRATO_2026_0086_1.pdf",
  type: "application/pdf",
  size: contractBytes.byteLength,
  bytes: contractBytes,
};
const content = {
  subject: "Propuesta técnica y render de su proyecto | Casa Atenta",
  html: "<p>Contenido</p>",
  text: "Contenido",
  digest: "c".repeat(64),
};
const providerPayload: QuotationProviderPayload = {
  from: QUOTATION_FROM,
  to: "internal-one@example.com",
  subject: content.subject,
  html: content.html,
  text: content.text,
  replyTo: QUOTATION_REPLY_TO,
  tags: [],
  attachments: [],
};

function dependencies(
  overrides: Partial<QuotationDeliveryDependencies> = {},
): QuotationDeliveryDependencies {
  return {
    auditSecret: "audit-secret-with-more-than-thirty-two-characters",
    from: QUOTATION_FROM,
    replyTo: QUOTATION_REPLY_TO,
    timeoutMs: 100,
    reserve: async () => ({ kind: "reserved" }),
    markSent: async () => undefined,
    markFailed: async () => undefined,
    send: async () => ({ data: { id: "email_123" }, error: null }),
    ...overrides,
  };
}

test("rechaza una respuesta de Resend sin ID", async () => {
  await assert.rejects(
    () =>
      sendQuotationWithTimeout(
        async () => ({ data: {}, error: null }),
        providerPayload,
        "quotation-test",
        100,
      ),
    (error) =>
      error instanceof QuotationProviderError && error.code === "MISSING_ID",
  );
});

test("propaga un error explícito y sanitizado de Resend", async () => {
  await assert.rejects(
    () =>
      sendQuotationWithTimeout(
        async () => ({
          data: null,
          error: {
            message: "Rejected for cliente@example.com",
            name: "validation_error",
            statusCode: 422,
          },
        }),
        providerPayload,
        "quotation-test",
        100,
      ),
    (error) =>
      error instanceof QuotationProviderError &&
      error.code === "PROVIDER_REJECTED" &&
      !error.message.includes("cliente@example.com"),
  );
});

test("el transporte aplica timeout con AbortSignal", async () => {
  await assert.rejects(
    () =>
      sendQuotationWithTimeout(
        async (_payload, options) =>
          new Promise((resolve) => {
            options.signal.addEventListener("abort", () =>
              resolve({ data: null, error: { message: "aborted" } }),
            );
          }),
        providerPayload,
        "quotation-test",
        5,
      ),
    (error) =>
      error instanceof QuotationProviderError && error.code === "TIMEOUT",
  );
});

test("una reserva duplicada bloquea el segundo envío", async () => {
  let sends = 0;
  const results = await deliverQuotationRecipients({
    data,
    pdf,
    content,
    dependencies: dependencies({
      reserve: async () => ({
        kind: "duplicate",
        status: "sent",
        resendEmailId: "email_existing",
      }),
      send: async () => {
        sends += 1;
        return { data: { id: "must_not_send" }, error: null };
      },
    }),
  });
  assert.equal(sends, 0);
  assert.equal(results[0]?.status, "duplicate");
  assert.equal(results[0]?.resendEmailId, "email_existing");
  assert.equal(results[0]?.existingStatus, "sent");
  assert.equal(results[0]?.requiresReview, false);
});

for (const existingStatus of ["bounced", "complained", "suppressed"] as const) {
  test(`un destinatario con estado histórico ${existingStatus} queda bloqueado antes del proveedor`, async () => {
    let sends = 0;
    const results = await deliverQuotationRecipients({
      data,
      pdf,
      content,
      dependencies: dependencies({
        reserve: async () => ({
          kind: "blocked",
          status: existingStatus,
        }),
        send: async () => {
          sends += 1;
          return { data: { id: "must_not_send" }, error: null };
        },
      }),
    });

    assert.equal(sends, 0);
    assert.equal(results[0]?.status, "blocked");
    assert.equal(results[0]?.existingStatus, existingStatus);
    assert.equal(results[0]?.requiresReview, true);
    assert.match(results[0]?.message || "", /No se intentó el envío/u);
  });
}

for (const existingStatus of ["pending", "failed"]) {
  test(`un duplicado en estado ${existingStatus} bloquea el envío y exige revisión`, async () => {
    let sends = 0;
    const results = await deliverQuotationRecipients({
      data,
      pdf,
      content,
      dependencies: dependencies({
        reserve: async () => ({
          kind: "duplicate",
          status: existingStatus,
          resendEmailId: existingStatus === "failed" ? "email_failed" : null,
        }),
        send: async () => {
          sends += 1;
          return { data: { id: "must_not_send" }, error: null };
        },
      }),
    });

    assert.equal(sends, 0);
    assert.equal(results[0]?.status, "duplicate");
    assert.equal(results[0]?.existingStatus, existingStatus);
    assert.equal(results[0]?.requiresReview, true);
  });
}

test("envía adjunto real, replyTo, tags y nombre profesional sin exponer PII en el resultado", async () => {
  let captured: QuotationProviderPayload | undefined;
  const results = await deliverQuotationRecipients({
    data,
    pdf,
    content,
    dependencies: dependencies({
      send: async (payload) => {
        captured = payload;
        return { data: { id: "email_new" }, error: null };
      },
    }),
  });

  assert.equal(captured?.from, "Casa Atenta <info@casa-atenta.com>");
  assert.equal(captured?.replyTo, "info@casa-atenta.com");
  assert.equal(
    captured?.attachments[0]?.filename,
    "Casa-Atenta-Cotizacion-DEMO-0001.pdf",
  );
  assert.equal(captured?.attachments[0]?.contentType, "application/pdf");
  assert.deepEqual(captured?.tags.slice(0, 3), [
    { name: "category", value: "quotation" },
    { name: "quotation", value: "DEMO-0001" },
    { name: "mode", value: "test" },
  ]);
  assert.equal(captured?.tags[3]?.name, "delivery");
  assert.match(captured?.tags[3]?.value || "", /^quotation-[0-9a-f]{64}$/u);
  assert.equal(results[0]?.status, "sent");
  assert.equal(results[0]?.requiresReview, false);
  assert.equal(results[0]?.recipientMasked, "in***@e***.com");
  assert.equal(
    JSON.stringify(results).includes("internal-one@example.com"),
    false,
  );
});

test("envía dos PDFs originales en un único correo y conserva auditoría e idempotencia", async () => {
  let captured: QuotationProviderPayload | undefined;
  let reserved:
    { attachmentFilename: string; attachmentBytes: number } | undefined;
  const results = await deliverQuotationRecipients({
    data,
    pdf: [pdf, contractPdf],
    content,
    dependencies: dependencies({
      reserve: async (input) => {
        reserved = {
          attachmentFilename: input.attachmentFilename,
          attachmentBytes: input.attachmentBytes,
        };
        return { kind: "reserved" };
      },
      send: async (payload) => {
        captured = payload;
        return { data: { id: "email_bundle" }, error: null };
      },
    }),
  });

  assert.deepEqual(
    captured?.attachments.map((attachment) => attachment.filename),
    ["quotation.pdf", "CONTRATO_2026_0086_1.pdf"],
  );
  assert.equal(
    reserved?.attachmentFilename,
    "Casa-Atenta-Documentos-DEMO-0001.pdf",
  );
  assert.equal(reserved?.attachmentBytes, pdf.size + contractPdf.size);
  assert.equal(captured?.tags.at(-1)?.name, "delivery");
  assert.equal(results[0]?.status, "sent");
  assert.equal(results[0]?.resendEmailId, "email_bundle");
});

test("reordenar los mismos dos PDFs conserva la clave idempotente", async () => {
  const keys: string[] = [];
  for (const documents of [
    [pdf, contractPdf],
    [contractPdf, pdf],
  ]) {
    const results = await deliverQuotationRecipients({
      data,
      pdf: documents,
      content,
      dependencies: dependencies(),
    });
    keys.push(results[0]?.idempotencyKey || "");
  }

  assert.equal(keys[0], keys[1]);
  assert.match(keys[0] || "", /^quotation-[0-9a-f]{64}$/u);
});

test("rechaza dos adjuntos con contenido o nombre duplicado", async () => {
  for (const documents of [
    [pdf, { ...pdf }],
    [pdf, { ...contractPdf, name: "QUOTATION.PDF" }],
  ]) {
    await assert.rejects(
      () =>
        deliverQuotationRecipients({
          data,
          pdf: documents,
          content,
          dependencies: dependencies(),
        }),
      (error) =>
        error instanceof QuotationValidationError &&
        error.code === "DUPLICATE_PDF",
    );
  }
});

test("rechaza dos PDFs que superan en conjunto 4 MiB antes de reservar o enviar", async () => {
  const documentSize = Math.floor(QUOTATION_MAX_PDF_BYTES / 2) + 1;
  const documentBytes = new Uint8Array(documentSize);
  documentBytes.set([0x25, 0x50, 0x44, 0x46, 0x2d]);
  const secondDocumentBytes = documentBytes.slice();
  secondDocumentBytes[secondDocumentBytes.length - 1] = 1;
  let reservations = 0;
  let sends = 0;

  await assert.rejects(
    () =>
      deliverQuotationRecipients({
        data,
        pdf: [
          {
            name: "cotizacion.pdf",
            type: "application/pdf",
            size: documentBytes.byteLength,
            bytes: documentBytes,
          },
          {
            name: "contrato.pdf",
            type: "application/pdf",
            size: secondDocumentBytes.byteLength,
            bytes: secondDocumentBytes,
          },
        ],
        content,
        dependencies: dependencies({
          reserve: async () => {
            reservations += 1;
            return { kind: "reserved" };
          },
          send: async () => {
            sends += 1;
            return { data: { id: "must_not_send" }, error: null };
          },
        }),
      }),
    (error) =>
      error instanceof QuotationValidationError &&
      error.code === "PDF_TOO_LARGE",
  );
  assert.equal(reservations, 0);
  assert.equal(sends, 0);
});

test("crea dos envíos separados y conserva un ID de Resend por destinatario", async () => {
  const providerRecipients: string[] = [];
  const results = await deliverQuotationRecipients({
    data: {
      ...data,
      recipients: ["internal-one@example.com", "internal-two@example.com"],
    },
    pdf,
    content,
    dependencies: dependencies({
      send: async (payload) => {
        providerRecipients.push(payload.to);
        return {
          data: { id: `email_${providerRecipients.length}` },
          error: null,
        };
      },
    }),
  });

  assert.deepEqual(providerRecipients, [
    "internal-one@example.com",
    "internal-two@example.com",
  ]);
  assert.deepEqual(
    results.map((result) => result.resendEmailId),
    ["email_1", "email_2"],
  );
  assert.notEqual(results[0]?.idempotencyKey, results[1]?.idempotencyKey);
});

test("un error del proveedor queda fallido y auditado sin correo completo", async () => {
  let auditError = "";
  const results = await deliverQuotationRecipients({
    data,
    pdf,
    content,
    dependencies: dependencies({
      send: async () => ({
        data: null,
        error: {
          message: "Error para internal-one@example.com",
          name: "validation_error",
          statusCode: 422,
        },
      }),
      markFailed: async (_key, error) => {
        auditError = error;
      },
    }),
  });
  assert.equal(results[0]?.status, "failed");
  assert.doesNotMatch(auditError, /internal-one@example\.com/u);
  assert.doesNotMatch(results[0]?.message || "", /internal-one@example\.com/u);
});

test("un error ambiguo conserva la reserva pendiente para reconciliar por webhook", async () => {
  let markedFailed = false;
  const results = await deliverQuotationRecipients({
    data,
    pdf,
    content,
    dependencies: dependencies({
      send: async () => {
        throw new Error("network reset after request");
      },
      markFailed: async () => {
        markedFailed = true;
      },
    }),
  });

  assert.equal(markedFailed, false);
  assert.equal(results[0]?.status, "failed");
  assert.equal(results[0]?.requiresReview, true);
  assert.match(results[0]?.message || "", /Estado de entrega incierto/u);
});

test("un error de red devuelto por el SDK no se registra como rechazo definitivo", async () => {
  let markedFailed = false;
  const results = await deliverQuotationRecipients({
    data,
    pdf,
    content,
    dependencies: dependencies({
      send: async () => ({
        data: null,
        error: {
          message: "fetch failed",
          name: "application_error",
          statusCode: null,
        },
      }),
      markFailed: async () => {
        markedFailed = true;
      },
    }),
  });

  assert.equal(markedFailed, false);
  assert.equal(results[0]?.requiresReview, true);
  assert.match(results[0]?.message || "", /Estado de entrega incierto/u);
});
