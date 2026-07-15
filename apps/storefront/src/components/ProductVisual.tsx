import {
  BatteryCharging,
  Disc3,
  Drill,
  Gauge,
  Hammer,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { StoreProduct } from "@/data/catalog";

const categoryIcons: Record<StoreProduct["category"], LucideIcon> = {
  inalambricas: Drill,
  "perforacion-demolicion": Hammer,
  "corte-desbaste": Disc3,
  "taller-industria": Gauge,
  limpieza: Sparkles,
  "baterias-accesorios": BatteryCharging,
};

export function ProductVisual({
  product,
  size = "card",
}: {
  product: StoreProduct;
  size?: "card" | "large" | "mini";
}) {
  const Icon = categoryIcons[product.category];

  return (
    <div
      className={`product-visual product-visual--${size} product-visual--${product.tone}`}
      role="img"
      aria-label={`${product.name}, modelo ${product.model}`}
    >
      <span className="product-visual__glow" />
      <span className="product-visual__grid" />
      <span className="product-visual__ring product-visual__ring--one" />
      <span className="product-visual__ring product-visual__ring--two" />
      <Icon className="product-visual__icon" strokeWidth={1.2} aria-hidden="true" />
      <span className="product-visual__model">{product.model}</span>
      <span className="product-visual__brand">DONGCHENG</span>
    </div>
  );
}
