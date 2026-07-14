import { ImageResponse } from "next/og";
import { getBlogPost } from "@/data/blog-posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  const title = post?.hero.h1 || "Casa Atenta Editorial";
  const category = post?.hero.category || "Editorial";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "66px 74px",
          color: "#f4f0e8",
          background:
            "radial-gradient(circle at 82% 16%, rgba(216,179,106,.25), transparent 31%), linear-gradient(135deg, #07111d, #0c2742)",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: "4px" }}>CASA ATENTA</div>
          <div style={{ fontSize: 15, color: "#d8b36a", letterSpacing: "3px", textTransform: "uppercase" }}>
            {category}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", maxWidth: 1020 }}>
          <div style={{ fontSize: title.length > 64 ? 57 : 70, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "-1.5px" }}>
            {title}
          </div>
          <div style={{ marginTop: 30, fontSize: 19, color: "#9aacbc", letterSpacing: "2px" }}>
            CASA ATENTA EDITORIAL · LIMA, PERÚ
          </div>
        </div>
        <div style={{ display: "flex", width: 260, height: 3, background: "#d8b36a" }} />
      </div>
    ),
    size,
  );
}
