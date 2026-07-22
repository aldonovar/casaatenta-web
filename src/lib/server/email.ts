import "server-only";

import { Resend } from "resend";
import { LEGAL_PROVIDER, LEGAL_PROVIDER_LABEL } from "@/constants/legal";
import {
  QUOTATION_REPLY_TO,
  quotationPreheader,
  quotationSubject,
  type QuotationEmailData,
} from "@/lib/quotation-email/core";
import { getResendConfig, getSiteUrl } from "./env";
import { escapeHtml } from "./security";

let resendClient: Resend | undefined;

const FONT_FAMILY =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif";
const BRAND_NAVY = "#07111d";
const BRAND_GOLD = "#d8b36a";
const BODY_TEXT = "#273445";
const MUTED_TEXT = "#596878";
const PAGE_BACKGROUND = "#f4f0e8";
const AUTOMATED_SENDER_ADDRESS = "notificaciones@casa-atenta.com";
const OPERATIONAL_CONTACT_ADDRESS = "info@casa-atenta.com";
const EMAIL_LOGO_SVG_PATH = "/email/casa-atenta-wordmark-white-v2.svg";
const EMAIL_LOGO_FALLBACK_PATH = "/email/casa-atenta-wordmark-white-v2@2x.png";

function formatClaimAmount(value: number | null) {
  return value === null
    ? null
    : new Intl.NumberFormat("es-PE", {
        style: "currency",
        currency: "PEN",
        minimumFractionDigits: 2,
      }).format(value);
}

export function getResend() {
  if (!resendClient) resendClient = new Resend(getResendConfig().apiKey);
  return resendClient;
}

type EmailOptions = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
  headers?: Record<string, string>;
};

export async function sendEmail(options: EmailOptions, idempotencyKey: string) {
  const config = getResendConfig();
  const { data, error } = await getResend().emails.send(
    {
      from: config.from,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
      tags: options.tags,
      headers: options.headers,
    },
    { idempotencyKey },
  );

  if (error || !data?.id) {
    throw new Error(error?.message || "Resend no devolvió un identificador.");
  }

  return data.id;
}

function inlineText(value: unknown, maxLength = 120) {
  return String(value ?? "")
    .normalize("NFC")
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

/**
 * Mantiene el documento HTML completamente ASCII para que los caracteres
 * españoles y cualquier nombre Unicode sobrevivan incluso si un intermediario
 * interpreta de forma incorrecta el charset del mensaje.
 */
function encodeHtmlForEmail(value: string) {
  return value
    .normalize("NFC")
    .replace(
      /[^\u0000-\u007f]/gu,
      (character) => `&#${character.codePointAt(0)};`,
    );
}

function paragraph(content: string, muted = false) {
  return `<p class="${muted ? "email-muted" : "email-copy"}" style="font-family:${FONT_FAMILY};font-size:${muted ? "13px" : "16px"};line-height:${muted ? "20px" : "25px"};color:${muted ? MUTED_TEXT : BODY_TEXT};margin-top:0;margin-right:0;margin-bottom:18px;margin-left:0;mso-line-height-rule:exactly;">${content}</p>`;
}

function sectionHeading(content: string) {
  return `<h2 class="email-heading" style="font-family:${FONT_FAMILY};font-size:17px;line-height:24px;font-weight:700;color:${BRAND_NAVY};margin-top:28px;margin-right:0;margin-bottom:10px;margin-left:0;mso-line-height-rule:exactly;">${content}</h2>`;
}

function callout(label: string, value: string) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:22px;">
    <tr>
      <td bgcolor="#f7f3e9" class="email-callout" style="background-color:#f7f3e9;border-left-width:4px;border-left-style:solid;border-left-color:${BRAND_GOLD};padding-top:16px;padding-right:18px;padding-bottom:16px;padding-left:18px;">
        <p class="callout-label" style="font-family:${FONT_FAMILY};font-size:11px;line-height:16px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:5px;margin-left:0;">${escapeHtml(label)}</p>
        <p class="callout-value" style="font-family:${FONT_FAMILY};font-size:18px;line-height:25px;font-weight:700;color:${BRAND_NAVY};margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;word-break:break-word;">${escapeHtml(value)}</p>
      </td>
    </tr>
  </table>`;
}

function internalDataNotice() {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-bottom:22px;">
    <tr>
      <td bgcolor="#fff4d6" class="internal-data-notice" style="background-color:#fff4d6;border-width:1px;border-style:solid;border-color:#e5c77d;padding-top:12px;padding-right:14px;padding-bottom:12px;padding-left:14px;">
        <p class="internal-data-notice-text" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;font-weight:700;color:${BRAND_NAVY};margin:0;mso-line-height-rule:exactly;">USO INTERNO · CONTIENE DATOS PERSONALES</p>
      </td>
    </tr>
  </table>`;
}

