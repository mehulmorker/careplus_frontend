"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";

import { Form } from "@/components/ui/form";
import {
  UserFormValidation,
  UserFormValues,
} from "@/lib/validations/user.validation";
import {
  CREATE_GUEST_USER_MUTATION,
  CreateGuestUserInput,
  CreateGuestUserMutationData,
} from "@/lib/graphql/mutations/guest.mutations";

import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

import "react-phone-number-input/style.css";

/**
 * Patient Form Component
 *
 * Initial form for new patients to book appointments.
 * Collects name, email, and phone (no password required).
 * On success, creates guest user and patient, then redirects to appointment booking.
 *
 * GraphQL Integration:
 * - Uses createGuestUser mutation
 * - Creates user without password (guest user)
 * - Creates minimal patient profile automatically
 * - Redirects directly to appointment booking
 */
export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createGuestUser] = useMutation<CreateGuestUserMutationData>(
    CREATE_GUEST_USER_MUTATION
  );

  const form = useForm<UserFormValues>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  /**
   * Handle form submission
   *
   * 1. Validate form data
   * 2. Call createGuestUser mutation
   * 3. On success, redirect to registration page
   * 4. On error, display error message
   */
  const onSubmit = async (values: UserFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      const input: CreateGuestUserInput = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const { data, errors } = await createGuestUser({
        variables: { input },
      });

      // Check for GraphQL errors first
      if (errors && errors.length > 0) {
        const errorMessage = errors[0]?.message || "Failed to create account";
        setError(errorMessage);
        setIsLoading(false);
        return;
      }

      // Check mutation result
      if (data?.createGuestUser.success && data.createGuestUser.user && data.createGuestUser.patient) {
        // Redirect to registration page (where patient can add image and complete profile)
        router.push(`/patients/${data.createGuestUser.user.id}/register`);
        return; // Exit early to prevent setIsLoading(false) from running
      } else {
        // Display error message
        const errorMessage =
          data?.createGuestUser.errors?.[0]?.message || "Failed to create account";
        setError(errorMessage);
      }
    } catch (err: unknown) {
      // Handle different error types safely
      let errorMessage = "An unexpected error occurred. Please try again.";
      
      if (err && typeof err === 'object') {
        const errorObj = err as any;
        
        // Check for GraphQL errors
        if (errorObj?.graphQLErrors && Array.isArray(errorObj.graphQLErrors) && errorObj.graphQLErrors.length > 0) {
          errorMessage = errorObj.graphQLErrors[0]?.message || errorMessage;
        } 
        // Check for network errors
        else if (errorObj?.networkError) {
          const networkErr = errorObj.networkError;
          errorMessage = networkErr?.message || "Network error. Please check your connection and try again.";
        } 
        // Check for generic error message
        else if (errorObj?.message && typeof errorObj.message === 'string') {
          errorMessage = errorObj.message;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        {/* Error display */}
        {error && (
          <div className="rounded-md bg-red-500/10 p-4 text-red-500">
            {error}
          </div>
        )}

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default PatientForm;

