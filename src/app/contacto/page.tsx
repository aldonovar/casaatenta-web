"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowRight, MessageSquare, Check, Mail, Phone, MapPin, Clock } from "lucide-react";
import { BrandText } from "@/components/BrandText";
import { SectionHeading } from "@/components/SectionHeading";
import { WHATSAPP_LINK } from "@/constants/contact";

export default function ContactoPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "residencial",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // Reveal anims
      gsap.fromTo(
        ".contact-reveal",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const socials = [
    { name: "Instagram", handle: "@casaatenta", url: "https://www.instagram.com/casaatenta/" },
    { name: "TikTok", handle: "@casaatenta", url: "https://www.tiktok.com/@casaatenta" },
    { name: "Facebook", handle: "casaatenta", url: "https://www.facebook.com/casaatenta" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", phone: "", projectType: "residencial", message: "" });
    }, 4000);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-ca-bg-deep pt-36 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-5 architectural-grid pointer-events-none" />
      <div className="absolute left-1/3 top-1/4 h-[400px] w-[400px] rounded-full bg-brand-gold opacity-[0.02] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24 relative z-10">
        
        {/* Header */}
        <div className="max-w-3xl mb-16 contact-reveal">
          <SectionHeading
            number="05"
            label="Contacto"
            title="AGNDA TU CITA Y EVALÚA TU OBRA"
            subtitle="Escríbenos para agendar una sesión virtual de revisión de planos o una reunión presencial en obra."
          />
        </div>

        {/* Split grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch contact-reveal">
          {/* Left Form */}
          <div className="lg:col-span-7 glass-card p-8 md:p-10 rounded-xl flex flex-col justify-between border border-ca-border bg-ca-bg-surface/10">
            {submitted ? (
              <div className="my-auto text-center space-y-6 py-12 animate-pulse">
                <div className="w-16 h-16 border border-brand-gold rounded-full flex items-center justify-center mx-auto bg-ca-bg-deep">
                  <Check size={28} className="text-brand-gold" />
                </div>
                <h3 className="text-xl font-display font-light text-ca-text uppercase tracking-wide">
                  <BrandText>Mensaje Enviado</BrandText>
                </h3>
                <p className="text-xs font-sans text-ca-text-secondary max-w-sm mx-auto leading-relaxed">
                  Gracias por escribirnos. Un director técnico se pondrá en contacto contigo en las próximas 24 horas para revisar los planos y viabilidad.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center font-mono text-[9px] text-brand-gold uppercase tracking-widest border-b border-ca-border pb-3 font-semibold">
                  <span>FORMULARIO DE CONTACTO</span>
                  <span>REG-MAILING</span>
                </div>
                
                {/* Form fields here */}


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono tracking-widest text-ca-text/60 uppercase block">
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Alexis Ruiz"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3.5 text-xs font-mono text-ca-text outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono tracking-widest text-ca-text/60 uppercase block">
                      Teléfono / WhatsApp
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +51 908 550 942"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3.5 text-xs font-mono text-ca-text outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono tracking-widest text-ca-text/60 uppercase block">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. contacto@casaatenta.pe"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3.5 text-xs font-mono text-ca-text outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Project Type */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-mono tracking-widest text-ca-text/60 uppercase block">
                      Tipo de Proyecto
                    </label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3.5 text-xs font-mono text-brand-gold tracking-widest outline-none transition-all duration-300 uppercase cursor-pointer"
                    >
                      <option value="residencial" className="bg-ca-bg-surface text-ca-text">Residencial Alta Gama</option>
                      <option value="pabellon" className="bg-ca-bg-surface text-ca-text">Pabellones / Terrazas</option>
                      <option value="wellness" className="bg-ca-bg-surface text-ca-text">Wellness / Spa</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-[9px] font-mono tracking-widest text-ca-text/60 uppercase block">
                    Cuéntanos sobre tu obra (Estado de planos, constructor, etc.)
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ej. Estoy en etapa de planos civiles con el estudio X. Quisiera integrar iluminación circadiana y control inteligente por WhatsApp."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3.5 text-xs font-mono text-ca-text outline-none transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="glow-btn w-full py-4 text-[10px] tracking-widest font-mono uppercase border border-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-dark transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer font-semibold"
                >
                  <span>
                    <BrandText>Enviar Propuesta de Consulta</BrandText>
                  </span>
                  <ArrowRight size={13} />
                </button>
              </form>
            )}
          </div>

          {/* Right contacts */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* WhatsApp Box */}
            <div className="glass-card p-8 rounded-xl flex flex-col justify-between flex-1 border border-brand-gold/25 bg-brand-gold/[0.01]">
              <div className="space-y-4">
                <div className="flex justify-between items-center font-mono text-[9px] text-brand-gold uppercase tracking-widest border-b border-brand-gold/15 pb-2 font-semibold">
                  <span>Contacto Directo</span>
                  <span>WA-CHANNEL</span>
                </div>
                <div className="w-10 h-10 border border-brand-gold/25 flex items-center justify-center rounded bg-ca-bg-deep mb-4">
                  <MessageSquare size={18} className="text-brand-gold" />
                </div>
                <h3 className="text-lg font-display font-light text-ca-text uppercase tracking-wide">
                  Consulta rápida vía <span className="text-brand-gold italic">WhatsApp</span>
                </h3>
                <p className="text-xs font-sans font-light text-ca-text-secondary leading-relaxed">
                  ¿Deseas una respuesta rápida? Escríbenos directamente por chat para evaluar viabilidad y coordinar llamadas técnicas.
                </p>
              </div>

              <a
                href={WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="glow-btn w-full py-3.5 text-[10px] tracking-widest font-mono uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark text-center transition-all duration-300 mt-8 font-semibold inline-block"
              >
                <BrandText>Escribir por WhatsApp</BrandText>
              </a>
            </div>

            {/* Coordinates */}
            <div className="glass-card p-8 rounded-xl space-y-6 font-mono text-[10px] tracking-wider text-ca-text-secondary border border-ca-border bg-ca-bg-surface/10">
              <div className="text-brand-gold border-b border-white/[0.05] pb-2 font-semibold tracking-widest uppercase">
                COBERTURA Y DATOS DE ACCESO
              </div>
              <div className="space-y-3.5">
                <div className="flex items-center space-x-3">
                  <MapPin size={12} className="text-brand-gold" />
                  <span>ÁREA CIVIL: LIMA Y PROVINCIAS</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={12} className="text-brand-gold" />
                  <span>TELÉFONO: +51 908 550 942</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail size={12} className="text-brand-gold" />
                  <span>CORREO: CONTACTO@CASAATENTA.PE</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock size={12} className="text-brand-gold" />
                  <span>HORARIO: LUN - VIE 09:00 - 18:00</span>
                </div>
              </div>

              {/* Socials */}
              <div className="border-t border-white/[0.05] pt-4 mt-4 flex flex-wrap gap-4">
                {socials.map((net, idx) => (
                  <a
                    key={idx}
                    href={net.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-gold text-[9px] uppercase tracking-widest transition-colors duration-300"
                  >
                    <BrandText>{net.name}</BrandText>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
