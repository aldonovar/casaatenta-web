"use client";
import Link from"next/link";import{usePathname}from"next/navigation";import{useEffect,useRef,useState}from"react";import{gsap}from"gsap";import{SunIcon,MoonIcon}from"./icons/AnimatedIcons";import{Logo}from"./Logo";import{BrandText}from"./BrandText";
const items=[["Automatización","/servicios/smart-homes"],["Servicios","/servicios"],["Proyectos","/proyectos"],["Proceso","/proceso"],["Nosotros","/nosotros"],["Contacto","/contacto"]]as const;
const active=(path:string,href:string)=>href==="/servicios"?path==="/servicios":path===href||path.startsWith(`${href}/`);
export function Header(){const path=usePathname(),[open,setOpen]=useState(false),[light,setLight]=useState(false),[scrolled,setScrolled]=useState(false);const