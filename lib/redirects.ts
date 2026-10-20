import { LEGACY_REDIRECTS } from "./live-urls";

/**
 * Resolve any incoming path to its final URL path in ONE step:
 * strip trailing slash, lowercase, then apply the legacy redirect map.
 * Returns null when the path is already final.
 */
export function resolveRedirect(pathname: string): string | null {
  let p = pathname;
  if (p.length > 1 && p.endsWith("/")) p = p.replace(/\/+$/, "") || "/";
  p = p.toLowerCase();
  p = LEGACY_REDIRECTS[p] ?? p;
  return p === pathname ? null : p;
}
