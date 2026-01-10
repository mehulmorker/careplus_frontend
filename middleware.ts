import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware
 * 
 * Protects admin routes at the edge before the page loads.
 * Cookies are now same-domain (via API proxy), so middleware can check them.
 * 
 * Note: Allows request to proceed even without cookies to avoid race conditions
 * after login. Server component will handle authentication and redirect if needed.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    // Check for authentication cookies
    // Cookies are now same-domain thanks to API proxy route
    const accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // If tokens exist, let request proceed
    // If no tokens, still allow request to proceed - server component will handle redirect
    // This avoids race condition where cookies aren't available immediately after login
    // Server component will validate via GraphQL and redirect if not authenticated
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: ["/admin/:path*"],
};


