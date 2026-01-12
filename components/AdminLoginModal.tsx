"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  LoginFormValidation,
  LoginFormValues,
} from "@/lib/validations/user.validation";
import CustomFormField, { FormFieldType } from "./CustomFormField";
import { Form } from "./ui/form";

interface AdminLoginModalProps {
  onClose: () => void;
}

/**
 * Admin Login Modal Component
 *
 * Modal that appears when user clicks "Admin" button on homepage.
 * Allows admin users to login with email and password.
 * After successful login, waits for cookies to be set, then redirects to admin dashboard.
 *
 * UX Improvements:
 * - Modal stays open on error (doesn't close)
 * - Clear error messages
 * - Loading state prevents multiple submissions
 * - Delay before redirect ensures cookies are available for middleware check
 */
export const AdminLoginModal = ({ onClose }: AdminLoginModalProps) => {
  const router = useRouter();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormValidation),
    defaultValues: {
      email: "admin@careplus.com",
      password: "Careplus123!",
    },
  });

  const handleOpenChange = (open: boolean) => {
    // Prevent closing when loading
    if (!open && isLoading) {
      return;
    }
    // Allow closing - clear error and call onClose
    if (!open) {
      setError(null);
      onClose();
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(values);

      if (result.success && result.user) {
        // Check if user is admin
        if (result.user.role === "ADMIN") {
          // Wait for cookies to be set by browser before redirecting
          // Cookies are now same-domain (via API proxy), but browser needs time to process them
          // Increased delay to ensure cookies are available when middleware runs
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Use window.location.href for full page reload
          // This ensures middleware runs and can check cookies properly
          window.location.href = "/admin";
          // Keep loading state - will be cleared when page navigates
        } else {
          // Not an admin user
          setError("Access denied. Admin privileges required.");
          setIsLoading(false);
        }
      } else {
        // Login failed - show error but keep modal open
        setError(
          result.errors?.[0]?.message ||
            "Invalid email or password. Please try again."
        );
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      // Network or unexpected error - show error but keep modal open
      setError(
        "An unexpected error occurred. Please check your connection and try again."
      );
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={true} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="shad-alert-dialog max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Login
            <button
              onClick={onClose}
              className="cursor-pointer"
              type="button"
              disabled={isLoading}
              aria-label="Close modal"
            >
              <Image
                src="/assets/icons/close.svg"
                alt="close"
                width={20}
                height={20}
              />
            </button>
          </AlertDialogTitle>
          <AlertDialogDescription>
            Please login with your admin credentials to access the admin
            dashboard.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="admin@careplus.com"
              disabled={isLoading}
            />

            <CustomFormField
              fieldType={FormFieldType.PASSWORD}
              control={form.control}
              name="password"
              label="Password"
              placeholder="Enter your password"
              disabled={isLoading}
            />

            {error && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-14-regular text-red-600 text-center">
                  {error}
                </p>
              </div>
            )}

            <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
              <AlertDialogAction
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                }}
                disabled={isLoading}
                className="shad-gray-btn w-full"
              >
                Cancel
              </AlertDialogAction>
              <Button
                type="submit"
                disabled={isLoading}
                className="shad-primary-btn w-full"
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
