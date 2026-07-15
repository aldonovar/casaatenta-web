import Link from "next/link";
import { WHATSAPP_LINK } from "@/constants/contact";
import { BLOG_URL, SITE_URL } from "@/lib/urls";
import { BrandText } from "./BrandText";
import { Logo } from "./Logo";

const STORE_URL = process.env.NEXT_PUBLIC_STORE_URL || "https://tienda.casa-atenta.com";

const nav = [
  ["Automatización", `${SITE_URL}/servicios/smart-homes`],
  ["Servicios", `${SITE_URL}/servicios`],
  ["Tienda", STORE_URL],
  ["Proyectos", `${SITE_URL}/proyectos`],
  ["Proceso", `${SITE_URL}/proceso`],
  ["Nosotros", `${SITE_URL}/nosotros`],
  ["Editorial", BLOG_URL],
  ["Contacto", `${SITE_URL}/contacto`],
] as const;

const services = [
  "Automatización del hogar",
  "Iluminación inteligente",
  "Techos Sol y Sombra",
  "Diseño de terrazas",
  "Mantenimiento y acabados",
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-ca-border bg-[#06101b] px-6 pb-8 pt-20 text-ca-text lg:px-10">
      <svg viewBox="0 0 800 360" aria-hidden="true" className="pointer-events-none absolute bottom-0 right-0 w-[720px] max-w-[78vw] fill-none stroke-brand-gold/15">
        <rect x="80" y="70" width="640" height="220" />
        <path d="M80 290L220 170H580L720 290M220 170V290M580 170V290" />
        <circle cx="400" cy="225" r="88" strokeDasharray="7 10" />
      </svg>

      <div className="relative z-10 mx-auto max-w-[1440px]">
        <div className="grid gap-12 border-b border-ca-border pb-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Link href={SITE_URL} aria-label="Casa Atenta">
              <Logo className="h-11 w-auto" />
            </Link>
            <h2 className="mt-8 font-display text-4xl font-light uppercase leading-[.95] md:text-5xl">
              <BrandText>Tu hogar responde.</BrandText>
            </h2>
            <p className="mt-6 max-w-md text-sm leading-7 text-ca-text-secondary">
              Automatización residencial por etapas para iluminación, sensores, accesos y rutinas. Arquitectura exterior, cubiertas y acabados se integran según el proyecto.
            </p>
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex border-b border-brand-gold/60 pb-2 font-mono text-[10px] uppercase tracking-[.2em] text-brand-gold">
              Definir qué debe responder <span className="ml-3" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="lg:col-span-3">
            <span className="font-mono text-[9px] uppercase tracking-[.22em] text-brand-gold">Navegación</span>
            <nav className="mt-6 grid gap-3" aria-label="Pie de página">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-ca-text-secondary transition hover:text-brand-gold">
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-4">
            <span className="font-mono text-[9px] uppercase tracking-[.22em] text-brand-gold">Áreas de trabajo</span>
            <ul className="mt-6 grid gap-3">
              {services.map((item, index) => (
                <li key={item} className="flex items-center justify-between border-b border-ca-border/30 pb-3 text-sm text-ca-text-secondary">
                  <span>{item}</span>
                  <span className="font-mono text-[8px] text-brand-gold">0{index + 1}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-7 font-mono text-[8px] uppercase tracking-[.18em] text-ca-text/40 md:flex-row md:items-center md:justify-between">
          <span>Casa Atenta · Lima, Perú</span>
          <div className="flex flex-wrap gap-5">
            <a href="https://www.instagram.com/casaatenta/" target="_blank" rel="noopener noreferrer">Instagram</a>
            <a href="https://www.tiktok.com/@casaatenta" target="_blank" rel="noopener noreferrer">TikTok</a>
            <a href="https://www.facebook.com/casaatenta" target="_blank" rel="noopener noreferrer">Facebook</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
