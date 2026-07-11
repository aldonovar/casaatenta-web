import Link from "next/link";

const founders=[
  {name:"Jhon Febres",role:"Operación y ejecución",text:"Levantamiento, coordinación de obra, fabricación, montaje y control de entrega."},
  {name:"Alexis Espíritu",role:"Dirección visual y estrategia",text:"Marca, propuesta visual, comunicación comercial y desarrollo digital del proyecto."}
] as const;

export function AboutSection(){
  return <section id="nosotros-summary" className="border-t border-white/10 bg-[#07111d] px-6 py-24 text-ca-text md:py-32 lg:px-10">
    <div className="mx-auto max-w-[1440px]">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <span className="mb-5 block text-[10px] uppercase tracking-[.28em] text-brand-gold">Dirección y ejecución</span>
          <h2 className="text-4xl font-display font-light uppercase leading-[1.02] md:text-6xl">Dos áreas, una sola entrega.</h2>
          <p className="mt-7 max-w-lg text-sm leading-7 text-ca-text-secondary">La propuesta visual, el alcance técnico y la ejecución se coordinan desde el inicio para evitar decisiones aisladas durante la obra.</p>
          <Link href="/nosotros" className="mt-8 inline-flex border-b border-brand-gold/50 pb-2 text-[10px] uppercase tracking-[.2em] text-brand-gold">Conocer el equipo <span className="ml-3" aria-hidden="true">↗</span></Link>
        </div>

        <div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-2 lg:col-span-7">
          {founders.map((founder,index)=><article key={founder.name} className="min-h-[360px] bg-[#0a1724] p-8">
            <span className="font-mono text-[10px] text-brand-gold">0{index+1}</span>
            <h3 className="mt-20 text-3xl font-display font-light uppercase tracking-[.04em]">{founder.name}</h3>
            <p className="mt-3 text-[10px] uppercase tracking-[.2em] text-brand-gold">{founder.role}</p>
            <p className="mt-8 border-t border-white/10 pt-6 text-sm leading-7 text-ca-text-secondary">{founder.text}</p>
          </article>)}
        </div>
      </div>
    </div>
  </section>;
}
export default AboutSection;
