import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { BrandText } from './BrandText';

interface ConfigState {
  spaceType: string;
  automationLevel: string;
  focusArea: string;
  name: string;
  phone: string;
}

export const Configurator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    spaceType: '',
    automationLevel: '',
    focusArea: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const updateConfig = (key: keyof ConfigState, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === 1 && !config.spaceType) return;
    if (step === 2 && !config.automationLevel) return;
    if (step === 3 && !config.focusArea) return;
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.name || !config.phone) return;
    
    // Construct WhatsApp message content
    const text = `Hola Casa Atenta, he configurado mi proyecto a través de su sitio web:
- **Espacio**: ${config.spaceType}
- **Nivel de Automatización**: ${config.automationLevel}
- **Enfoque Principal**: ${config.focusArea}
- **Cliente**: ${config.name}
- **Contacto**: ${config.phone}

Me gustaría recibir asesoría para integrar este diseño en mi residencia.`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/51908550942?text=${encodedText}`, '_blank');
    setStep(5); // Go to thank you step
  };

  return (
    <section className="w-full pt-40 pb-28 px-6 md:px-12 bg-brand-dark relative overflow-hidden min-h-screen">
      
      {/* Structural blueprint lines */}
      <div className="absolute top-[10%] left-0 w-full h-[1px] bg-white/[0.01] pointer-events-none" />
      <div className="absolute top-0 left-[35%] w-[1px] h-full bg-white/[0.01] pointer-events-none" />

      <div className="max-w-4xl mx-auto bg-brand-dark-soft border border-white/[0.06] p-8 md:p-14 relative z-20">
        
        {/* STEP METADATA INDICATOR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-16 border-b border-white/[0.06] pb-8 font-mono text-[9px] tracking-wider text-white/40">
          <div>
            <span className="text-brand-gold text-[8px] font-bold mr-2">●</span>
            <span className="text-brand-light/70 uppercase">
              <BrandText>CASA ATENTA // CONFIGURADOR RESIDENCIAL</BrandText>
            </span>
          </div>
          <div className="flex space-x-6">
            {[1, 2, 3, 4].map((s) => (
              <span 
                key={s} 
                className={`transition-colors duration-300 ${
                  step === s 
                    ? 'text-brand-gold font-bold' 
                    : step > s 
                    ? 'text-brand-light/70' 
                    : 'text-white/20'
                }`}
              >
                0{s} / {s === 1 ? 'ESPACIO' : s === 2 ? 'TECNOLOGÍA' : s === 3 ? 'PRIORIDAD' : 'CONFIRMACIÓN'}
              </span>
            ))}
          </div>
        </div>

        {/* STEP 1: SPACE TYPE */}
        {step === 1 && (
          <div className="animate-fade-in">
            <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
              PASO 01 / <BrandText>GEOMETRÍA</BrandText>
            </span>
            <h3 className="text-2xl md:text-3xl font-display text-brand-light font-extralight mb-8 uppercase">
              <BrandText>¿Cuál es la naturaleza de tu espacio?</BrandText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              {[
                { id: 'Villa de Lujo', label: 'Villa o Residencia', desc: 'Casas unifamiliares con amplias áreas de diseño interior y exterior.', code: 'VOL-RES' },
                { id: 'Apartamento de Diseño', label: 'Apartamento o Penthouse', desc: 'Espacios urbanos de gran densidad donde la luz y acústica son clave.', code: 'VOL-APT' },
                { id: 'Residencia de Campo', label: 'Finca o Casa de Campo', desc: 'Viviendas conectadas con el entorno natural, integrando energía y seguridad.', code: 'VOL-FLD' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateConfig('spaceType', opt.id)}
                  className={`border p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 select-none ${
                    config.spaceType === opt.id
                      ? 'border-brand-gold bg-brand-gold/[0.03]'
                      : 'border-white/[0.08] hover:border-white/[0.18] bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start font-mono text-[9px]">
                    <span className="text-white/35">{opt.code}</span>
                    <span className={`text-[10px] ${config.spaceType === opt.id ? 'text-brand-gold font-bold' : 'text-white/20'}`}>
                      {config.spaceType === opt.id ? '[X]' : '[ ]'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-base text-brand-light font-light mb-1.5 uppercase tracking-wide">
                      <BrandText>{opt.label}</BrandText>
                    </h4>
                    <p className="text-[11px] font-sans text-brand-light/45 leading-relaxed font-light">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                disabled={!config.spaceType}
                className="px-8 py-3 text-[10px] font-mono tracking-widest uppercase border border-brand-gold bg-brand-gold text-brand-dark font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-dark hover:border-brand-gold-dark transition-all duration-300 cursor-pointer"
              >
                <BrandText>Siguiente Paso</BrandText>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: AUTOMATION LEVEL */}
        {step === 2 && (
          <div className="animate-fade-in">
            <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
              PASO 02 / <BrandText>PRESENCIA</BrandText>
            </span>
            <h3 className="text-2xl md:text-3xl font-display text-brand-light font-extralight mb-8 uppercase">
              <BrandText>¿Qué nivel de presencia tecnológica deseas?</BrandText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-10">
              {[
                { 
                  id: 'Smart Confort', 
                  label: 'Smart Confort (Visible)', 
                  desc: 'Interactúa mediante botoneras grabadas en pared y pantallas táctiles de control general. Tecnología premium con interfaces tradicionales elegantes.',
                  code: 'INT-VIS-01'
                },
                { 
                  id: 'Invisibilidad Total / Casa Atenta', 
                  label: 'Invisibilidad Total (Casa Atenta)', 
                  desc: 'Sin pantallas ni interruptores visibles. Sensores de presencia y clima ocultos. Control por voz o chat natural mediante WhatsApp con tu asistente personal.',
                  code: 'INT-INV-02'
                },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateConfig('automationLevel', opt.id)}
                  className={`border p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between h-52 select-none ${
                    config.automationLevel === opt.id
                      ? 'border-brand-gold bg-brand-gold/[0.03]'
                      : 'border-white/[0.08] hover:border-white/[0.18] bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start font-mono text-[9px]">
                    <span className="text-white/35">{opt.code}</span>
                    <span className={`text-[10px] ${config.automationLevel === opt.id ? 'text-brand-gold font-bold' : 'text-white/20'}`}>
                      {config.automationLevel === opt.id ? '[X]' : '[ ]'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-base text-brand-light font-light mb-1.5 uppercase tracking-wide">
                      <BrandText>{opt.label}</BrandText>
                    </h4>
                    <p className="text-[11px] font-sans text-brand-light/45 leading-relaxed font-light">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-3 text-[10px] font-mono tracking-widest uppercase border border-white/10 text-brand-light/70 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <BrandText>Atrás</BrandText>
              </button>
              <button
                onClick={handleNext}
                disabled={!config.automationLevel}
                className="px-8 py-3 text-[10px] font-mono tracking-widest uppercase border border-brand-gold bg-brand-gold text-brand-dark font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-dark hover:border-brand-gold-dark transition-all duration-300 cursor-pointer"
              >
                <BrandText>Siguiente Paso</BrandText>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FOCUS AREA */}
        {step === 3 && (
          <div className="animate-fade-in">
            <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
              PASO 03 / <BrandText>PRIORIDAD</BrandText>
            </span>
            <h3 className="text-2xl md:text-3xl font-display text-brand-light font-extralight mb-8 uppercase">
              <BrandText>¿Cuál es tu prioridad funcional dentro de la casa?</BrandText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
              {[
                { id: 'Luz y Clima Circadiano', label: 'Luz y Clima', desc: 'Ajuste de color solar automático y climatización invisible por convección.', code: 'PRIOR-LUM' },
                { id: 'Acústica Sensorial', label: 'Audio Sensorial', desc: 'Música distribuida con bocinas invisibles en yeso, adaptada al estado de ánimo.', code: 'PRIOR-ACU' },
                { id: 'Seguridad Térmica Perimetral', label: 'Seguridad Silenciosa', desc: 'Control de accesos térmicos y protección sin cámaras visibles invasivas.', code: 'PRIOR-SEC' },
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => updateConfig('focusArea', opt.id)}
                  className={`border p-6 cursor-pointer transition-all duration-300 flex flex-col justify-between h-48 select-none ${
                    config.focusArea === opt.id
                      ? 'border-brand-gold bg-brand-gold/[0.03]'
                      : 'border-white/[0.08] hover:border-white/[0.18] bg-transparent'
                  }`}
                >
                  <div className="flex justify-between items-start font-mono text-[9px]">
                    <span className="text-white/35">{opt.code}</span>
                    <span className={`text-[10px] ${config.focusArea === opt.id ? 'text-brand-gold font-bold' : 'text-white/20'}`}>
                      {config.focusArea === opt.id ? '[X]' : '[ ]'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display text-base text-brand-light font-light mb-1.5 uppercase tracking-wide">
                      <BrandText>{opt.label}</BrandText>
                    </h4>
                    <p className="text-[11px] font-sans text-brand-light/45 leading-relaxed font-light">{opt.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleBack}
                className="px-8 py-3 text-[10px] font-mono tracking-widest uppercase border border-white/10 text-brand-light/70 hover:border-white/20 transition-all duration-300 cursor-pointer"
              >
                <BrandText>Atrás</BrandText>
              </button>
              <button
                onClick={handleNext}
                disabled={!config.focusArea}
                className="px-8 py-3 text-[10px] font-mono tracking-widest uppercase border border-brand-gold bg-brand-gold text-brand-dark font-semibold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-brand-gold-dark hover:border-brand-gold-dark transition-all duration-300 cursor-pointer"
              >
                <BrandText>Siguiente Paso</BrandText>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT FORM & SUMMARY */}
        {step === 4 && (
          <div className="animate-fade-in">
            <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-3">
              PASO 04 / <BrandText>REGISTRO</BrandText>
            </span>
            <h3 className="text-2xl md:text-3xl font-display text-brand-light font-extralight mb-8 uppercase">
              <BrandText>Tu Configuración de Residencia</BrandText>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              
              {/* Summary Card */}
              <div className="bg-brand-dark border border-white/[0.06] p-6 flex flex-col justify-between">
                <div>
                  <h4 className="text-[9px] font-mono tracking-wider text-brand-gold uppercase mb-5 border-b border-white/[0.08] pb-3">
                    <BrandText>RESUMEN DEL DISEÑO</BrandText>
                  </h4>
                  <div className="space-y-4 font-mono text-[10px] text-brand-light/80">
                    <div>
                      <span className="block text-[8px] text-white/30 uppercase tracking-widest">01 / ESPACIO</span>
                      <span className="text-xs font-display text-brand-light font-light uppercase tracking-wide">
                        <BrandText>{config.spaceType}</BrandText>
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-white/30 uppercase tracking-widest">02 / TECNOLOGÍA</span>
                      <span className="text-xs font-display text-brand-light font-light uppercase tracking-wide">
                        <BrandText>{config.automationLevel}</BrandText>
                      </span>
                    </div>
                    <div>
                      <span className="block text-[8px] text-white/30 uppercase tracking-widest">03 / PRIORIDAD</span>
                      <span className="text-xs font-display text-brand-light font-light uppercase tracking-wide">
                        <BrandText>{config.focusArea}</BrandText>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-[8px] font-mono text-brand-gold/60 mt-8 leading-relaxed">
                  * SE PROCESARÁ UNA PROPUESTA TÉCNICA E INTEGRACIÓN CIVIL PERSONALIZADA.
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-4">
                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-brand-light/60 uppercase mb-1.5">
                    <BrandText>Tu Nombre</BrandText>
                  </label>
                  <input
                    type="text"
                    required
                    value={config.name}
                    onChange={(e) => updateConfig('name', e.target.value)}
                    placeholder="Ej. Alexis Ruiz"
                    className="w-full bg-brand-dark border border-white/[0.1] focus:border-brand-gold px-4 py-3 text-[11px] font-mono text-brand-light outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono tracking-widest text-brand-light/60 uppercase mb-1.5">
                    <BrandText>Tu WhatsApp / Teléfono</BrandText>
                  </label>
                  <input
                    type="tel"
                    required
                    value={config.phone}
                    onChange={(e) => updateConfig('phone', e.target.value)}
                    placeholder="Ej. +51 908..."
                    className="w-full bg-brand-dark border border-white/[0.1] focus:border-brand-gold px-4 py-3 text-[11px] font-mono text-brand-light outline-none transition-colors"
                  />
                </div>
                <div className="pt-4 flex gap-4">
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 py-3 text-[10px] font-mono tracking-widest uppercase border border-white/10 text-brand-light hover:border-white/20 transition-all duration-300 cursor-pointer"
                  >
                    <BrandText>Atrás</BrandText>
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-[10px] font-mono tracking-widest uppercase border border-brand-gold bg-brand-gold text-brand-dark font-semibold hover:bg-brand-gold-dark transition-all duration-300 cursor-pointer"
                  >
                    <BrandText>Enviar Propuesta</BrandText>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* STEP 5: THANK YOU SCREEN */}
        {step === 5 && (
          <div className="text-center py-10 animate-fade-in font-mono">
            <CheckCircle className="w-12 h-12 text-brand-gold mx-auto mb-6" />
            <h3 className="text-xl md:text-2xl font-display text-brand-light font-extralight mb-4 uppercase">
              <BrandText>¡Configuración Registrada!</BrandText>
            </h3>
            <p className="text-xs font-light text-brand-light/50 leading-relaxed font-sans max-w-md mx-auto mb-8">
              Tu selección técnica ha sido compilada. Se ha abierto un canal directo de comunicación vía WhatsApp para coordinar tu propuesta arquitectónica.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => { setStep(1); setConfig({ spaceType: '', automationLevel: '', focusArea: '', name: '', phone: '' }); }}
                className="px-6 py-2.5 text-[9px] tracking-widest uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-400 cursor-pointer"
              >
                <BrandText>NUEVO PROCESO</BrandText>
              </button>
              <Link
                href="/contacto"
                className="px-6 py-2.5 text-[9px] tracking-widest uppercase border border-white/20 text-brand-light hover:border-white/40 transition-all duration-400 flex items-center"
              >
                <BrandText>VER REDES SOCIALES</BrandText>
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
