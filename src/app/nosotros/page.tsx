import Link from "next/link";

const capabilities=[
  ["01","Levantamiento técnico","Medidas, niveles, apoyos, accesos y registro fotográfico antes de definir estructura o instalaciones."],
  ["02","Diseño de intervención","Distribución, cubierta, recorridos, iluminación y acabados coordinados con el espacio existente."],
  ["03","Fabricación y montaje","Preparación de perfiles, componentes y secuencia de instalación con control de encuentros y remates."],
  ["04","Automatización aplicada","Sensores, escenas, iluminación y control integrados por etapas según la infraestructura disponible."]
] as const;

export default function NosotrosPage(){return <main className="min-h-screen bg-[#07111d] pt-32 text-ca-text">
  <section className="border-b border-white/10 px-6 py-20 lg:px-10"><div className="mx-auto max-w-[1440px] grid gap-10 lg:grid-cols-12">
    <div className="lg:col-span-7"><span className="text-[10px] uppercase tracking-[.28em] text-brand-gold">Casa Atenta / Lima</span><h1 className="mt-6 text-5xl font-display font-light uppercase leading-[.95] md:text-7xl">Diseño, ejecución y control en una sola dirección.</h1></div>
    <p className="max-w-xl text-base leading-8 text-ca-text-secondary lg:col-span-4 lg:col-start-9">La propuesta visual, el alcance técnico y la obra se coordinan desde el inicio para reducir improvisaciones y mantener continuidad entre estructura, cubierta, iluminación y acabado.</p>
  </div></section>
  <section className="px-6 py-24 lg:px-10"><div className="mx-auto max-w-[1440px] grid gap-px border border-white/10 bg-white/10 md:grid-cols-2">
    {capabilities.map(([n,title,text])=><article key={n} className="min-h-[300px] bg-[#0a1724] p-8"><span className="font-mono text-[10px] text-brand-gold">{n}</span><h2 className="mt-16 text-2xl font-display font-light uppercase tracking-[.04em]">{title}</h2><p className="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-ca-text-secondary">{text}</p></article>)}
  </div></section>
  <section className="border-y border-white/10 bg-[#0a1724] px-6 py-20 lg:px-10"><div className="mx-auto max-w-[1440px] grid gap-10 lg:grid-cols-12"><h2 className="text-4xl font-display font-light uppercase lg:col-span-5">Criterios de trabajo.</h2><ul className="grid gap-4 text-sm leading-7 text-ca-text-secondary lg:col-span-6 lg:col-start-7"><li>Medir antes de diseñar.</li><li>Definir apoyos y recorridos antes de fabricar.</li><li>Clasificar cada imagen como referencia, propuesta o avance.</li><li>Documentar alcance, materiales, pagos y tiempos antes de iniciar.</li></ul></div></section>
  <section className="px-6 py-24 text-center lg:px-10"><p className="mx-auto max-w-2xl text-lg leading-8 text-ca-text-secondary">Envíanos una foto, medidas aproximadas y distrito. Con esa información indicamos qué datos faltan para evaluar el espacio.</p><Link href="/contacto" className="mt-8 inline-flex min-h-14 items-center justify-center bg-brand-gold px-8 text-[10px] font-semibold uppercase tracking-[.22em] text-[#07111d]">Solicitar evaluación</Link></section>
</main>;}
