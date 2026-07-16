import Link from "next/link";
import { AlertTriangle, ArrowLeft, ExternalLink, Scale, ShieldCheck } from "lucide-react";
import {
  getStoreLegalProviderSnapshot,
  storeConfig,
} from "@/lib/store-config";
import type { StoreLegalDocument } from "@/lib/store-legal-documents";
import { getStoreLegalEvidenceSha256 } from "@/lib/store-legal-hash";

export function StoreLegalDocumentView({
  document,
}: {
  document: StoreLegalDocument;
}) {
  const documentHash = getStoreLegalEvidenceSha256(document);
  const provider = getStoreLegalProviderSnapshot();
  return (
    <div className="store-legal-page">
      <header className="store-legal-hero">
        <div className="store-container">
          <Link href="/" className="store-legal-back"><ArrowLeft size={16} /> Volver a la tienda</Link>
          <span className="eyebrow">{document.eyebrow}</span>
          <h1>{document.title}</h1>
          <p>{document.description}</p>
          <div className="store-legal-version">
            <span>Actualizado: {document.updatedAt}</span>
            <span>Versión: {document.version}</span>
            <span>SHA-256 del documento y proveedor: {documentHash}</span>
          </div>
        </div>
      </header>

      <div className="store-container store-legal-grid">
        <aside className="store-legal-provider" aria-label="Identificación del proveedor">
          <span><Scale size={22} /></span>
          <h2>Proveedor responsable</h2>
          <dl>
            <div><dt>Titular</dt><dd>{provider.holder_name}</dd></div>
            <div><dt>Nombre comercial</dt><dd>{provider.trade_name}</dd></div>
            <div><dt>RUC</dt><dd>{provider.ruc}</dd></div>
            <div>
              <dt>Domicilio</dt>
              <dd>{provider.address}</dd>
            </div>
            <div><dt>Correo</dt><dd><a href={`mailto:${provider.email}`}>{provider.email}</a></dd></div>
            <div><dt>Teléfono</dt><dd>{provider.phone}</dd></div>
          </dl>
          {!storeConfig.legal.address && (
            <p className="store-legal-provider__warning">
              <AlertTriangle size={16} /> Los pagos permanecen desactivados hasta publicar el domicilio legal verificado.
            </p>
          )}
          <Link href="/libro-de-reclamaciones">Libro de Reclamaciones</Link>
        </aside>

        <article className="store-legal-content">
          {document.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              {section.bullets && (
                <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>
              )}
              {section.links && (
                <div className="store-legal-links">
                  {section.links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noreferrer">
                      {link.label}<ExternalLink size={14} />
                    </a>
                  ))}
                </div>
              )}
            </section>
          ))}
          {storeConfig.preview && (
            <footer className="store-legal-content__footer">
              <ShieldCheck size={18} />
              <p>
                Este documento forma parte de la preparación técnica de la tienda.
                Antes de habilitar pagos debe aprobarse la versión comercial final y
                completarse la configuración legal, tributaria y operativa pendiente.
              </p>
            </footer>
          )}
        </article>
      </div>
    </div>
  );
}
