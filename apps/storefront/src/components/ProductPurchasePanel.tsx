"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  CircleCheck,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { StoreProduct } from "@/data/catalog";
import { formatMoney, storeConfig } from "@/lib/store-config";
import { useCart } from "./CartProvider";

export function ProductPurchasePanel({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [district, setDistrict] = useState("");
  const [deliveryChecked, setDeliveryChecked] = useState(false);
  const [added, setAdded] = useState(false);
  const available =
    product.priceMinor !== null &&
    product.stock > 0 &&
    product.shippingClass === "standard";
  const maximumQuantity = Math.max(1, Math.min(20, product.stock));

  const quoteMessage = encodeURIComponent(
    product.shippingClass !== "standard"
      ? `Hola Casa Atenta, quisiera cotizar ${product.name} (${product.model}) y su despacho.`
      : product.priceMinor === null
        ? `Hola Casa Atenta, quisiera cotizar ${product.name} (${product.model}).`
        : `Hola Casa Atenta, quisiera consultar disponibilidad de ${product.name} (${product.model}).`,
  );
  const quoteUrl = storeConfig.whatsapp.replace(/\?.*$/, "") + `?text=${quoteMessage}`;

  return (
    <div className="product-buybox">
      {product.badge && <span className="product-buybox__badge">{product.badge}</span>}
      <div className="product-buybox__price">
        <strong>{formatMoney(product.priceMinor)}</strong>
        {product.compareAtMinor && <del>{formatMoney(product.compareAtMinor)}</del>}
        {storeConfig.preview && product.priceMinor !== null && (
          <small>Precio referencial con IGV · pendiente de validación comercial</small>
        )}
      </div>

      <div className="product-buybox__availability">
        <span><CircleCheck size={17} /> {product.stock > 0 ? "Disponible" : "Consulta disponibilidad"}</span>
        <small>{product.stockLabel}</small>
      </div>

      <div className="delivery-checker">
        <div className="delivery-checker__title"><Truck size={18} /><strong>Calcula tu entrega</strong></div>
        <div className="delivery-checker__form">
          <label>
            <MapPin size={16} />
            <select aria-label="Zona de entrega" value={district} onChange={(event) => { setDistrict(event.target.value); setDeliveryChecked(false); }}>
              <option value="">Selecciona tu zona</option>
              <option value="lima-centro">Lima Centro</option>
              <option value="lima-norte">Lima Norte</option>
              <option value="lima-sur">Lima Sur</option>
              <option value="lima-este">Lima Este</option>
              <option value="callao">Callao</option>
              <option value="provincia">Otra provincia</option>
            </select>
            <ChevronDown size={15} />
          </label>
          <button type="button" onClick={() => setDeliveryChecked(Boolean(district))} disabled={!district}>Calcular</button>
        </div>
        {deliveryChecked && (
          <p className="delivery-checker__result">
            <Check size={14} /> El checkout online cubre Lima y Callao. Para provincias confirmamos tarifa y fecha antes de cobrar.
          </p>
        )}
      </div>

      {available ? (
        <div className="product-buybox__actions">
          <div className="quantity-control quantity-control--large">
            <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Restar cantidad"><Minus size={15} /></button>
            <span>{quantity}</span>
            <button type="button" onClick={() => setQuantity((value) => Math.min(maximumQuantity, value + 1))} aria-label="Sumar cantidad"><Plus size={15} /></button>
          </div>
          <button
            type="button"
            className="button button--primary"
            onClick={() => {
              addItem(product.id, quantity);
              setAdded(true);
              window.setTimeout(() => setAdded(false), 1600);
            }}
          >
            {added ? <Check size={18} /> : <ShoppingBag size={18} />}
            {added ? "Agregado al carrito" : "Agregar al carrito"}
          </button>
        </div>
      ) : (
        <a href={quoteUrl} target="_blank" rel="noreferrer" className="button button--primary product-buybox__quote">
          <MessageCircle size={18} /> {product.shippingClass !== "standard" ? "Cotizar despacho" : product.priceMinor === null ? "Solicitar cotización" : "Consultar disponibilidad"}
        </a>
      )}

      <ul className="product-buybox__assurances">
        <li><Check size={14} /> Total y entrega confirmados antes del cobro</li>
        <li><Check size={14} /> Pago tokenizado directamente por Openpay</li>
        <li><Check size={14} /> Soporte técnico identificado por modelo y pedido</li>
      </ul>
    </div>
  );
}
