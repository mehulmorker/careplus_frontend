import { gql } from "@apollo/client";

/**
 * Register Patient Mutation
 *
 * Creates a complete patient profile for an existing user.
 */
export const REGISTER_PATIENT_MUTATION = gql`
  mutation RegisterPatient($input: RegisterPatientInput!) {
    registerPatient(input: $input) {
      success
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
        privacyConsent
        treatmentConsent
        disclosureConsent
        user {
          id
          name
          email
          phone
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
 * Update Patient Mutation
 */
export const UPDATE_PATIENT_MUTATION = gql`
  mutation UpdatePatient($id: ID!, $input: UpdatePatientInput!) {
    updatePatient(id: $id, input: $input) {
      success
      patient {
        id
        birthDate
        gender
        address
        occupation
        primaryPhysician
        insuranceProvider
        insurancePolicyNumber
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
export interface RegisterPatientInput {
  userId: string;
  birthDate: string; // ISO string
  gender: "MALE" | "FEMALE" | "OTHER";
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
  identificationDocumentId?: string;
  identificationDocumentUrl?: string;
  privacyConsent: boolean;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
}

export interface UpdatePatientInput {
  birthDate?: string;
  gender?: "MALE" | "FEMALE" | "OTHER";
  address?: string;
  occupation?: string;
  emergencyContactName?: string;
  emergencyContactNumber?: string;
  primaryPhysician?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  allergies?: string;
  currentMedication?: string;
  familyMedicalHistory?: string;
  pastMedicalHistory?: string;
}

// Types for mutation responses
export interface PatientData {
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
  privacyConsent: boolean;
  treatmentConsent: boolean;
  disclosureConsent: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

export interface FieldError {
  field?: string;
  message: string;
  code?: string;
}

export interface PatientPayload {
  success: boolean;
  patient?: PatientData;
  errors: FieldError[];
}

export interface RegisterPatientMutationData {
  registerPatient: PatientPayload;
}

export interface UpdatePatientMutationData {
  updatePatient: PatientPayload;
}