function actionButton(url: string, label: string) {
  const safeUrl = escapeHtml(url);
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;margin-top:8px;margin-right:0;margin-bottom:24px;margin-left:0;">
    <tr>
      <td align="center" bgcolor="${BRAND_GOLD}" style="background-color:${BRAND_GOLD};mso-padding-alt:14px 24px;">
        <a href="${safeUrl}" style="display:inline-block;font-family:${FONT_FAMILY};font-size:15px;line-height:20px;font-weight:700;color:${BRAND_NAVY};text-decoration:none;padding-top:14px;padding-right:24px;padding-bottom:14px;padding-left:24px;mso-line-height-rule:exactly;">${escapeHtml(label)}</a>
      </td>
    </tr>
  </table>`;
}

type EmailAudience = "external" | "internal";

function automatedSenderNotice(audience: EmailAudience) {
  const senderAddress = escapeHtml(AUTOMATED_SENDER_ADDRESS);
  const contactAddress = escapeHtml(OPERATIONAL_CONTACT_ADDRESS);

  if (audience === "internal") {
    return {
      html: `<p class="email-muted" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:8px;margin-left:0;">Notificación interna enviada automáticamente desde <strong class="email-strong" style="color:${BRAND_NAVY};">${senderAddress}</strong>. Gestiona cualquier respuesta exclusivamente desde una identidad autorizada <strong class="email-strong" style="color:${BRAND_NAVY};">@casa-atenta.com</strong>; no respondas desde una cuenta personal.</p>`,
      text: `Notificación interna enviada automáticamente desde ${AUTOMATED_SENDER_ADDRESS}. Gestiona cualquier respuesta exclusivamente desde una identidad autorizada @casa-atenta.com; no respondas desde una cuenta personal.`,
    };
  }

  return {
    html: `<p class="email-muted" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:8px;margin-left:0;">Este mensaje fue enviado automáticamente desde <strong class="email-strong" style="color:${BRAND_NAVY};">${senderAddress}</strong>. No escribas manualmente a esa dirección. Si pulsas <strong class="email-strong" style="color:${BRAND_NAVY};">Responder</strong>, tu mensaje será dirigido al canal de atención de Casa Atenta; también puedes escribir a <a href="mailto:${contactAddress}" class="email-link" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${BRAND_NAVY};text-decoration:underline;">${contactAddress}</a>.</p>`,
    text: `Este mensaje fue enviado automáticamente desde ${AUTOMATED_SENDER_ADDRESS}. No escribas manualmente a esa dirección. Si pulsas Responder, tu mensaje será dirigido al canal de atención de Casa Atenta; también puedes escribir a ${OPERATIONAL_CONTACT_ADDRESS}.`,
  };
}

type EmailShellOptions = {
  title: string;
  preheader: string;
  body: string;
  footerNote?: string;
  audience?: EmailAudience;
  senderNotice?: { html: string; text: string };
};

