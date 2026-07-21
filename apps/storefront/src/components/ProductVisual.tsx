import Image from "next/image";
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

export type ProductVisualProduct = Pick<
  StoreProduct,
  "category" | "media" | "tone" | "name" | "model"
>;

const imageSizes = {
  card: "(max-width: 480px) calc(100vw - 1rem), (max-width: 760px) 50vw, (max-width: 1120px) 33vw, 25vw",
  large: "(max-width: 760px) calc(100vw - 2.5rem), 52vw",
  mini: "84px",
} as const;

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
  eager = false,
}: {
  product: ProductVisualProduct;
  size?: "card" | "large" | "mini";
  eager?: boolean;
}) {
  const image = product.media[0];
  const Icon = categoryIcons[product.category];

  if (image) {
    return (
      <div
        className={`product-visual product-visual--${size} product-visual--media`}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes={imageSizes[size]}
          loading={eager ? "eager" : "lazy"}
          fetchPriority={eager ? "high" : "auto"}
          className="product-visual__image"
        />
      </div>
    );
  }

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
