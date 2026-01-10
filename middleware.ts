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
    // Check for authentication cookies
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If no tokens, redirect to home with admin modal
    if (!accessToken && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.searchParams.set("admin", "true");
      return NextResponse.redirect(url);
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