function emailShell({
  title,
  preheader,
  body,
  footerNote,
  audience = "external",
  senderNotice: configuredSenderNotice,
}: EmailShellOptions) {
  const safeTitle = escapeHtml(title);
  const safePreheader = escapeHtml(preheader);
  const preheaderPadding = "&zwnj;&nbsp;".repeat(80);
  const siteUrl = getSiteUrl();
  const homeUrl = escapeHtml(siteUrl.href);
  const privacyUrl = escapeHtml(new URL("/privacidad", siteUrl).href);
  const logoSvgUrl = escapeHtml(new URL(EMAIL_LOGO_SVG_PATH, siteUrl).href);
  const logoFallbackUrl = escapeHtml(
    new URL(EMAIL_LOGO_FALLBACK_PATH, siteUrl).href,
  );
  const senderNotice =
    configuredSenderNotice || automatedSenderNotice(audience);
  const legalIdentity = escapeHtml(
    `${LEGAL_PROVIDER.tradeName} · ${LEGAL_PROVIDER.displayName} · RUC ${LEGAL_PROVIDER.ruc}`,
  );

  const html = `<!DOCTYPE html>
<html lang="es" dir="ltr" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${safeTitle}</title>
    <style>
      :root { color-scheme: light dark; supported-color-schemes: light dark; }
      table { border-spacing: 0; }
      img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
      @media screen and (max-width: 480px) {
        .email-page-padding { padding: 16px 8px !important; }
        .email-header { padding: 18px !important; }
        .email-body { padding: 25px 18px 23px !important; }
        .email-footer { padding: 18px !important; }
        .email-brand-cell, .email-title-cell { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        .email-brand-cell { padding-right: 0 !important; padding-bottom: 14px !important; }
        .email-title-cell { border-left: 0 !important; border-top: 1px solid #304050 !important; padding-top: 13px !important; padding-left: 0 !important; }
        .email-title { font-size: 22px !important; line-height: 28px !important; }
        .email-logo { width: 220px !important; height: auto !important; max-width: 100% !important; }
        .data-label, .data-value { display: block !important; width: 100% !important; box-sizing: border-box !important; }
        .data-label { border-bottom: 0 !important; padding-bottom: 3px !important; }
        .data-value { padding-top: 3px !important; }
        .email-footer-link { display: block !important; margin-top: 4px !important; }
        .email-footer-separator { display: none !important; }
      }
      @media (prefers-color-scheme: dark) {
        body, .email-page { background-color: #050d16 !important; }
        .email-card, .email-body { background-color: #0d1824 !important; }
        .email-card { border-color: #2b3948 !important; }
        .email-copy { color: #e8edf2 !important; }
        .email-muted { color: #b6c0cb !important; }
        .email-heading { color: #f3d28f !important; }
        .email-title { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
        .email-tagline { color: #c9d1d9 !important; -webkit-text-fill-color: #c9d1d9 !important; }
        .email-footer, .data-label { background-color: #111e2b !important; }
        .email-footer, .data-label, .data-value { border-color: #334252 !important; }
        .data-value { color: #e8edf2 !important; }
        .email-callout { background-color: #172433 !important; }
        .email-link, .email-strong, .callout-value { color: #f3d28f !important; }
        .callout-label, .data-label { color: #b6c0cb !important; }
        .internal-data-notice { background-color: #3b2e16 !important; border-color: #806536 !important; }
        .internal-data-notice-text { color: #f3d28f !important; }
      }
      [data-ogsc] body, [data-ogsc] .email-page { background-color: #050d16 !important; }
      [data-ogsc] .email-card, [data-ogsc] .email-body { background-color: #0d1824 !important; }
      [data-ogsc] .email-card { border-color: #2b3948 !important; }
      [data-ogsc] .email-copy { color: #e8edf2 !important; }
      [data-ogsc] .email-muted { color: #b6c0cb !important; }
      [data-ogsc] .email-heading { color: #f3d28f !important; }
      [data-ogsc] .email-title { color: #ffffff !important; -webkit-text-fill-color: #ffffff !important; }
      [data-ogsc] .email-tagline { color: #c9d1d9 !important; -webkit-text-fill-color: #c9d1d9 !important; }
      [data-ogsc] .email-footer, [data-ogsc] .data-label { background-color: #111e2b !important; }
      [data-ogsc] .email-footer, [data-ogsc] .data-label, [data-ogsc] .data-value { border-color: #334252 !important; }
      [data-ogsc] .data-value { color: #e8edf2 !important; }
      [data-ogsc] .email-callout { background-color: #172433 !important; }
      [data-ogsc] .email-link, [data-ogsc] .email-strong, [data-ogsc] .callout-value { color: #f3d28f !important; }
      [data-ogsc] .callout-label, [data-ogsc] .data-label { color: #b6c0cb !important; }
      [data-ogsc] .internal-data-notice { background-color: #3b2e16 !important; border-color: #806536 !important; }
      [data-ogsc] .internal-data-notice-text { color: #f3d28f !important; }
    </style>
    <!--[if mso]>
    <noscript>
      <xml>
        <o:OfficeDocumentSettings>
          <o:PixelsPerInch>96</o:PixelsPerInch>
          <o:AllowPNG/>
        </o:OfficeDocumentSettings>
      </xml>
    </noscript>
    <![endif]-->
  </head>
  <body bgcolor="${PAGE_BACKGROUND}" style="width:100%;margin:0;padding:0;background-color:${PAGE_BACKGROUND};-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
    <span style="display:none!important;visibility:hidden;mso-hide:all;font-family:${FONT_FAMILY};font-size:1px;line-height:1px;color:${PAGE_BACKGROUND};max-height:0;max-width:0;opacity:0;overflow:hidden;">${safePreheader}${preheaderPadding}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${PAGE_BACKGROUND}" class="email-page" style="width:100%;border-collapse:collapse;background-color:${PAGE_BACKGROUND};mso-table-lspace:0pt;mso-table-rspace:0pt;">
      <tr>
        <td align="center" class="email-page-padding" style="padding-top:32px;padding-right:14px;padding-bottom:32px;padding-left:14px;">
          <!--[if mso]>
          <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0"><tr><td>
          <![endif]-->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" class="email-card" style="width:100%;max-width:640px;border-collapse:collapse;background-color:#ffffff;border-width:1px;border-style:solid;border-color:#dedbd3;mso-table-lspace:0pt;mso-table-rspace:0pt;">
            <tr>
              <td bgcolor="${BRAND_NAVY}" class="email-header" style="background-color:${BRAND_NAVY};padding-top:20px;padding-right:24px;padding-bottom:19px;padding-left:24px;border-bottom-width:3px;border-bottom-style:solid;border-bottom-color:${BRAND_GOLD};">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;">
                  <tr>
                    <td width="45%" valign="middle" class="email-brand-cell" style="width:45%;padding-right:22px;">
                      <a href="${homeUrl}" style="display:inline-block;color:#ffffff;text-decoration:none;">
                        <!--[if mso]>
                        <img src="${logoFallbackUrl}" width="243" height="42" alt="Casa Atenta" class="email-logo" style="display:block;width:243px;height:42px;max-width:100%;border:0;color:#ffffff;font-family:${FONT_FAMILY};font-size:18px;line-height:42px;font-weight:700;letter-spacing:2px;-ms-interpolation-mode:bicubic;">
                        <![endif]-->
                        <!--[if !mso]><!-->
                        <picture style="display:block;">
                          <source srcset="${logoSvgUrl}" type="image/svg+xml">
                          <img src="${logoFallbackUrl}" width="243" height="42" alt="Casa Atenta" class="email-logo" style="display:block;width:243px;height:42px;max-width:100%;border:0;color:#ffffff;font-family:${FONT_FAMILY};font-size:18px;line-height:42px;font-weight:700;letter-spacing:2px;-ms-interpolation-mode:bicubic;">
                        </picture>
                        <!--<![endif]-->
                      </a>
                    </td>
                    <td valign="middle" class="email-title-cell" style="border-left-width:1px;border-left-style:solid;border-left-color:#304050;padding-left:22px;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important;">
                      <p class="email-tagline" style="font-family:${FONT_FAMILY};font-size:10px;line-height:15px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#c9d1d9!important;-webkit-text-fill-color:#c9d1d9!important;margin-top:0;margin-right:0;margin-bottom:4px;margin-left:0;"><font color="#C9D1D9">Diseño · ejecución · control</font></p>
                      <h1 class="email-title" style="font-family:${FONT_FAMILY};font-size:22px;line-height:29px;font-weight:600;color:#ffffff!important;-webkit-text-fill-color:#ffffff!important;margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;mso-line-height-rule:exactly;"><font color="#FFFFFF">${safeTitle}</font></h1>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td bgcolor="#ffffff" class="email-body" style="background-color:#ffffff;padding-top:32px;padding-right:24px;padding-bottom:28px;padding-left:24px;">
                ${body}
              </td>
            </tr>
            <tr>
              <td bgcolor="#f7f7f5" class="email-footer" style="background-color:#f7f7f5;border-top-width:1px;border-top-style:solid;border-top-color:#e4e2dc;padding-top:20px;padding-right:24px;padding-bottom:22px;padding-left:24px;">
                ${senderNotice.html}
                <p class="email-muted" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:8px;margin-left:0;">${escapeHtml(footerNote || "Correo transaccional enviado por Casa Atenta.")}</p>
                <p class="email-muted" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:6px;margin-left:0;">${legalIdentity}</p>
                <p class="email-muted email-footer-links" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:0;margin-left:0;"><a href="${homeUrl}" class="email-link email-footer-link" style="display:inline-block;color:${BRAND_NAVY};text-decoration:underline;">casa-atenta.com</a><span class="email-footer-separator"> · </span><a href="mailto:${escapeHtml(OPERATIONAL_CONTACT_ADDRESS)}" class="email-link email-footer-link" style="display:inline-block;color:${BRAND_NAVY};text-decoration:underline;">${escapeHtml(OPERATIONAL_CONTACT_ADDRESS)}</a><span class="email-footer-separator"> · </span><a href="${privacyUrl}" class="email-link email-footer-link" style="display:inline-block;color:${BRAND_NAVY};text-decoration:underline;">Privacidad</a></p>
              </td>
            </tr>
          </table>
          <!--[if mso]>
          </td></tr></table>
          <![endif]-->
        </td>
      </tr>
    </table>
  </body>
</html>`;

  return encodeHtmlForEmail(html);
}

