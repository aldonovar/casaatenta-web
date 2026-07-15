import Link from "next/link";
import { ArrowUpRight, CircleCheck, Heart } from "lucide-react";
import { discountPercent, type StoreProduct } from "@/data/catalog";
import { formatMoney, storeConfig } from "@/lib/store-config";
import { AddToCartButton } from "./AddToCartButton";
import { ProductVisual } from "./ProductVisual";

export function ProductCard({ product }: { product: StoreProduct }) {
  const discount = discountPercent(product);
  return (
    <article className="product-card">
      <div className="product-card__visual-wrap">
        <Link href={`/producto/${product.slug}`} aria-label={`Ver ${product.name}`}>
          <ProductVisual product={product} />
        </Link>
        <div className="product-card__badges">
          {discount > 0 && <span className="badge badge--sale">-{discount}%</span>}
          {product.badge && <span className="badge">{product.badge}</span>}
        </div>
        <button className="product-card__wish" aria-label="Guardar en favoritos">
          <Heart size={18} />
        </button>
      </div>
      <div className="product-card__body">
        <div className="product-card__meta">
          <span>{product.brand}</span>
          <span>{product.model}</span>
        </div>
        <Link href={`/producto/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>
        <span className="product-card__stock">
          <CircleCheck size={14} /> {product.stock > 0 ? product.stockLabel : "Disponible bajo pedido"}
        </span>
        <div className="product-card__price">
          <strong>{formatMoney(product.priceMinor)}</strong>
          {product.compareAtMinor && <del>{formatMoney(product.compareAtMinor)}</del>}
          {storeConfig.preview && product.priceMinor !== null && <small>Precio referencial</small>}
        </div>
        <div className="product-card__actions">
          <AddToCartButton product={product} compact />
          <Link href={`/producto/${product.slug}`} className="product-card__detail" aria-label="Ver detalle">
            <ArrowUpRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
