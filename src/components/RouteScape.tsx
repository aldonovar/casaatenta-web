"use client";
import {useEffect,useRef} from "react";
import {usePathname} from "next/navigation";
import {gsap} from "gsap";

const rootOf=(p:string)=>"/"+(p.split("/").filter(Boolean)[0]||"");
const drawings:Record<string,string[]>={
  "/servicios":["M120 620H1080","M220 520V210H980V520","M300 270H900","M300 340H900","M300 410H900"],
  "/proyectos":["M150 610L390 250H820L1050 610","M390 250V610","M820 250V610","M520 250V610","M690 250V610"],
  "/pro