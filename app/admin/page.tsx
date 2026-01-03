import { redirect } from "next/navigation";

import { StatCard } from "@/components/StatCard";
import { columns } from "@/components/table/columns";
import { DataTable } from "@/components/table/DataTable";
import { AdminHeader } from "@/components/AdminHeader";
import { GET_APPOINTMENTS_QUERY } from "@/lib/graphql/queries/appointment.queries";
import { GET_APPOINTMENT_STATS_QUERY } from "@/lib/graphql/queries/admin.queries";
import { ME_QUERY } from "@/lib/graphql/queries/auth.queries";
import { getClient } from "@/lib/apollo/client";
import { getServerToken } from "@/lib/utils/auth.server";

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
  // Get token from cookies (server-side)
  const token = await getServerToken();

  // If no token, redirect to home with admin modal
  if (!token) {
    redirect("/?admin=true");
  }

  // Create client with token
  const client = getClient(token);

  // Verify user is authenticated and is admin
  try {
    const meResult = await client.query({
      query: ME_QUERY,
      fetchPolicy: "no-cache",
    });

    const user = meResult.data?.me;

    // If not authenticated or not admin, redirect
    if (!user || user.role !== "ADMIN") {
      redirect("/?admin=true");
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
  } catch (error) {
    // If any error occurs (auth failure, network error, etc.), redirect to login
    console.error("Admin page error:", error);
    redirect("/?admin=true");
  }
};

export default AdminPage;
