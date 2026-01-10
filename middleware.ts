import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware
 * 
 * Protects admin routes at the edge before the page loads.
 * Cookies are now same-domain (via API proxy), so middleware can check them.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Check for authentication cookies
    // Cookies are now same-domain thanks to API proxy route
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If no tokens, redirect to home
    if (!accessToken && !refreshToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Tokens exist - let the request proceed
    // Server component will verify the token is valid and user is admin
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*"],
};


