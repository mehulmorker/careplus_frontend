import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware
 * 
 * Protects admin routes at the edge before the page loads.
 * This provides better security and UX than client-side checks.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Get token from cookie
    const token = request.cookies.get("carepulse_token")?.value;

    // If no token, redirect to home with admin modal
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("admin", "true");
      return NextResponse.redirect(url);
    }

    // Token exists - let the request proceed
    // Server component will verify the token is valid and user is admin
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*"],
};


