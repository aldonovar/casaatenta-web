import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Box,
  Check,
  ChevronRight,
  CircleCheck,
  ExternalLink,
  FileText,
  Headphones,
  Home,
  RotateCcw,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import {
  discountPercent,
  getCategoryBySlug,
  getProductBySlug,
  getRelatedProducts,
  products,
} from "@/data/catalog";
import { getCatalogSources, catalogDataPolicy } from "@/data/catalog-sources";
import { absoluteStoreUrl, storeConfig } from "@/lib/store-config";

type ProductPageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: "Producto no encontrado" };

  return {
    title: `${product.shortName} ${product.model}`,
    description: product.description,
    alternates: { canonical: `/producto/${product.slug}` },
    openGraph: {
      type: "website",
      title: `${product.name} | Casa Atenta Tienda`,
      description: product.description,
      url: absoluteStoreUrl(`/producto/${product.slug}`),
      images: product.media[0]
        ? [{ url: absoluteStoreUrl(product.media[0].src), alt: product.media[0].alt }]
        : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = getCategoryBySlug(product.category);
  const related = getRelatedProducts(product, 4);
  const discount = discountPercent(product);
  const sources = getCatalogSources(product.model);
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    sku: product.sku,
    mpn: product.model,
    brand: { "@type": "Brand", name: product.brand },
    description: product.description,
    image: product.media.map((image) => absoluteStoreUrl(image.src)),
    url: absoluteStoreUrl(`/producto/${product.slug}`),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c") }}
      />
      <section className="product-page">
        <div className="store-container">
          <nav className="breadcrumbs breadcrumbs--dark" aria-label="Migas de pan">
            <Link href="/"><Home size={14} /> Inicio</Link><ChevronRight size={13} />
            <Link href="/catalogo">Catálogo</Link><ChevronRight size={13} />
            <Link href={`/catalogo?categoria=${product.category}`}>{category?.shortName}</Link><ChevronRight size={13} />
            <span>{product.model}</span>
          </nav>

          <div className="product-detail">
            <ProductGallery product={product} discount={discount} />

            <div className="product-summary">
              <div className="product-summary__meta">
                <span>{product.brand}</span><i />
                <span>Modelo {product.model}</span><i />
                <span>SKU {product.sku}</span>
              </div>
              <h1>{product.name}</h1>
              <p className="product-summary__description">{product.description}</p>
              <ul className="product-summary__highlights">
                {product.highlights.map((highlight) => <li key={highlight}><Check size={17} /> {highlight}</li>)}
              </ul>
              <ProductPurchasePanel product={product} />
            </div>
          </div>
        </div>
      </section>

      <section className="product-service-strip">
        <div className="store-container">
          {[
            { icon: Truck, title: "Entrega coordinada", text: `Ventana estimada: ${storeConfig.deliveryWindow}. Costo y condiciones visibles antes del pago.` },
            { icon: ShieldCheck, title: "Garantía trazable", text: "Modelo, serial y atención registrados en tu cuenta." },
            { icon: Headphones, title: "Asesoría técnica", text: "Validamos que potencia y accesorios sean correctos." },
            { icon: RotateCcw, title: "Cambios claros", text: "Proceso digital según estado y motivo del producto." },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title}><Icon size={22} /><p><strong>{title}</strong><span>{text}</span></p></div>
          ))}
        </div>
      </section>

      <section className="store-container product-information">
        <div className="product-information__main">
          <span className="eyebrow">Especificaciones</span>
          <h2>Datos para decidir con criterio.</h2>
          <div className="spec-table">
            {product.specs.map((spec) => <div key={spec.label}><span>{spec.label}</span><strong>{spec.value}</strong></div>)}
            <div><span>Modelo</span><strong>{product.model}</strong></div>
            <div><span>SKU Casa Atenta</span><strong>{product.sku}</strong></div>
            <div><span>Clase de envío</span><strong>{product.shippingClass === "heavy" ? "Equipo pesado" : "Estándar"}</strong></div>
          </div>
          {product.compatibility && (
            <div className="compatibility-note"><Box size={22} /><div><strong>Compatibilidad</strong><p>{product.compatibility}</p></div></div>
          )}
          <div className="product-provenance">
            <div className="product-provenance__heading">
              <span><CircleCheck size={20} /></span>
              <div><strong>Ficha con trazabilidad</strong><p>{catalogDataPolicy.technical}</p></div>
            </div>
            <div className="product-provenance__sources">
              {sources.map((source) => (
                <a href={source.url} target="_blank" rel="noreferrer" key={`${source.publisher}-${source.url}`}>
                  <div><small>{source.kind === "manufacturer" ? "Fabricante" : source.kind === "supplier" ? "Proveedor Perú" : "Contraste local"}</small><strong>{source.label}</strong><span>{source.publisher}{source.version ? ` · ${source.version}` : ""}</span></div>
                  <ExternalLink size={16} />
                </a>
              ))}
            </div>
            <p className="product-provenance__commercial">{catalogDataPolicy.commercial}</p>
          </div>
        </div>
        <aside className="product-information__aside">
          <div className="included-card">
            <span className="eyebrow">Contenido</span>
            <h3>¿Qué incluye?</h3>
            <ul>{product.includes.map((item) => <li key={item}><Check size={15} /> {item}</li>)}</ul>
          </div>
          <div className="document-card">
            <FileText size={24} />
            <div><strong>Ficha y manual</strong><p>Los documentos oficiales se publicarán por modelo antes de la venta.</p></div>
          </div>
        </aside>
      </section>

      <section className="home-section related-products">
        <div className="store-container">
          <div className="section-heading"><div><span className="eyebrow">Completa tu equipo</span><h2>Productos relacionados</h2></div><Link href={`/catalogo?categoria=${product.category}`} className="section-heading__link">Ver categoría <ArrowRight size={16} /></Link></div>
          <div className="product-grid">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div>
        </div>
      </section>
    </>
  );
}
