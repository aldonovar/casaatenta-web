"use client";

import { FormEvent, useState } from "react";
import { MailCheck, Search } from "lucide-react";
import { StoreTurnstileWidget } from "@/components/StoreTurnstileWidget";

export function GuestOrderAccessRequestForm({
  initialOrderNumber = "",
}: {
  initialOrderNumber?: string;
}) {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/orders/guest-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: form.get("order_number"),
          email: form.get("email"),
          turnstileToken,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error || "No pudimos procesar la solicitud.");
      setMessage(
        result.message ||
          "Si los datos coinciden, enviaremos un enlace nuevo al correo registrado.",
      );
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "No pudimos procesar la solicitud.",
      );
    } finally {
      setTurnstileToken("");
      setTurnstileResetKey((value) => value + 1);
      setPending(false);
    }
  }

  return (
    <form className="guest-access-form" onSubmit={submit}>
      <div className="field">
        <label htmlFor="guest-order-number">Número de pedido</label>
        <div className="guest-access-input">
          <Search size={18} aria-hidden="true" />
          <input
            id="guest-order-number"
            name="order_number"
            defaultValue={initialOrderNumber}
            placeholder="CA-20260719-000001"
            autoComplete="off"
            pattern="CA-[0-9]{8}-[0-9]{6}"
            maxLength={18}
            required
          />
        </div>
      </div>
      <div className="field">
        <label htmlFor="guest-order-email">Correo usado en la compra</label>
        <div className="guest-access-input">
          <MailCheck size={18} aria-hidden="true" />
          <input
            id="guest-order-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="nombre@correo.com"
            maxLength={254}
            required
          />
        </div>
      </div>
      {message && <p className="form-success" role="status">{message}</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <StoreTurnstileWidget
        action="store_guest_access"
        onToken={setTurnstileToken}
        resetKey={turnstileResetKey}
      />
      <button
        className="button button--primary"
        type="submit"
        disabled={pending || !turnstileToken}
      >
        {pending ? "Solicitando…" : "Enviarme un enlace seguro"}
      </button>
      <small>
        Por privacidad mostramos la misma confirmación exista o no el pedido.
        Los enlaces anteriores conservarán únicamente su vigencia original.
      </small>
    </form>
  );
}
