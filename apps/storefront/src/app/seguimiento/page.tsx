import type { Metadata } from "next";
import Link from "next/link";
import { KeyRound, PackageSearch, ShieldCheck } from "lucide-react";
import { GuestOrderAccessRequestForm } from "@/components/GuestOrderAccessRequestForm";

export const metadata: Metadata = {
  title: "Seguimiento seguro de pedidos",
  description: "Consulta privada para compras realizadas como invitado.",
  robots: { index: false, follow: false },
};

export default async function TrackingAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ pedido?: string; estado?: string }>;
}) {
  const { pedido = "", estado = "" } = await searchParams;
  const initialOrderNumber = /^CA-\d{8}-\d{6}$/.test(pedido.toUpperCase())
    ? pedido.toUpperCase()
    : "";

  return (
    <section className="guest-tracking-entry">
      <div className="store-container guest-tracking-entry__grid">
        <div className="guest-tracking-entry__intro">
          <span className="guest-tracking-entry__icon"><PackageSearch size={31} /></span>
          <span className="eyebrow">Pedidos de invitados</span>
          <h1>Seguimiento privado, sin crear una cuenta.</h1>
          <p>
            Por seguridad no basta con adivinar un número de pedido. Te enviamos
            un enlace firmado al mismo correo utilizado durante la compra.
          </p>
          <ul>
            <li><ShieldCheck size={17} /> El enlace no contiene tu correo, documento ni dirección.</li>
            <li><KeyRound size={17} /> Un enlace renovado no expone tus datos ni interrumpe uno que aún sea válido.</li>
          </ul>
          <Link href="/auth/ingresar" className="text-link">
            ¿Compraste con cuenta? Ingresa a Mis pedidos →
          </Link>
        </div>
        <div className="guest-tracking-entry__card">
          <h2>Solicitar acceso</h2>
          <p>Encontrarás el número en el correo de recepción del pedido.</p>
          {estado === "enlace-invalido" && (
            <div className="form-error" role="alert">
              El enlace venció, fue revocado o no es válido. Solicita uno nuevo.
            </div>
          )}
          {estado === "no-disponible" && (
            <div className="form-error" role="alert">
              El seguimiento no está disponible temporalmente. Intenta nuevamente.
            </div>
          )}
          {estado === "acceso-requerido" && (
            <div className="form-error" role="alert">
              Abre el enlace enviado a tu correo o solicita uno nuevo.
            </div>
          )}
          <GuestOrderAccessRequestForm initialOrderNumber={initialOrderNumber} />
        </div>
      </div>
    </section>
  );
}
