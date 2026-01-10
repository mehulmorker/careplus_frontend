"use client";

import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@apollo/client";
import { GET_APPOINTMENT_QUERY } from "@/lib/graphql/queries/appointment.queries";
import Link from "next/link";

/**
 * Appointment Success Page
 *
 * Displays confirmation after successful appointment creation.
 */
const AppointmentSuccessPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const appointmentId = searchParams.get("appointmentId");

  const { data, loading, error } = useQuery(GET_APPOINTMENT_QUERY, {
    variables: { id: appointmentId },
    skip: !appointmentId,
  });

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p>Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.appointment) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">
            Failed to load appointment details. Please try again.
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-white"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const appointment = data.appointment;

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container my-auto">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src="/assets/icons/logo-full.svg"
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />

          <div className="space-y-6">
            <div className="text-center">
              <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="header">Appointment Request Submitted!</h1>
              <p className="text-dark-700">
                Your appointment request has been received and is pending confirmation.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Appointment Details</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Doctor:</span>
                  <p className="text-dark-700">{appointment.primaryPhysician}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Scheduled Date:</span>
                  <p className="text-dark-700">
                    {new Date(appointment.schedule).toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Reason:</span>
                  <p className="text-dark-700">{appointment.reason}</p>
                </div>
                {appointment.note && (
                  <div>
                    <span className="text-sm font-medium text-gray-600">Notes:</span>
                    <p className="text-dark-700">{appointment.note}</p>
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <p className="text-dark-700 capitalize">{appointment.status.toLowerCase()}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                href={`/patients/${appointment.patient?.userId}/new-appointment`}
                className="flex-1 rounded-md bg-primary px-4 py-2 text-center text-white transition hover:bg-primary/90"
              >
                Book Another Appointment
              </Link>
              <button
                onClick={() => router.push("/")}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 text-center transition hover:bg-gray-50"
              >
                Go Home
              </button>
            </div>
          </div>

          <p className="copyright mt-10 py-12">© {new Date().getFullYear()} CarePulse</p>
        </div>
      </section>

      <Image
        src="/assets/images/appointment-img.png"
        height={1500}
        width={1500}
        alt="appointment"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
};

export default AppointmentSuccessPage;

