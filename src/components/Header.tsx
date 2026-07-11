"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { SunIcon, MoonIcon } from "./icons/AnimatedIcons";
import { Logo } from "./Logo";
import { BrandText } from "./BrandText";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Servicios", path: "/servicios" },
  { label: "Proyectos", path: