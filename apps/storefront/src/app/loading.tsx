import { LoaderCircle } from "lucide-react";

export default function StoreLoading() {
  return (
    <section className="store-state-page" role="status" aria-live="polite">
      <div>
        <span className="store-state-page__icon is-loading"><LoaderCircle size={31} /></span>
        <span className="eyebrow">Casa Atenta Tienda</span>
        <h1>Preparando esta sección…</h1>
        <p>Estamos cargando la información más reciente.</p>
      </div>
    </section>
  );
}
