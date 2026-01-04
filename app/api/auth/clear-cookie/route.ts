import { NextResponse } from "next/server";

const TOKEN_KEY = "carepulse_token";

/**
 * POST /api/auth/clear-cookie
 * 
 * Clears the authentication token cookie.
 * Used during logout to properly remove the server-side cookie.
 */
export async function POST() {
  try {
    const response = NextResponse.json({ success: true });

    // Clear cookie by setting it to empty with immediate expiration
    response.cookies.set(TOKEN_KEY, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return response;
  } catch (error) {
    console.error("Error clearing cookie:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear cookie" },
      { status: 500 }
    );
  }
}

