import Link from "next/link";
import { Mail, MapPin, MessageCircle, ShieldCheck } from "lucide-react";
import { categories } from "@/data/catalog";
import { storeConfig } from "@/lib/store-config";
import { StoreLogo } from "./StoreLogo";

export function StoreFooter() {
  return (
    <footer className="store-footer">
      <div className="store-container store-footer__service">
        <div>
          <span><MessageCircle size={20} /></span>
          <p><strong>¿No sabes qué equipo elegir?</strong> Un asesor compara potencia, uso y compatibilidad contigo.</p>
        </div>
        <a href={storeConfig.whatsapp} target="_blank" rel="noreferrer" className="button button--light">
          Hablar con un asesor
        </a>
      </div>
      <div className="store-container store-footer__grid">
        <div className="store-footer__brand">
          <StoreLogo />
          <p>
            Maquinaria, herramientas y repuestos seleccionados con criterio técnico,
            logística transparente y posventa que sí responde.
          </p>
          <div className="store-footer__contact">
            <a href={`mailto:${storeConfig.supportEmail}`}><Mail size={16} /> {storeConfig.supportEmail}</a>
            <span><MapPin size={16} /> {storeConfig.legal.address || "Lima, Perú · ventas aún desactivadas"}</span>
          </div>
          <p className="store-footer__identity">{storeConfig.legal.holderName} · {storeConfig.legal.tradeName} · RUC {storeConfig.legal.ruc}</p>
        </div>
        <div>
          <h3>Comprar</h3>
          {categories.slice(0, 5).map((category) => (
            <Link key={category.slug} href={`/catalogo?categoria=${category.slug}`}>
              {category.shortName}
            </Link>
          ))}
        </div>
        <div>
          <h3>Tu cuenta</h3>
          <Link href="/auth/ingresar">Ingresar o registrarme</Link>
          <Link href="/cuenta/pedidos">Mis pedidos</Link>
          <Link href="/seguimiento">Seguir compra invitada</Link>
          <Link href="/cuenta/direcciones">Direcciones</Link>
          <Link href="/cuenta/seguridad">Seguridad y 2FA</Link>
        </div>
        <div>
          <h3>Ayuda y posventa</h3>
          <Link href="/legal/envios-cambios-y-garantias">Envíos, cambios y garantía</Link>
          <Link href="/ayuda">Centro de ayuda</Link>
          <Link href="/libro-de-reclamaciones">Libro de Reclamaciones</Link>
        </div>
      </div>
      <div className="store-container store-footer__bottom">
        <span>© {new Date().getFullYear()} Casa Atenta. Todos los derechos reservados.</span>
        <div>
          <Link href="/legal/privacidad">Privacidad</Link>
          <Link href="/legal/terminos-de-compra">Términos de compra</Link>
          <Link href="/legal/cookies">Cookies</Link>
          <span><ShieldCheck size={14} /> Pago protegido por Openpay</span>
        </div>
      </div>
    </footer>
  );
}
