import { NextRequest, NextResponse } from "next/server";
import { constantTimeEqual } from "@/lib/ct-equal";

// Gate for the operations surface. Everything matched below can read or change
// order state, so it fails closed: when the credentials are not configured the
// route is refused outright rather than served unauthenticated.
//
// Runs on the edge runtime, so node:crypto is unavailable — constantTimeEqual
// is pure JS for exactly that reason.

const ADMIN_PAGES = "/admin";
const ADMIN_APIS = ["/api/sadad/verify", "/api/sadad/reject"];

function unauthorized(realm: boolean) {
  return new NextResponse("Unauthorized", {
    status: 401,
    headers: realm ? { "WWW-Authenticate": 'Basic realm="BrainSAIT Admin"' } : {},
  });
}

function misconfigured(what: string) {
  console.error(`[middleware] Refusing request: ${what} is not configured.`);
  return new NextResponse("Admin authentication unavailable", { status: 503 });
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Admin APIs: bearer token, for programmatic callers ---
  if (ADMIN_APIS.some((p) => pathname.startsWith(p))) {
    const expected = process.env.ADMIN_API_TOKEN;
    if (!expected) return misconfigured("ADMIN_API_TOKEN");

    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token || !constantTimeEqual(expected, token)) {
      return unauthorized(false);
    }
    return NextResponse.next();
  }

  // --- Admin pages: HTTP Basic, so a browser can reach them ---
  if (pathname === ADMIN_PAGES || pathname.startsWith(`${ADMIN_PAGES}/`)) {
    const user = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASSWORD;
    if (!user || !password) return misconfigured("ADMIN_USER / ADMIN_PASSWORD");

    const header = request.headers.get("authorization") ?? "";
    if (!header.startsWith("Basic ")) return unauthorized(true);

    let decoded: string;
    try {
      decoded = atob(header.slice(6));
    } catch {
      return unauthorized(true);
    }

    const sep = decoded.indexOf(":");
    if (sep < 0) return unauthorized(true);

    const okUser = constantTimeEqual(user, decoded.slice(0, sep));
    const okPass = constantTimeEqual(password, decoded.slice(sep + 1));

    // Evaluate both before returning so the response time does not reveal
    // whether it was the username or the password that was wrong.
    if (!okUser || !okPass) return unauthorized(true);

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/sadad/verify", "/api/sadad/reject"],
};
