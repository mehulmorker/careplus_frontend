import { cookies } from "next/headers";

/**
 * Server-side authentication utilities
 * 
 * These functions work in Next.js server components and server actions
 * to access authentication tokens from cookies or headers.
 */

const TOKEN_KEY = "carepulse_token";

/**
 * Get authentication token from cookies (server-side)
 * 
 * @returns Token string or null
 */
export async function getServerToken(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(TOKEN_KEY);
    return token?.value || null;
  } catch (error) {
    // If cookies() fails (e.g., in middleware), return null
    return null;
  }
}

/**
 * Get authentication token from request headers (for middleware)
 * 
 * @param request - Next.js request object
 * @returns Token string or null
 */
export function getTokenFromHeaders(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  
  if (!authHeader) {
    return null;
  }

  const parts = authHeader.split(" ");
  
  if (parts.length !== 2 || parts[0].toLowerCase() !== "bearer") {
    return null;
  }

  return parts[1];
}


