"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

/**
 * HomePageRedirect Component
 * 
 * Client component that checks if admin is logged in.
 * If admin is logged in, redirects to admin dashboard.
 * This prevents logged-in admins from accessing the homepage.
 * 
 * Prevents redirect loop by checking current pathname.
 */
export const HomePageRedirect = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Only redirect if we're on the homepage and admin is logged in
    // Don't redirect if already on admin page (prevents redirect loop)
    if (pathname === "/" && isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [user, isAuthenticated, loading, router, pathname]);

  // This component doesn't render anything
  return null;
};

