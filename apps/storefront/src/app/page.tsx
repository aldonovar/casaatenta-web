import Link from "next/link";
import {
  ArrowRight,
  BatteryCharging,
  Boxes,
  Building2,
  CheckCircle2,
  ChevronRight,
  Disc3,
  Drill,
  Factory,
  Gauge,
  Hammer,
  HardHat,
  PackageSearch,
  Sparkles,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { ProductCard } from "@/components/ProductCard";
import { ProductVisual } from "@/components/ProductVisual";
import { TrustBar } from "@/components/TrustBar";
import { categories, products, type ProductCategorySlug } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";

const categoryIcons: Record<ProductCategorySlug, LucideIcon> = {
  inalambricas: Drill,
  "perforacion-demolicion": Hammer,
  "corte-desbaste": Disc3,
  "taller-industria": Gauge,
  limpieza: Sparkles,
  "baterias-accesorios": BatteryCharging,
};

const jobs = [
  {
    icon: HardHat,
    title: "Construcción y obra",
    text: "Demolición, perforación y corte para concreto y albañilería.",
    href: "/catalogo?uso=construccion",
  },
  {
    icon: Factory,
    title: "Metalmecánica",
    text: "Taladros magnéticos, amoladoras y equipos para fabricación.",
    href: "/catalogo?uso=metalmecanica",
  },
  {
    icon: Building2,
    title: "Instalación y acabados",
    text: "Soluciones portátiles para montaje, carpintería y detalle.",
    href: "/catalogo?uso=instalacion",
  },
  {
    icon: Wrench,
    title: "Taller y mantenimiento",
    text: "Compresión, limpieza y herramientas para continuidad operativa.",
    href: "/catalogo?uso=taller",
  },
];

export default function StoreHomePage() {
  const featured = products.filter((product) => product.featured).slice(0, 5);
  const heroProduct = products[0];
  const secondaryHeroProduct = products[1];

  return (
    <>
      {storeConfig.preview && (
        <div className="preview-notice">
          <div className="store-container">
            <span>Entorno precomercial</span>
            <p>Precios, stock y garantías se validarán con proveedores antes de aceptar pagos.</p>
          </div>
        </div>
      )}

      <section className="store-hero">
        <div className="store-hero__mesh" aria-hidden="true" />
        <div className="store-container store-hero__grid">
          <div className="store-hero__copy">
            <span className="store-hero__eyebrow"><Boxes size={16} /> Catálogo técnico · Perú</span>
            <h1>Potencia para hacer el trabajo <em>bien.</em></h1>
            <p>
              Herramientas y maquinaria profesional con especificaciones claras,
              compatibilidad real y una posventa que acompaña cada equipo.
            </p>
            <div className="store-hero__actions">
              <Link href="/catalogo" className="button button--primary">
                Explorar catálogo <ArrowRight size={18} />
              </Link>
              <Link href="#elige-por-trabajo" className="button store-hero__secondary">
                Elegir por trabajo
              </Link>
            </div>
            <ul className="store-hero__checks">
              <li><CheckCircle2 size={16} /> Compra como invitado o con cuenta</li>
              <li><CheckCircle2 size={16} /> Asesoría antes y después de comprar</li>
            </ul>
          </div>
          <div className="store-hero__visual">
            <div className="store-hero__product-main">
              <ProductVisual product={heroProduct} size="large" eager />
              <div className="store-hero__product-label">
                <span>Selección profesional</span>
                <strong>{heroProduct.shortName}</strong>
                <small>{heroProduct.model}</small>
              </div>
            </div>
            <div className="store-hero__product-float">
              <ProductVisual product={secondaryHeroProduct} size="mini" />
              <p><strong>Obra pesada</strong><span>{secondaryHeroProduct.model}</span></p>
            </div>
            <div className="store-hero__catalog-note">
              <PackageSearch size={19} />
              <p><strong>Catálogo en expansión</strong><span>Dongcheng 2026 + nuevas marcas</span></p>
            </div>
          </div>
        </div>
        <div className="store-container store-hero__signals">
          <div><strong>2026</strong><span>Catálogo Dongcheng localizado</span></div>
          <div><strong>20 V</strong><span>Ecosistema compatible</span></div>
          <div><strong>Openpay</strong><span>Pago antifraude y 3DS</span></div>
          <div><strong>Postventa</strong><span>Garantía y soporte trazables</span></div>
        </div>
      </section>

      <TrustBar />

      <section className="home-section home-categories">
        <div className="store-container">
          <div className="section-heading">
            <div><span className="eyebrow">Encuentra más rápido</span><h2>Compra por categoría</h2></div>
            <Link href="/catalogo" className="section-heading__link">Ver todo <ArrowRight size={16} /></Link>
          </div>
          <div className="category-grid">
            {categories.map((category) => {
              const Icon = categoryIcons[category.slug];
              const count = products.filter((product) => product.category === category.slug).length;
              return (
                <Link key={category.slug} href={`/catalogo?categoria=${category.slug}`} className="category-card">
                  <span className="category-card__icon" style={{ "--category-accent": category.accent } as React.CSSProperties}>
                    <Icon size={30} strokeWidth={1.5} />
                  </span>
                  <span className="category-card__count">{String(count).padStart(2, "0")} referencias</span>
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <span className="category-card__more">Explorar <ChevronRight size={16} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-section home-products">
        <div className="store-container">
          <div className="section-heading">
            <div><span className="eyebrow">Selección inicial</span><h2>Equipos destacados</h2></div>
            <Link href="/catalogo?destacados=true" className="section-heading__link">Ver destacados <ArrowRight size={16} /></Link>
          </div>
          <div className="product-grid product-grid--five">
            {featured.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <section className="home-section home-jobs" id="elige-por-trabajo">
        <div className="store-container">
          <div className="section-heading section-heading--light">
            <div><span className="eyebrow">Tu trabajo primero</span><h2>¿Qué necesitas resolver?</h2></div>
            <p>Empieza por el material y la tarea. Nosotros ordenamos potencia, formato y accesorios.</p>
          </div>
          <div className="jobs-grid">
            {jobs.map(({ icon: Icon, title, text, href }, index) => (
              <Link href={href} key={title} className="job-card">
                <span className="job-card__number">0{index + 1}</span>
                <Icon size={34} strokeWidth={1.4} />
                <h3>{title}</h3>
                <p>{text}</p>
                <span>Ver equipos <ArrowRight size={16} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section home-platform">
        <div className="store-container home-platform__grid">
          <div className="home-platform__visual">
            <div className="platform-battery"><BatteryCharging size={82} strokeWidth={1.1} /></div>
            <span className="platform-orbit platform-orbit--one"><Drill size={24} /></span>
            <span className="platform-orbit platform-orbit--two"><Disc3 size={24} /></span>
            <span className="platform-orbit platform-orbit--three"><Wrench size={24} /></span>
            <strong>20 V MAX</strong>
            <small>UNA PLATAFORMA · MÚLTIPLES EQUIPOS</small>
          </div>
          <div className="home-platform__copy">
            <span className="eyebrow">Compatibilidad sin dudas</span>
            <h2>Una batería. Más posibilidades.</h2>
            <p>
              La tienda relaciona cada herramienta con sus baterías, cargadores y accesorios
              compatibles. Así evitas duplicar compras o elegir un kit incompleto.
            </p>
            <ul>
              <li><CheckCircle2 size={18} /> Variantes “solo herramienta” y kit bien diferenciadas</li>
              <li><CheckCircle2 size={18} /> Filtros por voltaje, amperaje y batería incluida</li>
              <li><CheckCircle2 size={18} /> Repuestos y consumibles vinculados por modelo</li>
            </ul>
            <Link href="/catalogo?categoria=inalambricas" className="button button--dark">
              Explorar plataforma 20 V <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <section className="store-container home-pro-banner">
        <div>
          <span className="eyebrow">Casa Atenta Pro</span>
          <h2>Compra para tu empresa, obra o taller.</h2>
          <p>Cotizaciones, RUC, pedidos recurrentes, múltiples direcciones y atención por volumen.</p>
          <Link href="/ayuda#empresas" className="button button--light">Conocer cuenta Pro <ArrowRight size={17} /></Link>
        </div>
        <div className="home-pro-banner__art" aria-hidden="true">
          <Boxes size={110} strokeWidth={.8} />
          <span>PRO</span>
        </div>
      </section>
    </>
  );
}
