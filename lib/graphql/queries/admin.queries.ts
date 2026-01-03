import { gql } from "@apollo/client";

/**
 * Get Appointment Statistics Query
 *
 * Returns appointment counts for admin dashboard.
 */
export const GET_APPOINTMENT_STATS_QUERY = gql`
  query GetAppointmentStats {
    getAppointmentStats {
      total
      scheduled
      pending
      cancelled
    }
  }
`;

// Types
export interface AppointmentStats {
  total: number;
  scheduled: number;
  pending: number;
  cancelled: number;
}

export interface GetAppointmentStatsData {
  getAppointmentStats: AppointmentStats;
}

