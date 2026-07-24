import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/dal";
import {
  createOpenpayCharge,
  OpenpayError,
  safeChargeSnapshot,
} from "@/lib/openpay/server";
import {
  classifyOpenpayChargeStatus,
  isDefinitiveOpenpayCardRejection,
  isDefinitiveOpenpayNoChargeError,
} from "@/lib/openpay/reconciliation";
import {
  getVerifiedClientIp,
  getRequestFingerprint,
  hashPayload,
  isAllowedStoreOrigin,
} from "@/lib/server/security";
import {
  assertGuestOrderTrackingConfigured,
  createGuestOrderAccessToken,
  GUEST_ORDER_COOKIE,
  guestOrderCookieMaxAge,
} from "@/lib/server/guest-order-access";
import { assertLiveCommerceConfig } from "@/lib/server/live-commerce-config";
import { verifyStoreTurnstile } from "@/lib/server/turnstile";
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
const MAX_STORE_TOTAL_MINOR = 100_000_000;

const checkoutSchema = z.object({
  turnstileToken: shortText(1, 2_048),
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
    documentNumber: shortText(5, 20)
      .regex(/^[A-Za-z0-9-]+$/)
      .transform((value) => value.toUpperCase()),
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
  expectedTotalMinor: z.number().int().positive().max(MAX_STORE_TOTAL_MINOR),
  legalAcceptance: z.object({
    accepted: z.literal(true),
    privacyVersion: z.literal(STORE_LEGAL_VERSIONS.privacy),
    purchaseTermsVersion: z.literal(STORE_LEGAL_VERSIONS.purchaseTerms),
    fulfilmentVersion: z.literal(STORE_LEGAL_VERSIONS.fulfilment),
  }),
});

type CheckoutInput = z.infer<typeof checkoutSchema>;

function checkoutBindingFor(
  input: CheckoutInput,
  normalizedItems: { productId: string; quantity: number }[],
) {
  return hashPayload(
    JSON.stringify({
      items: [...normalizedItems].sort((left, right) =>
        left.productId.localeCompare(right.productId),
      ),
      customer: input.customer,
      shipping: input.shipping,
      invoice: input.invoice,
      couponCode: input.couponCode || null,
      expectedTotalMinor: input.expectedTotalMinor,
      legalAcceptance: input.legalAcceptance,
    }),
  );
}

type CatalogueRow = {
  id: string;
  slug: string;
  sku: string;
  model: string;
  name: string;
  short_name: string;
  price_minor: number | null;
  currency: string;
  tax_rate: number;
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

function safeProviderDiagnostic(caught: unknown) {
  if (caught instanceof OpenpayError) {
    const category = String(caught.category || "")
      .replace(/[^A-Za-z0-9_-]/g, "")
      .slice(0, 80);
    return [
      `Openpay HTTP ${caught.status}`,
      caught.code ? `code ${caught.code}` : "code unknown",
      category ? `category ${category}` : null,
    ]
      .filter(Boolean)
      .join("; ");
  }
  return "Fallo interno al confirmar la respuesta del proveedor";
}

async function flagPaymentReview(
  admin: ReturnType<typeof getSupabaseAdmin>,
  orderId: string,
  paymentId: string,
  reason: string,
) {
  const result = await admin.rpc("flag_store_order_payment_review", {
    p_order_id: orderId,
    p_payment_id: paymentId,
    p_reason: reason.slice(0, 500),
  });
  if (result.error) {
    console.error("checkout_review_flag_error", {
      orderId,
      status: "rpc_failed",
    });
  }
  return String(result.data || "review_not_flagged");
}

function checkoutResponse(
  body: Record<string, unknown>,
  status: number,
  guestAccess?: { token: string; expiresAt: number } | null,
) {
  const response = NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
  if (guestAccess) {
    response.cookies.set(GUEST_ORDER_COOKIE, guestAccess.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: guestOrderCookieMaxAge(guestAccess.expiresAt),
    });
  }
  return response;
}

async function guestAccessForOrder(
  admin: ReturnType<typeof getSupabaseAdmin>,
  orderId: string,
) {
  const result = await admin
    .from("store_order_guest_access")
    .select("nonce,expires_at")
    .eq("order_id", orderId)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .maybeSingle();
  if (result.error || !result.data) return null;
  const expiresAt = Math.floor(new Date(result.data.expires_at).getTime() / 1000);
  const token = createGuestOrderAccessToken({
    orderId,
    nonce: result.data.nonce,
    expiresAt: result.data.expires_at,
  });
  return { token, expiresAt };
}

