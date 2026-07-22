import "server-only";

import { isIP } from "node:net";
import { storeConfig } from "@/lib/store-config";

type OpenpayEnvironment = "sandbox" | "production";

type OpenpayCardSummary = {
  brand?: string;
  card_number?: string;
  holder_name?: string;
  type?: string;
  bank_name?: string;
};

export type OpenpayCharge = {
  id: string;
  status: string;
  authorization?: string;
  error_message?: string;
  amount: number;
  currency: string;
  order_id?: string;
  card?: OpenpayCardSummary;
  payment_method?: {
    type?: string;
    url?: string;
    card?: OpenpayCardSummary;
  };
};

type CreateChargeInput = {
  sourceId: string;
  deviceSessionId: string;
  orderId: string;
  paymentAttemptId: string;
  orderNumber: string;
  amountMinor: number;
  customerIp: string;
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
};

export class OpenpayError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: number,
    public readonly category?: string,
  ) {
    super(message);
    this.name = "OpenpayError";
  }
}

function getOpenpayConfig() {
  const merchantId =
    process.env.OPENPAY_MERCHANT_ID ||
    process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID;
  const privateKey = process.env.OPENPAY_PRIVATE_KEY;
  const environment = (process.env.OPENPAY_ENVIRONMENT ||
    process.env.NEXT_PUBLIC_OPENPAY_ENVIRONMENT ||
    "sandbox") as OpenpayEnvironment;

  if (!merchantId || !privateKey) {
    throw new Error(
      "Falta configurar OPENPAY_MERCHANT_ID y OPENPAY_PRIVATE_KEY.",
    );
  }
  if (!(["sandbox", "production"] as string[]).includes(environment)) {
    throw new Error("OPENPAY_ENVIRONMENT debe ser sandbox o production.");
  }

  return {
    merchantId,
    privateKey,
    environment,
    apiBase:
      environment === "production"
        ? "https://api.openpay.pe"
        : "https://sandbox-api.openpay.pe",
  };
}

function validateRedirectUrl(
  value: unknown,
  config: ReturnType<typeof getOpenpayConfig>,
) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string" || value.length > 2_048) {
    throw new OpenpayError("Openpay devolvió un redirect inválido.", 502);
  }
  try {
    const url = new URL(value);
    const expected = new URL(config.apiBase);
    if (
      url.protocol !== "https:" ||
      url.hostname !== expected.hostname ||
      url.port ||
      url.username ||
      url.password
    ) {
      throw new Error("unexpected_redirect_origin");
    }
    return url.toString();
  } catch {
    throw new OpenpayError("Openpay devolvió un redirect no permitido.", 502);
  }
}

