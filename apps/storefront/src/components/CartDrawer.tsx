"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { formatMoney } from "@/lib/store-config";
import { ProductVisual } from "./ProductVisual";
import { useCart } from "./CartProvider";

export function CartDrawer() {
  const {
    lines,
    subtotalMinor,
    drawerOpen,
    closeDrawer,
    updateQuantity,
    removeItem,
  } = useCart();
  const drawerRef = useRef<HTMLElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (!drawerOpen) {
      if (wasOpen.current) {
        document.querySelector<HTMLElement>("[data-cart-trigger]")?.focus();
      }
      wasOpen.current = false;
      return;
    }

    wasOpen.current = true;
    const frame = requestAnimationFrame(() =>
      drawerRef.current?.querySelector<HTMLElement>("button, a")?.focus(),
    );
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeDrawer();
        return;
      }
      if (event.key !== "Tab") return;
      const nodes = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a, button, input, [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes?.length) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("keydown", onKeyDown);
    };
  }, [closeDrawer, drawerOpen]);

  return (
    <>
      <button
        type="button"
        className={`cart-backdrop ${drawerOpen ? "is-open" : ""}`}
        onClick={closeDrawer}
        aria-label="Cerrar carrito"
        tabIndex={drawerOpen ? 0 : -1}
      />
      <aside
        ref={drawerRef}
        className={`cart-drawer ${drawerOpen ? "is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!drawerOpen}
        aria-label="Carrito de compras"
        inert={!drawerOpen}
      >
        <div className="cart-drawer__head">
          <div>
            <span className="eyebrow">Tu selección</span>
            <h2>Carrito</h2>
          </div>
          <button className="icon-button" onClick={closeDrawer} aria-label="Cerrar carrito">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="cart-empty">
            <span className="cart-empty__icon"><ShoppingBag size={28} /></span>
            <h3>Tu carrito está listo para empezar</h3>
            <p>Explora herramientas por trabajo, potencia o sistema de batería.</p>
            <Link href="/catalogo" className="button button--dark" onClick={closeDrawer}>
              Ver catálogo
            </Link>
          </div>
        ) : (
          <>
            <div className="cart-drawer__lines">
              {lines.map((line) => (
                <article className="cart-line" key={line.productId}>
                  <ProductVisual product={line.product} size="mini" />
                  <div className="cart-line__body">
                    <span className="cart-line__model">{line.product.model}</span>
                    <Link href={`/producto/${line.product.slug}`} onClick={closeDrawer}>
                      {line.product.shortName}
                    </Link>
                    <strong>{formatMoney(line.lineTotalMinor)}</strong>
                    <div className="quantity-control" aria-label="Cantidad">
                      <button
                        onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                        aria-label="Restar una unidad"
                      >
                        <Minus size={14} />
                      </button>
                      <span>{line.quantity}</span>
                      <button
                        onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                        aria-label="Agregar una unidad"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="cart-line__remove"
                    onClick={() => removeItem(line.productId)}
                    aria-label={`Eliminar ${line.product.shortName}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </article>
              ))}
            </div>
            <div className="cart-drawer__summary">
              <div><span>Subtotal</span><strong>{formatMoney(subtotalMinor)}</strong></div>
              <p>El envío se calcula con tu distrito y el peso del pedido.</p>
              <Link href="/checkout" className="button button--primary" onClick={closeDrawer}>
                Continuar compra
              </Link>
              <Link href="/carrito" className="text-link" onClick={closeDrawer}>
                Revisar carrito completo
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