export async function POST(request: Request) {
  if (storeConfig.preview || process.env.STORE_MODE !== "live") {
    return responseError(
      "La tienda está en modo precomercial y todavía no acepta pagos.",
      503,
    );
  }
  try {
    assertLiveCommerceConfig();
  } catch {
    console.error("checkout_live_configuration_invalid");
    return responseError("La tienda no está configurada para aceptar pagos.", 503);
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
  const clientIp = getVerifiedClientIp(request);
  if (!clientIp) {
    return responseError("No pudimos validar el origen de la compra.", 400);
  }
  try {
    const turnstile = await verifyStoreTurnstile(input.turnstileToken, request);
    if (!turnstile.valid) {
      console.warn("checkout_turnstile_rejected", {
        hostname: turnstile.hostname,
        errors: turnstile.errors,
      });
      return responseError(
        "No pudimos completar la verificación de seguridad. Inténtalo nuevamente.",
        403,
      );
    }
  } catch (caught) {
    console.error(
      "checkout_turnstile_unavailable",
      caught instanceof Error ? caught.message : "verification_failed",
    );
    return responseError("La verificación de seguridad no está disponible.", 503);
  }
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
  const normalizedItems = [...uniqueItems].map(([productId, quantity]) => ({
    productId,
    quantity,
  }));
  const checkoutBinding = checkoutBindingFor(input, normalizedItems);

  const admin = getSupabaseAdmin();
  const fingerprint = getRequestFingerprint(request, "store-checkout");
  let userId: string | null = null;
  try {
    userId = (await getCurrentUser())?.id || null;
  } catch (caught) {
    console.error(
      "checkout_auth_lookup_error",
      caught instanceof Error ? caught.message : "No se pudo leer la sesión",
    );
    return responseError("No pudimos validar la sesión de compra.", 503);
  }
  const { data: withinLimit, error: rateLimitError } = await admin.rpc(
    "check_submission_rate_limit",
    {
      p_fingerprint: fingerprint,
      p_scope: "store-checkout",
      p_limit: 4,
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
    .select("id,order_number,payment_state,user_id,email,metadata")
    .eq("idempotency_key", idempotencyKey)
    .maybeSingle();
  if (existingError) {
    console.error("checkout_idempotency_lookup_error", existingError.message);
    return responseError("No pudimos iniciar el pedido.", 503);
  }
  if (existingOrder) {
    const metadata = existingOrder.metadata as {
      request_fingerprint?: string;
      checkout_binding?: string;
    } | null;
    const sameBinding = metadata?.checkout_binding === checkoutBinding;
    const samePrincipal = existingOrder.user_id
      ? sameBinding && existingOrder.user_id === userId
      : !userId &&
        sameBinding &&
        existingOrder.email.toLowerCase() === input.customer.email &&
        metadata?.request_fingerprint === fingerprint;
    if (!samePrincipal) {
      return responseError(
        "Esta clave de idempotencia ya está vinculada a otra solicitud.",
        409,
      );
    }
    if (["paid", "authorized"].includes(existingOrder.payment_state)) {
      const guestAccess = existingOrder.user_id
        ? null
        : await guestAccessForOrder(admin, existingOrder.id);
      return checkoutResponse(
        {
          orderNumber: existingOrder.order_number,
          trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
        },
        200,
        guestAccess,
      );
    }
    if (existingOrder.payment_state === "failed") {
      const guestAccess = existingOrder.user_id
        ? null
        : await guestAccessForOrder(admin, existingOrder.id);
      return checkoutResponse(
        {
          error: "El intento anterior ya finalizó sin pago. Puedes iniciar un intento nuevo.",
          code: "attempt_failed",
          orderNumber: existingOrder.order_number,
          trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
        },
        422,
        guestAccess,
      );
    }
    if (["refunded", "partially_refunded", "chargeback"].includes(existingOrder.payment_state)) {
      return responseError(
        "Este pedido ya tuvo una resolución de pago. Revísalo en seguimiento antes de comprar nuevamente.",
        409,
      );
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
      "id,slug,sku,model,name,short_name,price_minor,currency,tax_rate,stock_quantity,allow_backorder,status,commercial_status,shipping_class",
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
      !Number.isSafeInteger(product.price_minor) ||
      product.price_minor <= 0 ||
      product.price_minor > MAX_STORE_TOTAL_MINOR ||
      product.currency !== "PEN" ||
      Number(product.tax_rate) !== 0.18 ||
      product.shipping_class !== "standard" ||
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
        currency: product.currency,
        tax_rate: product.tax_rate,
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

  if (!userId) {
    try {
      assertGuestOrderTrackingConfigured();
    } catch (caught) {
      console.error(
        "checkout_guest_tracking_configuration_error",
        caught instanceof Error ? caught.message : "Configuración inválida",
      );
      return responseError("No pudimos preparar el seguimiento del pedido.", 503);
    }
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
  if (
    !Number.isSafeInteger(subtotalMinor) ||
    !Number.isSafeInteger(totalMinor) ||
    totalMinor <= 0 ||
    totalMinor > MAX_STORE_TOTAL_MINOR
  ) {
    return responseError("El total del pedido está fuera del rango permitido.", 422);
  }
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
      checkout_binding: checkoutBinding,
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
    .rpc("create_store_order_v2", {
      p_order: orderPayload,
      p_items: orderItems,
      p_address: addressPayload,
    })
    .single();
  if (createError || !created) {
    console.error("checkout_create_order_error", createError?.message);
    const conflict = createError?.message.includes("catalog_or_stock_changed");
    const pendingLimit = createError?.message.includes(
      "too_many_pending_reservations",
    );
    return responseError(
      pendingLimit
        ? "Ya existen compras pendientes de validación para estos datos. Revisa el seguimiento antes de volver a pagar."
        : conflict
        ? "El precio o stock cambió. Actualiza el carrito para continuar."
        : "No pudimos crear el pedido.",
      pendingLimit ? 429 : conflict ? 409 : 503,
    );
  }

  const order = created as {
    order_id: string;
    order_number: string;
    payment_id: string;
    guest_access_nonce: string | null;
    guest_access_expires_at: string | null;
  };

  let guestAccess: { token: string; expiresAt: number } | null = null;
  if (!userId) {
    if (!order.guest_access_nonce || !order.guest_access_expires_at) {
      const released = await admin.rpc("release_store_order_inventory_v2", {
        p_order_id: order.order_id,
        p_payment_id: order.payment_id,
        p_failure_code: "guest_tracking_unavailable",
        p_failure_message: "No se pudo crear el acceso seguro del pedido invitado.",
      });
      if (released.error) {
        console.error("checkout_guest_tracking_release_error", released.error.message);
      }
      return responseError("No pudimos preparar el seguimiento del pedido.", 503);
    }
    const expiresAt = Math.floor(
      new Date(order.guest_access_expires_at).getTime() / 1000,
    );
    guestAccess = {
      token: createGuestOrderAccessToken({
        orderId: order.order_id,
        nonce: order.guest_access_nonce,
        expiresAt: order.guest_access_expires_at,
      }),
      expiresAt,
    };
  }

  try {
    const charge = await createOpenpayCharge({
      sourceId: input.sourceId,
      deviceSessionId: input.deviceSessionId,
      orderId: order.order_id,
      paymentAttemptId: order.payment_id,
      orderNumber: order.order_number,
      amountMinor: totalMinor,
      customerIp: clientIp,
      customer: {
        firstName: input.customer.firstName,
        lastName: input.customer.lastName,
        email: input.customer.email,
        phone: input.customer.phone,
      },
    });
    const snapshot = safeChargeSnapshot(charge);
    const action = classifyOpenpayChargeStatus(charge.status);

    const localEventType =
      action === "confirm"
        ? "charge.succeeded"
        : action === "reject"
          ? "charge.failed"
          : "charge.pending";
    const eventKey = hashPayload(
      `checkout:${order.payment_id}:${charge.id}:${charge.status}`,
    );
    const applied = await admin.rpc("ingest_and_apply_openpay_event", {
      p_event_key: eventKey,
      p_event_type: localEventType,
      p_external_payment_id: charge.id,
      p_payment_id: order.payment_id,
      p_order_id: order.order_id,
      p_payload: snapshot,
      p_amount_minor: Math.round(charge.amount * 100),
      p_currency: charge.currency,
      p_authorization: charge.authorization || null,
      p_card_summary: snapshot.payment_method.card || {},
      p_failure_message:
        action === "reject" ? `Openpay reportó estado ${charge.status}.` : null,
    });
    if (applied.error) throw applied.error;

    const appliedStatus = String(
      (applied.data as { status?: string } | null)?.status || "",
    );
    const acceptedStatus =
      (action === "confirm" && ["processed", "already_paid"].includes(appliedStatus)) ||
      (action === "reject" && ["processed", "already_failed"].includes(appliedStatus)) ||
      (action === "wait" && appliedStatus === "event_recorded_no_state_change");
    const redirectUrl = charge.payment_method?.url;

    if (!acceptedStatus || (action === "wait" && !redirectUrl)) {
      await flagPaymentReview(
        admin,
        order.order_id,
        order.payment_id,
        `Checkout Openpay requiere revisión: action=${action}; status=${appliedStatus || "missing"}; redirect=${Boolean(redirectUrl)}`,
      );
      console.error("checkout_payment_requires_review", {
        orderId: order.order_id,
        paymentId: order.payment_id,
        action,
        status: appliedStatus || "missing_status",
      });
      return checkoutResponse(
        {
          error: `Recibimos el intento del pedido ${order.order_number}, pero debemos verificarlo manualmente. No vuelvas a pagar; usa el seguimiento o contacta a soporte.`,
          orderNumber: order.order_number,
          trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
        },
        503,
        guestAccess,
      );
    }

    if (action === "reject") {
      return checkoutResponse(
        {
          error: "El pago no fue aprobado. Revisa los datos o intenta con otra tarjeta.",
          code: "attempt_failed",
          orderNumber: order.order_number,
          trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
        },
        402,
        guestAccess,
      );
    }

    return checkoutResponse(
      {
        orderNumber: order.order_number,
        redirectUrl: redirectUrl || undefined,
        trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
      },
      201,
      guestAccess,
    );
  } catch (caught) {
    const explicitRejection =
      caught instanceof OpenpayError &&
      isDefinitiveOpenpayCardRejection(caught.status, caught.code);
    const definitiveNoCharge =
      caught instanceof OpenpayError &&
      isDefinitiveOpenpayNoChargeError(caught.status, caught.code);
    const diagnostic = safeProviderDiagnostic(caught);

    if (explicitRejection || definitiveNoCharge) {
      const released = await admin.rpc("release_store_order_inventory_v2", {
        p_order_id: order.order_id,
        p_payment_id: order.payment_id,
        p_failure_code:
          caught instanceof OpenpayError && caught.code
            ? String(caught.code)
            : null,
        p_failure_message: diagnostic,
      });
      if (released.error || released.data !== true) {
        console.error("checkout_inventory_release_error", {
          orderId: order.order_id,
          error: released.error?.message || "La liberación segura fue rechazada.",
        });
        return responseError(
          `El pago fue rechazado, pero debemos conciliar el pedido ${order.order_number}. No vuelvas a pagar y contacta a soporte.`,
          503,
        );
      }
      return checkoutResponse(
        {
          error: definitiveNoCharge
            ? "El token de pago no pudo utilizarse. Actualiza el checkout e inténtalo nuevamente."
            : "El pago no fue aprobado. Revisa los datos o intenta con otra tarjeta.",
          code: "attempt_failed",
          orderNumber: order.order_number,
          trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
        },
        definitiveNoCharge ? 422 : 402,
        guestAccess,
      );
    }

    const pendingUpdate = await admin
      .from("store_payments")
      .update({ failure_message: diagnostic })
      .eq("id", order.payment_id)
      .in("state", ["pending", "authorized"]);
    if (pendingUpdate.error) {
      console.error("checkout_pending_diagnostic_error", pendingUpdate.error.message);
    }

    console.error("checkout_openpay_unconfirmed", {
      orderId: order.order_id,
      providerStatus:
        caught instanceof OpenpayError
          ? { http: caught.status, code: caught.code || null }
          : "internal_boundary_failure",
    });
    return checkoutResponse(
      {
        error: `No pudimos confirmar el pago del pedido ${order.order_number}. No vuelvas a pagar; usa el seguimiento o contacta a soporte.`,
        orderNumber: order.order_number,
        trackingUrl: guestAccess ? "/seguimiento/acceso" : undefined,
      },
      503,
      guestAccess,
    );
  }
}
