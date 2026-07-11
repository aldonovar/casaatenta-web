const steps=[
  ["01","Levantamiento","Medidas, niveles, apoyos, accesos y registro fotográfico del estado actual."],
  ["02","Propuesta","Distribución, estructura, cubierta, iluminación y sistema de accionamiento."],
  ["03","Presupuesto","Alcance, materiales, condiciones de pago y plazo estimado por escrito."],
  ["04","Fabricación","Corte, preparación de perfiles, piezas, acabados y componentes antes del montaje."],
  ["05","Instalación","Montaje de estructura, cubierta, iluminación y mecanismos según secuencia de obra."],
  ["06","Entrega","Prueba de funcionamiento, revisión de acabados, limpieza y conformidad del cliente."]
] as const;

export function ProcesoSection(){
  return <section id="proceso" className="border-t border-white/10 bg-[#091522] px-6 py-24 text-ca-text md:py-32 lg:px-10">
    <div className="mx-auto max-w-[1440px]">
      <div className="grid gap-8 border-b border-white/10 pb-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <span className="mb-5 block text-[10px] uppercase tracking-[.28em] text-brand-gold">Proceso de trabajo</span>
          <h2 className="max-w-4xl text-4xl font-display font-light uppercase leading-[1.02] md:text-6xl">Medición, diseño y montaje.</h2>
        </div>
        <p className="max-w-xl text-sm leading-7 text-ca-text-secondary lg:col-span-4 lg:col-start-9">La visita técnica define apoyos, niveles, recorrido de cubierta, puntos eléctricos y secuencia de instalación.</p>
      </div>

      <ol className="mt-12 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:grid-cols-3">
        {steps.map(([number,title,text])=><li key={number} className="min-h-[260px] bg-[#07111d] p-7 md:p-8">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <span className="font-mono text-xs text-brand-gold">{number}</span>
            <span className="h-2 w-2 rounded-full border border-brand-gold/60"/>
          </div>
          <h3 className="mt-8 text-xl font-display font-light uppercase tracking-[.06em]">{title}</h3>
          <p className="mt-4 text-sm leading-7 text-ca-text-secondary">{text}</p>
        </li>)}
      </ol>
    </div>
  </section>;
}
export default ProcesoSection;
