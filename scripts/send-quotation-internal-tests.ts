import { readFile, stat } from "node:fs/promises";
import { basename } from "node:path";
import { parseArgs } from "node:util";
import {
  createQuotationEmailDataSchema,
  quotationAttachmentFilename,
  quotationDocumentsAuditFilename,
} from "../src/lib/quotation-email/core";
import { getQuotationTestRecipients } from "../src/lib/server/env";
import { sendQuotationEmail } from "../src/lib/server/quotation-email";

const { values } = parseArgs({
  options: {
    pdf: { type: "string", multiple: true },
    treatment: { type: "string" },
    "client-name": { type: "string" },
    "quotation-number": { type: "string" },
    project: { type: "string" },
    location: { type: "string" },
    total: { type: "string" },
    "render-link": { type: "string" },
    subject: { type: "string" },
    "delivery-message": { type: "string" },
    "closing-message": { type: "string" },
    "confirm-internal-tests": { type: "boolean", default: false },
  },
  strict: true,
});

if (!values.pdf?.length || values.pdf.length > 2) {
  throw new Error("Indica uno o dos PDFs reales repitiendo --pdf <ruta>.");
}
if (!values["confirm-internal-tests"]) {
  throw new Error(
    "Falta --confirm-internal-tests. Este comando solo envía a la allowlist interna.",
  );
}
if (
  !values.treatment ||
  !values["client-name"] ||
  !values["quotation-number"] ||
  !values.project ||
  !values.location ||
  !values.total
) {
  throw new Error(
    "Indica --treatment, --client-name, --quotation-number, --project, --location y --total.",
  );
}

const documents = await Promise.all(
  values.pdf.map(async (path) => {
    const fileStats = await stat(path);
    if (!fileStats.isFile()) {
      throw new Error(`La ruta indicada no es un archivo: ${basename(path)}`);
    }
    const bytes = new Uint8Array(await readFile(path));
    return {
      name: basename(path),
      type: "application/pdf",
      size: bytes.byteLength,
      bytes,
    };
  }),
);
const testRecipients = getQuotationTestRecipients();
const data = createQuotationEmailDataSchema(testRecipients).parse({
  treatment: values.treatment,
  clientName: values["client-name"],
  quotationNumber: values["quotation-number"],
  project: values.project,
  location: values.location,
  total: values.total,
  recipients: testRecipients,
  isTest: true,
  productionDocumentConfirmed: false,
  renderLink: values["render-link"] || undefined,
  subject: values.subject || undefined,
  deliveryMessage: values["delivery-message"] || undefined,
  closingMessage: values["closing-message"] || undefined,
});

const results = await sendQuotationEmail({
  data,
  pdf: documents,
});

console.log(
  JSON.stringify(
    {
      mode: "internal-test",
      quotationNumber: data.quotationNumber,
      attachmentFilename:
        documents.length === 1
          ? quotationAttachmentFilename(data.quotationNumber)
          : quotationDocumentsAuditFilename(data.quotationNumber),
      attachments: documents.map((document) => ({
        name: document.name,
        bytes: document.size,
      })),
      attachmentBytes: documents.reduce(
        (total, document) => total + document.size,
        0,
      ),
      results,
    },
    null,
    2,
  ),
);

if (
  results.length !== testRecipients.length ||
  results.some((result) => result.requiresReview)
) {
  process.exitCode = 1;
}