type TransactionalEmailOptions = EmailShellOptions & {
  subject: string;
  text: string;
};

function transactionalEmail({
  subject,
  title,
  preheader,
  body,
  footerNote,
  audience = "external",
  text,
}: TransactionalEmailOptions) {
  const senderNotice = automatedSenderNotice(audience);

  return {
    subject,
    html: emailShell({ title, preheader, body, footerNote, audience }),
    text: `${text.trimEnd()}\n\n${senderNotice.text}\n\n${LEGAL_PROVIDER.tradeName} · ${LEGAL_PROVIDER.displayName} · RUC ${LEGAL_PROVIDER.ruc}\n${getSiteUrl().href}\n${OPERATIONAL_CONTACT_ADDRESS}`,
  };
}

function rows(values: Array<[string, unknown]>) {
  const renderedRows = values
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    )
    .map(
      ([label, value]) => `<tr>
        <th scope="row" width="35%" valign="top" align="left" bgcolor="#f7f7f5" class="data-label" style="width:35%;background-color:#f7f7f5;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e5e3dd;font-family:${FONT_FAMILY};font-size:13px;line-height:20px;font-weight:700;color:${MUTED_TEXT};padding-top:10px;padding-right:12px;padding-bottom:10px;padding-left:12px;mso-line-height-rule:exactly;">${escapeHtml(label)}</th>
        <td width="65%" valign="top" class="data-value" style="width:65%;border-bottom-width:1px;border-bottom-style:solid;border-bottom-color:#e5e3dd;font-family:${FONT_FAMILY};font-size:14px;line-height:21px;color:${BODY_TEXT};padding-top:10px;padding-right:12px;padding-bottom:10px;padding-left:12px;word-break:break-word;mso-line-height-rule:exactly;">${escapeHtml(value).replace(/\r\n|\r|\n/g, "<br>")}</td>
      </tr>`,
    )
    .join("");

  return `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;border-collapse:collapse;border-top-width:1px;border-top-style:solid;border-top-color:#e5e3dd;mso-table-lspace:0pt;mso-table-rspace:0pt;">${renderedRows}</table>`;
}

