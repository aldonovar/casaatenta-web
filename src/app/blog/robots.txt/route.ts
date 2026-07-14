import { BLOG_URL } from "@/lib/urls";

export const dynamic = "force-static";

export function GET() {
  const body = [
    "User-agent: *",
    "Allow: /",
    `Sitemap: ${BLOG_URL}/sitemap.xml`,
    `Host: ${BLOG_URL}`,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
