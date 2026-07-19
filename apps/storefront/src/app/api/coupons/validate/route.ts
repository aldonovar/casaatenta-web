import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/dal";
import { getRequestFingerprint, isAllowedStoreOrigin } from "@/lib/server/security";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { calculateOnlineShippingMinor } from "@/lib/store-shipping";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const couponSchema = z.object({
  code: z.string().trim().toUpperCase().regex(/^[A-Z0-9_-]{3,40}$/),
  email: z.string().trim().toLowerCase().email().max(254).optional(),
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().int().min(1).max(20),
  })).min(1).max(50),
});

type ProductRow = {
  id: string;
  price_minor: number | null;
  currency: string;
  tax_rate: number;
  shipping_class: string;
  stock_quantity: number;
  status: string;
  commercial_status: string;
};

function reply(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store, max-age=0" },
  });
}

export async function POST(request: Request) {
  if (!isAllowedStoreOrigin(request)) return reply({ error: "Origen no permitido." }, 403);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return reply({ error: "Formato no permitido." }, 415);
  }
  const rawBody = await request.text();
  if (Buffer.byteLength(rawBody, "utf8") > 16_384) {
    return reply({ error: "Solicitud demasiado grande." }, 413);
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return reply({ error: "JSON inválido." }, 400);
  }
  const parsed = couponSchema.safeParse(payload);
  if (!parsed.success) return reply({ error: "Revisa el código del cupón." }, 400);

  const quantities = new Map<string, number>();
  for (const item of parsed.data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
  }
  if ([...quantities.values()].some((quantity) => quantity > 20)) {
    return reply({ error: "La cantidad excede el límite permitido." }, 400);
  }

  const admin = getSupabaseAdmin();
  const fingerprint = getRequestFingerprint(request, "store-coupon");
  const limited = await admin.rpc("check_submission_rate_limit", {
    p_fingerprint: fingerprint,
    p_scope: "store-coupon",
    p_limit: 30,
    p_window_seconds: 900,
  });
  if (limited.error) return reply({ error: "No pudimos validar el cupón." }, 503);
  if (limited.data !== true) return reply({ error: "Demasiados intentos. Espera unos minutos." }, 429);

  const catalogueResult = await admin
    .from("store_products")
    .select("id,price_minor,currency,tax_rate,shipping_class,stock_quantity,status,commercial_status")
    .in("id", [...quantities.keys()]);
  if (catalogueResult.error) return reply({ error: "No pudimos validar el catálogo." }, 503);
  const products = (catalogueResult.data || []) as ProductRow[];
  if (products.length !== quantities.size) return reply({ error: "El carrito cambió." }, 409);

  let subtotalMinor = 0;
  for (const product of products) {
    const quantity = quantities.get(product.id) || 0;
    if (
      product.status !== "active" ||
      product.commercial_status !== "approved" ||
      product.price_minor === null ||
      !Number.isSafeInteger(product.price_minor) ||
      product.price_minor <= 0 ||
      product.currency !== "PEN" ||
      Number(product.tax_rate) !== 0.18 ||
      product.shipping_class !== "standard" ||
      product.stock_quantity < quantity
    ) {
      return reply({ error: "Actualiza el carrito antes de aplicar el cupón." }, 409);
    }
    subtotalMinor += product.price_minor * quantity;
  }

  let userId: string | null = null;
  try {
    userId = (await getCurrentUser())?.id || null;
  } catch (caught) {
    console.error(
      "coupon_auth_lookup_error",
      caught instanceof Error ? caught.message : "No se pudo leer la sesión",
    );
    return reply({ error: "No pudimos validar la sesión del cupón." }, 503);
  }
  const shippingMinor = calculateOnlineShippingMinor(subtotalMinor);
  const quote = await admin.rpc("quote_store_coupon", {
    p_code: parsed.data.code,
    p_subtotal_minor: subtotalMinor,
    p_shipping_minor: shippingMinor,
    p_user_id: userId,
    p_email: parsed.data.email || null,
  });

  if (quote.error) {
    const unavailable = /coupon_(invalid|limit_reached|customer_limit_reached)/.test(quote.error.message);
    return reply(
      { error: unavailable ? "El cupón no está vigente o no aplica a este pedido." : "No pudimos validar el cupón." },
      unavailable ? 422 : 503,
    );
  }

  return reply({ valid: true, ...(quote.data as Record<string, unknown>) });
}
