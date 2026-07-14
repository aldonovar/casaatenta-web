const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

export const SITE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.casa-atenta.com",
);

export const BLOG_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_BLOG_URL || "https://blog.casa-atenta.com",
);

export function siteUrl(path = "") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function blogUrl(path = "") {
  if (!path || path === "/") return BLOG_URL;
  return `${BLOG_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
