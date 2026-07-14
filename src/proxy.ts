import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const BLOG_HOST = new URL(
  process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.casa-atenta.com",
).hostname;
const MAIN_HOSTS = new Set(["casa-atenta.com", "www.casa-atenta.com"]);

function requestHost(request: NextRequest) {
  return (request.headers.get("x-forwarded-host") || request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();
}

export function proxy(request: NextRequest) {
  const host = requestHost(request);
  const { pathname } = request.nextUrl;

  // A rewrite can pass through Proxy again. This marker lets the internal
  // /blog route resolve without being redirected back to its public URL.
  if (request.headers.get("x-casa-atenta-surface") === "blog") {
    return NextResponse.next();
  }

  if (host === BLOG_HOST || host === "blog.localhost") {
    if (pathname === "/blog" || pathname.startsWith("/blog/")) {
      const cleanPath = pathname.replace(/^\/blog(?=\/|$)/, "") || "/";
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = cleanPath;
      return NextResponse.redirect(redirectUrl, 308);
    }

    const rewriteUrl = request.nextUrl.clone();
    rewriteUrl.pathname = pathname === "/" ? "/blog" : `/blog${pathname}`;

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-casa-atenta-surface", "blog");

    return NextResponse.rewrite(rewriteUrl, {
      request: { headers: requestHeaders },
    });
  }

  if (MAIN_HOSTS.has(host) && (pathname === "/blog" || pathname.startsWith("/blog/"))) {
    const blogUrl = new URL(
      process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.casa-atenta.com",
    );
    blogUrl.pathname = pathname.replace(/^\/blog(?=\/|$)/, "") || "/";
    blogUrl.search = request.nextUrl.search;
    return NextResponse.redirect(blogUrl, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpe?g|gif|webp|svg|ico|woff2?)$).*)",
  ],
};
