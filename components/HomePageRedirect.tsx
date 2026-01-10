"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

/**
 * HomePageRedirect Component
 * 
 * Client component that checks if admin is logged in.
 * If admin is logged in, redirects to admin dashboard.
 * This prevents logged-in admins from accessing the homepage.
 * 
 * Prevents redirect loop by:
 * - Checking current pathname
 * - Adding delay to avoid race condition with cookie availability
 * - Only redirecting once per mount
 */
export const HomePageRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Only redirect if we're on the homepage and admin is logged in
    // Don't redirect if already on admin page (prevents redirect loop)
    // Don't redirect if we've already redirected (prevents multiple redirects)
    if (
      pathname === "/" &&
      isAuthenticated &&
      user?.role === "ADMIN" &&
      !hasRedirected.current
    ) {
      // Add small delay to ensure cookies are available
      // This prevents race condition where middleware redirects to / 
      // before cookies are fully processed
      const timeoutId = setTimeout(() => {
        hasRedirected.current = true;
        router.replace("/admin");
      }, 300);

      return () => clearTimeout(timeoutId);
    }
  }, [user, isAuthenticated, loading, router, pathname]);

  // Reset redirect flag when pathname changes
  useEffect(() => {
    if (pathname !== "/") {
      hasRedirected.current = false;
    }
  }, [pathname]);

  // This component doesn't render anything
  return null;
};

