import Link from "next/link";
import { ArrowRight, SearchX } from "lucide-react";

export default function NotFound() {
  return <section className="not-found"><span><SearchX size={36} /></span><p className="eyebrow">Error 404</p><h1>No encontramos esa página.</h1><p>El producto pudo cambiar de URL o todavía no está publicado.</p><Link href="/catalogo" className="button button--primary">Ir al catálogo <ArrowRight size={17} /></Link></section>;
}
