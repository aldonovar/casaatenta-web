"use client";

import { useRef, useState, type DragEvent, type FormEvent } from "react";
import styles from "./quotation-admin.module.css";

const PROFESSIONAL_TREATMENTS = [
  "Sr.",
  "Sra.",
  "Srta.",
  "Dr.",
  "Dra.",
  "Arq.",
  "Ing.",
  "Lic.",
] as const;
const FEMININE_TREATMENTS = new Set(["Sra.", "Srta.", "Dra."]);
const MAX_PDF_BYTES = 4 * 1024 * 1024;
const ADMIN_REQUEST_HEADER = "x-casa-atenta-admin-request";
const ADMIN_REQUEST_VALUE = "quotation-email-v1";

type FormState = {
  treatment: string;
  clientName: string;
  quotationNumber: string;
  project: string;
  location: string;
  total: string;
  recipients: string;
  isTest: boolean;
  productionDocumentConfirmed: boolean;
  productionConfirmation: string;
  renderLink: string;
  subject: string;
};

type DeliveryResult = {
  recipientIndex: number;
  recipientMasked: string;
  status: "sent" | "duplicate" | "failed" | "accepted_audit_pending";
  resendEmailId: string | null;
  existingStatus: string | null;
  requiresReview: boolean;
  message: string;
  idempotencyKey: string;
};

type ApiResponse = {
  error?: string;
  quotationNumber?: string;
  isTest?: boolean;
  attachment?: { name: string; bytes: number; mime: string };
  results?: DeliveryResult[];
};

const initialState = (testRecipients: readonly string[]): FormState => ({
  treatment: "Dra.",
  clientName: "",
  quotationNumber: "",
  project: "",
  location: "",
  total: "",
  recipients: testRecipients.join("\n"),
  isTest: true,
  productionDocumentConfirmed: false,
  productionConfirmation: "",
  renderLink: "",
  subject: "",
});

function parseRecipients(value: string) {
  return [
    ...new Set(
      value
        .split(/[\s,;]+/u)
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean),
    ),
  ];
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

function statusLabel(status: DeliveryResult["status"]) {
  if (status === "sent") return "Aceptado por Resend";
  if (status === "duplicate") return "Duplicado bloqueado";
  if (status === "accepted_audit_pending")
    return "Aceptado / auditoría pendiente";
  return "Falló";
}

