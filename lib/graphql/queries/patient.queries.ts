import { gql } from "@apollo/client";

/**
 * Get Patient Query
 */
export const GET_PATIENT_QUERY = gql`
  query GetPatient($id: ID!) {
    patient(id: $id) {
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
  }
`;

/**
 * Get Patient by User ID Query
 */
export const GET_PATIENT_BY_USER_ID_QUERY = gql`
  query GetPatientByUserId($userId: ID!) {
    patientByUserId(userId: $userId) {
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
  }
`;

/**
 * Get Doctors Query
 */
export const GET_DOCTORS_QUERY = gql`
  query GetDoctors {
    doctors {
      id
      name
      image
      specialty
    }
  }
`;

// Types
export interface PatientQueryData {
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

export interface GetPatientData {
  patient: PatientQueryData | null;
}

export interface GetPatientByUserIdData {
  patientByUserId: PatientQueryData | null;
}

export interface DoctorData {
  id: string;
  name: string;
  image: string;
  specialty?: string;
}

export interface GetDoctorsData {
  doctors: DoctorData[];
}

