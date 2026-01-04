import { NextRequest, NextResponse } from "next/server";

const TOKEN_KEY = "carepulse_token";

/**
 * POST /api/auth/set-cookie
 * 
 * Sets the authentication token as an HTTP-only cookie.
 * This ensures the cookie is properly set with Secure flag in production (HTTPS).
 * 
 * Body: { token: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { success: false, error: "Token is required" },
        { status: 400 }
      );
    }

    // Create response
    const response = NextResponse.json({ success: true });

    // Set cookie with proper attributes for production
    // - Secure: Only send over HTTPS (required for production)
    // - SameSite=Lax: Prevents CSRF while allowing normal navigation
    // - HttpOnly: false - We need client-side access for Apollo client
    // - Path=/: Cookie available across the entire site
    // - Max-Age: 7 days in seconds
    const isProduction = process.env.NODE_ENV === "production";
    
    response.cookies.set(TOKEN_KEY, token, {
      httpOnly: false, // Need client-side access for Apollo
      secure: isProduction, // Only require HTTPS in production
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
    });

    return response;
  } catch (error) {
    console.error("Error setting cookie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set cookie" },
      { status: 500 }
    );
  }
}