function quotationGreeting(
  data: Pick<QuotationEmailData, "treatment" | "clientName">,
) {
  const feminine = new Set(["Sra.", "Srta.", "Dra."]);
  const adjective = feminine.has(data.treatment) ? "Estimada" : "Estimado";
  return `${adjective} ${data.treatment} ${data.clientName}:`;
}

function quotationObjectPronoun(treatment: QuotationEmailData["treatment"]) {
  return new Set(["Sra.", "Srta.", "Dra."]).has(treatment) ? "la" : "lo";
}

export function quotationDeliveryEmail(data: QuotationEmailData) {
  const greeting = quotationGreeting(data);
  const objectPronoun = quotationObjectPronoun(data.treatment);
  const testNotice = data.isTest
    ? `${callout("Prueba interna", "Validación operativa. No reenviar a la cliente.")}`
    : "";
  const renderDescription = data.renderLink
    ? `junto con el <a href="${escapeHtml(data.renderLink)}" class="email-link" style="color:#07111d;text-decoration:underline;">render referencial correspondiente</a>`
    : "junto con el render referencial correspondiente";

  const renderButton = data.renderLink
    ? actionButton(data.renderLink, "Ver render referencial")
    : "";

  const body = `${testNotice}
    ${paragraph(escapeHtml(greeting))}
    ${paragraph("Esperamos que se encuentre muy bien.")}
    ${paragraph(`Tal como conversamos, le hacemos llegar adjunta la propuesta técnica desarrollada para su proyecto, ${renderDescription}.`)}
    ${renderButton}
    ${paragraph("En el documento encontrará el alcance del proyecto, las especificaciones técnicas, los materiales considerados y el presupuesto elaborado para su evaluación.")}
    ${paragraph("Si tuviera alguna consulta o deseara realizar algún ajuste sobre la propuesta presentada, estaremos atentos para atenderla y absolver cualquier inquietud.")}
    ${paragraph(`Agradecemos la confianza depositada en Casa Atenta y esperamos poder acompañar${objectPronoun} en la ejecución de este proyecto.`)}
    ${paragraph("Reciba un cordial saludo.")}
    ${paragraph('<strong class="email-strong" style="color:#07111d;">Equipo Casa Atenta</strong><br><a href="mailto:info@casa-atenta.com" class="email-link" style="color:#07111d;text-decoration:underline;">info@casa-atenta.com</a><br>+51 908 550 942<br><a href="https://www.casa-atenta.com" class="email-link" style="color:#07111d;text-decoration:underline;">www.casa-atenta.com</a>')}`;
  const text = [
    ...(data.isTest
      ? ["PRUEBA INTERNA — Validación operativa. No reenviar a la cliente.", ""]
      : []),
    greeting,
    "",
    "Esperamos que se encuentre muy bien.",
    "",
    data.renderLink
      ? `Tal como conversamos, le hacemos llegar adjunta la propuesta técnica desarrollada para su proyecto, junto con el render referencial correspondiente: ${data.renderLink}`
      : "Tal como conversamos, le hacemos llegar adjunta la propuesta técnica desarrollada para su proyecto, junto con el render referencial correspondiente.",
    "",
    "En el documento encontrará el alcance del proyecto, las especificaciones técnicas, los materiales considerados y el presupuesto elaborado para su evaluación.",
    "",
    "Si tuviera alguna consulta o deseara realizar algún ajuste sobre la propuesta presentada, estaremos atentos para atenderla y absolver cualquier inquietud.",
    "",
    `Agradecemos la confianza depositada en Casa Atenta y esperamos poder acompañar${objectPronoun} en la ejecución de este proyecto.`,
    "",
    "Reciba un cordial saludo.",
    "",
    "Equipo Casa Atenta",
    "info@casa-atenta.com",
    "+51 908 550 942",
    "www.casa-atenta.com",
  ].join("\n");

  return {
    subject: quotationSubject(data),
    html: emailShell({
      title: "Propuesta técnica",
      preheader: quotationPreheader(data),
      body,
      footerNote:
        "Esta propuesta fue preparada por Casa Atenta para el proyecto indicado.",
      senderNotice: {
        html: `<p class="email-muted" style="font-family:${FONT_FAMILY};font-size:12px;line-height:19px;color:${MUTED_TEXT};margin-top:0;margin-right:0;margin-bottom:8px;margin-left:0;">Puede responder directamente a este mensaje; la respuesta será atendida en <a href="mailto:${QUOTATION_REPLY_TO}" class="email-link" style="color:${BRAND_NAVY};text-decoration:underline;">${QUOTATION_REPLY_TO}</a>.</p>`,
        text: `Puede responder directamente a este mensaje en ${QUOTATION_REPLY_TO}.`,
      },
    }),
    text,
  };
}

