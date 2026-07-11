import Image from "next/image";
import Link from "next/link";
import type { ServicePageData } from "@/data/services-pages";
import { ServiceMotionGraphics } from "./ServiceMotionGraphics";

type Presentation={label:string;title:string;summary:string;image:string;visual:string;focus:string[]};
const presentations:Record<string,Presentation>={
  "techos-sol-y-sombra":{label:"Cubiertas para exterior",title:"Sombra,