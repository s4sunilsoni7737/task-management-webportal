import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has("dexter-session");

  // Allow auth-related routes to bypass protection
  if (pathname.startsWith("/login") || pathname.startsWith("/auth/callback")) {
    if (hasSession) {
      // If user is already logged in, redirect away from login page to dashboard
      return NextResponse.redirect(new URL("/tasks", request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!hasSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except Next.js internals, static files, images, etc.
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icons|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
