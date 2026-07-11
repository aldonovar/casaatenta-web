"use client";
import{useEffect}from"react";import Lenis from"lenis";import{gsap}from"gsap";import{ScrollTrigger}from"gsap/ScrollTrigger";gsap.registerPlugin(ScrollTrigger);
export function SmoothScroll(){useEffect(()=>{const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches,desktop=matchMedia("(min-width:1024px) and (pointer:fine)").matches;if(reduced||!desktop)return;const lenis=new Lenis({duration:1,smoothWheel:true,wheelMultiplier:.9});const update=(time:number)=>lenis.raf(time*1000);lenis.on("scroll",ScrollTrigger.update);gsap.ticker.add(update);return()=>{gsap.ticker.remove(update);lenis.destroy();ScrollTrigger.refresh()}},[]);return null}
export default SmoothScroll;
