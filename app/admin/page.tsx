import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { AdminHeader } from "@/components/AdminHeader";
import { GET_APPOINTMENTS_QUERY } from "@/lib/graphql/queries/appointment.queries";
import { GET_APPOINTMENT_STATS_QUERY } from "@/lib/graphql/queries/admin.queries";
import { ME_QUERY } from "@/lib/graphql/queries/auth.queries";
import { getClient } from "@/lib/apollo/client";

/**
 * Admin Dashboard Page
 *
 * Server component that displays:
 * - Welcome message
 * - Appointment statistics (scheduled, pending, cancelled)
 * - Data table with all appointments
 *
 * Requires admin authentication - checks on server-side before rendering.
 */
const AdminPage = async () => {
  // Get cookies from Next.js request and forward to GraphQL backend
  const cookieStore = await cookies();
  // Convert cookies to header string format: "name1=value1; name2=value2"
  const cookieHeader = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  
  // Create client with cookies forwarded
  const client = getClient(cookieHeader);

  // Verify user is authenticated and is admin
  // This will handle cookie validation on the backend
  try {
    const meResult = await client.query({
      query: ME_QUERY,
      fetchPolicy: "no-cache",
    });

    const user = meResult.data?.me;

    // If not authenticated or not admin, redirect to home
    // Note: redirect() throws NEXT_REDIRECT which is expected behavior in Next.js
    if (!user || user.role !== "ADMIN") {
      redirect("/");
    }

    // Fetch appointments and statistics in parallel
    const [appointmentsResult, statsResult] = await Promise.all([
      client.query({
        query: GET_APPOINTMENTS_QUERY,
        variables: {},
        fetchPolicy: "no-cache",
      }),
      client.query({
        query: GET_APPOINTMENT_STATS_QUERY,
        fetchPolicy: "no-cache",
      }),
    ]);

    const appointments = appointmentsResult.data?.appointments;
    const stats = statsResult.data?.getAppointmentStats;

    return (
      <div className="mx-auto flex max-w-7xl flex-col space-y-14">
        <AdminHeader />

      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome 👋</h1>
          <p className="text-dark-700">
            Start the day with managing new appointments
          </p>
        </section>

        <section className="admin-stat">
          <StatCard
            type="appointments"
            count={stats?.scheduled || 0}
            label="Scheduled appointments"
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            count={stats?.pending || 0}
            label="Pending appointments"
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="cancelled"
            count={stats?.cancelled || 0}
            label="Cancelled appointments"
            icon="/assets/icons/cancelled.svg"
          />
        </section>

        <DataTable columns={columns} data={appointments?.appointments || []} />
      </main>
      </div>
    );
  } catch (error: any) {
    // Check if it's an authentication error
    const isAuthError = error?.graphQLErrors?.some(
      (e: any) => e.extensions?.code === "UNAUTHENTICATED" || 
                  e.extensions?.code === "UNAUTHORIZED"
    );

    if (isAuthError) {
      // Auth error - redirect to home
      redirect("/");
    } else {
      // Other errors (network, etc.) - log and redirect
      // Note: redirect() throws NEXT_REDIRECT which is expected behavior in Next.js
      // This error may appear in console during development but is handled by Next.js
      console.error("Admin page error:", error);
      redirect("/");
    }
  }
};

export default AdminPage;
