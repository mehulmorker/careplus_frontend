"use client";

import { useMutation, useQuery, useApolloClient } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

import {
  REGISTER_MUTATION,
  LOGIN_MUTATION,
  LOGOUT_MUTATION,
  RegisterInput,
  LoginInput,
  RegisterMutationData,
  LoginMutationData,
} from "../graphql/mutations/auth.mutations";
import { ME_QUERY, MeQueryData } from "../graphql/queries/auth.queries";

// Local storage key for token
const TOKEN_KEY = "carepulse_token";

/**
 * useAuth Hook
 *
 * Provides authentication functionality:
 * - Current user state
 * - Register function
 * - Login function
 * - Logout function
 *
 * Usage:
 * ```
 * const { user, isAuthenticated, register, login, logout, loading } = useAuth();
 * ```
 */
export const useAuth = () => {
  const router = useRouter();
  const client = useApolloClient();

  // Query current user
  const {
    data: meData,
    loading: meLoading,
    refetch: refetchMe,
  } = useQuery<MeQueryData>(ME_QUERY, {
    // Skip if no token in localStorage
    skip: typeof window !== "undefined" && !localStorage.getItem(TOKEN_KEY),
  });

  // Register mutation
  const [registerMutation, { loading: registerLoading }] =
    useMutation<RegisterMutationData>(REGISTER_MUTATION);

  // Login mutation
  const [loginMutation, { loading: loginLoading }] =
    useMutation<LoginMutationData>(LOGIN_MUTATION);

  // Logout mutation
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  /**
   * Save token to localStorage and cookies
   * Cookies are needed for server-side authentication
   */
  const saveToken = useCallback((token: string) => {
    if (typeof window !== "undefined") {
      // Save to localStorage for client-side access
      localStorage.setItem(TOKEN_KEY, token);
      
      // Save to cookie for server-side access
      // Set cookie with 7 days expiration (matching JWT expiration)
      const expires = new Date();
      expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days
      document.cookie = `${TOKEN_KEY}=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    }
  }, []);

  /**
   * Remove token from localStorage and cookies, clear Apollo cache
   */
  const removeToken = useCallback(() => {
    if (typeof window !== "undefined") {
      // Remove from localStorage
      localStorage.removeItem(TOKEN_KEY);
      
      // Remove cookie by setting expiration to past date
      document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }, []);

  /**
   * Get token from localStorage
   */
  const getToken = useCallback((): string | null => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  }, []);

  /**
   * Register a new user
   */
  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const { data } = await registerMutation({
          variables: { input },
        });

        if (data?.register.success && data.register.token) {
          saveToken(data.register.token);
          await refetchMe();
          return { success: true, user: data.register.user };
        }

        return {
          success: false,
          errors: data?.register.errors || [{ message: "Registration failed" }],
        };
      } catch (error) {
        console.error("Register error:", error);
        return {
          success: false,
          errors: [{ message: "An unexpected error occurred" }],
        };
      }
    },
    [registerMutation, saveToken, refetchMe]
  );

  /**
   * Login with email and password
   */
  const login = useCallback(
    async (input: LoginInput) => {
      try {
        const { data } = await loginMutation({
          variables: { input },
        });

        if (data?.login.success && data.login.token) {
          saveToken(data.login.token);
          await refetchMe();
          return { success: true, user: data.login.user };
        }

        // Return specific error message from backend
        const errorMessage = data?.login.errors?.[0]?.message || "Invalid email or password";
        return {
          success: false,
          errors: [{ message: errorMessage }],
        };
      } catch (error: any) {
        console.error("Login error:", error);
        
        // Handle GraphQL errors
        if (error?.graphQLErrors?.length > 0) {
          const graphQLError = error.graphQLErrors[0];
          return {
            success: false,
            errors: [{ message: graphQLError.message || "Login failed" }],
          };
        }

        // Handle network errors
        if (error?.networkError) {
          return {
            success: false,
            errors: [{ message: "Network error. Please check your connection and try again." }],
          };
        }

        return {
          success: false,
          errors: [{ message: "An unexpected error occurred. Please try again." }],
        };
      }
    },
    [loginMutation, saveToken, refetchMe]
  );

  /**
   * Logout current user
   */
  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      removeToken();
      await client.clearStore();
      router.push("/");
    }
  }, [logoutMutation, removeToken, client, router]);

  return {
    // User state
    user: meData?.me || null,
    isAuthenticated: !!meData?.me,
    loading: meLoading || registerLoading || loginLoading,

    // Auth functions
    register,
    login,
    logout,

    // Token helpers
    getToken,
    saveToken,
    removeToken,

    // Refetch user
    refetchMe,
  };
};

export default useAuth;

