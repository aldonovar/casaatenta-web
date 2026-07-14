"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";

interface ShareToolbarProps {
  title: string;
  url: string;
  compact?: boolean;
}

export function ShareToolbar({ title, url, compact = false }: ShareToolbarProps) {
  const [copied, setCopied] = useState(false);
  const message = `${title} — Casa Atenta`;
  const encodedUrl = encodeURIComponent(url);
  const encodedMessage = encodeURIComponent(`${message} ${url}`);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    }
  };

  const nativeShare = async () => {
    if (typeof navigator.share !== "function") {
      await copyLink();
      return;
    }
    try {
      await navigator.share({ title, text: message, url });
    } catch {
      // El usuario puede cerrar el diálogo sin compartir.
    }
  };

  const itemClass = compact
    ? "inline-flex h-9 items-center rounded-full border border-ca-border px-3 font-mono text-[8px] uppercase tracking-[.14em] text-ca-text-secondary transition hover:border-brand-gold hover:text-brand-gold"
    : "inline-flex h-10 items-center rounded-full border border-ca-border px-4 font-mono text-[9px] uppercase tracking-[.14em] text-ca-text-secondary transition hover:border-brand-gold hover:text-brand-gold";

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Compartir artículo">
      <button type="button" onClick={nativeShare} className={itemClass}>
        <Share2 size={13} className="mr-2" aria-hidden="true" />
        Compartir
      </button>
      <a
        href={`https://wa.me/?text=${encodedMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        aria-label="Compartir por WhatsApp"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        aria-label="Compartir en Facebook"
      >
        Facebook
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        aria-label="Compartir en LinkedIn"
      >
        LinkedIn
      </a>
      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(message)}&url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        aria-label="Compartir en X"
      >
        X
      </a>
      <button type="button" onClick={copyLink} className={itemClass} aria-live="polite">
        {copied ? <Check size={13} className="mr-2" /> : <Copy size={13} className="mr-2" />}
        {copied ? "Enlace copiado" : "Copiar enlace"}
      </button>
    </div>
  );
}
