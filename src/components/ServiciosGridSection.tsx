import Image from "next/image";
import Link from "next/link";
import type { ComponentType } from "react";
import {
  IluminacionIcon,
  MantenimientoIcon,
  SmartHomeIcon,
  TechosIcon,
  TerrazasIcon,
} from "./icons/AnimatedIcons";

type ServiceIcon = ComponentType<{ className?: string; size?: number }>;

type ServiceCard = {
  slug: string;
  title: string;
  text: string;
  image: string