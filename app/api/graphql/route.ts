import { NextRequest, NextResponse } from "next/server";

/**
 * GraphQL API Proxy Route
 * 
 * Proxies GraphQL requests from frontend to backend.
 * This allows cookies to be set on the same domain (frontend),
 * making them accessible to Next.js middleware.
 * 
 * Benefits:
 * - Cookies are same-domain (accessible in middleware)
 * - Better security (edge protection)
 * - Better UX (no flash of content before redirect)
 */
export async function POST(request: NextRequest) {
  try {
    // Get request body
    const body = await request.json();
    
    // Get cookies from incoming request
    const cookieHeader = request.headers.get("cookie") || "";
    
    // Get backend URL from environment variable
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";
    
    // Forward request to backend
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Forward cookies to backend
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: JSON.stringify(body),
      // Important: Don't follow redirects automatically
      redirect: "manual",
    });
    
    // Get response data
    const data = await response.json();
    
    // Get Set-Cookie headers from backend response
    const setCookieHeaders = response.headers.getSetCookie();
    
    // Create response with data
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    // Forward Set-Cookie headers from backend to frontend
    // Rewrite cookies to be for frontend domain (remove domain attribute)
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        // Parse cookie string
        const parts = cookie.split(";").map((p) => p.trim());
        const [nameValue] = parts;
        const [name, ...valueParts] = nameValue.split("=");
        const value = valueParts.join("=");
        
        // Extract attributes (skip domain)
        const attributes: string[] = [];
        parts.slice(1).forEach((part) => {
          const lowerPart = part.toLowerCase();
          // Skip domain attribute - browser will use current domain
          if (!lowerPart.startsWith("domain=")) {
            attributes.push(part);
          }
        });
        
        // Reconstruct cookie without domain
        const cookieString = attributes.length > 0
          ? `${name}=${value}; ${attributes.join("; ")}`
          : `${name}=${value}`;
        
        nextResponse.headers.append("Set-Cookie", cookieString);
      });
    }
    
    return nextResponse;
  } catch (error) {
    console.error("GraphQL proxy error:", error);
    return NextResponse.json(
      {
        errors: [
          {
            message: "Internal server error",
            extensions: { code: "INTERNAL_SERVER_ERROR" },
          },
        ],
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Cookie",
      "Access-Control-Allow-Credentials": "true",
    },
  });
}

