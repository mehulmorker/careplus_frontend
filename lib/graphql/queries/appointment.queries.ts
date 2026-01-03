import { gql } from "@apollo/client";

/**
 * Get Appointment Query
 */
export const GET_APPOINTMENT_QUERY = gql`
  query GetAppointment($id: ID!) {
    appointment(id: $id) {
      id
      primaryPhysician
      schedule
      status
      reason
      note
      cancellationReason
      createdAt
      updatedAt
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
  }
`;

/**
 * Get Patient Appointments Query
 */
export const GET_PATIENT_APPOINTMENTS_QUERY = gql`
  query GetPatientAppointments($patientId: ID!) {
    patientAppointments(patientId: $patientId) {
      id
      primaryPhysician
      schedule
      status
      reason
      note
      cancellationReason
      createdAt
      updatedAt
    }
  }
`;

/**
 * Get All Appointments Query (with filters)
 */
export const GET_APPOINTMENTS_QUERY = gql`
  query GetAppointments($status: AppointmentStatus) {
    appointments(status: $status) {
      success
      appointments {
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
          birthDate
          gender
          address
          occupation
          emergencyContactName
          emergencyContactNumber
          primaryPhysician
          insuranceProvider
          insurancePolicyNumber
          allergies
          currentMedication
          familyMedicalHistory
          pastMedicalHistory
          identificationType
          identificationNumber
          identificationDocumentUrl
          user {
            id
            name
            email
            phone
          }
        }
      }
      counts {
        total
        scheduled
        pending
        cancelled
      }
      errors {
        message
      }
    }
  }
`;

// Types
export interface AppointmentQueryData {
  id: string;
  primaryPhysician: string;
  schedule: string;
  status: string;
  reason: string;
  note?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    userId: string;
    birthDate: string;
    gender: string;
    address: string;
    occupation: string;
    emergencyContactName: string;
    emergencyContactNumber: string;
    primaryPhysician: string;
    insuranceProvider: string;
    insurancePolicyNumber: string;
    allergies?: string;
    currentMedication?: string;
    familyMedicalHistory?: string;
    pastMedicalHistory?: string;
    identificationType?: string;
    identificationNumber?: string;
    identificationDocumentUrl?: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone?: string;
    };
  };
}

export interface GetAppointmentData {
  appointment: AppointmentQueryData | null;
}

export interface GetPatientAppointmentsData {
  patientAppointments: AppointmentQueryData[];
}

export interface AppointmentCounts {
  total: number;
  scheduled: number;
  pending: number;
  cancelled: number;
}

export interface GetAppointmentsData {
  appointments: {
    success: boolean;
    appointments: AppointmentQueryData[];
    counts: AppointmentCounts;
    errors: Array<{ message: string }>;
  };
}
