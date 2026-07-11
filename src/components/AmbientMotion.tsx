"use client";
import {useEffect} from "react";
import {usePathname} from "next/navigation";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function AmbientMotion(){const pathname=usePathname();useEffect(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const main=document.getElementById("main-content");if(!main)return;const ctx=gsap.context(()=>{const sections=gsap.utils.toArray<HTMLElement>("section");sections.forEach((section,index)=>{if(index===0)return;const targets=Array.from(section.children).filter(el=>!(el as HTMLElement).dataset.motionIgnore);if(targets.length)gsap.fromTo(targets,{opacity:0,y:42},{opacity:1,y:0,duration:.9,stagger:.09,ease:"power3.out",scrollTrigger:{trigger:section,start:"top 82%",once:true}});const images=section.querySelectorAll("img");images.forEach(image=>gsap.fromTo(image,{scale:1.045},{scale:1,ease:"none",scrollTrigger:{trigger:section,start:"top bottom",end:"bottom top",scrub:.5}}))});},main);const timer=setTimeout(()=>ScrollTrigger.refresh(),250);return()=>{clearTimeout(timer);ctx.revert()}},[pathname]);return null}
export default AmbientMotion;