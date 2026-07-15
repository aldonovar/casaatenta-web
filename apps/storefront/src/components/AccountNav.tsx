import Link from "next/link";
import { House, KeyRound, MapPin, PackageSearch, UserRound } from "lucide-react";

const links = [
  { href: "/cuenta", label: "Resumen", icon: House },
  { href: "/cuenta/pedidos", label: "Mis pedidos", icon: PackageSearch },
  { href: "/cuenta/direcciones", label: "Direcciones", icon: MapPin },
  { href: "/cuenta/seguridad", label: "Seguridad", icon: KeyRound },
];

export function AccountNav() {
  return (
    <aside className="account-nav">
      <div className="account-nav__user"><span><UserRound size={22} /></span><p><strong>Mi cuenta</strong><small>Casa Atenta</small></p></div>
      <nav>{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href}><Icon size={17} /> {label}</Link>)}</nav>
      <form action="/auth/salir" method="post"><button>Cerrar sesión</button></form>
    </aside>
  );
}
