import Link from "next/link";

const areas=[
  ["01","Dirección técnica","Levantamiento, alcance, coordinación de fabricación, montaje y control de entrega."],
  ["02","Dirección visual","Propuesta, materiales, comunicación del proyecto y continuidad entre diseño y ejecución."]
] as const;

export function AboutSection(){return <section id="nosotros-summary" className="border-t border-white/10 bg-[#07111d] px-6 py-24 text-ca-text lg:px-10"><div className="mx-auto grid max-w-[1440px] gap-10 lg:grid-cols-12"><div className="lg:col-span-5"><span className="text-[10px] uppercase tracking-[.28em] text-brand-gold">Dirección y ejecución</span><h2 className="mt-6 text-4xl font-display font-light uppercase leading-[1.02] md:text-6xl">Un criterio continuo desde la propuesta hasta la entrega.</h2><p className="mt-7 max-w-lg text-sm leading-7 text-ca-text-secondary">La información visual, el alcance técnico y la obra se coordinan dentro de un mismo proceso.</p><Link href="/nosotros" className="mt-8 inline-flex border-b border-brand-gold/50 pb-2 text-[10px] uppercase tracking-[.2em] text-brand-gold">Revisar método <span className="ml-3">↗</span></Link></div><div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:col-span-7">{areas.map(([n,title,text])=><article key={n} className="min-h-[320px] bg-[#0a1724] p-8"><span className="font-mono text-[10px] text-brand-gold">{n}</span><h3 className="mt-20 text-2xl font-display font-light uppercase">{title}</h3><p className="mt-6 border-t border-white/10 pt-6 text-sm leading-7 text-ca-text-secondary">{text}</p></article>)}</div></div></section>;}
export default AboutSection;
