import { gql } from "@apollo/client";

/**
 * Create Appointment Mutation
 *
 * Creates a new appointment for a patient.
 */
export const CREATE_APPOINTMENT_MUTATION = gql`
  mutation CreateAppointment($input: CreateAppointmentInput!) {
    createAppointment(input: $input) {
      success
      appointment {
        id
        primaryPhysician
        schedule
        status
        reason
        note
        cancellationReason
        createdAt
        patient {
          id
          userId
          user {
            id
            name
            email
          }
        }
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Update Appointment Mutation
 */
export const UPDATE_APPOINTMENT_MUTATION = gql`
  mutation UpdateAppointment($id: ID!, $input: UpdateAppointmentInput!) {
    updateAppointment(id: $id, input: $input) {
      success
      appointment {
        id
        primaryPhysician
        schedule
        status
        reason
        note
        cancellationReason
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Schedule Appointment Mutation
 *
 * Changes appointment status to SCHEDULED.
 */
export const SCHEDULE_APPOINTMENT_MUTATION = gql`
  mutation ScheduleAppointment($id: ID!, $schedule: DateTime!) {
    scheduleAppointment(id: $id, schedule: $schedule) {
      success
      appointment {
        id
        schedule
        status
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

/**
 * Cancel Appointment Mutation
 */
export const CANCEL_APPOINTMENT_MUTATION = gql`
  mutation CancelAppointment($id: ID!, $reason: String!) {
    cancelAppointment(id: $id, reason: $reason) {
      success
      appointment {
        id
        status
        cancellationReason
      }
      errors {
        field
        message
        code
      }
    }
  }
`;

// Types for mutation variables
export interface CreateAppointmentInput {
  patientId: string;
  primaryPhysician: string;
  schedule: string; // ISO string
  reason: string;
  note?: string;
}

export interface UpdateAppointmentInput {
  primaryPhysician?: string;
  schedule?: string;
  reason?: string;
  note?: string;
  status?: "PENDING" | "SCHEDULED" | "CANCELLED";
  cancellationReason?: string;
}

// Types for mutation responses
export interface AppointmentData {
  id: string;
  primaryPhysician: string;
  schedule: string;
  status: string;
  reason: string;
  note?: string;
  cancellationReason?: string;
  createdAt: string;
  patient: {
    id: string;
    userId: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface FieldError {
  field?: string;
  message: string;
  code?: string;
}

export interface AppointmentPayload {
  success: boolean;
  appointment?: AppointmentData;
  errors: FieldError[];
}

export interface CreateAppointmentMutationData {
  createAppointment: AppointmentPayload;
}

export interface UpdateAppointmentMutationData {
  updateAppointment: AppointmentPayload;
}

export interface ScheduleAppointmentMutationData {
  scheduleAppointment: AppointmentPayload;
}

export interface CancelAppointmentMutationData {
  cancelAppointment: AppointmentPayload;
}
