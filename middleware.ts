import { NextResponse } from "next/server";

/**
 * Injects the request pathname into headers so the root layout can set
 * a self-referencing canonical URL dynamically for every page.
 */
export function middleware(request: Request) {
  const url = new URL(request.url);
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", url.pathname);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
