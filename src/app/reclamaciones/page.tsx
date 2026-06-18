"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";

interface FormErrors {
  [key: string]: string;
}

export default function ReclamacionesPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    documentType: "DNI",
    documentNumber: "",
    email: "",
    phone: "",
    address: "",
    minorGuardian: "",
    claimType: "Reclamo", // Reclamo o Queja
    productDescription: "",
    claimedAmount: "",
    claimDetail: "",
    consumerRequest: ""
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [claimCode, setClaimCode] = useState("");
  const [claimDate, setClaimDate] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "El nombre completo es obligatorio.";
    if (!formData.documentNumber.trim()) newErrors.documentNumber = "El número de documento es obligatorio.";
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido.";
    }
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es obligatorio.";
    if (!formData.address.trim()) newErrors.address = "La dirección de domicilio es obligatoria.";
    if (!formData.productDescription.trim()) newErrors.productDescription = "Describe el bien o servicio adquirido.";
    if (!formData.claimDetail.trim()) newErrors.claimDetail = "Describe el detalle del reclamo o queja.";
    if (!formData.consumerRequest.trim()) newErrors.consumerRequest = "Indica tu pedido concreto de solución.";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Generate a random unique tracking code: CA-REC-YYYY-XXXX
      const year = new Date().getFullYear();
      const randNum = Math.floor(1000 + Math.random() * 9000);
      const code = `CA-REC-${year}-${randNum}`;
      
      setClaimCode(code);
      setClaimDate(new Date().toLocaleDateString("es-PE", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      }));
      
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main className="min-h-screen bg-ca-bg-deep text-ca-text pt-32 pb-24 relative overflow-hidden transition-colors duration-800">
      {/* Immersive background aura blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] rounded-full bg-brand-gold/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[35rem] h-[35rem] rounded-full bg-ca-bg-primary/20 blur-[130px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center mb-16 pb-8 border-b border-ca-border/20">
          <Link href="/" className="group flex items-center space-x-2 text-xs font-mono uppercase tracking-[0.2em] text-ca-text-secondary hover:text-brand-gold transition-colors duration-300">
            <span>← Volver al inicio</span>
          </Link>
          <Logo className="h-8 w-auto opacity-70" iconOnly={true} />
        </div>

        {!isSubmitted ? (
          <>
            <p className="ca-kicker mb-4">SERVICIO AL CONSUMIDOR</p>
            <h1 className="text-4xl md:text-6xl font-display font-light uppercase tracking-wider mb-6">
              Libro de <br />
              <span className="text-brand-gold italic font-serif normal-case">Reclamaciones</span>
            </h1>
            <p className="text-sm font-light text-ca-text-secondary leading-relaxed mb-12 max-w-2xl">
              Conforme a lo establecido en el Código de Protección y Defensa del Consumidor de la República del Perú (Ley N° 29571), ponemos a tu disposición nuestro Libro de Reclamaciones Virtual para registrar tus reclamos o quejas comerciales.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Sección 1: Datos del Consumidor */}
              <div className="space-y-6">
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-gold border-b border-ca-border/20 pb-2">
                  1. Identificación del Consumidor Reclamante
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Nombre Completo o Razón Social *</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                      placeholder="Ej. Juan Pérez"
                    />
                    {errors.fullName && <p className="text-xs text-red-400 font-mono mt-1">{errors.fullName}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2 col-span-1">
                      <label htmlFor="documentType" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Tipo Doc. *</label>
                      <select
                        id="documentType"
                        name="documentType"
                        value={formData.documentType}
                        onChange={handleChange}
                        className="w-full bg-ca-bg-surface border border-ca-border/60 rounded px-3 py-3 text-sm focus:outline-none focus:border-brand-gold transition-colors"
                      >
                        <option value="DNI">DNI</option>
                        <option value="CE">C.E.</option>
                        <option value="RUC">RUC</option>
                        <option value="Pasaporte">PAS</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 col-span-2">
                      <label htmlFor="documentNumber" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Nº Documento *</label>
                      <input
                        type="text"
                        id="documentNumber"
                        name="documentNumber"
                        value={formData.documentNumber}
                        onChange={handleChange}
                        className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                        placeholder="Ej. 76543210"
                      />
                      {errors.documentNumber && <p className="text-xs text-red-400 font-mono mt-1">{errors.documentNumber}</p>}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Correo Electrónico *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                      placeholder="Ej. juan@correo.com"
                    />
                    {errors.email && <p className="text-xs text-red-400 font-mono mt-1">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Teléfono Celular *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                      placeholder="Ej. 987654321"
                    />
                    {errors.phone && <p className="text-xs text-red-400 font-mono mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="address" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Domicilio Completo *</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                    placeholder="Calle, avenida, número y distrito"
                  />
                  {errors.address && <p className="text-xs text-red-400 font-mono mt-1">{errors.address}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="minorGuardian" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Nombre de Padre/Madre o Tutor (Solo si el consumidor es menor de edad)</label>
                  <input
                    type="text"
                    id="minorGuardian"
                    name="minorGuardian"
                    value={formData.minorGuardian}
                    onChange={handleChange}
                    className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                    placeholder="Nombre del apoderado legal"
                  />
                </div>
              </div>

              {/* Sección 2: Detalle del Bien o Servicio */}
              <div className="space-y-6">
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-gold border-b border-ca-border/20 pb-2">
                  2. Identificación del Bien o Servicio Contratado
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="productDescription" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Descripción del Bien/Servicio adquirido *</label>
                    <input
                      type="text"
                      id="productDescription"
                      name="productDescription"
                      value={formData.productDescription}
                      onChange={handleChange}
                      className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                      placeholder="Ej. Techo Sol y Sombra / Integración Domótica"
                    />
                    {errors.productDescription && <p className="text-xs text-red-400 font-mono mt-1">{errors.productDescription}</p>}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="claimedAmount" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Monto Reclamado (S/.) (Opcional)</label>
                    <input
                      type="number"
                      id="claimedAmount"
                      name="claimedAmount"
                      value={formData.claimedAmount}
                      onChange={handleChange}
                      className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors"
                      placeholder="Ej. 1500"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Detalle de Reclamación */}
              <div className="space-y-6">
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-brand-gold border-b border-ca-border/20 pb-2">
                  3. Detalle de la Reclamación
                </h3>

                <div className="space-y-4">
                  <span className="block text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Tipo de Acción *</span>
                  <div className="flex space-x-8">
                    <label className="flex items-center space-x-3 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="claimType"
                        value="Reclamo"
                        checked={formData.claimType === "Reclamo"}
                        onChange={handleChange}
                        className="accent-brand-gold w-4 h-4 cursor-pointer"
                      />
                      <span>
                        <strong className="text-ca-text">Reclamo:</strong> Disconformidad relacionada a los servicios o productos contratados.
                      </span>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer text-sm">
                      <input
                        type="radio"
                        name="claimType"
                        value="Queja"
                        checked={formData.claimType === "Queja"}
                        onChange={handleChange}
                        className="accent-brand-gold w-4 h-4 cursor-pointer"
                      />
                      <span>
                        <strong className="text-ca-text">Queja:</strong> Disconformidad no relacionada directamente a los bienes, sino al trato, atención o soporte.
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="claimDetail" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Detalle del Reclamo o Queja *</label>
                  <textarea
                    id="claimDetail"
                    name="claimDetail"
                    rows={5}
                    value={formData.claimDetail}
                    onChange={handleChange}
                    className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors resize-y"
                    placeholder="Describe claramente los hechos ocurridos..."
                  />
                  {errors.claimDetail && <p className="text-xs text-red-400 font-mono mt-1">{errors.claimDetail}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="consumerRequest" className="text-xs font-mono uppercase tracking-wider text-ca-text-secondary">Pedido Concreto del Consumidor *</label>
                  <textarea
                    id="consumerRequest"
                    name="consumerRequest"
                    rows={3}
                    value={formData.consumerRequest}
                    onChange={handleChange}
                    className="w-full bg-ca-bg-surface/50 border border-ca-border/60 rounded px-4 py-3 text-sm focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold/30 transition-colors resize-y"
                    placeholder="Detalla tu pedido de solución..."
                  />
                  {errors.consumerRequest && <p className="text-xs text-red-400 font-mono mt-1">{errors.consumerRequest}</p>}
                </div>
              </div>

              {/* Declaración e Envío */}
              <div className="space-y-6 pt-4">
                <p className="text-xs text-ca-text-secondary/50 leading-relaxed">
                  * Al enviar este formulario, declaras que los datos ingresados son verídicos y que prestas tu consentimiento para el tratamiento de tu reclamo de conformidad con la normativa de protección de datos del consumidor en el Perú. Casa Atenta enviará una copia del reclamo a la dirección de correo proporcionada. La atención del mismo será resuelta en un plazo máximo de quince (15) días hábiles improrrogables.
                </p>

                <div className="flex justify-start">
                  <button
                    type="submit"
                    className="ca-button hover:cursor-pointer"
                  >
                    Registrar Reclamación
                  </button>
                </div>
              </div>

            </form>
          </>
        ) : (
          /* ÉXITO - COMPROBANTE DE RECLAMO */
          <div className="space-y-12">
            
            {/* Header de Comprobante */}
            <div className="text-center space-y-4 py-8 border-b border-ca-border/20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-gold/10 border border-brand-gold/30 text-brand-gold mb-2">
                <svg className="w-8 h-8 stroke-current fill-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="ca-kicker">Registro Exitoso</p>
              <h2 className="text-3xl md:text-5xl font-display font-light uppercase tracking-wider text-ca-text">
                Reclamación <br className="md:hidden" />
                <span className="text-brand-gold italic font-serif normal-case">Registrada</span>
              </h2>
              <p className="text-sm font-light text-ca-text-secondary max-w-lg mx-auto">
                Tu solicitud ha sido catalogada y enviada a nuestro equipo de auditoría legal. Recibirás una copia en tu bandeja de entrada en los próximos minutos.
              </p>
            </div>

            {/* Ficha Técnica de Reclamación */}
            <div className="glass-panel rounded-lg p-6 md:p-8 space-y-6 text-sm">
              <div className="flex flex-col md:flex-row justify-between border-b border-ca-border/10 pb-4 gap-4">
                <div>
                  <span className="block text-[10px] font-mono text-ca-text-secondary/50 uppercase tracking-widest">Código de Registro</span>
                  <span className="font-mono text-lg text-brand-gold font-bold">{claimCode}</span>
                </div>
                <div className="md:text-right">
                  <span className="block text-[10px] font-mono text-ca-text-secondary/50 uppercase tracking-widest">Fecha y Hora de Emisión</span>
                  <span className="font-mono text-sm text-ca-text">{claimDate}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-4 border-b border-ca-border/10">
                <div>
                  <span className="block text-[10px] font-mono text-ca-text-secondary/50 uppercase tracking-widest mb-1.5">Consumidor Reclamante</span>
                  <p className="font-medium text-ca-text">{formData.fullName}</p>
                  <p className="text-xs text-ca-text-secondary">{formData.documentType}: {formData.documentNumber}</p>
                  <p className="text-xs text-ca-text-secondary">{formData.email} | {formData.phone}</p>
                  <p className="text-xs text-ca-text-secondary mt-1">{formData.address}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-ca-text-secondary/50 uppercase tracking-widest mb-1.5">Detalle del Servicio</span>
                  <p className="font-medium text-ca-text">{formData.productDescription}</p>
                  {formData.claimedAmount && <p className="text-xs text-brand-gold">Monto Estimado: S/. {formData.claimedAmount}</p>}
                  <p className="text-xs text-ca-text-secondary mt-2">Acción catalogada como: <strong>{formData.claimType}</strong></p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="block text-[10px] font-mono text-ca-text-secondary/50 uppercase tracking-widest mb-1">Detalle del Inconveniente</span>
                  <p className="text-ca-text leading-relaxed font-light bg-ca-bg-deep/40 rounded p-4 border border-ca-border/10 whitespace-pre-wrap">{formData.claimDetail}</p>
                </div>
                <div>
                  <span className="block text-[10px] font-mono text-ca-text-secondary/50 uppercase tracking-widest mb-1">Pedido del Cliente</span>
                  <p className="text-ca-text leading-relaxed font-light bg-ca-bg-deep/40 rounded p-4 border border-ca-border/10 whitespace-pre-wrap">{formData.consumerRequest}</p>
                </div>
              </div>
            </div>

            {/* Acciones y Plazos */}
            <div className="space-y-6 text-center max-w-xl mx-auto">
              <div className="p-4 bg-brand-gold/5 border border-brand-gold/10 rounded-lg text-xs text-ca-text-secondary leading-relaxed">
                <strong>Plazo de Respuesta Legal:</strong> De conformidad con la directiva nacional, Casa Atenta brindará respuesta por escrito a tu dirección de correo electrónico en un plazo no mayor a 15 días hábiles.
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 border border-ca-border text-xs font-mono uppercase tracking-widest hover:bg-ca-text hover:text-ca-bg-deep hover:cursor-pointer transition-all duration-300"
                >
                  Imprimir Comprobante
                </button>
                <Link
                  href="/"
                  className="px-6 py-3 bg-brand-gold text-ca-night text-xs font-mono uppercase tracking-widest hover:bg-brand-gold-light transition-all duration-300 inline-block font-semibold"
                >
                  Regresar a la Web
                </Link>
              </div>
            </div>

          </div>
        )}

      </div>
    </main>
  );
}
