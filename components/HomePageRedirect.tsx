"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";

/**
 * HomePageRedirect Component
 * 
 * Client component that checks if admin is logged in.
 * If admin is logged in, redirects to admin dashboard.
 * This prevents logged-in admins from accessing the homepage.
 */
export const HomePageRedirect = () => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // If user is authenticated and is admin, redirect to admin dashboard
    // Use replace to avoid adding to browser history
    if (isAuthenticated && user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [user, isAuthenticated, loading, router]);

  // This component doesn't render anything
  return null;
};

