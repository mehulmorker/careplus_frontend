"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/button";

/**
 * AdminHeader Component
 * 
 * Header for admin dashboard with:
 * - Logo
 * - Dashboard title
 * - Logout button
 */
export const AdminHeader = () => {
  const router = useRouter();
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    // Logout function already handles redirect and token cleanup
    await logout();
  };

  return (
    <header className="admin-header">
      <Link href="/" className="cursor-pointer">
        <Image
          src="/assets/icons/logo-full.svg"
          height={32}
          width={162}
          alt="logo"
          className="h-8 w-fit"
        />
      </Link>

      <div className="flex items-center gap-4">
        {user && (
          <p className="text-14-regular text-dark-600">
            {user.name}
          </p>
        )}
        <p className="text-16-semibold">Admin Dashboard</p>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="shad-gray-btn"
        >
          Logout
        </Button>
      </div>
    </header>
  );
};

