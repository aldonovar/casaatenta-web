import { readFile, stat } from "node:fs/promises";
import { parseArgs } from "node:util";
import {
  createQuotationEmailDataSchema,
  quotationAttachmentFilename,
} from "../src/lib/quotation-email/core";
import { getQuotationTestRecipients } from "../src/lib/server/env";
import { sendQuotationEmail } from "../src/lib/server/quotation-email";

const { values } = parseArgs({
  options: {
    pdf: { type: "string" },
    treatment: { type: "string" },
    "client-name": { type: "string" },
    "quotation-number": { type: "string" },
    project: { type: "string" },
    location: { type: "string" },
    total: { type: "string" },
    "render-link": { type: "string" },
    subject: { type: "string" },
    "confirm-internal-tests": { type: "boolean", default: false },
  },
  strict: true,
});

if (!values.pdf) {
  throw new Error("Indica el PDF real con --pdf <ruta>.");
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

const fileStats = await stat(values.pdf);
if (!fileStats.isFile()) throw new Error("La ruta indicada no es un archivo.");
const bytes = new Uint8Array(await readFile(values.pdf));
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
});

const results = await sendQuotationEmail({
  data,
  pdf: {
    name: values.pdf,
    type: "application/pdf",
    size: bytes.byteLength,
    bytes,
  },
});

console.log(
  JSON.stringify(
    {
      mode: "internal-test",
      quotationNumber: data.quotationNumber,
      attachmentFilename: quotationAttachmentFilename(data.quotationNumber),
      attachmentBytes: bytes.byteLength,
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
