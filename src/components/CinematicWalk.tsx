"use client";

import Image from "next/image";
import React, { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { homeCopy, walkSteps } from "@/data/site";
import { SectionHeading } from "./SectionHeading";
import { BrandText } from "./BrandText";

gsap.registerPlugin(ScrollTrigger);

export const CinematicWalk: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if