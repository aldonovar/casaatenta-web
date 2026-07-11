"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Logo } from "./Logo";

const navItems = [
  { label: "Inicio", path: "/" },
  { label: "Servicios", path: "/servicios" },
  { label: "Proyectos", path: "/proyectos" },
  { label: "Proceso", path: "/proceso" },
  { label: "Nosotros", path: "/nosotros" },
 