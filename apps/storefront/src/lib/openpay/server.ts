import "server-only";

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

export async function createOpenpayCharge(
  input: CreateChargeInput,
): Promise<OpenpayCharge> {
  const config = getOpenpayConfig();
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
  if (!body.id) throw new OpenpayError("Respuesta inválida de Openpay.", 502);
  return body;
}

export function safeChargeSnapshot(charge: OpenpayCharge) {
  const card = charge.payment_method?.card;
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
      url: charge.payment_method?.url || null,
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