export function QuotationEmailForm({
  testRecipients,
  productionEnabled,
}: {
  testRecipients: string[];
  productionEnabled: boolean;
}) {
  const [form, setForm] = useState<FormState>(() =>
    initialState(testRecipients),
  );
  const [pdf, setPdf] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [operationConfirmed, setOperationConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const recipients = parseRecipients(form.recipients);
  const subject = `${form.isTest ? "[PRUEBA INTERNA] " : ""}${form.subject || "Propuesta técnica y render de su proyecto | Casa Atenta"}`;
  const locality = form.location.split(",", 1)[0]?.trim() || form.location;
  const preheader = `Propuesta técnica N.° ${form.quotationNumber} preparada para su proyecto en ${locality}.`;
  const confirmationPhrase = `CONFIRMAR ENVIO ${form.quotationNumber}`;
  const greetingAdjective = FEMININE_TREATMENTS.has(form.treatment)
    ? "Estimada"
    : "Estimado";
  const objectPronoun = FEMININE_TREATMENTS.has(form.treatment) ? "la" : "lo";
  const locked = Boolean(response?.results?.length);

  const update = <Key extends keyof FormState>(
    key: Key,
    value: FormState[Key],
  ) => {
    setForm((current) => {
      const next = { ...current, [key]: value };
      if (
        key !== "productionDocumentConfirmed" &&
        key !== "productionConfirmation"
      ) {
        next.productionDocumentConfirmed = false;
        next.productionConfirmation = "";
      }
      return next;
    });
    setResponse(null);
    setError("");
    setOperationConfirmed(false);
  };

  const selectPdf = (next: File | null) => {
    setForm((current) => ({
      ...current,
      productionDocumentConfirmed: false,
      productionConfirmation: "",
    }));
    setResponse(null);
    setError("");
    setOperationConfirmed(false);
    setPdf(next);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    selectPdf(event.dataTransfer.files.item(0));
  };

  const toggleMode = (isTest: boolean) => {
    setForm((current) => ({
      ...current,
      isTest,
      recipients: isTest ? testRecipients.join("\n") : "",
      productionDocumentConfirmed: false,
      productionConfirmation: "",
    }));
    setResponse(null);
    setError("");
    setOperationConfirmed(false);
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setCopied(false);

    if (!pdf) {
      setError("Selecciona el PDF real de la cotización.");
      return;
    }
    if (pdf.size > MAX_PDF_BYTES) {
      setError("El PDF supera el límite de 4 MiB.");
      return;
    }
    if (!operationConfirmed) {
      setError("Confirma la operación antes de enviar.");
      return;
    }

    const metadata = {
      treatment: form.treatment,
      clientName: form.clientName,
      quotationNumber: form.quotationNumber,
      project: form.project,
      location: form.location,
      total: form.total,
      recipients,
      isTest: form.isTest,
      productionDocumentConfirmed: form.productionDocumentConfirmed,
      productionConfirmation: form.productionConfirmation || undefined,
      renderLink: form.renderLink || undefined,
      subject: form.subject || undefined,
    };
    const body = new FormData();
    body.set("metadata", JSON.stringify(metadata));
    body.set("pdf", pdf);

    setSubmitting(true);
    try {
      const request = await fetch("/api/admin/quotation-email", {
        method: "POST",
        headers: { [ADMIN_REQUEST_HEADER]: ADMIN_REQUEST_VALUE },
        body,
        credentials: "same-origin",
      });
      const payload = (await request.json()) as ApiResponse;
      if (!payload.results?.length) {
        throw new Error(
          payload.error || "No se obtuvo un resultado verificable.",
        );
      }
      setResponse(payload);
      const needsReview = payload.results.some(
        (result) => result.requiresReview,
      );
      if (!request.ok || needsReview) {
        setError(
          payload.error ||
            "Uno o más resultados requieren revisión antes de cualquier reintento.",
        );
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "No se pudo completar la solicitud.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  const technicalSummary = response?.results
    ? [
        `Cotización: ${response.quotationNumber}`,
        `Modo: ${response.isTest ? "prueba" : "producción"}`,
        `Adjunto: ${response.attachment?.name || "-"} (${response.attachment?.bytes || 0} bytes)`,
        ...response.results.map(
          (result) =>
            `${result.recipientMasked} | ${result.status} | Resend: ${result.resendEmailId || "sin ID"} | Idempotencia: ${result.idempotencyKey}`,
        ),
      ].join("\n")
    : "";

  const copySummary = async () => {
    try {
      await navigator.clipboard.writeText(technicalSummary);
      setCopied(true);
    } catch {
      setError(
        "No se pudo copiar el resumen. Puedes seleccionar los datos manualmente.",
      );
    }
  };

  return (
    <form className={styles.workspace} onSubmit={submit}>
      <section
        className={styles.formPanel}
        aria-labelledby="quotation-data-title"
      >
        <div className={styles.sectionHeader}>
          <span>01</span>
          <div>
            <p>Datos y control</p>
            <h2 id="quotation-data-title">Preparar entrega</h2>
          </div>
        </div>

        <fieldset className={styles.modeFieldset}>
          <legend>Modo de envío</legend>
          <label className={form.isTest ? styles.activeMode : ""}>
            <input
              type="radio"
              name="mode"
              checked={form.isTest}
              onChange={() => toggleMode(true)}
            />
            <strong>Prueba interna</strong>
            <span>Allowlist estricta, sin cliente real.</span>
          </label>
          <label className={!form.isTest ? styles.productionMode : ""}>
            <input
              type="radio"
              name="mode"
              checked={!form.isTest}
              disabled={!productionEnabled}
              onChange={() => toggleMode(false)}
            />
            <strong>Producción</strong>
            <span>
              {productionEnabled
                ? "Requiere revisión documental y frase exacta."
                : "Bloqueada por configuración server-side."}
            </span>
          </label>
        </fieldset>

        <div className={styles.gridTwo}>
          <label>
            Tratamiento
            <select
              value={form.treatment}
              onChange={(event) => update("treatment", event.target.value)}
            >
              {PROFESSIONAL_TREATMENTS.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            Nombre de cliente
            <input
              value={form.clientName}
              onChange={(event) => update("clientName", event.target.value)}
              maxLength={120}
              required
            />
          </label>
          <label>
            N.° de cotización
            <input
              value={form.quotationNumber}
              onChange={(event) =>
                update("quotationNumber", event.target.value)
              }
              pattern="[A-Za-z0-9-]+"
              maxLength={40}
              required
            />
          </label>
          <label>
            Importe
            <input
              type="number"
              min="0.01"
              step="0.01"
              value={form.total}
              onChange={(event) => update("total", event.target.value)}
              required
            />
          </label>
        </div>

        <label>
          Proyecto
          <input
            value={form.project}
            onChange={(event) => update("project", event.target.value)}
            maxLength={240}
            required
          />
        </label>
        <label>
          Ubicación
          <input
            value={form.location}
            onChange={(event) => update("location", event.target.value)}
            maxLength={160}
            required
          />
        </label>
        <label>
          Enlace del render (opcional)
          <input
            type="url"
            value={form.renderLink}
            onChange={(event) => update("renderLink", event.target.value)}
            placeholder="https://drive.google.com/..."
          />
        </label>
        <label>
          Asunto del correo (opcional)
          <input
            value={form.subject}
            onChange={(event) => update("subject", event.target.value)}
            placeholder="Propuesta técnica y render de su proyecto | Casa Atenta"
            maxLength={200}
          />
        </label>
        <label>
          Destinatarios — uno por línea
          <textarea
            value={form.recipients}
            onChange={(event) => update("recipients", event.target.value)}
            rows={3}
            spellCheck={false}
            required
          />
          <small>
            {form.isTest
              ? `Solo se acepta la allowlist privada configurada (${testRecipients.length} destinatarios). Se enviarán por separado.`
              : "Verifica visualmente cada dirección: producción no admite destinatarios implícitos."}
          </small>
        </label>

        <div
          className={`${styles.dropZone} ${dragging ? styles.dropZoneActive : ""}`}
          onDragEnter={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
        >
          <input
            ref={fileInput}
            type="file"
            accept="application/pdf,.pdf"
            onChange={(event) => selectPdf(event.target.files?.item(0) || null)}
            className={styles.srOnly}
          />
          <p>
            {pdf ? pdf.name : "Arrastra el PDF o selecciónalo desde el equipo"}
          </p>
          <span>
            {pdf
              ? `${formatBytes(pdf.size)} · ${pdf.type || "MIME no declarado"}`
              : "PDF con firma válida · máximo 4 MiB · nunca se publica"}
          </span>
          <button type="button" onClick={() => fileInput.current?.click()}>
            {pdf ? "Cambiar archivo" : "Seleccionar PDF"}
          </button>
        </div>

        {!form.isTest ? (
          <div className={styles.productionGate}>
            <p>
              Producción exige corregir o aprobar conscientemente el contenido
              del PDF y mostrar el destinatario real antes de enviar.
            </p>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={form.productionDocumentConfirmed}
                onChange={(event) =>
                  update("productionDocumentConfirmed", event.target.checked)
                }
              />
              Revisé destinatario, alcance, partidas, total, fotografías y
              metadatos del PDF.
            </label>
            <label>
              Escribe exactamente: <code>{confirmationPhrase}</code>
              <input
                value={form.productionConfirmation}
                onChange={(event) =>
                  update("productionConfirmation", event.target.value)
                }
                autoComplete="off"
                required
              />
            </label>
          </div>
        ) : null}
      </section>

      <aside className={styles.previewPanel} aria-labelledby="preview-title">
        <div className={styles.sectionHeader}>
          <span>02</span>
          <div>
            <p>Vista previa</p>
            <h2 id="preview-title">Correo y confirmación</h2>
          </div>
        </div>

        <dl className={styles.deliveryMeta}>
          <div>
            <dt>From</dt>
            <dd>Casa Atenta &lt;info@casa-atenta.com&gt;</dd>
          </div>
          <div>
            <dt>Reply-To</dt>
            <dd>info@casa-atenta.com</dd>
          </div>
          <div>
            <dt>Asunto</dt>
            <dd>{subject}</dd>
          </div>
          <div>
            <dt>Preheader</dt>
            <dd>{preheader}</dd>
          </div>
        </dl>

        <article className={styles.emailPreview}>
          {form.isTest ? (
            <span className={styles.testBadge}>Prueba interna</span>
          ) : null}
          <p>
            {greetingAdjective} {form.treatment} {form.clientName}:
          </p>
          <p>Esperamos que se encuentre muy bien.</p>
          <p>
            Tal como conversamos, le hacemos llegar adjunta la propuesta técnica
            desarrollada para su proyecto, junto con el{" "}
            {form.renderLink ? (
              <a
                href={form.renderLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#d8b36a", textDecoration: "underline" }}
              >
                render referencial correspondiente
              </a>
            ) : (
              "render referencial correspondiente"
            )}
            .
          </p>
          {form.renderLink ? (
            <div style={{ marginTop: "8px", marginBottom: "24px" }}>
              <table role="presentation" cellPadding="0" cellSpacing="0" style={{ borderCollapse: "collapse" }}>
                <tr>
                  <td align="center" style={{ backgroundColor: "#d8b36a" }}>
                    <a
                      href={form.renderLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-block",
                        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
                        fontSize: "15px",
                        lineHeight: "20px",
                        fontWeight: "700",
                        color: "#07111d",
                        textDecoration: "none",
                        padding: "14px 24px",
                      }}
                    >
                      Ver render referencial
                    </a>
                  </td>
                </tr>
              </table>
            </div>
          ) : null}
          <p>
            En el documento encontrará el alcance del proyecto, las
            especificaciones técnicas, los materiales considerados y el
            presupuesto elaborado para su evaluación.
          </p>
          <p>
            Si tuviera alguna consulta o deseara realizar algún ajuste sobre la
            propuesta presentada, estaremos atentos para atenderla y absolver
            cualquier inquietud.
          </p>
          <p>
            Agradecemos la confianza depositada en Casa Atenta y esperamos poder
            acompañar{objectPronoun} en la ejecución de este proyecto.
          </p>
          <p>
            Reciba un cordial saludo.
            <br />
            <strong>Equipo Casa Atenta</strong>
          </p>
        </article>

        <div className={styles.recipientReview}>
          <p>Saldrán {recipients.length} mensajes independientes:</p>
          <ol>
            {recipients.map((recipient) => (
              <li key={recipient}>{recipient}</li>
            ))}
          </ol>
        </div>

        <label className={styles.confirmationBox}>
          <input
            type="checkbox"
            checked={operationConfirmed}
            onChange={(event) => setOperationConfirmed(event.target.checked)}
            disabled={locked || submitting}
          />
          <span>
            {form.isTest
              ? "Confirmo que esta operación solo puede enviarse a la allowlist interna y nunca a la cliente."
              : "Confirmo el envío real a las direcciones visibles arriba y acepto la reserva idempotente."}
          </span>
        </label>

        {error ? (
          <p className={styles.errorBanner} role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className={styles.sendButton}
          disabled={submitting || locked || !operationConfirmed}
        >
          {submitting
            ? "Procesando y auditando…"
            : locked
              ? "Operación ya procesada"
              : `Enviar ${recipients.length || 0} mensaje${recipients.length === 1 ? "" : "s"}`}
        </button>

        <p className={styles.sendFootnote}>
          No recargues durante el envío. Una clave estable bloquea cualquier
          repetición del mismo destinatario, contenido y PDF.
        </p>

        {response?.results?.length ? (
          <section
            className={styles.results}
            aria-live="polite"
            aria-labelledby="results-title"
          >
            <div className={styles.resultsHeader}>
              <h3 id="results-title">Resultado individual</h3>
              <button type="button" onClick={copySummary}>
                {copied ? "Resumen copiado" : "Copiar resumen técnico"}
              </button>
            </div>
            {response.results.map((result) => (
              <article key={result.idempotencyKey} data-status={result.status}>
                <div>
                  <strong>{result.recipientMasked}</strong>
                  <span>{statusLabel(result.status)}</span>
                </div>
                <p>{result.message}</p>
                <dl>
                  <div>
                    <dt>ID Resend</dt>
                    <dd>
                      <code>{result.resendEmailId || "No disponible"}</code>
                    </dd>
                  </div>
                  <div>
                    <dt>Idempotencia</dt>
                    <dd>
                      <code>{result.idempotencyKey}</code>
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </section>
        ) : null}
      </aside>
    </form>
  );
}
