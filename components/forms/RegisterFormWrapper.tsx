"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";

import RegisterForm from "./RegisterForm";
import { GET_USER_QUERY } from "@/lib/graphql/queries/auth.queries";
import { GET_PATIENT_BY_USER_ID_QUERY } from "@/lib/graphql/queries/patient.queries";

/**
 * Client-side wrapper for RegisterForm
 *
 * Fetches user data and renders the form once data is available.
 * Checks if patient already completed registration and redirects if needed.
 */
export function RegisterFormWrapper({ userId }: { userId: string }) {
  const router = useRouter();

  // Fetch user data
  const { data: userData, loading: userLoading, error: userError } = useQuery(GET_USER_QUERY, {
    variables: { id: userId },
    fetchPolicy: "network-only", // Always fetch fresh data
  });

  // Fetch patient data to check if registration is complete
  const { data: patientData, loading: patientLoading } = useQuery(GET_PATIENT_BY_USER_ID_QUERY, {
    variables: { userId },
    fetchPolicy: "network-only", // Always fetch fresh data
  });

  const loading = userLoading || patientLoading;
  const patient = patientData?.patientByUserId;

  // Check if patient has completed registration (not just minimal profile)
  useEffect(() => {
    if (patient && patient.address && patient.address !== "Not provided" && patient.address !== "N/A") {
      // Patient already registered, redirect to appointment page
      router.replace(`/patients/${userId}/new-appointment`);
    }
  }, [patient, userId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Image
          src="/assets/icons/loader.svg"
          alt="Loading"
          width={40}
          height={40}
          className="animate-spin"
        />
      </div>
    );
  }

  if (userError || !userData?.user) {
    return (
      <div className="rounded-md bg-red-500/10 p-4 text-red-500">
        User not found. Please try logging in again.
      </div>
    );
  }

  return <RegisterForm user={userData.user} />;
}

export default RegisterFormWrapper;

