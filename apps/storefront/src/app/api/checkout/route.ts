import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  createOpenpayCharge,
  OpenpayError,
  safeChargeSnapshot,
} from "@/lib/openpay/server";
import {
  getRequestFingerprint,
  hashPayload,
  isAllowedStoreOrigin,
} from "@/lib/server/security";
import {
  getStoreLegalProviderSnapshot,
  storeConfig,
} from "@/lib/store-config";
import { STORE_LEGAL_VERSIONS } from "@/lib/store-legal";
import {
  fulfilmentDocument,
  privacyDocument,
  purchaseTermsDocument,
} from "@/lib/store-legal-documents";
import { getStoreLegalEvidenceSha256 } from "@/lib/store-legal-hash";
import { calculateOnlineShippingMinor } from "@/lib/store-shipping";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const shortText = (minimum: number, maximum: number) =>
  z.string().trim().min(minimum).max(maximum);

const checkoutSchema = z.object({
  sourceId: shortText(8, 120).regex(/^[A-Za-z0-9_-]+$/),
  deviceSessionId: shortText(8, 160).regex(/^[A-Za-z0-9_-]+$/),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        quantity: z.number().int().min(1).max(20),
      }),
    )
    .min(1)
    .max(50),
  customer: z.object({
    email: z.string().trim().toLowerCase().email().max(254),
    firstName: shortText(2, 90),
    lastName: shortText(2, 90),
    phone: shortText(7, 30),
    documentType: z.enum(["DNI", "CE", "RUC", "PASSPORT"]),
    documentNumber: shortText(5, 20).regex(/^[A-Za-z0-9-]+$/),
  }),
  shipping: z.object({
    addressLine1: shortText(5, 240),
    addressLine2: z.string().trim().max(160).optional().default(""),
    department: z.enum(["Lima", "Callao"]),
    province: z.string().trim().max(80).optional().default(""),
    district: shortText(2, 100),
    postalCode: z.string().trim().max(20).optional().default(""),
    reference: z.string().trim().max(300).optional().default(""),
    method: z.enum(["delivery"]).default("delivery"),
  }),
  invoice: z.discriminatedUnion("type", [
    z.object({ type: z.literal("receipt") }),
    z.object({
      type: z.literal("invoice"),
      businessName: shortText(2, 180),
      ruc: z.string().trim().regex(/^\d{11}$/),
    }),
  ]),
  couponCode: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,40}$/).optional(),
  expectedTotalMinor: z.number().int().nonnegative(),
  legalAcceptance: z.object({
    accepted: z.literal(true),
    privacyVersion: z.literal(STORE_LEGAL_VERSIONS.privacy),
    purchaseTermsVersion: z.literal(STORE_LEGAL_VERSIONS.purchaseTerms),
    fulfilmentVersion: z.literal(STORE_LEGAL_VERSIONS.fulfilment),
  }),
});

type CatalogueRow = {
  id: string;
  slug: string;
  sku: string;
  model: string;
  name: string;
  short_name: string;
  price_minor: number | null;
  stock_quantity: number;
  allow_backorder: boolean;
  status: string;
  commercial_status: string;
  shipping_class: string;
};

function responseError(message: string, status: number) {
  return NextResponse.json(
    { error: message },
    {
      status,
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    },
  );
}

