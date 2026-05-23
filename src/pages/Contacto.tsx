import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ArrowRight, MessageSquare, Check, Mail, Phone, MapPin, Clock } from 'lucide-react';
import { BrandText } from '../components/BrandText';

export const Contacto: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'residencial',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const ctx = gsap.context(() => {
      gsap.fromTo('.contact-title', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out' }
      );
      gsap.fromTo('.contact-anim-item', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 1.0, ease: 'power3.out', stagger: 0.1, delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const socials = [
    { name: 'Instagram', handle: '@casaatenta', url: 'https://www.instagram.com/casaatenta/' },
    { name: 'TikTok', handle: '@casaatenta', url: 'https://www.tiktok.com/@casaatenta' },
    { name: 'LinkedIn', handle: 'casaatenta', url: 'https://www.linkedin.com/company/casaatenta' },
    { name: 'Facebook', handle: 'casaatenta', url: 'https://www.facebook.com/casaatenta' }
  ];

  const handleWhatsApp = () => {
    const text = 'Hola Casa Atenta, deseo agendar una sesión de consulta para mi proyecto de integración invisible.';
    window.open(`https://wa.me/51908550942?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', projectType: 'residencial', message: '' });
    }, 4000);
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-brand-dark pt-36 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-1 pointer-events-none" style={{
        backgroundImage: 'linear-gradient(to right, rgba(255, 255, 255, 0.007) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.007) 1px, transparent 1px)',
        backgroundSize: '80px 80px'
      }} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Page Header */}
        <div className="max-w-3xl mb-16 contact-title">
          <span className="text-[10px] font-sans tracking-[0.25em] text-brand-gold uppercase mb-4 block">
            05 / CONTACTO & AGENDAS
          </span>
          <h1 className="text-4xl md:text-6xl font-sans font-extralight text-brand-light uppercase tracking-widest leading-[1.1]">
            <BrandText>Agenda tu Cita</BrandText> <br />
            <span className="font-light text-brand-gold"><BrandText>proyecta tu espacio</BrandText></span><span className="text-brand-gold">.</span>
          </h1>
          {/* Sparkle divider */}
          <div className="h-[1px] w-28 bg-gradient-to-r from-brand-gold via-brand-gold/60 to-transparent relative my-5">
            <div className="absolute top-[-1px] left-6 w-1.5 h-[3px] bg-brand-light rounded-full blur-[0.5px] opacity-90" />
          </div>
          <p className="text-xs md:text-sm font-sans font-light text-brand-light/45 leading-relaxed max-w-xl pt-4">
            Escríbenos para coordinar una reunión presencial en nuestro showroom o una sesión virtual de revisión de planos.
          </p>
        </div>

        {/* Form and Contact cards Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch contact-anim-item">
          
          {/* Left: Premium Contact Form */}
          <div className="lg:col-span-7 bg-brand-dark-soft border border-white/[0.04] p-8 md:p-10 flex flex-col justify-between">
            {submitted ? (
              <div className="my-auto text-center space-y-6 py-12 animate-fade-in">
                <div className="w-16 h-16 border border-brand-gold rounded-full flex items-center justify-center mx-auto bg-brand-dark">
                  <Check size={28} className="text-brand-gold" />
                </div>
                <h3 className="text-xl font-sans font-light text-brand-light uppercase tracking-wider">
                  <BrandText>Mensaje Enviado</BrandText>
                </h3>
                <p className="text-xs font-sans text-brand-light/50 max-w-sm mx-auto leading-relaxed">
                  Gracias por escribirnos. Un diseñador especializado se pondrá en contacto contigo en las próximas 24 horas para revisar tu caso.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-between items-center font-sans text-[10px] text-brand-gold uppercase tracking-widest border-b border-white/[0.04] pb-3 font-bold">
                  <span>FORMULARIO DE CONTACTO</span>
                  <span>CÓD: REG-FORM</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name input */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans tracking-widest text-brand-gold uppercase block">Nombre Completo</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Alexis Falcon"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-brand-dark border border-white/[0.08] focus:border-brand-gold px-4 py-3 text-xs font-sans text-brand-light focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Phone input */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans tracking-widest text-brand-gold uppercase block">Teléfono / WhatsApp</label>
                    <input
                      type="tel"
                      required
                      placeholder="Ej. +51 908 550 942"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-brand-dark border border-white/[0.08] focus:border-brand-gold px-4 py-3 text-xs font-sans text-brand-light focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email input */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans tracking-widest text-brand-gold uppercase block">Correo Electrónico</label>
                    <input
                      type="email"
                      required
                      placeholder="Ej. contacto@casaatenta.pe"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-brand-dark border border-white/[0.08] focus:border-brand-gold px-4 py-3 text-xs font-sans text-brand-light focus:outline-none transition-all duration-300"
                    />
                  </div>

                  {/* Project Type select */}
                  <div className="space-y-2">
                    <label className="text-[9px] font-sans tracking-widest text-brand-gold uppercase block">Tipo de Proyecto</label>
                    <select
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full bg-brand-dark border border-white/[0.08] focus:border-brand-gold px-4 py-3 text-xs font-sans text-brand-gold tracking-widest focus:outline-none transition-all duration-300 uppercase"
                    >
                      <option value="residencial">Residencial Alta Gama</option>
                      <option value="pabellon">Pabellón / Showroom</option>
                      <option value="wellness">Wellness / Spa</option>
                      <option value="corporativo">Corporativo / Hotel</option>
                    </select>
                  </div>
                </div>

                {/* Message input */}
                <div className="space-y-2">
                  <label className="text-[9px] font-sans tracking-widest text-brand-gold uppercase block">Cuéntanos sobre tu obra (Estado, Arquitecto, etc.)</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Ej. Estoy en etapa de planos civiles con el estudio X. Quisiera integrar audio y clima invisible en el salón principal."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-brand-dark border border-white/[0.08] focus:border-brand-gold px-4 py-3 text-xs font-sans text-brand-light focus:outline-none transition-all duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 text-xs tracking-[0.25em] font-sans font-light uppercase border border-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-dark transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <span><BrandText>ENVIAR PROPUESTA DE CONSULTA</BrandText></span>
                  <ArrowRight size={12} />
                </button>
              </form>
            )}
          </div>

          {/* Right: Direct Contacts & Channels */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            
            {/* Direct WhatsApp Box */}
            <div className="bg-brand-dark-soft border border-brand-gold/30 p-8 flex flex-col justify-between flex-1">
              <div className="space-y-4">
                <div className="flex justify-between items-center font-sans text-[10px] text-brand-gold uppercase tracking-widest border-b border-white/[0.04] pb-2 font-bold">
                  <span>ATENCIÓN COMERCIAL</span>
                  <span>WA-SUPPORT</span>
                </div>
                <div className="w-10 h-10 border border-brand-gold/20 flex items-center justify-center bg-brand-dark mb-4">
                  <MessageSquare size={18} className="text-brand-gold" />
                </div>
                <h3 className="text-lg font-sans font-light text-brand-light uppercase tracking-wider">
                  Asistencia por <span className="font-light text-brand-gold italic lowercase">WhatsApp</span>
                </h3>
                <p className="text-[11px] font-sans font-light text-brand-light/55 leading-relaxed">
                  ¿Deseas una respuesta rápida? Escríbenos directamente para agendar citas presenciales o virtuales en minutos.
                </p>
              </div>

              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 text-xs tracking-[0.2em] font-sans font-light uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-300 mt-6"
              >
                <BrandText>Escribir por WhatsApp</BrandText>
              </button>
            </div>

            {/* Technical Metadata Box */}
            <div className="bg-brand-dark-soft border border-white/[0.04] p-8 space-y-6 font-sans text-[10px] tracking-wider text-brand-light/50">
              <div className="text-brand-gold border-b border-white/[0.04] pb-2 font-sans tracking-[0.15em] uppercase font-bold">
                COORDENADAS & COBERTURA
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <MapPin size={12} className="text-brand-gold" />
                  <span>COBERTURA: LIMA Y CIUDADES A NIVEL NACIONAL</span>
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

              {/* Social Channels row */}
              <div className="border-t border-white/[0.04] pt-4 mt-4 flex flex-wrap gap-x-4 gap-y-2">
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
};
