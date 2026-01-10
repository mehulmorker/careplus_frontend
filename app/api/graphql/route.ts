import { NextRequest, NextResponse } from "next/server";

/**
 * GraphQL API Proxy Route
 * 
 * Proxies GraphQL requests from frontend to backend.
 * Rewrites cookies to be same-domain for middleware access.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const cookieHeader = request.headers.get("cookie") || "";
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql";
    
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(cookieHeader && { Cookie: cookieHeader }),
      },
      body: JSON.stringify(body),
      redirect: "manual",
    });
    
    const data = await response.json();
    const setCookieHeaders: string[] = [];
    
    if (typeof (response.headers as any).getSetCookie === "function") {
      setCookieHeaders.push(...(response.headers as any).getSetCookie());
    } else {
      response.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          if (Array.isArray(value)) {
            setCookieHeaders.push(...value);
          } else {
            setCookieHeaders.push(value);
          }
        }
      });
    }
    
    const nextResponse = NextResponse.json(data, {
      status: response.status,
    });
    
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        const parts = cookie.split(";").map((p) => p.trim());
        const [nameValue] = parts;
        
        const equalIndex = nameValue.indexOf("=");
        if (equalIndex === -1) {
          return;
        }
        
        const name = nameValue.substring(0, equalIndex);
        const value = nameValue.substring(equalIndex + 1);
        
        const attributes: string[] = [];
        let expiresDate: Date | null = null;
        let maxAgeValue: number | null = null;
        
        parts.slice(1).forEach((part) => {
          const lowerPart = part.toLowerCase();
          
          if (lowerPart.startsWith("domain=")) {
            return;
          }
          
          if (lowerPart.startsWith("expires=")) {
            const expiresValue = part.substring(8);
            expiresDate = new Date(expiresValue);
            attributes.push(part);
            return;
          }
          
          if (lowerPart.startsWith("max-age=")) {
            maxAgeValue = parseInt(part.substring(8), 10);
            if (maxAgeValue > 0) {
              attributes.push(part);
            }
            return;
          }
          
          attributes.push(part);
        });
        
        if ((!maxAgeValue || maxAgeValue === 0) && expiresDate !== null) {
          try {
            const expiresTime = (expiresDate as Date).getTime();
            if (!isNaN(expiresTime)) {
              const now = new Date();
              const secondsUntilExpiry = Math.max(0, Math.floor((expiresTime - now.getTime()) / 1000));
              if (secondsUntilExpiry > 0) {
                attributes.push(`Max-Age=${secondsUntilExpiry}`);
              }
            }
          } catch (error) {
            // Invalid date, skip Max-Age recalculation
          }
        }
        
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

