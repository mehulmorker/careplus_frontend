import Image from "next/image";
import { AppointmentForm } from "@/components/forms/AppointmentForm";
import { GET_PATIENT_BY_USER_ID_QUERY } from "@/lib/graphql/queries/patient.queries";
import { getClient } from "@/lib/apollo/client";

interface PageProps {
  params: {
    userId: string;
  };
}

/**
 * New Appointment Page
 *
 * Server component that fetches patient data and renders the appointment form.
 */
const AppointmentPage = async ({ params: { userId } }: PageProps) => {
  // Fetch patient data
  const client = getClient();
  const { data } = await client.query({
    query: GET_PATIENT_BY_USER_ID_QUERY,
    variables: { userId },
    context: {
      fetchOptions: {
        cache: "no-store",
      },
    },
  });

  const patient = data?.patientByUserId;

  if (!patient) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Patient Not Found</h1>
          <p className="mt-2 text-gray-600">
            Please register as a patient first before booking an appointment.
          </p>
        </div>
      </div>
    );
  }

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

          <AppointmentForm
            patientId={patient.id}
            userId={userId}
            type="create"
          />

          <p className="copyright mt-10 py-12">© 2024 CarePulse</p>
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

export default AppointmentPage;

