"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Header } from "./Header";
import { WhatsAppButton } from "./WhatsAppButton";
import { Footer } from "./Footer";
import { InjectIconStyles } from "./icons/AnimatedIcons";
import { Preloader } from "./Preloader";
gsap.registerPlugin(ScrollTrigger);
export function ClientWrapper({children}:{children:React.ReactNode}){const pathname=usePathname();useEffect(()=>{window.scrollTo({top:0,left:0,behavior:"auto"});const frame=requestAnimationFrame(()=>ScrollTrigger.refresh());const timer=window.setTimeout(()=>ScrollTrigger.refresh(),350);return()=>{cancelAnimationFrame(frame);clearTimeout(timer)}},[pathname]);const shell=pathname!=="/about/conexiones";return <div className="relative flex min-h-screen flex-col overflow-x-clip bg-ca-bg-deep font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark"><InjectIconStyles/><Preloader/>{shell&&<Header/>}<main id="main-content" tabIndex={-1} className="relative z-10 w-full flex-grow bg-ca-bg-deep outline-none">{children}</main><WhatsAppButton variant="floating" label="Enviar foto y medidas"/>{shell&&<Footer/>}</div>}
export default ClientWrapper;