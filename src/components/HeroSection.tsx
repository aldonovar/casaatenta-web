import Image from "next/image";
import Link from "next/link";
import { WHATSAPP_LINK } from "@/constants/contact";

const systems=["Cubierta fija","Corredizo manual","Corredizo motorizado","Iluminación integrada"];

export function HeroSection(){
  return <section id="hero" aria-labelledby="hero-title" className="relative min-h-[780px] overflow-hidden bg-[#07111d] pt-20 text-ca-text lg:min-h-[900px]">
    <div className="absolute inset-0">
      <Image src="/media/hero/hero-desktop-01.webp" alt="Propuesta visual de terraza con estructura, cubierta e iluminación integrada" fill priority sizes="100vw" className="object-cover object-center"/>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,17,29,.98)_0%,rgba(7,17,29,.92)_34%,rgba(7,17,29,.42)_67%,rgba(7,17,29,.14)_100%)]"/>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,17,29,.18)_0%,rgba(7,17,29,.08)_55%,rgba(7,17,29,.9)_100%)]"/>
    </div>

    <div className="relative z-10 mx-auto grid min-h-[700px] max-w-[1440px] items-end px-6 pb-24 pt-20 lg:grid-cols-12 lg:px-10 lg:pb-28">
      <div className="lg:col-span-7 lg:pb-16">
        <div className="mb-7 flex items-center gap-4">
          <span className="text-[10px] uppercase tracking-[.32em] text-brand-gold">Diseño y ejecución residencial · Lima</span>
          <span className="h-px w-14 bg-brand-gold/50"/>
        </div>

        <h1 id="hero-title" className="max-w-4xl text-[clamp(3.4rem,7vw,7.8rem)] font-display font-light uppercase leading-[.9] tracking-[-.025em]">
          Terrazas, cubiertas y control del hogar.
        </h1>

        <p className="mt-8 max-w-2xl text-base leading-7 text-ca-text-secondary md:text-lg md:leading-8">
          Medimos el espacio, definimos estructura y cubierta, integramos iluminación y resolvemos cada encuentro para el uso diario.
        </p>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-14 items-center justify-center bg-brand-gold px-7 text-[10px] font-semibold uppercase tracking-[.22em] text-[#07111d] transition hover:bg-[#e5c98f]">
            Enviar foto y medidas <span className="ml-3" aria-hidden="true">↗</span>
          </a>
          <Link href="/proyectos" className="inline-flex min-h-14 items-center justify-center border border-white/20 bg-[#07111d]/35 px-7 text-[10px] uppercase tracking-[.22em] backdrop-blur-md transition hover:border-white/45 hover:bg-white/5">
            Revisar propuestas
          </Link>
        </div>
      </div>

      <aside className="mt-14 border border-white/12 bg-[#07111d]/72 p-6 backdrop-blur-xl lg:col-span-4 lg:col-start-9 lg:mb-16 lg:mt-0 lg:p-8" aria-label="Sistemas disponibles">
        <div className="flex items-center justify-between border-b border-white/12 pb-4">
          <span className="text-[9px] uppercase tracking-[.24em] text-brand-gold">Configuración del proyecto</span>
          <span className="text-[8px] uppercase tracking-[.18em] text-ca-text/45">Referencial</span>
        </div>
        <ul className="mt-5 space-y-4">
          {systems.map((item,index)=><li key={item} className="flex items-center justify-between gap-4 text-sm text-ca-text/82"><span>{item}</span><span className="text-[9px] font-mono text-brand-gold">0{index+1}</span></li>)}
        </ul>
        <p className="mt-6 border-t border-white/12 pt-5 text-xs leading-6 text-ca-text/50">La solución final depende de medidas, apoyos, orientación y puntos eléctricos disponibles.</p>
      </aside>
    </div>

    <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-[#07111d]/74 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-x-7 gap-y-3 px-6 py-4 text-[8px] uppercase tracking-[.2em] text-ca-text/55 lg:px-10">
        <span>Techos Sol y Sombra</span><span>Terrazas</span><span>Iluminación</span><span>Domótica</span><span>Mantenimiento</span>
      </div>
    </div>
  </section>;
}
export default HeroSection;
