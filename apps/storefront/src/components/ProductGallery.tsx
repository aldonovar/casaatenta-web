"use client";

import Image from "next/image";
import { useId, useState } from "react";
import type { StoreProduct } from "@/data/catalog";
import { ProductVisual } from "./ProductVisual";

export function ProductGallery({
  product,
  discount,
}: {
  product: StoreProduct;
  discount: number;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const stageId = useId();
  const activeImage = product.media[activeIndex] ?? product.media[0];

  if (!activeImage) {
    return (
      <div className="product-gallery">
        <div className="product-gallery__main">
          <ProductVisual product={product} size="large" />
          <GalleryBadges product={product} discount={discount} />
        </div>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      <figure
        className="product-gallery__main"
        id={stageId}
        aria-label={`${product.name}, ${activeImage.label.toLowerCase()}`}
      >
        <Image
          key={activeImage.src}
          src={activeImage.src}
          alt={activeImage.alt}
          fill
          sizes="(max-width: 760px) calc(100vw - 2.5rem), (max-width: 1120px) 54vw, 48vw"
          loading="eager"
          className="product-gallery__image"
        />
        <GalleryBadges product={product} discount={discount} />
        <figcaption className="product-gallery__caption">
          {activeImage.label}
        </figcaption>
      </figure>

      {product.media.length > 1 && (
        <div
          className="product-gallery__thumbs"
          role="group"
          aria-label={`Vistas de ${product.shortName}`}
        >
          {product.media.map((image, index) => {
            const active = index === activeIndex;

            return (
              <button
                type="button"
                key={image.src}
                className={active ? "is-active" : undefined}
                aria-label={`Mostrar ${image.label.toLowerCase()}`}
                aria-controls={stageId}
                aria-pressed={active}
                onClick={() => setActiveIndex(index)}
              >
                <span className="product-gallery__thumb-media">
                  <Image
                    src={image.src}
                    alt=""
                    fill
                    sizes="76px"
                    className="product-gallery__thumb-image"
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GalleryBadges({
  product,
  discount,
}: {
  product: StoreProduct;
  discount: number;
}) {
  if (discount <= 0 && !product.badge) return null;

  return (
    <div className="product-gallery__badges">
      {discount > 0 && <span className="badge badge--sale">-{discount}%</span>}
      {product.badge && <span className="badge">{product.badge}</span>}
    </div>
  );
}
