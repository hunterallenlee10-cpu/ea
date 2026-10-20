import { NextResponse, type NextRequest } from "next/server";
import { resolveRedirect } from "./lib/redirects";

// Lowercase + trailing-slash + legacy redirects in one hop (KICKSTART 2.3).
// Only the path changes; the query string (gclid, utm_*) is kept exactly as sent.
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const target = resolveRedirect(pathname);
  if (!target) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = target;
  url.search = search;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // Skip Next internals, API routes and any path with a file extension.
  matcher: ["/((?!_next/|api/|.*\\.[A-Za-z0-9]+$).*)"],
};
