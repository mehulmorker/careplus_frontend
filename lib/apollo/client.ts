import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Code: ${extensions?.code}`
      );

      // Handle specific error codes
      if (extensions?.code === "UNAUTHENTICATED") {
        // Redirect to login or clear auth state
        if (typeof window !== "undefined") {
          localStorage.removeItem("token");
          // window.location.href = '/login';
        }
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Token key - same as in useAuth hook
const TOKEN_KEY = "carepulse_token";

// Auth link to add token to requests
const authLink = new ApolloLink((operation, forward) => {
  // Get token from storage
  const token =
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null;

  // Add authorization header
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(token && { authorization: `Bearer ${token}` }),
    },
  }));

  return forward(operation);
});

// HTTP link
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
  credentials: "include", // For cookies
});

// Create Apollo Client (for client components)
export const createApolloClient = () => {
  return new ApolloClient({
    link: from([errorLink, authLink, httpLink]),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            appointments: {
              merge(existing, incoming) {
                return incoming;
              },
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: "cache-and-network",
      },
    },
  });
};

// Server-side Apollo Client (for Next.js App Router server components)
// This creates a new client instance for each request with auth token support
export function getClient(token?: string | null) {
  // Create auth link for server-side requests
  const serverAuthLink = new ApolloLink((operation, forward) => {
    // Add authorization header if token is provided
    operation.setContext(({ headers = {} }) => ({
      headers: {
        ...headers,
        ...(token && { authorization: `Bearer ${token}` }),
      },
    }));

    return forward(operation);
  });

  // Create HTTP link for server-side
  const serverHttpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
    credentials: "include",
    fetch: fetch, // Use native fetch
  });

  // Create a server-side client with auth support
  return new ApolloClient({
    link: from([serverAuthLink, serverHttpLink]),
    cache: new InMemoryCache(),
    ssrMode: true, // Enable SSR mode
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache", // Always fetch fresh data on server
        errorPolicy: "all", // Return both data and errors
      },
    },
  });
}
