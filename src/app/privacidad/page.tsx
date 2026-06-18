import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Política de Privacidad | Casa Atenta",
  description:
    "Consulta cómo Casa Atenta recopila, utiliza y protege tus datos personales de acuerdo con la Ley N° 29733 de Protección de Datos Personales en el Perú.",
  keywords: [
    "política de privacidad casa atenta",
    "protección de datos personales",
    "tratamiento de datos lima",
  ],
};

const UPDATED_AT = "18 de junio de 2026";

export default function PrivacyPage() {
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

        <p className="ca-kicker mb-4">LEGAL & TRANSPARENCIA</p>
        <h1 className="text-4xl md:text-6xl font-display font-light uppercase tracking-wider mb-6">
          Política de <br />
          <span className="text-brand-gold italic font-serif normal-case">Privacidad</span>
        </h1>
        <p className="text-xs font-mono tracking-widest text-ca-text-secondary/50 mb-12">
          ÚLTIMA ACTUALIZACIÓN: {UPDATED_AT}
        </p>

        {/* Legal Text Sections */}
        <div className="space-y-12 text-sm md:text-base font-light text-ca-text-secondary leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              1. Responsable del Tratamiento de Datos
            </h2>
            <p>
              CASA ATENTA es responsable del tratamiento de los datos personales recopilados a través de los formularios del sitio web y los canales de mensajería integrados.
            </p>
            <p>
              Para cualquier consulta legal o relacionada con tus datos personales, puedes escribir a nuestro canal oficial de privacidad:{" "}
              <a className="text-brand-gold hover:text-brand-gold-light border-b border-brand-gold/30 pb-0.5 transition-colors" href="mailto:contacto@casa-atenta.com">
                contacto@casa-atenta.com
              </a>.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              2. Datos Personales Recopilados
            </h2>
            <p>
              Dependiendo de las interacciones que realices en el sitio web (formulario de cotización calificado, contacto por WhatsApp, suscripción al newsletter), recopilamos:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>Nombre y apellidos del titular del proyecto.</li>
              <li>Detalles de contacto (teléfono celular y correo electrónico).</li>
              <li>Información del inmueble o proyecto (tipo de servicio requerido, rango presupuestal, distrito de Lima y notas de requerimiento técnico).</li>
              <li>Datos anónimos de analítica (dirección IP encriptada, datos de navegación y comportamiento del usuario).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              3. Finalidad del Tratamiento de la Información
            </h2>
            <p>
              De conformidad con la Ley N° 29733 del Perú, tus datos serán tratados únicamente para las siguientes finalidades necesarias:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>Procesar, calificar y responder tus solicitudes de cotización o visitas técnicas para proyectos residenciales.</li>
              <li>Coordinar llamadas comerciales o de consultoría en iluminación inteligente y domótica.</li>
              <li>Mantener el envío regular de información sobre innovaciones técnicas y lanzamientos de nuestro blog (previo consentimiento expreso).</li>
              <li>Optimizar y evaluar de forma estadística el rendimiento de la web mediante analítica técnica agregada.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              4. Consentimiento y Legitimación
            </h2>
            <p>
              El tratamiento de tus datos personales se legitima mediante tu consentimiento libre, previo, expreso, informado e inequívoco, el cual otorgas activamente al completar y enviar los formularios digitales de la web de Casa Atenta.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              5. Periodo de Conservación de los Datos
            </h2>
            <p>
              Los datos personales facilitados se conservarán durante el periodo que resulte necesario para atender la relación pre-contractual o comercial establecida, y posteriormente durante el plazo de prescripción de responsabilidades legales que puedan derivarse de la misma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              6. Proveedores y Terceros
            </h2>
            <p>
              Casa Atenta no vende, alquila ni cede tus datos personales a terceros sin tu consentimiento previo. Para poder realizar nuestra operación digital técnica, la información puede ser gestionada por:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>Servicios de mensajería instantánea directa (WhatsApp Business).</li>
              <li>Proveedores de infraestructura en la nube y hosting seguro del sitio web (Vercel, Supabase).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              7. Seguridad de los Datos
            </h2>
            <p>
              Aplicamos estrictas medidas de seguridad técnicas y organizativas para garantizar la confidencialidad de tus datos y evitar cualquier alteración, pérdida o acceso no autorizado. Esto incluye el cifrado de datos en tránsito (protocolo SSL/HTTPS) y el almacenamiento en bases de datos con accesos restingidos bajo estándares industriales.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              8. Tus Derechos ARCO
            </h2>
            <p>
              Tienes pleno derecho a ejercer tus derechos de **Acceso, Rectificación, Cancelación y Oposición** (Derechos ARCO) respecto a tu información personal en cualquier momento.
            </p>
            <p>
              Para ejercerlos, puedes enviar una solicitud formal por escrito a nuestro email:{" "}
              <a className="text-brand-gold hover:text-brand-gold-light border-b border-brand-gold/30 pb-0.5 transition-colors" href="mailto:contacto@casa-atenta.com">
                contacto@casa-atenta.com
              </a>, adjuntando una copia legible de tu documento de identidad (DNI/CE).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              9. Cambios y Actualizaciones
            </h2>
            <p>
              Esta política puede sufrir variaciones debido a actualizaciones en la legislación vigente o cambios de diseño interno. Te sugerimos revisar este documento de forma periódica para mantenerte al tanto de cómo protegemos tu privacidad.
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