export type ContactEmailData = {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: string;
  service: string | null;
  location: string | null;
  measures: string | null;
  message: string | null;
  projectData: Record<string, string>;
};

export function contactNotificationEmail(data: ContactEmailData) {
  const projectRows = Object.entries(data.projectData);
  const body = `${internalDataNotice()}
    ${paragraph("Se registró una nueva solicitud desde la web. Gestiona cualquier respuesta desde una identidad corporativa autorizada de Casa Atenta; nunca desde una cuenta personal.")}
    ${rows([
      ["Registro", data.id],
      ["Origen", data.source],
      ["Nombre", data.name],
      ["Correo", data.email],
      ["Teléfono", data.phone],
      ["Servicio", data.service],
      ["Ubicación", data.location],
      ["Medidas", data.measures],
      ...projectRows,
    ])}
    ${sectionHeading("Detalle proporcionado")}
    ${paragraph(escapeHtml(data.message || "Sin detalle adicional.").replaceAll("\n", "<br>"))}`;

  return transactionalEmail({
    subject: "Nueva solicitud web | Casa Atenta",
    title: "Nueva solicitud web",
    preheader: "Hay una nueva solicitud pendiente de revisión.",
    body,
    audience: "internal",
    footerNote:
      "Notificación interna de Casa Atenta. Contiene datos personales; no la reenvíes fuera del equipo autorizado.",
    text: [
      "Nueva solicitud web de Casa Atenta",
      `Registro: ${data.id}`,
      `Origen: ${data.source}`,
      `Nombre: ${data.name}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone}`,
      `Servicio: ${data.service || "-"}`,
      `Ubicación: ${data.location || "-"}`,
      `Medidas: ${data.measures || "-"}`,
      ...projectRows.map(([key, value]) => `${key}: ${value}`),
      `Detalle: ${data.message || "-"}`,
    ].join("\n"),
  });
}

export function contactReceiptEmail(name: string, reference: string) {
  const displayName = inlineText(name);
  const greeting = displayName ? `Hola ${escapeHtml(displayName)},` : "Hola,";
  const textGreeting = displayName ? `Hola ${displayName},` : "Hola,";
  const body = `${paragraph(greeting)}
    ${paragraph("Recibimos correctamente la información que enviaste desde casa-atenta.com. Nuestro equipo la revisará antes de comunicarse contigo mediante los datos de contacto que proporcionaste.")}
    ${callout("Referencia de la solicitud", reference)}
    ${sectionHeading("¿Necesitas añadir información?")}
    ${paragraph("Puedes responder directamente a este correo para adjuntar fotos, medidas o cualquier detalle adicional.")}
    ${paragraph("Conserva esta referencia para facilitar el seguimiento.", true)}`;

  return transactionalEmail({
    subject: "Recibimos tu solicitud | Casa Atenta",
    title: "Recibimos tu solicitud",
    preheader: `Tu solicitud quedó registrada con la referencia ${reference}.`,
    body,
    text: `${textGreeting}\n\nRecibimos correctamente la información que enviaste desde casa-atenta.com. Nuestro equipo la revisará antes de comunicarse contigo.\n\nReferencia: ${reference}\n\nSi necesitas añadir fotos, medidas u otros detalles, responde directamente a este correo. Conserva la referencia para facilitar el seguimiento.`,
  });
}

export type ClaimEmailData = {
  id: string;
  code: string;
  fullName: string;
  documentType: string;
  documentNumber: string;
  email: string;
  phone: string;
  address: string;
  isMinor: boolean;
  minorGuardian: string | null;
  minorGuardianAddress: string | null;
  minorGuardianPhone: string | null;
  minorGuardianEmail: string | null;
  claimType: string;
  goodType: string;
  productDescription: string;
  claimedAmount: number | null;
  claimDetail: string;
  consumerRequest: string;
  createdAt: string;
};

