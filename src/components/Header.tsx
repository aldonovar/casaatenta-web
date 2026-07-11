"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect,useState } from "react";
import { Logo } from "./Logo";

const items=[["Inicio","/"],["Servicios","/servicios"],["Proyectos","/proyectos"],["Proceso","/proceso"],["Nosotros","/nosotros"],["Contacto","/contacto"]] as const;

export function Header(){
  const path=usePathname();
  const [open,setOpen]=use