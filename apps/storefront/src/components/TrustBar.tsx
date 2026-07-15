import { Headphones, PackageCheck, RotateCcw, ShieldCheck, Truck } from "lucide-react";

const items = [
  { icon: PackageCheck, title: "Equipos verificados", text: "Modelo, kit y compatibilidad claros" },
  { icon: Truck, title: "Entrega transparente", text: "Costo y plazo antes de pagar" },
  { icon: ShieldCheck, title: "Compra protegida", text: "Openpay, antifraude y 3DS" },
  { icon: Headphones, title: "Asesoría técnica", text: "Te ayudamos a dimensionar" },
  { icon: RotateCcw, title: "Posventa que responde", text: "Garantía y repuestos trazables" },
];

export function TrustBar() {
  return (
    <section className="trust-bar" aria-label="Beneficios de comprar en Casa Atenta">
      <div className="store-container trust-bar__grid">
        {items.map(({ icon: Icon, title, text }) => (
          <div key={title} className="trust-item">
            <span><Icon size={20} /></span>
            <p><strong>{title}</strong><small>{text}</small></p>
          </div>
        ))}
      </div>
    </section>
  );
}
