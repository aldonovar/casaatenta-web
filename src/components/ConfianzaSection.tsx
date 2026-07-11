import { MapPin, Ruler, ShieldCheck } from "lucide-react";

const cards=[
  {icon:ShieldCheck,title:"Alcance documentado",text:"Materiales, condiciones, pagos y plazo se definen antes del inicio."},
  {icon:MapPin,title:"Atención en Lima",text:"Evaluación según distrito, acceso, altura y condiciones del espacio."},
  {icon:Ruler,title:"Supervisión directa",text:"Medidas, fabricación, montaje y entrega se revisan dentro de una misma secuencia."}
] as const;

export function ConfianzaSection(){return <section className="border-t border-white/10 bg-[#07111d] px-6 py-24 text-ca-text lg:px-10" id="confianza"><div className="mx-auto max-w-[1440px]"><div className="mb-12"><span className="text-[10px] uppercase tracking-[.28em] text-brand-gold">Criterios de trabajo</span><h2 className="mt-5 text-4xl font-display font-light uppercase md:text-6xl">Información clara antes de fabricar.</h2></div><div className="grid gap-px border border-white/10 bg-white/10 md:grid-cols-3">{cards.map(({icon:Icon,title,text})=><article key={title} className="bg-[#0a1724] p-7"><Icon className="h-5 w-5 text-brand-gold"/><h3 className="mt-10 text-lg font-display font-light uppercase">{title}</h3><p className="mt-5 border-t border-white/10 pt-5 text-sm leading-7 text-ca-text-secondary">{text}</p></article>)}</div></div></section>;}
export default ConfianzaSection;
