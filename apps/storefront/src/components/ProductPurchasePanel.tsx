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

  const quoteMessage = encodeURIComponent(
    `Hola Casa Atenta, quisiera cotizar ${product.name} (${product.model}).`,
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
        <span><CircleCheck size={17} /> {product.stock > 0 ? "Disponible" : "Ingreso programado"}</span>
        <small>{product.stockLabel}</small>
      </div>

      <div className="delivery-checker">
        <div className="delivery-checker__title"><Truck size={18} /><strong>Calcula tu entrega</strong></div>
        <div className="delivery-checker__form">
          <label>
            <MapPin size={16} />
            <select value={district} onChange={(event) => { setDistrict(event.target.value); setDeliveryChecked(false); }}>
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
          <button onClick={() => setDeliveryChecked(Boolean(district))} disabled={!district}>Calcular</button>
        </div>
        {deliveryChecked && (
          <p className="delivery-checker__result">
            <Check size={14} /> El costo y fecha exactos se mostrarán en checkout según peso y dirección.
          </p>
        )}
      </div>

      {product.priceMinor !== null ? (
        <div className="product-buybox__actions">
          <div className="quantity-control quantity-control--large">
            <button onClick={() => setQuantity((value) => Math.max(1, value - 1))} aria-label="Restar cantidad"><Minus size={15} /></button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((value) => Math.min(20, value + 1))} aria-label="Sumar cantidad"><Plus size={15} /></button>
          </div>
          <button
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
          <MessageCircle size={18} /> Solicitar cotización
        </a>
      )}

      <ul className="product-buybox__assurances">
        <li><Check size={14} /> Compra como invitado disponible</li>
        <li><Check size={14} /> Comprobante electrónico</li>
        <li><Check size={14} /> Soporte técnico y trazabilidad de garantía</li>
      </ul>
    </div>
  );
}
