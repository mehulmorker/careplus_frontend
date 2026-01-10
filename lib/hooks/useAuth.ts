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
  // Cookies are sent automatically, so we always try to fetch
  const {
    data: meData,
    loading: meLoading,
    refetch: refetchMe,
  } = useQuery<MeQueryData>(ME_QUERY, {
    errorPolicy: "all", // Return data even if there are errors
  });

  // Register mutation
  const [registerMutation, { loading: registerLoading }] =
    useMutation<RegisterMutationData>(REGISTER_MUTATION);

  // Login mutation
  const [loginMutation, { loading: loginLoading }] =
    useMutation<LoginMutationData>(LOGIN_MUTATION);

  // Logout mutation
  const [logoutMutation] = useMutation(LOGOUT_MUTATION);

  // Tokens are now managed server-side via HTTP-only cookies
  // No client-side token management needed

  /**
   * Register a new user
   */
  const register = useCallback(
    async (input: RegisterInput) => {
      try {
        const { data } = await registerMutation({
          variables: { input },
        });

        if (data?.register.success) {
          // Cookies are set automatically by backend
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
    [registerMutation, refetchMe]
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

        if (data?.login.success) {
          // Cookies are set automatically by backend
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
    [loginMutation, refetchMe]
  );

  /**
   * Logout current user
   * Backend handles cookie clearing and token blacklisting
   */
  const logout = useCallback(async () => {
    try {
      await logoutMutation();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear Apollo cache
      await client.clearStore();
      // Redirect to home
      router.push("/");
    }
  }, [logoutMutation, client, router]);

  return {
    // User state
    user: meData?.me || null,
    isAuthenticated: !!meData?.me,
    loading: meLoading || registerLoading || loginLoading,

    // Auth functions
    register,
    login,
    logout,

    // Refetch user
    refetchMe,
  };
};

export default useAuth;