export function claimNotificationEmail(data: ClaimEmailData) {
  const body = `${internalDataNotice()}
    ${paragraph("Se registró una nueva entrada en el Libro de Reclamaciones. Revisa los datos, conserva el código y gestiona cualquier respuesta únicamente desde una identidad corporativa autorizada de Casa Atenta.")}
    ${rows([
      ["Código", data.code],
      ["ID interno", data.id],
      ["Fecha", data.createdAt],
      ["Tipo", data.claimType],
      ["Nombre", data.fullName],
      ["Documento", `${data.documentType} ${data.documentNumber}`],
      ["Correo", data.email],
      ["Teléfono", data.phone],
      ["Domicilio", data.address],
      ["Consumidor menor de edad", data.isMinor ? "Sí" : "No"],
      ["Representante", data.minorGuardian],
      ["Domicilio del representante", data.minorGuardianAddress],
      ["Teléfono del representante", data.minorGuardianPhone],
      ["Correo del representante", data.minorGuardianEmail],
      ["Tipo de bien", data.goodType],
      ["Producto o servicio", data.productDescription],
      ["Monto reclamado", formatClaimAmount(data.claimedAmount)],
    ])}
    ${sectionHeading("Detalle")}
    ${paragraph(escapeHtml(data.claimDetail).replaceAll("\n", "<br>"))}
    ${sectionHeading("Pedido del consumidor")}
    ${paragraph(escapeHtml(data.consumerRequest).replaceAll("\n", "<br>"))}`;

  return transactionalEmail({
    subject: `${inlineText(data.claimType, 30)} ${inlineText(data.code, 40)} | Libro de Reclamaciones`,
    title: `${data.claimType} ${data.code}`,
    preheader: "Nueva entrada registrada en el Libro de Reclamaciones.",
    body,
    audience: "internal",
    footerNote:
      "Notificación interna de Casa Atenta. Contiene datos personales; no la reenvíes fuera del equipo autorizado.",
    text: [
      `${data.claimType} ${data.code}`,
      `ID interno: ${data.id}`,
      `Fecha: ${data.createdAt}`,
      `Nombre: ${data.fullName}`,
      `Documento: ${data.documentType} ${data.documentNumber}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone}`,
      `Domicilio: ${data.address}`,
      `Consumidor menor de edad: ${data.isMinor ? "Sí" : "No"}`,
      `Representante: ${data.minorGuardian || "-"}`,
      `Domicilio del representante: ${data.minorGuardianAddress || "-"}`,
      `Teléfono del representante: ${data.minorGuardianPhone || "-"}`,
      `Correo del representante: ${data.minorGuardianEmail || "-"}`,
      `Tipo de bien: ${data.goodType}`,
      `Producto o servicio: ${data.productDescription}`,
      `Monto: ${formatClaimAmount(data.claimedAmount) || "-"}`,
      `Detalle: ${data.claimDetail}`,
      `Pedido: ${data.consumerRequest}`,
    ].join("\n"),
  });
}

export function claimReceiptEmail(data: ClaimEmailData) {
  const displayName = inlineText(data.fullName);
  const greeting = displayName ? `Hola ${escapeHtml(displayName)},` : "Hola,";
  const textGreeting = displayName ? `Hola ${displayName},` : "Hola,";
  const claimType = inlineText(data.claimType, 30).toLocaleLowerCase("es-PE");
  const subjectClaimType =
    claimType === "queja" ? "de la queja" : "del reclamo";
  const createdAt = inlineText(data.createdAt, 180).replace(/\.$/, "");
  const body = `${paragraph(greeting)}
    ${paragraph(`Registramos correctamente tu ${escapeHtml(claimType)} el ${escapeHtml(createdAt)}. Este mensaje contiene la copia digital de la información recibida.`)}
    ${callout("Código de seguimiento", data.code)}
    ${rows([
      ["Proveedor", LEGAL_PROVIDER_LABEL],
      ["Domicilio fiscal", LEGAL_PROVIDER.address || null],
      ["Fecha y hora", data.createdAt],
      ["Tipo", data.claimType],
      ["Nombre", data.fullName],
      ["Documento", `${data.documentType} ${data.documentNumber}`],
      ["Correo", data.email],
      ["Teléfono", data.phone],
      ["Domicilio", data.address],
      ["Consumidor menor de edad", data.isMinor ? "Sí" : "No"],
      ["Representante", data.minorGuardian],
      ["Domicilio del representante", data.minorGuardianAddress],
      ["Teléfono del representante", data.minorGuardianPhone],
      ["Correo del representante", data.minorGuardianEmail],
      ["Tipo de bien", data.goodType],
      ["Producto o servicio", data.productDescription],
      ["Monto reclamado", formatClaimAmount(data.claimedAmount)],
      ["Detalle", data.claimDetail],
      ["Pedido", data.consumerRequest],
    ])}
    ${paragraph("Casa Atenta debe responder el reclamo o la queja en un plazo máximo e improrrogable de 15 días hábiles.")}
    ${paragraph("Conserva este correo y el código para cualquier seguimiento posterior.", true)}`;

  return transactionalEmail({
    subject: `Copia ${subjectClaimType} ${inlineText(data.code, 40)} | Casa Atenta`,
    title: `Registro ${data.code}`,
    preheader: `Tu registro fue recibido con el código ${data.code}.`,
    body,
    footerNote:
      "Copia digital del registro enviado al Libro de Reclamaciones de Casa Atenta.",
    text: [
      textGreeting,
      "",
      `Registramos correctamente tu ${claimType}. Esta es la copia digital de la información recibida.`,
      "",
      `Código: ${data.code}`,
      `Proveedor: ${LEGAL_PROVIDER_LABEL}`,
      ...(LEGAL_PROVIDER.address
        ? [`Domicilio fiscal del proveedor: ${LEGAL_PROVIDER.address}`]
        : []),
      `Fecha y hora: ${data.createdAt}`,
      `Tipo: ${data.claimType}`,
      `Nombre: ${data.fullName}`,
      `Documento: ${data.documentType} ${data.documentNumber}`,
      `Correo: ${data.email}`,
      `Teléfono: ${data.phone}`,
      `Domicilio: ${data.address}`,
      `Consumidor menor de edad: ${data.isMinor ? "Sí" : "No"}`,
      `Representante: ${data.minorGuardian || "-"}`,
      `Domicilio del representante: ${data.minorGuardianAddress || "-"}`,
      `Teléfono del representante: ${data.minorGuardianPhone || "-"}`,
      `Correo del representante: ${data.minorGuardianEmail || "-"}`,
      `Tipo de bien: ${data.goodType}`,
      `Producto o servicio: ${data.productDescription}`,
      `Monto reclamado: ${formatClaimAmount(data.claimedAmount) || "-"}`,
      `Detalle: ${data.claimDetail}`,
      `Pedido: ${data.consumerRequest}`,
      "",
      "Casa Atenta debe responder el reclamo o la queja en un plazo máximo e improrrogable de 15 días hábiles.",
      "Conserva este correo y el código para cualquier seguimiento posterior.",
    ].join("\n"),
  });
}

