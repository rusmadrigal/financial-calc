/**
 * Single source of truth for canonical base URL.
 * Used for self-referencing canonicals across the site and JSON-LD.
 */
export const CANONICAL_BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.smartcalclab.com";

export function getCanonicalUrl(pathname: string): string {
  const path = pathname?.startsWith("/") ? pathname : `/${pathname || ""}`;
  return path === "/" ? `${CANONICAL_BASE}/` : `${CANONICAL_BASE}${path}`;
}
