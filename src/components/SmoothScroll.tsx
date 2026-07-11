"use client";
import {useEffect} from "react";
import Lenis from "lenis";
import {gsap} from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export function SmoothScroll(){useEffect(()=>{if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;const lenis=new Lenis({duration:1.05,smoothWheel:true,wheelMultiplier:.9,touchMultiplier:1.05});const update=(time:number)=>lenis.raf(time*1000);lenis.on("scroll",ScrollTrigger.update);gsap.ticker.add(update);gsap.ticker.lagSmoothing(0);return()=>{gsap.ticker.remove(update);lenis.destroy()}},[]);return null}
export default SmoothScroll;