export async function POST(request: Request) {
  if (storeConfig.preview || process.env.STORE_MODE !== "live") {
    return responseError(
      "La tienda está en modo precomercial y todavía no acepta pagos.",
      503,
    );
  }
  if (!isAllowedStoreOrigin(request)) {
    return responseError("Origen de solicitud no permitido.", 403);
  }
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return responseError("Formato de solicitud no permitido.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 32_768) return responseError("Solicitud demasiado grande.", 413);

  const idempotencyKey = request.headers.get("idempotency-key")?.trim() || "";
  if (!/^[A-Za-z0-9_-]{16,120}$/.test(idempotencyKey)) {
    return responseError("Falta una clave de idempotencia válida.", 400);
  }

  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 32_768) {
    return responseError("Solicitud demasiado grande.", 413);
  }

  let json: unknown;
  try {
    json = JSON.parse(rawBody);
  } catch {
    return responseError("El cuerpo JSON no es válido.", 400);
  }
  const parsed = checkoutSchema.safeParse(json);
  if (!parsed.success) {
    return responseError("Revisa los datos de contacto, entrega y pago.", 400);
  }

  const input = parsed.data;
  const uniqueItems = new Map<string, number>();
  for (const item of input.items) {
    uniqueItems.set(
      item.productId,
      (uniqueItems.get(item.productId) || 0) + item.quantity,
    );
  }
  if ([...uniqueItems.values()].some((quantity) => quantity > 20)) {
    return responseError("La cantidad solicitada excede el límite por producto.", 400);
  }

  const admin = getSupabaseAdmin();
  const fingerprint = getRequestFingerprint(request);
  const { data: withinLimit, error: rateLimitError } = await admin.rpc(
    "check_submission_rate_limit",
    {
      p_fingerprint: fingerprint,
      p_scope: "store-checkout",
      p_limit: 8,
      p_window_seconds: 900,
    },
  );
  if (rateLimitError) {
    console.error("checkout_rate_limit_error", rateLimitError.message);
    return responseError("No pudimos validar la solicitud. Intenta nuevamente.", 503);
  }
  if (withinLimit !== true) {
    return responseError("Demasiados intentos. Espera unos minutos.", 429);
  }

  const { data: existingOrder, error: existingError } = await admin
    .from("store_orders")
    .select("id,order_number,payment_state")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existingError) {
    console.error("checkout_idempotency_lookup_error", existingError.message);
    return responseError("No pudimos iniciar el pedido.", 503);
  }
  if (existingOrder) {
    if (["paid", "authorized"].includes(existingOrder.payment_state)) {
      return NextResponse.json({ orderNumber: existingOrder.order_number });
    }
    return responseError(
      "Este intento de pago ya está siendo validado. Revisa tu correo antes de volver a intentar.",
      409,
    );
  }

  const productIds = [...uniqueItems.keys()];
  const { data: catalogueData, error: catalogueError } = await admin
    .from("store_products")
    .select(
      "id,slug,sku,model,name,short_name,price_minor,stock_quantity,allow_backorder,status,commercial_status,shipping_class",
    )
    .in("id", productIds);
  if (catalogueError) {
    console.error("checkout_catalogue_error", catalogueError.message);
    return responseError("No pudimos validar el catálogo.", 503);
  }

  const catalogue = (catalogueData || []) as CatalogueRow[];
  if (catalogue.length !== productIds.length) {
    return responseError("Uno de los productos ya no está disponible.", 409);
  }

  const catalogueById = new Map(catalogue.map((product) => [product.id, product]));
  const unavailable = [...uniqueItems].some(([productId, quantity]) => {
    const product = catalogueById.get(productId);
    return (
      !product ||
      product.status !== "active" ||
      product.commercial_status !== "approved" ||
      product.price_minor === null ||
      product.stock_quantity < quantity
    );
  });
  if (unavailable) {
    return responseError(
      "El precio o stock de uno de los productos cambió. Actualiza el carrito.",
      409,
    );
  }
  const orderItems = [...uniqueItems].map(([productId, quantity]) => {
    const product = catalogueById.get(productId)!;
    if (product.price_minor === null) {
      throw new Error("validated_product_without_price");
    }
    return {
      product_id: product.id,
      sku: product.sku,
      name: product.name,
      quantity,
      unit_price_minor: product.price_minor,
      discount_minor: 0,
      product_snapshot: {
        slug: product.slug,
        sku: product.sku,
        model: product.model,
        name: product.name,
        short_name: product.short_name,
        shipping_class: product.shipping_class,
      },
    };
  });

  const subtotalMinor = orderItems.reduce(
    (sum, item) => sum + item.unit_price_minor * item.quantity,
    0,
  );
  let shippingMinor = calculateOnlineShippingMinor(subtotalMinor);
  let discountMinor = 0;

  let userId: string | null = null;
  try {
    userId = (await getCurrentUser())?.id || null;
  } catch {
    // Guest checkout remains available if no authenticated session is present.
  }

  if (input.couponCode) {
    const couponQuote = await admin.rpc("quote_store_coupon", {
      p_code: input.couponCode,
      p_subtotal_minor: subtotalMinor,
      p_shipping_minor: shippingMinor,
      p_user_id: userId,
      p_email: input.customer.email,
    });
    if (couponQuote.error) {
      const unavailable = /coupon_(invalid|limit_reached|customer_limit_reached)/.test(
        couponQuote.error.message,
      );
      return responseError(
        unavailable
          ? "El cupón ya no está vigente o no aplica a este pedido."
          : "No pudimos validar el cupón.",
        unavailable ? 422 : 503,
      );
    }
    const quote = couponQuote.data as {
      discount_minor?: number;
      shipping_minor?: number;
    };
    discountMinor = Number(quote.discount_minor || 0);
    shippingMinor = Number(quote.shipping_minor ?? shippingMinor);
    if (
      !Number.isSafeInteger(discountMinor) ||
      !Number.isSafeInteger(shippingMinor) ||
      discountMinor < 0 ||
      shippingMinor < 0
    ) {
      return responseError("La respuesta del cupón no es válida.", 503);
    }
  }

  const totalMinor = subtotalMinor - discountMinor + shippingMinor;
  const taxMinor = Math.round((totalMinor * 18) / 118);
  if (totalMinor !== input.expectedTotalMinor) {
    return responseError(
      "El total del pedido cambió. Revisa el resumen antes de pagar.",
      409,
    );
  }

  const orderPayload = {
    user_id: userId,
    email: input.customer.email,
    phone: input.customer.phone,
    customer_name: `${input.customer.firstName} ${input.customer.lastName}`,
    document_type: input.customer.documentType,
    document_number: input.customer.documentNumber,
    subtotal_minor: subtotalMinor,
    discount_minor: discountMinor,
    shipping_minor: shippingMinor,
    tax_minor: taxMinor,
    total_minor: totalMinor,
    coupon_code: input.couponCode || null,
    shipping_method: input.shipping.method,
    invoice_type: input.invoice.type,
    invoice_data:
      input.invoice.type === "invoice"
        ? { business_name: input.invoice.businessName, ruc: input.invoice.ruc }
        : {},
    idempotency_key: idempotencyKey,
    metadata: {
      request_fingerprint: fingerprint,
      legal_acceptance: {
        accepted_at: new Date().toISOString(),
        locale: "es-PE",
        delivery_window: storeConfig.deliveryWindow,
        privacy_version: input.legalAcceptance.privacyVersion,
        privacy_sha256: getStoreLegalEvidenceSha256(privacyDocument),
        purchase_terms_version: input.legalAcceptance.purchaseTermsVersion,
        purchase_terms_sha256:
          getStoreLegalEvidenceSha256(purchaseTermsDocument),
        fulfilment_version: input.legalAcceptance.fulfilmentVersion,
        fulfilment_sha256: getStoreLegalEvidenceSha256(fulfilmentDocument),
        provider: getStoreLegalProviderSnapshot(),
      },
    },
  };
  const addressPayload = {
    recipient_name: orderPayload.customer_name,
    phone: input.customer.phone,
    address_line_1: input.shipping.addressLine1,
    address_line_2: input.shipping.addressLine2,
    department: input.shipping.department,
    province: input.shipping.province,
    district: input.shipping.district,
    postal_code: input.shipping.postalCode,
    reference: input.shipping.reference,
  };

  const { data: created, error: createError } = await admin
    .rpc("create_store_order", {
      p_order: orderPayload,
      p_items: orderItems,
      p_address: addressPayload,
    })
    .single();
  if (createError || !created) {
    console.error("checkout_create_order_error", createError?.message);
    const conflict = createError?.message.includes("catalog_or_stock_changed");
    return responseError(
      conflict
        ? "El precio o stock cambió. Actualiza el carrito para continuar."
        : "No pudimos crear el pedido.",
      conflict ? 409 : 503,
    );
  }

  const order = created as {
    order_id: string;
    order_number: string;
    payment_id: string;
  };

  try {
    const charge = await createOpenpayCharge({
      sourceId: input.sourceId,
      deviceSessionId: input.deviceSessionId,
      orderId: order.order_id,
      paymentAttemptId: order.payment_id,
      orderNumber: order.order_number,
      amountMinor: totalMinor,
      customer: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        phone: input.customer.phone,
      },
    });
    const snapshot = safeChargeSnapshot(charge);
    const completed = ["completed", "paid"].includes(charge.status);

    const localEventType = completed ? "charge.succeeded" : "charge.pending";
    const eventKey = hashPayload(
      `checkout:${order.payment_id}:${charge.id}:${charge.status}`,
    );
    const storedEvent = await admin
      .from("store_payment_events")
      .insert({
        provider: "openpay",
        event_key: eventKey,
        event_type: localEventType,
        external_payment_id: charge.id,
        payment_id: order.payment_id,
        order_id: order.order_id,
        payload: snapshot,
      })
      .select("id")
      .single();
    if (storedEvent.error || !storedEvent.data) {
      throw storedEvent.error || new Error("No pudimos registrar la respuesta de Openpay.");
    }

    const applied = await admin.rpc("apply_openpay_event", {
      p_event_id: storedEvent.data.id,
      p_event_type: localEventType,
      p_external_payment_id: charge.id,
      p_payment_id: order.payment_id,
      p_amount_minor: Math.round(charge.amount * 100),
      p_currency: charge.currency,
      p_authorization: charge.authorization || null,
      p_card_summary: snapshot.payment_method.card || {},
      p_failure_message: charge.error_message || null,
    });
    if (applied.error) throw applied.error;

    return NextResponse.json(
      {
        orderNumber: order.order_number,
        redirectUrl: charge.payment_method?.url || undefined,
      },
      { status: 201 },
    );
  } catch (caught) {
    const explicitRejection =
      caught instanceof OpenpayError && caught.status >= 400 && caught.status < 500;
    const message =
      caught instanceof Error ? caught.message.slice(0, 500) : "Openpay error";

    if (explicitRejection) {
      const released = await admin.rpc("release_store_order_inventory", {
        p_order_id: order.order_id,
        p_failure_code:
          caught instanceof OpenpayError && caught.code
            ? String(caught.code)
            : null,
        p_failure_message: message,
      });
      if (released.error) {
        console.error("checkout_inventory_release_error", {
          orderId: order.order_id,
          error: released.error.message,
        });
        return responseError(
          `El pago fue rechazado, pero debemos conciliar el pedido ${order.order_number}. No vuelvas a pagar y contacta a soporte.`,
          503,
        );
      }
      return responseError(
        "El pago no fue aprobado. Revisa los datos o intenta con otra tarjeta.",
        402,
      );
    }

    const pendingUpdate = await admin
      .from("store_payments")
      .update({ failure_message: message })
      .eq("id", order.payment_id)
      .in("state", ["pending", "authorized"]);
    if (pendingUpdate.error) {
      console.error("checkout_pending_diagnostic_error", pendingUpdate.error.message);
    }

    console.error("checkout_openpay_unconfirmed", {
      orderId: order.order_id,
      error: message,
    });
    return responseError(
      `No pudimos confirmar el pago del pedido ${order.order_number}. No vuelvas a pagar; revisa tu correo o contacta a soporte.`,
      503,
    );
  }
}