export async function createOpenpayCharge(
  input: CreateChargeInput,
): Promise<OpenpayCharge> {
  const config = getOpenpayConfig();
  if (!isIP(input.customerIp)) {
    throw new OpenpayError("La IP del comprador no es válida.", 400);
  }
  const use3dSecure = process.env.OPENPAY_USE_3DS !== "false";
  const payload = {
    method: "card",
    source_id: input.sourceId,
    amount: input.amountMinor / 100,
    currency: "PEN",
    description: `Pedido ${input.orderNumber} - Casa Atenta`,
    // Openpay order_id identifies this exact payment attempt, not a reusable
    // commerce order. This prevents a webhook from binding to the wrong retry.
    order_id: input.paymentAttemptId,
    device_session_id: input.deviceSessionId,
    ...(use3dSecure
      ? {
          use_3d_secure: true,
          redirect_url: `${storeConfig.url}/checkout/retorno?order=${encodeURIComponent(input.orderId)}`,
        }
      : {}),
    customer: {
      name: input.customer.firstName,
      last_name: input.customer.lastName,
      phone_number: input.customer.phone,
      email: input.customer.email,
    },
  };

  const response = await fetch(
    `${config.apiBase}/v1/${encodeURIComponent(config.merchantId)}/charges`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.privateKey}:`).toString("base64")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "CasaAtentaStore/1.0",
        "X-Forwarded-For": input.customerIp,
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: AbortSignal.timeout(25_000),
    },
  );

  const body = (await response.json().catch(() => ({}))) as OpenpayCharge & {
    description?: string;
    error_code?: number;
    category?: string;
  };
  if (!response.ok) {
    throw new OpenpayError(
      body.description || "Openpay rechazó la operación.",
      response.status,
      body.error_code,
      body.category,
    );
  }
  if (
    typeof body.id !== "string" ||
    typeof body.status !== "string" ||
    typeof body.amount !== "number" ||
    !Number.isFinite(body.amount) ||
    typeof body.currency !== "string" ||
    (body.order_id !== undefined && body.order_id !== input.paymentAttemptId)
  ) {
    throw new OpenpayError("Respuesta inválida de Openpay.", 502);
  }
  if (
    body.payment_method !== undefined &&
    (body.payment_method === null || typeof body.payment_method !== "object")
  ) {
    throw new OpenpayError("Openpay devolvió un método de pago inválido.", 502);
  }
  const redirectUrl = validateRedirectUrl(body.payment_method?.url, config);
  return {
    ...body,
    payment_method: body.payment_method
      ? { ...body.payment_method, url: redirectUrl }
      : undefined,
  };
}

export async function listOpenpayChargesByOrderId(
  orderId: string,
): Promise<OpenpayCharge[]> {
  const config = getOpenpayConfig();
  const query = new URLSearchParams({ order_id: orderId, limit: "10" });
  const response = await fetch(
    `${config.apiBase}/v1/${encodeURIComponent(config.merchantId)}/charges?${query.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Basic ${Buffer.from(`${config.privateKey}:`).toString("base64")}`,
        Accept: "application/json",
        "User-Agent": "CasaAtentaStore/1.0",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    },
  );

  const body = (await response.json().catch(() => null)) as unknown;
  if (!response.ok) {
    const errorBody = body as {
      description?: string;
      error_code?: number;
      category?: string;
    } | null;
    throw new OpenpayError(
      errorBody?.description || "No pudimos conciliar el cargo en Openpay.",
      response.status,
      errorBody?.error_code,
      errorBody?.category,
    );
  }
  if (!Array.isArray(body)) {
    throw new OpenpayError("Openpay devolvió una lista de cargos inválida.", 502);
  }

  for (const candidate of body) {
    const charge = candidate as Partial<OpenpayCharge> | null;
    if (
      !charge ||
      typeof charge !== "object" ||
      typeof charge.id !== "string" ||
      typeof charge.status !== "string" ||
      typeof charge.amount !== "number" ||
      !Number.isFinite(charge.amount) ||
      typeof charge.currency !== "string" ||
      typeof charge.order_id !== "string" ||
      charge.order_id !== orderId
    ) {
      throw new OpenpayError(
        "Openpay devolvió un cargo con estructura o identidad inesperada.",
        502,
      );
    }
  }

  return body as OpenpayCharge[];
}

export function safeChargeSnapshot(charge: OpenpayCharge) {
  const card = charge.card || charge.payment_method?.card;
  const cardDigits = String(card?.card_number || "").replace(/\D/g, "");
  return {
    id: charge.id,
    status: charge.status,
    authorization: charge.authorization || null,
    amount: charge.amount,
    currency: charge.currency,
    order_id: charge.order_id || null,
    payment_method: {
      type: charge.payment_method?.type || null,
      // Redirect URLs can contain short-lived transaction credentials. The
      // caller may return it to the browser once, but it must not be persisted
      // in the payment-event audit payload.
      has_redirect: Boolean(charge.payment_method?.url),
      card: card
        ? {
            brand: card.brand || null,
            last4: cardDigits.slice(-4) || null,
            type: card.type || null,
            bank_name: card.bank_name || null,
          }
        : null,
    },
  };
}
