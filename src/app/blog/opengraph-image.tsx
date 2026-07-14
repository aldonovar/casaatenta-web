import { ImageResponse } from "next/og";

export const alt = "Casa Atenta Editorial — Ideas para un hogar que responde";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 76px",
          color: "#f4f0e8",
          background:
            "radial-gradient(circle at 78% 20%, rgba(216,179,106,.22), transparent 30%), #07111d",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: "4px" }}>CASA ATENTA</div>
          <div style={{ fontSize: 16, color: "#d8b36a", letterSpacing: "4px" }}>EDITORIAL</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 920 }}>
          <div style={{ fontSize: 78, lineHeight: .95, textTransform: "uppercase", letterSpacing: "-2px" }}>
            Ideas para un hogar que responde.
          </div>
          <div style={{ marginTop: 32, fontSize: 24, lineHeight: 1.45, color: "#9aacbc" }}>
            Diseño, terrazas, iluminación y automatización residencial.
          </div>
        </div>
        <div style={{ display: "flex", width: 250, height: 3, background: "#d8b36a" }} />
      </div>
    ),
    size,
  );
}
