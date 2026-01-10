import { cookies } from "next/headers";

/**
 * Server-side authentication utilities
 * 
 * These functions work in Next.js server components and server actions
 * to check authentication status via cookies.
 * 
 * Note: Tokens are now HTTP-only cookies, so we can only check if they exist,
 * not read their values. Actual token validation happens on the backend.
 */

const ACCESS_TOKEN_COOKIE = "accessToken";
const REFRESH_TOKEN_COOKIE = "refreshToken";

/**
 * Check if user has authentication cookies (server-side)
 * 
 * @returns true if access or refresh token cookie exists
 */
export async function hasAuthCookies(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE);
    const refreshToken = cookieStore.get(REFRESH_TOKEN_COOKIE);
    return !!(accessToken || refreshToken);
  } catch (error) {
    // If cookies() fails (e.g., in middleware), return false
    return false;
  }
}

/**
 * Check if user has authentication cookies (for middleware)
 * 
 * @param request - Next.js request object
 * @returns true if access or refresh token cookie exists
 */
export function hasAuthCookiesFromRequest(request: Request): boolean {
  const cookies = request.headers.get("cookie");
  if (!cookies) {
    return false;
  }
  
  // Check if either token cookie exists
  return cookies.includes(`${ACCESS_TOKEN_COOKIE}=`) || 
         cookies.includes(`${REFRESH_TOKEN_COOKIE}=`);
}


