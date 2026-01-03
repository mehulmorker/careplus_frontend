import { gql } from "@apollo/client";

/**
 * Register Mutation
 *
 * Creates a new user account and returns authentication token.
 */
export const REGISTER_MUTATION = gql`
  mutation Register($input: CreateUserInput!) {
    register(input: $input) {
      success
      token
      user {
        id
        email
        name
        phone
        role
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
 * Login Mutation
 *
 * Authenticates user and returns JWT token.
 */
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      success
      token
      user {
        id
        email
        name
        phone
        role
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
 * Logout Mutation
 */
export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout
  }
`;

// Types for mutation variables
export interface RegisterInput {
  email: string;
  name: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

// Types for mutation responses
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
}

export interface FieldError {
  field?: string;
  message: string;
  code?: string;
}

export interface AuthPayload {
  success: boolean;
  token?: string;
  user?: AuthUser;
  errors: FieldError[];
}

export interface RegisterMutationData {
  register: AuthPayload;
}

export interface LoginMutationData {
  login: AuthPayload;
}

