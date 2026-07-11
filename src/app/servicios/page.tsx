import type { Metadata } from "next";
import Link from "next/link";
import { ServiciosGridSection } from "@/components/ServiciosGridSection";
import { ProcesoSection } from "@/components/ProcesoSection";
import { CTAFinal } from "@/components/CTAFinal";

export const metadata: Metadata={title:"Servicios | Techos, terrazas, iluminación y domótica | Casa Atenta",description:"Techos Sol y Sombra, terrazas, iluminación, domótica y mantenimiento residencial en Lima."};

export default function ServiciosPage(){return <main className="min-h-screen bg-[#07111d] pt-20 text-ca-text"><section className="border-b border-white/10 px-6 py-20 lg:px-10 lg:py-28"><div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12 lg:items-end"><div className="lg:col-span-8"><span className="text-[10px] uppercase tracking-[.28em] text-brand-gold">Servicios / Lima</span><h1 className="mt-6 max-w-5xl text-5xl font-display font-light uppercase leading-[.95] md:text-7xl">Intervenciones para exteriores, iluminación y control del hogar.</h1></div><div className="lg:col-span-4"><p className="text-sm leading-7 text-ca-text-secondary">Cada alcance se define después de revisar medidas, apoyos, orientación, instalaciones existentes y forma de uso.</p><Link href="/contacto" className="mt-7 inline-flex border-b border-brand-gold/60 pb-2 text-[10px] uppercase tracking-[.2em] text-brand-gold">Solicitar evaluación <span className="ml-3" aria-hidden="true">↗</span></Link></div></div></section><ServiciosGridSection/><ProcesoSection/><CTAFinal/></main>;}