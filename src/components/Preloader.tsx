"use client";
import { useEffect,useState } from "react";

export function Preloader(){
  const [show,setShow]=useState(false);
  useEffect(()=>{const seen=sessionStorage.getItem("ca-preloader");if(seen)return;setShow(true);const t=window.setTimeout(()=>{sessionStorage.setItem("ca-preloader","1");setShow(false);},1600);return()=>window.clearTimeout(t);},[]);
  if(!show)return null;
  return <div className="fixed inset-0 z-[10000] grid place-items-center overflow-hidden bg-[#07111d] text-ca-text" role="status" aria-label="Cargando Casa Atenta">
    <style>{`@keyframes caDraw{to{stroke-dashoffset:0}}@keyframes caFade{0%,78%{opacity:1}100%{opacity:0}}.ca-preloader{animation:caFade 1.6s ease forwards}.ca-preloader path,.ca-preloader circle{stroke-dasharray:900;stroke-dashoffset:900;animation:caDraw 1s cubic-bezier(.65,0,.35,1) forwards}.ca-preloader .d2{animation-delay:.12s}.ca-preloader .d3{animation-delay:.24s}.ca-preloader .d4{animation-delay:.34s}@media(prefers-reduced-motion:reduce){.ca-preloader path,.ca-preloader circle{animation:none;stroke-dashoffset:0}}`}</style>
    <div className="ca-preloader flex flex-col items-center gap-7">
      <svg viewBox="0 0 240 240" className="h-28 w-28 fill-none stroke-current" aria-hidden="true"><circle cx="120" cy="120" r="78" strokeWidth="7"/><circle className="d2" cx="120" cy="120" r="55" strokeWidth="2"/><path className="d3" d="M92 112l28-17 28 17" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/><path className="d4" d="M120 126v24" strokeWidth="5" strokeLinecap="round"/></svg>
      <div className="text-center"><p className="text-[10px] uppercase tracking-[.42em] text-brand-gold">Casa Atenta</p><p className="mt-3 text-[8px] uppercase tracking-[.28em] text-ca-text/45">Diseño · ejecución · control</p></div>
    </div>
  </div>;
}
export default Preloader;
