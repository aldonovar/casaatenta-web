"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";

const items=[
  ["Inicio","/"],["Servicios","/servicios"],["Proyectos","/proyectos"],
  ["Proceso","/proceso"],["Nosotros","/nosotros"],["Contacto","/contacto"]
] as const;

export function Header(){
  const path=usePathname();
  const [open,setOpen]=useState(false);
  return <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07111d]/88 backdrop-blur-xl">
    <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
      <Link href="/" aria-label="Casa Atenta" onClick={()=>setOpen(false)}><Logo className="h-10 w-auto"/></Link>
      <nav className="hidden items-center gap-7 lg:flex" aria-label="Principal">
        {items.slice(1).map(([label,href])=><Link key={href} href={href} className={`text-[11px] uppercase tracking-[0.18em] transition ${path===href?"text-brand-gold":"text-ca-text/72 hover:text-ca-text"}`}>{label}</Link>)}
      </nav>
      <button type="button" aria-expanded={open} aria-controls="mobile-menu" onClick={()=>setOpen(v=>!v)} className="grid h-10 w-10 place-items-center border border-white/15 text-ca-text lg:hidden"><span className="sr-only">Abrir menú</span><span aria-hidden="true">{open?"×":"☰"}</span></button>
    </div>
    {open&&<nav id="mobile-menu" className="border-t border-white/10 bg-[#07111d] px-6 py-5 lg:hidden" aria-label="Móvil">
      <div className="mx-auto grid max-w-[1440px] gap-1">{items.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)} className="border-b border-white/8 py-3 text-sm uppercase tracking-[0.16em] text-ca-text">{label}</Link>)}</div>
    </nav>}
  </header>;
}
export default Header;
