"use client";

import { Check, MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import type { StoreProduct } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";
import { useCart } from "./CartProvider";

export function AddToCartButton({
  product,
  compact = false,
}: {
  product: StoreProduct;
  compact?: boolean;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const requiresQuote = product.priceMinor === null || product.shippingClass !== "standard";
  const outOfStock = product.stock <= 0;

  if (requiresQuote || outOfStock) {
    const message = encodeURIComponent(
      product.shippingClass !== "standard"
        ? `Hola Casa Atenta, quisiera cotizar ${product.name} (${product.model}) y su despacho.`
        : product.priceMinor === null
          ? `Hola Casa Atenta, quisiera cotizar ${product.name} (${product.model}).`
          : `Hola Casa Atenta, quisiera consultar disponibilidad de ${product.name} (${product.model}).`,
    );
    const url = storeConfig.whatsapp.replace(/\?.*$/, "") + `?text=${message}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`button button--outline ${compact ? "button--compact" : ""}`}
      >
        <MessageCircle size={17} />
        {product.shippingClass !== "standard"
          ? "Cotizar despacho"
          : product.priceMinor === null
            ? "Cotizar"
            : "Consultar stock"}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`button button--primary ${compact ? "button--compact" : ""}`}
      onClick={() => {
        addItem(product.id);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? <Check size={17} /> : <ShoppingBag size={17} />}
      {added ? "Agregado" : compact ? "Agregar" : "Agregar al carrito"}
    </button>
  );
}
