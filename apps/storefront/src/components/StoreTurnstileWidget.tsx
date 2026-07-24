"use client";

import Script from "next/script";
import { useCallback, useEffect, useRef } from "react";

type StoreTurnstileAction = "store_checkout" | "store_guest_access";

type TurnstileApi = {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      action: StoreTurnstileAction;
      theme: "auto";
      language: "es";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
      "timeout-callback": () => void;
      "unsupported-callback": () => void;
      "refresh-expired": "auto";
      "response-field": false;
    },
  ) => string;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

const siteKey = process.env.NEXT_PUBLIC_STORE_TURNSTILE_SITE_KEY || "";

export function StoreTurnstileWidget({
  onToken,
  resetKey,
  action = "store_checkout",
}: {
  onToken: (token: string) => void;
  resetKey: number;
  action?: StoreTurnstileAction;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | undefined>(undefined);

  const renderWidget = useCallback(() => {
    if (
      !siteKey ||
      !containerRef.current ||
      !window.turnstile ||
      widgetIdRef.current
    ) {
      return;
    }
    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action,
      theme: "auto",
      language: "es",
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
      "timeout-callback": () => onToken(""),
      "unsupported-callback": () => onToken(""),
      "refresh-expired": "auto",
      "response-field": false,
    });
  }, [action, onToken]);

  useEffect(() => {
    renderWidget();
    return () => {
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = undefined;
      }
    };
  }, [renderWidget]);

  useEffect(() => {
    if (resetKey > 0 && widgetIdRef.current && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
      onToken("");
    }
  }, [onToken, resetKey]);

  if (!siteKey) {
    return (
      <p className="form-error" role="alert">
        La verificación contra abuso no está configurada. El pago permanece bloqueado.
      </p>
    );
  }

  return (
    <div aria-label="Verificación de seguridad de la compra">
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={renderWidget}
      />
      <div ref={containerRef} />
    </div>
  );
}
