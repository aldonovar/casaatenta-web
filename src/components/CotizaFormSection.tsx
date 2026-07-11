"use client";
import { FormEvent, useState } from "react";
import { createWhatsAppLink } from "@/constants/contact";

const services=["Techo Sol y Sombra","Terraza","Iluminación","Domótica","Mantenimiento","Aún no lo tengo definido"];
const field="w-full border border-white/12 bg-white/[.035] px-4 py-3.5 text-sm text-ca-text outline-none transition placeholder:text-ca-text/35 focus:border-brand-gold/60";

export function CotizaFormSection(){
  const [name,setName]=useState("");
  const [service,setService]=useState(services[0]);
  const [location,setLocation]=useState("");
  const [measures,setMeasures]=useState("");
  const [detail,setDetail]=useState("");

  function submit(event:FormEvent){
    event.preventDefault();
    const message=[
      "Hola Casa Atenta, quiero evaluar un proyecto.",
      name&&`Nombre: ${name}`,
      `Servicio: ${service}`,
      location&&`Distrito o ubicación: ${location}`,
      measures&&`Medidas aproximadas: ${measures}`,
      detail&&`Estado actual / necesidad: ${detail}`,
      "Adjuntaré fotos del espacio en este chat."
    ].filter(Boolean).join("\n");
    window.open(createWhatsAppLink(message),"_blank","noopener,noreferrer");
  }

  return <section id="cotiza" className="border-t border-white/10 bg-[#0a1724] px-6 py-24 text-ca-text md:py-32 lg:px-10">
    <div className="mx-auto grid max-w-[1440px] gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <span className="mb-5 block text-[10px] uppercase tracking-[.28em] text-brand-gold">Evaluación inicial</span>
        <h2 className="text-4xl font-display font-light uppercase leading-[1.02] md:text-6xl">Envíanos una foto y las medidas disponibles.</h2>
        <p className="mt-7 max-w-lg text-sm leading-7 text-ca-text-secondary">Con esa información indicamos el tipo de cubierta, el accionamiento y los datos necesarios para revisar el espacio.</p>
        <div className="mt-10 border-t border-white/10 pt-6 text-xs leading-6 text-ca-text/50">
          <p>Información útil: ancho, largo, altura, distrito, nivel del inmueble y fotos de los apoyos existentes.</p>
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-5 border border-white/10 bg-[#07111d] p-6 md:grid-cols-2 md:p-8 lg:col-span-7" aria-label="Solicitud de evaluación">
        <label className="grid gap-2 text-[9px] uppercase tracking-[.18em] text-ca-text/55">Nombre<input required value={name} onChange={e=>setName(e.target.value)} className={field} placeholder="Nombre y apellido"/></label>
        <label className="grid gap-2 text-[9px] uppercase tracking-[.18em] text-ca-text/55">Servicio<select value={service} onChange={e=>setService(e.target.value)} className={field}>{services.map(item=><option key={item}>{item}</option>)}</select></label>
        <label className="grid gap-2 text-[9px] uppercase tracking-[.18em] text-ca-text/55">Distrito o ubicación<input value={location} onChange={e=>setLocation(e.target.value)} className={field} placeholder="Ej. La Victoria, Lima"/></label>
        <label className="grid gap-2 text-[9px] uppercase tracking-[.18em] text-ca-text/55">Medidas aproximadas<input value={measures} onChange={e=>setMeasures(e.target.value)} className={field} placeholder="Ej. 4.20 m × 3.60 m"/></label>
        <label className="grid gap-2 text-[9px] uppercase tracking-[.18em] text-ca-text/55 md:col-span-2">Estado actual y uso esperado<textarea required rows={5} value={detail} onChange={e=>setDetail(e.target.value)} className={`${field} resize-y`} placeholder="Describe apoyos, cubierta actual, ingreso de agua, sombra, iluminación o uso previsto."/></label>
        <button type="submit" className="min-h-14 bg-brand-gold px-6 text-[10px] font-semibold uppercase tracking-[.22em] text-[#07111d] transition hover:bg-[#e5c98f] md:col-span-2">Abrir consulta en WhatsApp <span className="ml-3" aria-hidden="true">↗</span></button>
        <p className="text-[10px] leading-5 text-ca-text/40 md:col-span-2">WhatsApp se abrirá con los datos escritos. Las fotografías se adjuntan directamente en la conversación.</p>
      </form>
    </div>
  </section>;
}
export default CotizaFormSection;
