import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/Logo";

export const metadata: Metadata = {
  title: "Términos y Condiciones | Casa Atenta",
  description:
    "Revisa los términos y condiciones de uso del sitio web de Casa Atenta, que regulan el alcance de nuestros servicios de arquitectura y domótica.",
  keywords: [
    "términos y condiciones casa atenta",
    "condiciones de uso",
    "servicios domótica lima",
  ],
};

const UPDATED_AT = "18 de junio de 2026";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ca-bg-deep text-ca-text pt-32 pb-24 relative overflow-hidden transition-colors duration-800">
      {/* Immersive background aura blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] rounded-full bg-brand-gold/3 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[35rem] h-[35rem] rounded-full bg-ca-bg-primary/20 blur-[130px] pointer-events-none z-0" />

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
          Términos y <br />
          <span className="text-brand-gold italic font-serif normal-case">Condiciones</span>
        </h1>
        <p className="text-xs font-mono tracking-widest text-ca-text-secondary/50 mb-12">
          ÚLTIMA ACTUALIZACIÓN: {UPDATED_AT}
        </p>

        {/* Legal Text Sections */}
        <div className="space-y-12 text-sm md:text-base font-light text-ca-text-secondary leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              1. Aceptación del Contrato
            </h2>
            <p>
              Al acceder, navegar o utilizar este sitio web, o al enviar formularios de contacto y cotización técnica, manifiestas tu aceptación incondicional de los presentes Términos y Condiciones. Si no estás de acuerdo con alguna de las cláusulas aquí estipuladas, te solicitamos abstenerte de hacer uso de la plataforma.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              2. Propósito y Propuesta del Sitio
            </h2>
            <p>
              El sitio web de Casa Atenta tiene una finalidad informativa, publicitaria y comercial orientada a presentar soluciones integrales de diseño residencial, techos sol y sombra, terrazas modernas, iluminación circadiana y domótica avanzada. Asimismo, facilita un canal digital directo para calificar a potenciales clientes e iniciar visitas técnicas presenciales en Lima, Perú.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              3. Cotizaciones e Informes Técnicos
            </h2>
            <p>
              Cualquier cotización inicial calculada en línea o provista tras el contacto inicial se considera estrictamente referencial. 
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>El presupuesto real, los alcances arquitectónicos y las especificaciones finales se formalizarán por escrito en una propuesta comercial valorizada.</li>
              <li>La viabilidad técnica, los tiempos de ejecución de las obras y los costos finales están sujetos a la visita técnica de diagnóstico estructural y las características del inmueble.</li>
              <li>Los cronogramas de obra podrán sufrir variaciones a causa de factores climatológicos, retraso en aprobaciones municipales o disponibilidad de materiales de importación.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              4. Condiciones de Uso de la Plataforma
            </h2>
            <p>
              El usuario se compromete a hacer uso de este sitio web de conformidad con la ley, la moral y las buenas costumbres. Está prohibido de manera enunciativa mas no limitativa:
            </p>
            <ul className="list-disc pl-6 space-y-2 font-light">
              <li>Incurrir en cualquier acto ilícito o que busque vulnerar la seguridad, el código fuente o el rendimiento del sitio web.</li>
              <li>Ingresar datos falsos, maliciosos o suplantar la identidad de terceros en los formularios de cotización o de reclamación.</li>
              <li>Extraer información, imágenes o contenidos mediante técnicas de "scraping" o bots automatizados.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              5. Derechos de Propiedad Intelectual
            </h2>
            <p>
              Todo el contenido presente en esta plataforma —incluyendo textos, renders 3D, planos de simulación interactiva, códigos, logotipos, wordmarks, interfaces y animaciones— es de propiedad exclusiva de Casa Atenta o es utilizado con las licencias correspondientes. Queda terminantemente prohibida su reproducción, distribución o uso para fines comerciales sin la autorización previa por escrito del representante legal de la marca.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              6. Enlaces y Servicios de Terceros
            </h2>
            <p>
              Esta plataforma incorpora redireccionamientos a herramientas de terceros como WhatsApp, redes sociales u otros proveedores técnicos. Casa Atenta no ejerce control ni asume responsabilidad alguna por el contenido, políticas de privacidad o el funcionamiento de dichos sitios de terceros.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              7. Limitación de Responsabilidad
            </h2>
            <p>
              Si bien realizamos esfuerzos permanentes para mantener la exactitud de la información comercial y la disponibilidad del sitio web, no garantizamos que el servicio esté libre de caídas temporales del servidor, errores en la visualización interactiva de renders, o virus informáticos externos. Casa Atenta se reserva el derecho de modificar el contenido de la web o suspender secciones de la misma sin previo aviso.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              8. Resolución de Conflictos y Jurisdicción
            </h2>
            <p>
              Cualquier controversia relacionada con el uso de este sitio web o la interpretación de estos términos se resolverá bajo las leyes de la República del Perú y se someterá a la jurisdicción de los jueces y tribunales de la ciudad de Lima Cercado, renunciando expresamente a cualquier otro fuero.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl md:text-2xl font-display font-light uppercase tracking-wide text-ca-text">
              9. Contacto Directo
            </h2>
            <p>
              Si tienes preguntas sobre este documento o deseas programar una consulta técnica:
            </p>
            <p className="font-mono text-xs text-brand-gold">
              Email: contacto@casa-atenta.com <br />
              WhatsApp: +51 908 550 942
            </p>
          </section>

        </div>
      </div>
    </main>
  );
}
