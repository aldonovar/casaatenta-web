"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import {Header} from "./Header";
import {WhatsAppButton} from "./WhatsAppButton";
import {Footer} from "./Footer";
import {InjectIconStyles} from "./icons/AnimatedIcons";
import {Preloader} from "./Preloader";
import {SmoothScroll} from "./SmoothScroll";
import {RouteExperience} from "./RouteExperience";
import {AmbientMotion} from "./AmbientMotion";
gsap.registerPlugin(ScrollTrigger);
export function ClientWrapper({children}:{children:React.ReactNode}){const pathname=usePathname();useEffect(()=>{const frame=requestAnimationFrame(()=>ScrollTrigger.refresh());const timer=window.setTimeout(()=>ScrollTrigger.refresh(),500);return()=>{cancelAnimationFrame(frame);clearTimeout(timer)}},[pathname]);useEffect(()=>{const bar=document.getElementById("scroll-progress");if(!bar)return;const update=()=>{const max=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${max>0?scrollY/max:0})`};update();addEventListener("scroll",update,{passive:true});addEventListener("resize",update);return()=>{removeEventListener("scroll",update);removeEventListener("resize",update)}},[]);const shell=pathname!=="/about/conexiones";return <div className="relative flex min-h-screen flex-col overflow-x-clip bg-ca-bg-deep font-sans text-brand-light antialiased selection:bg-brand-gold selection:text-brand-dark"><InjectIconStyles/><SmoothScroll/><Preloader/><RouteExperience/><AmbientMotion/><div id="scroll-progress" aria-hidden="true" className="fixed left-0 top-0 z-[9100] h-[2px] w-full origin-left scale-x-0 bg-brand-gold"/>{shell&&<Header/>}<main id="main-content" tabIndex={-1} className="relative z-10 w-full flex-grow bg-ca-bg-deep outline-none">{children}</main><WhatsAppButton variant="floating" label="Enviar foto y medidas"/>{shell&&<Footer/>}</div>}
export default ClientWrapper;