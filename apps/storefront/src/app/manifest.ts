import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Casa Atenta Tienda",
    short_name: "Casa Atenta",
    description: "Herramientas y maquinaria profesional en Perú.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5f7f7",
    theme_color: "#071521",
    lang: "es-PE",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}
