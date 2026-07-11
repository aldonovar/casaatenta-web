"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const clamp = gsap.utils.clamp(0, 1);

export const ZenitMotionSystem: React.FC = () => {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const