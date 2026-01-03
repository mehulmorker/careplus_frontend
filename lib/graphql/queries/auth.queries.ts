import { gql } from "@apollo/client";

/**
 * Me Query
 *
 * Gets the currently authenticated user.
 * Returns null if not authenticated.
 */
export const ME_QUERY = gql`
  query Me {
    me {
      id
      email
      name
      phone
      role
      patient {
        id
      }
    }
  }
`;

/**
 * Get User Query
 */
export const GET_USER_QUERY = gql`
  query GetUser($id: ID!) {
    user(id: $id) {
      id
      email
      name
      phone
      role
      patient {
        id
      }
    }
  }
`;

// Types
export interface MeQueryData {
  me: {
    id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
    patient?: {
      id: string;
    };
  } | null;
}

