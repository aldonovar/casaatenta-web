"use client";

import React, { useState, useEffect, useRef } from "react";
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { gsap } from "gsap";
import { BrandText } from "./BrandText";
import { WHATSAPP_NUMBER } from "@/constants/contact";
import { TurnstileWidget } from "./TurnstileWidget";

interface ConfigState {
  spaceType: string;
  automationLevel: string;
  focusArea: string;
  name: string;
  email: string;
  phone: string;
}

export const Configurator: React.FC = () => {
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<ConfigState>({
    spaceType: "",
    automationLevel: "",
    focusArea: "",
    name: "",
    email: "",
    phone: "",
  });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [whatsappUrl, setWhatsappUrl] = useState("");

  const stepContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Animates step card changes
  useEffect(() => {
    if (stepContainerRef.current) {
      gsap.fromTo(
        stepContainerRef.current,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [step]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!config.name || !config.email || !config.phone) return;
    if (!turnstileToken) {
      setSubmitError("Completa la verificación de seguridad.");
      return;
    }
    setIsSubmitting(true);
    setSubmitError("");

    const text = `Hola Casa Atenta, he configurado mi proyecto a través de su sitio web:
- **Espacio**: ${config.spaceType}
- **Nivel de Automatización**: ${config.automationLevel}
- **Enfoque Principal**: ${config.focusArea}
- **Cliente**: ${config.name}
- **Contacto**: ${config.phone}

Me gustaría recibir asesoría para integrar este diseño en mi residencia.`;

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "configurator",
          name: config.name,
          email: config.email,
          phone: config.phone,
          service: "Configurador residencial",
          location: "",
          measures: "",
          message: "Solicitud generada desde el configurador de residencias.",
          projectData: {
            espacio: config.spaceType,
            automatizacion: config.automationLevel,
            prioridad: config.focusArea,
          },
          privacyConsent,
          website: "",
          turnstileToken,
        }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(result.error || "No pudimos registrar la configuración.");
      }

      setWhatsappUrl(
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`,
      );
      setStep(5);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "No pudimos registrar la configuración.",
      );
      setTurnstileResetKey((key) => key + 1);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="w-full pt-36 pb-28 px-6 md:px-12 bg-ca-bg-deep relative overflow-hidden min-h-screen flex items-center justify-center">
      <div className="absolute inset-0 z-0 opacity-10 architectural-grid pointer-events-none" />
      <div className="absolute top-[10%] left-0 w-full h-[1px] bg-white/[0.02] pointer-events-none" />
      <div className="absolute top-0 left-[35%] w-[1px] h-full bg-white/[0.02] pointer-events-none" />
      
      {/* Glow backgrounds */}
      <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-brand-gold opacity-[0.03] blur-[100px] z-0 pointer-events-none" />
      <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-brand-dark opacity-[0.05] blur-[100px] z-0 pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div className="glass-panel border border-ca-border p-6 md:p-12 rounded-2xl shadow-2xl relative w-full">
          
          {/* STEP INDICATORS */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-ca-border pb-6 font-mono text-[10px] tracking-wider text-ca-text-secondary">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand-gold animate-pulse" />
              <span className="text-ca-text/85 uppercase font-semibold">
                <BrandText>CASA ATENTA // CONFIGURADOR DE RESIDENCIAS</BrandText>
              </span>
            </div>
            <div className="flex flex-wrap gap-4 md:gap-6">
              {[1, 2, 3, 4].map((s) => {
                const label =
                  s === 1
                    ? "ESPACIO"
                    : s === 2
                    ? "TECNOLOGÍA"
                    : s === 3
                    ? "PRIORIDAD"
                    : "REGISTRO";
                return (
                  <span
                    key={s}
                    className={`transition-colors duration-300 ${
                      step === s
                        ? "text-brand-gold font-semibold"
                        : step > s
                        ? "text-ca-text/60"
                        : "text-ca-text-muted/40"
                    }`}
                  >
                    0{s} / {label}
                  </span>
                );
              })}
            </div>
          </div>

          {/* TWO COLUMN CONSOLE GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* LEFT COLUMN: Steps Form Panel (7 columns) */}
            <div ref={stepContainerRef} className="lg:col-span-7 flex flex-col justify-between">
              
              {/* STEP 1: SPACE TYPE */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-2">
                      Paso 01 / <BrandText>Geometría</BrandText>
                    </span>
                    <h3 className="text-xl md:text-2.5xl font-display text-ca-text font-light uppercase tracking-wide">
                      <BrandText>¿Cuál es la naturaleza de tu espacio?</BrandText>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        id: "Villa de Lujo",
                        label: "Villa o Residencia",
                        desc: "Casas unifamiliares con amplias áreas de diseño y terrazas.",
                        code: "SPEC-VOL-RES",
                      },
                      {
                        id: "Apartamento de Diseño",
                        label: "Apartamento o Loft",
                        desc: "Espacios urbanos de gran densidad donde la luz y acústica son clave.",
                        code: "SPEC-VOL-APT",
                      },
                      {
                        id: "Residencia de Campo",
                        label: "Casa de Campo",
                        desc: "Viviendas integradas con el entorno, automatizando energía y accesos.",
                        code: "SPEC-VOL-FLD",
                      },
                    ].map((opt) => {
                      const isSelected = config.spaceType === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => updateConfig("spaceType", opt.id)}
                          className={`group relative border p-5 cursor-pointer rounded-lg transition-all duration-300 flex flex-col justify-between h-44 select-none ${
                            isSelected
                              ? "border-brand-gold bg-brand-gold/[0.04] shadow-[0_0_15px_rgba(255,208,138,0.06)]"
                              : "border-ca-border hover:border-brand-gold bg-ca-bg-surface/10"
                          }`}
                        >
                          <div className="flex justify-between items-start font-mono text-[8px]">
                            <span className="text-ca-text-muted">{opt.code}</span>
                            <span
                              className={`text-[9px] ${
                                isSelected ? "text-brand-gold font-bold" : "text-ca-text-muted/40"
                              }`}
                            >
                              {isSelected ? "[X]" : "[ ]"}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-display text-sm uppercase tracking-wide mb-1 transition-colors duration-300 ${
                              isSelected ? "text-brand-gold" : "text-ca-text/90"
                            }`}>
                              <BrandText>{opt.label}</BrandText>
                            </h4>
                            <p className="text-[10px] font-sans text-ca-text-secondary leading-normal font-light">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-ca-border">
                    <button
                      onClick={handleNext}
                      disabled={!config.spaceType}
                      className="glow-btn inline-flex min-h-11 items-center justify-center gap-3 border border-brand-gold bg-brand-gold px-8 py-3 text-[10px] font-mono uppercase tracking-widest text-brand-dark font-semibold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none rounded cursor-pointer"
                    >
                      <BrandText>Siguiente Paso</BrandText>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: AUTOMATION LEVEL */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-2">
                      Paso 02 / <BrandText>Presencia</BrandText>
                    </span>
                    <h3 className="text-xl md:text-2.5xl font-display text-ca-text font-light uppercase tracking-wide">
                      <BrandText>¿Qué nivel de automatización deseas?</BrandText>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        id: "Smart Confort",
                        label: "Smart Confort (Visible)",
                        desc: "Interactúa mediante botoneras grabadas en pared y pantallas táctiles elegantes. Sistemas tradicionales premium con interfaces táctiles visibles.",
                        code: "SPEC-INT-VIS",
                      },
                      {
                        id: "Invisibilidad Total / Casa Atenta",
                        label: "Invisibilidad Total (Casa Atenta)",
                        desc: "Sin pantallas ni interruptores en muros. Sensores invisibles de movimiento y temperatura. Control automático predictivo o mediante voz y WhatsApp.",
                        code: "SPEC-INT-INV",
                      },
                    ].map((opt) => {
                      const isSelected = config.automationLevel === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => updateConfig("automationLevel", opt.id)}
                          className={`group relative border p-5 cursor-pointer rounded-lg transition-all duration-300 flex flex-col justify-between h-48 select-none ${
                            isSelected
                              ? "border-brand-gold bg-brand-gold/[0.04] shadow-[0_0_15px_rgba(255,208,138,0.06)]"
                              : "border-ca-border hover:border-brand-gold bg-ca-bg-surface/10"
                          }`}
                        >
                          <div className="flex justify-between items-start font-mono text-[8px]">
                            <span className="text-ca-text-muted">{opt.code}</span>
                            <span
                              className={`text-[9px] ${
                                isSelected ? "text-brand-gold font-bold" : "text-ca-text-muted/40"
                              }`}
                            >
                              {isSelected ? "[X]" : "[ ]"}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-display text-sm uppercase tracking-wide mb-1.5 transition-colors duration-300 ${
                              isSelected ? "text-brand-gold" : "text-ca-text/90"
                            }`}>
                              <BrandText>{opt.label}</BrandText>
                            </h4>
                            <p className="text-[10px] font-sans text-ca-text-secondary leading-normal font-light">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-ca-border">
                    <button
                      onClick={handleBack}
                      className="inline-flex min-h-11 items-center justify-center gap-2 border border-ca-border bg-transparent px-6 py-3 text-[10px] font-mono tracking-widest uppercase text-ca-text/70 hover:border-brand-gold/40 hover:text-brand-gold transition-all duration-300 rounded cursor-pointer"
                    >
                      <ArrowLeft size={13} />
                      <BrandText>Atrás</BrandText>
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!config.automationLevel}
                      className="glow-btn inline-flex min-h-11 items-center justify-center gap-3 border border-brand-gold bg-brand-gold px-8 py-3 text-[10px] font-mono tracking-widest uppercase text-brand-dark font-semibold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none rounded cursor-pointer"
                    >
                      <BrandText>Siguiente Paso</BrandText>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: FOCUS AREA */}
              {step === 3 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-2">
                      Paso 03 / <BrandText>Prioridad</BrandText>
                    </span>
                    <h3 className="text-xl md:text-2.5xl font-display text-ca-text font-light uppercase tracking-wide">
                      <BrandText>¿Cuál es tu prioridad funcional?</BrandText>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      {
                        id: "Luz y Clima Circadiano",
                        label: "Luz y Clima",
                        desc: "Iluminación que imita el ciclo solar automático y climatización oculta sin corrientes molestas.",
                        code: "SPEC-PRI-LUM",
                      },
                      {
                        id: "Acústica Sensorial",
                        label: "Audio invisible",
                        desc: "Audio distribuido con parlantes invisibles empotrados en paredes, sintonizados al ritmo diario.",
                        code: "SPEC-PRI-ACU",
                      },
                      {
                        id: "Seguridad Térmica Perimetral",
                        label: "Seguridad Pasiva",
                        desc: "Control de accesos inteligentes y protección silenciosa sin cámaras invasivas en el diseño.",
                        code: "SPEC-PRI-SEC",
                      },
                    ].map((opt) => {
                      const isSelected = config.focusArea === opt.id;
                      return (
                        <div
                          key={opt.id}
                          onClick={() => updateConfig("focusArea", opt.id)}
                          className={`group relative border p-5 cursor-pointer rounded-lg transition-all duration-300 flex flex-col justify-between h-44 select-none ${
                            isSelected
                              ? "border-brand-gold bg-brand-gold/[0.04] shadow-[0_0_15px_rgba(255,208,138,0.06)]"
                              : "border-ca-border hover:border-brand-gold bg-ca-bg-surface/10"
                          }`}
                        >
                          <div className="flex justify-between items-start font-mono text-[8px]">
                            <span className="text-ca-text-muted">{opt.code}</span>
                            <span
                              className={`text-[9px] ${
                                isSelected ? "text-brand-gold font-bold" : "text-ca-text-muted/40"
                              }`}
                            >
                              {isSelected ? "[X]" : "[ ]"}
                            </span>
                          </div>
                          <div>
                            <h4 className={`font-display text-sm uppercase tracking-wide mb-1 transition-colors duration-300 ${
                              isSelected ? "text-brand-gold" : "text-ca-text/90"
                            }`}>
                              <BrandText>{opt.label}</BrandText>
                            </h4>
                            <p className="text-[10px] font-sans text-ca-text-secondary leading-normal font-light">
                              {opt.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-between pt-4 border-t border-ca-border">
                    <button
                      onClick={handleBack}
                      className="inline-flex min-h-11 items-center justify-center gap-2 border border-ca-border bg-transparent px-6 py-3 text-[10px] font-mono tracking-widest uppercase text-ca-text/70 hover:border-brand-gold/40 hover:text-brand-gold transition-all duration-300 rounded cursor-pointer"
                    >
                      <ArrowLeft size={13} />
                      <BrandText>Atrás</BrandText>
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={!config.focusArea}
                      className="glow-btn inline-flex min-h-11 items-center justify-center gap-3 border border-brand-gold bg-brand-gold px-8 py-3 text-[10px] font-mono tracking-widest uppercase text-brand-dark font-semibold transition-all duration-300 disabled:opacity-30 disabled:pointer-events-none rounded cursor-pointer"
                    >
                      <BrandText>Siguiente Paso</BrandText>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: CONTACT FORM & SUMMARY */}
              {step === 4 && (
                <div className="space-y-6">
                  <div>
                    <span className="text-[9px] font-mono tracking-[0.3em] text-brand-gold uppercase block mb-2">
                      Paso 04 / <BrandText>Registro</BrandText>
                    </span>
                    <h3 className="text-xl md:text-2.5xl font-display text-ca-text font-light uppercase tracking-wide">
                      <BrandText>Configuración de Proyecto</BrandText>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Summary Block */}
                    <div className="border border-ca-border p-5 rounded-lg bg-ca-bg-surface/10 flex flex-col justify-between">
                      <div>
                        <h4 className="text-[10px] font-mono tracking-wider text-brand-gold uppercase mb-4 border-b border-ca-border pb-2">
                          <BrandText>Resumen del Diseño</BrandText>
                        </h4>
                        <div className="space-y-4 font-mono text-[9px] text-ca-text-secondary">
                          <div>
                            <span className="block text-[8px] text-ca-text-muted/65 uppercase tracking-widest mb-0.5">
                              01 / ESPACIO
                            </span>
                            <span className="text-xs font-display text-ca-text font-light uppercase tracking-wide">
                              <BrandText>{config.spaceType}</BrandText>
                            </span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-ca-text-muted/65 uppercase tracking-widest mb-0.5">
                              02 / TECNOLOGÍA
                            </span>
                            <span className="text-xs font-display text-ca-text font-light uppercase tracking-wide">
                              <BrandText>{config.automationLevel}</BrandText>
                            </span>
                          </div>
                          <div>
                            <span className="block text-[8px] text-ca-text-muted/65 uppercase tracking-widest mb-0.5">
                              03 / PRIORIDAD
                            </span>
                            <span className="text-xs font-display text-ca-text font-light uppercase tracking-wide">
                              <BrandText>{config.focusArea}</BrandText>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-[8px] font-mono text-brand-gold/60 mt-6 leading-relaxed">
                        * SE PROCESARÁ UNA PROPUESTA TÉCNICA E INTEGRACIÓN CIVIL PERSONALIZADA.
                      </div>
                    </div>

                    {/* Form Block */}
                    <form onSubmit={handleSubmit} className="flex flex-col justify-center space-y-4">
                      <div className="relative group">
                        <label className="block text-[9px] font-mono tracking-widest text-ca-text/60 uppercase mb-1.5">
                          <BrandText>Tu Nombre</BrandText>
                        </label>
                        <input
                          type="text"
                          required
                          value={config.name}
                          onChange={(e) => updateConfig("name", e.target.value)}
                          placeholder="Ej. Alexis Ruiz"
                          className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3 text-xs font-mono text-ca-text outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-[9px] font-mono tracking-widest text-ca-text/60 uppercase mb-1.5">
                          <BrandText>WhatsApp de contacto</BrandText>
                        </label>
                        <input
                          type="tel"
                          required
                          value={config.phone}
                          onChange={(e) => updateConfig("phone", e.target.value)}
                          placeholder="Ej. +51 908 550 942"
                          className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3 text-xs font-mono text-ca-text outline-none transition-all duration-300"
                        />
                      </div>
                      <div className="relative group">
                        <label className="block text-[9px] font-mono tracking-widest text-ca-text/60 uppercase mb-1.5">
                          <BrandText>Correo electrónico</BrandText>
                        </label>
                        <input
                          type="email"
                          required
                          autoComplete="email"
                          value={config.email}
                          onChange={(e) => updateConfig("email", e.target.value)}
                          placeholder="nombre@correo.com"
                          className="w-full bg-ca-bg-deep/60 border border-ca-border focus:border-brand-gold/80 rounded px-4 py-3 text-xs font-mono text-ca-text outline-none transition-all duration-300"
                        />
                      </div>
                      <label className="flex items-start gap-2 text-[9px] leading-4 text-ca-text/60">
                        <input
                          type="checkbox"
                          required
                          checked={privacyConsent}
                          onChange={(event) => setPrivacyConsent(event.target.checked)}
                          className="mt-0.5 accent-brand-gold"
                        />
                        Acepto el tratamiento de mis datos para recibir respuesta a esta solicitud.
                      </label>
                      <TurnstileWidget
                        action="contact_form"
                        onToken={setTurnstileToken}
                        resetKey={turnstileResetKey}
                      />
                      {submitError && (
                        <p className="text-[10px] leading-4 text-red-300" role="status">
                          {submitError}
                        </p>
                      )}

                      <div className="pt-2 flex gap-4">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="flex-1 inline-flex min-h-11 items-center justify-center gap-2 border border-ca-border bg-transparent px-4 py-3 text-[10px] font-mono tracking-widest uppercase text-ca-text/70 hover:border-brand-gold/40 hover:text-brand-gold transition-all duration-300 rounded cursor-pointer"
                        >
                          <BrandText>Atrás</BrandText>
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="flex-1 glow-btn inline-flex min-h-11 items-center justify-center gap-2 border border-brand-gold bg-brand-gold px-4 py-3 text-[10px] font-mono tracking-widest uppercase text-brand-dark font-semibold hover:bg-brand-gold-dark transition-all duration-300 rounded cursor-pointer disabled:cursor-wait disabled:opacity-60"
                        >
                          <BrandText>{isSubmitting ? "Registrando…" : "Enviar Propuesta"}</BrandText>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* STEP 5: THANK YOU SCREEN */}
              {step === 5 && (
                <div className="text-center py-8 font-mono space-y-6">
                  <CheckCircle className="w-14 h-14 text-brand-gold mx-auto animate-pulse" />
                  <h3 className="text-xl md:text-2xl font-display text-brand-light font-extralight uppercase">
                    <BrandText>¡Configuración Registrada!</BrandText>
                  </h3>
                  <p className="text-xs font-light text-brand-light/50 leading-relaxed font-sans max-w-md mx-auto">
                    Tu selección técnica fue registrada de forma segura. También enviamos una copia a tu correo.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4 pt-6">
                    {whatsappUrl && (
                      <a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="glow-btn px-6 py-3 text-[10px] tracking-widest uppercase border border-brand-gold bg-brand-gold text-brand-dark transition-all duration-400 font-semibold rounded"
                      >
                        <BrandText>Continuar por WhatsApp</BrandText>
                      </a>
                    )}
                    <button
                      onClick={() => {
                        setStep(1);
                        setConfig({
                          spaceType: "",
                          automationLevel: "",
                          focusArea: "",
                          name: "",
                          email: "",
                          phone: "",
                        });
                        setPrivacyConsent(false);
                        setTurnstileToken("");
                        setTurnstileResetKey((key) => key + 1);
                        setSubmitError("");
                        setWhatsappUrl("");
                      }}
                      className="glow-btn px-6 py-3 text-[10px] tracking-widest uppercase border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-dark transition-all duration-400 font-semibold rounded cursor-pointer"
                    >
                      <BrandText>Configurar nuevo proyecto</BrandText>
                    </button>
                    <Link
                      href="/"
                      className="px-6 py-3 text-[10px] tracking-widest uppercase border border-white/10 text-brand-light hover:border-brand-gold hover:text-brand-gold transition-all duration-400 flex items-center rounded"
                    >
                      <BrandText>Volver al inicio</BrandText>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Interactive CAD Technical Blueprint Panel (5 columns) */}
            <div className="lg:col-span-5 h-[320px] lg:h-[420px] border border-ca-border rounded-xl bg-ca-bg-deep/50 p-5 flex flex-col justify-between relative overflow-hidden select-none">
              <div className="absolute inset-0 opacity-[0.03] cad-technical-grid pointer-events-none" />
              
              {/* CAD corner crosses */}
              <span className="absolute top-2 left-2 text-[8px] font-mono text-brand-gold/30 pointer-events-none">+</span>
              <span className="absolute top-2 right-2 text-[8px] font-mono text-brand-gold/30 pointer-events-none">+</span>
              <span className="absolute bottom-2 left-2 text-[8px] font-mono text-brand-gold/30 pointer-events-none">+</span>
              <span className="absolute bottom-2 right-2 text-[8px] font-mono text-brand-gold/30 pointer-events-none">+</span>

              <div className="flex justify-between items-center border-b border-ca-border/60 pb-2">
                <span className="text-[7.5px] font-mono text-brand-gold/60 uppercase tracking-widest">[ CAD_VIEWER // PLAN_RENDER ]</span>
                <span className="text-[7.5px] font-mono text-ca-text-muted">ID: CA-509</span>
              </div>

              {/* Responsive SVG Blueprint Drawing Canvas */}
              <div className="flex-1 flex items-center justify-center relative my-4">
                <svg viewBox="0 0 300 220" className="w-full h-full fill-none stroke-brand-gold/30">
                  {/* Fine layout outer border grid */}
                  <rect x="10" y="10" width="280" height="200" strokeWidth="0.5" strokeDasharray="3 3" />
                  
                  {/* DYNAMIC FLOOR PLAN WALLS DEPENDING ON SPACE SELECTION */}
                  {(!config.spaceType || config.spaceType === "Villa de Lujo") && (
                    <g className="transition-all duration-500">
                      {/* Villa geometry */}
                      <path d="M 40 40 L 260 40 L 260 180 L 40 180 Z" strokeWidth="1" stroke="var(--color-brand-gold)" />
                      <line x1="120" y1="40" x2="120" y2="180" strokeWidth="0.75" />
                      <line x1="120" y1="110" x2="260" y2="110" strokeWidth="0.75" />
                      <text x="50" y="55" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">PATIO</text>
                      <text x="130" y="55" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">SUITE</text>
                      <text x="130" y="125" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">LIVING</text>
                    </g>
                  )}
                  {config.spaceType === "Apartamento de Diseño" && (
                    <g className="transition-all duration-500">
                      {/* Apartment geometry */}
                      <path d="M 50 50 L 250 50 L 250 170 L 50 170 Z" strokeWidth="1" stroke="var(--color-brand-gold)" />
                      <line x1="160" y1="50" x2="160" y2="170" strokeWidth="0.75" />
                      {/* Balcony slab */}
                      <rect x="250" y="70" width="18" height="60" strokeWidth="0.5" strokeDasharray="2 2" />
                      <text x="60" y="65" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">STUDIO</text>
                      <text x="170" y="65" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">BATH</text>
                      <text x="252" y="80" fill="var(--color-brand-gold)" fontSize="5" fontFamily="monospace" opacity="0.4" transform="rotate(90, 252, 80)">BALCONY</text>
                    </g>
                  )}
                  {config.spaceType === "Residencia de Campo" && (
                    <g className="transition-all duration-500">
                      {/* Country house wide geometry */}
                      <path d="M 30 60 L 270 60 L 270 160 L 30 160 Z" strokeWidth="1" stroke="var(--color-brand-gold)" />
                      <line x1="90" y1="60" x2="90" y2="160" strokeWidth="0.75" />
                      <line x1="210" y1="60" x2="210" y2="160" strokeWidth="0.75" />
                      {/* Veranda posts */}
                      <circle cx="30" cy="180" r="2.5" strokeWidth="0.5" />
                      <circle cx="150" cy="180" r="2.5" strokeWidth="0.5" />
                      <circle cx="270" cy="180" r="2.5" strokeWidth="0.5" />
                      <line x1="30" y1="180" x2="270" y2="180" strokeWidth="0.5" strokeDasharray="3 3" />
                      <text x="40" y="75" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">DECK</text>
                      <text x="100" y="75" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">LOUNGE</text>
                      <text x="220" y="75" fill="var(--color-brand-gold)" fontSize="6" fontFamily="monospace" opacity="0.4">GARDEN</text>
                    </g>
                  )}

                  {/* DYNAMIC TECHNOLOGY INDICATORS (Nivel Domótica) */}
                  {config.automationLevel === "Smart Confort" && (
                    <g className="cad-active-node">
                      {/* Wall keypad controls */}
                      <circle cx="118" cy="70" r="3.5" fill="var(--color-brand-gold)" stroke="none" />
                      <circle cx="158" cy="110" r="3.5" fill="var(--color-brand-gold)" stroke="none" />
                      <text x="124" y="73" fill="var(--color-brand-gold)" fontSize="5.5" fontFamily="monospace">[KEYPAD]</text>
                    </g>
                  )}
                  {config.automationLevel === "Invisibilidad Total / Casa Atenta" && (
                    <g>
                      {/* Hidden radar occupancy zones */}
                      <circle cx="80" cy="110" r="22" stroke="var(--color-brand-gold)" strokeWidth="0.5" strokeDasharray="3 3" className="animate-pulse" opacity="0.65" />
                      <circle cx="200" cy="110" r="22" stroke="var(--color-brand-gold)" strokeWidth="0.5" strokeDasharray="3 3" className="animate-pulse" opacity="0.65" />
                      <circle cx="80" cy="110" r="2" fill="var(--color-brand-gold)" stroke="none" />
                      <circle cx="200" cy="110" r="2" fill="var(--color-brand-gold)" stroke="none" />
                      <text x="85" y="113" fill="var(--color-brand-gold)" fontSize="5" fontFamily="monospace" opacity="0.85">[RADAR_SENS]</text>
                    </g>
                  )}

                  {/* DYNAMIC PRIORITIES LAYERS HIGHLIGHTS */}
                  {config.focusArea === "Luz y Clima Circadiano" && (
                    <g>
                      {/* Highlight hidden lighting joints and linear HVAC diffusers */}
                      <line x1="50" y1="44" x2="110" y2="44" stroke="var(--color-brand-gold)" strokeWidth="2" className="animate-pulse" />
                      <line x1="130" y1="44" x2="250" y2="44" stroke="var(--color-brand-gold)" strokeWidth="2" className="animate-pulse" />
                      <text x="135" y="38" fill="var(--color-brand-gold)" fontSize="5" fontFamily="monospace">[LINEAR_HVAC_SLOT]</text>
                    </g>
                  )}
                  {config.focusArea === "Acústica Sensorial" && (
                    <g>
                      {/* Sound waves from walls */}
                      <path d="M 120 120 A 10 10 0 0 1 120 140" stroke="var(--color-brand-gold)" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "2.5s" }} />
                      <path d="M 120 115 A 15 15 0 0 1 120 145" stroke="var(--color-brand-gold)" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "2.5s", animationDelay: "0.6s" }} />
                      <text x="65" y="155" fill="var(--color-brand-gold)" fontSize="5" fontFamily="monospace" opacity="0.8">[CONCEALED_AUDIO]</text>
                    </g>
                  )}
                  {config.focusArea === "Seguridad Térmica Perimetral" && (
                    <g>
                      {/* Scanning outer lasers */}
                      <rect x="25" y="25" width="250" height="170" stroke="var(--color-brand-gold)" strokeWidth="0.75" strokeDasharray="3 1" className="animate-pulse" />
                      <text x="32" y="21" fill="var(--color-brand-gold)" fontSize="5.5" fontFamily="monospace">[THERMAL_PERIMETER: SHIELD]</text>
                    </g>
                  )}
                </svg>
              </div>

              {/* Status footer information */}
              <div className="border-t border-ca-border/60 pt-2 flex justify-between items-center text-[7.5px] font-mono text-ca-text-secondary/40">
                <span>SELECCIÓN: {config.spaceType ? "ACTIVE" : "PENDING"}</span>
                <span>SYS_TEMP: 21.8°C // OK</span>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  );
};
export default Configurator;