export function newsletterConfirmationEmail(
  name: string | null,
  token: string,
) {
  const confirmationUrl = new URL("/newsletter/confirmar", getSiteUrl());
  confirmationUrl.searchParams.set("token", token);
  const displayName = name ? inlineText(name) : "";
  const greeting = displayName ? `Hola ${escapeHtml(displayName)},` : "Hola,";
  const body = `${paragraph(greeting)}
    ${paragraph("Recibimos una solicitud para suscribirte a las novedades de Casa Atenta. Confirma que este correo es tuyo para completar el registro.")}
    ${actionButton(confirmationUrl.href, "Confirmar mi suscripción")}
    ${paragraph(`Si el botón no funciona, copia y pega este enlace en tu navegador:<br><a href="${escapeHtml(confirmationUrl.href)}" class="email-link" style="font-family:${FONT_FAMILY};font-size:13px;line-height:20px;color:${BRAND_NAVY};text-decoration:underline;word-break:break-all;">${escapeHtml(confirmationUrl.href)}</a>`, true)}
    ${paragraph("El enlace caduca en 24 horas. Si no realizaste esta solicitud, ignora el mensaje; no quedarás suscrito.", true)}`;

  return transactionalEmail({
    subject: "Confirma tu suscripción | Casa Atenta",
    title: "Confirma tu suscripción",
    preheader:
      "Confirma tu correo para completar la suscripción a Casa Atenta.",
    body,
    footerNote: "Mensaje de verificación solicitado desde casa-atenta.com.",
    text: `${displayName ? `Hola ${displayName}` : "Hola"},\n\nRecibimos una solicitud para suscribirte a las novedades de Casa Atenta. Confirma que este correo es tuyo abriendo el siguiente enlace:\n${confirmationUrl.href}\n\nEl enlace caduca en 24 horas. Si no realizaste la solicitud, ignora este mensaje; no quedarás suscrito.`,
  });
}

export function newsletterWelcomeEmail(
  name: string | null,
  unsubscribeUrl: string,
) {
  const siteUrl = getSiteUrl().href;
  const displayName = name ? inlineText(name) : "";
  const greeting = displayName ? `Hola ${escapeHtml(displayName)},` : "Hola,";
  const body = `${paragraph(greeting)}
    ${paragraph("Tu correo quedó confirmado. A partir de ahora podrás recibir novedades, ideas y contenidos de Casa Atenta.")}
    ${actionButton(siteUrl, "Visitar Casa Atenta")}
    ${paragraph(`Puedes dejar de recibir estas comunicaciones en cualquier momento mediante este <a href="${escapeHtml(unsubscribeUrl)}" class="email-link" style="font-family:${FONT_FAMILY};font-size:13px;line-height:20px;color:${BRAND_NAVY};text-decoration:underline;">enlace de cancelación</a>.`, true)}`;

  return transactionalEmail({
    subject: "Suscripción confirmada | Casa Atenta",
    title: "Tu suscripción está activa",
    preheader: "Tu correo quedó confirmado correctamente.",
    body,
    footerNote:
      "Recibes este mensaje porque confirmaste tu suscripción en casa-atenta.com.",
    text: `${displayName ? `Hola ${displayName}` : "Hola"},\n\nTu correo quedó confirmado. A partir de ahora podrás recibir novedades, ideas y contenidos de Casa Atenta.\n\nVisita: ${siteUrl}\n\nPuedes cancelar la suscripción en cualquier momento: ${unsubscribeUrl}`,
  });
}
