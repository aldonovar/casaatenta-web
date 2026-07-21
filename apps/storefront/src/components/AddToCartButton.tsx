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
  const available = product.priceMinor !== null && product.stock > 0;

  if (!available) {
    const message = encodeURIComponent(
      product.priceMinor === null
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
        {product.priceMinor === null ? "Cotizar" : "Consultar stock"}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={`button button--primary ${compact ? "button--compact" : ""}`}
      onClick={() => {
        addItem(product);
        setAdded(true);
        window.setTimeout(() => setAdded(false), 1600);
      }}
    >
      {added ? <Check size={17} /> : <ShoppingBag size={17} />}
      {added ? "Agregado" : compact ? "Agregar" : "Agregar al carrito"}
    </button>
  );
}
