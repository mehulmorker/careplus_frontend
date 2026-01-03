import { gql } from "@apollo/client";

/**
 * Create Guest User Mutation
 *
 * Creates a guest user (without password) and minimal patient profile
 * for immediate appointment booking.
 */
export const CREATE_GUEST_USER_MUTATION = gql`
  mutation CreateGuestUser($input: CreateGuestUserInput!) {
    createGuestUser(input: $input) {
      success
      user {
        id
        email
        name
        phone
        role
      }
      patient {
        id
        userId
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
 * Input type for creating a guest user
 */
export interface CreateGuestUserInput {
  name: string;
  email: string;
  phone: string;
}

/**
 * Response type for guest user creation
 */
export interface GuestUserPayload {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
  };
  patient?: {
    id: string;
    userId: string;
  };
  errors: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}

/**
 * Mutation data type
 */
export interface CreateGuestUserMutationData {
  createGuestUser: GuestUserPayload;
}


