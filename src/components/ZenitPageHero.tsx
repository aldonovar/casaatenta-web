"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BrandText } from "./BrandText";

type Variant="services"|"projects"|"process"|"studio"|"contact"|"service";
type Action={label:string;href:string;external?:boolean};
type Props={number:string;eyebrow:string;title:string;description:string;variant:Variant;action?:Action;secondary?:Action;meta