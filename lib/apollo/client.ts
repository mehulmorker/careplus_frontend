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
        // User is not authenticated - cookies may have expired
        // Frontend should handle this (e.g., redirect to login)
        console.warn("User is not authenticated");
      }
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP link
const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
  credentials: "include", // Include cookies automatically
});

// Create Apollo Client (for client components)
// Cookies are sent automatically by the browser - no need for Authorization header
export const createApolloClient = () => {
  return new ApolloClient({
    link: from([errorLink, httpLink]),
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
// Cookies must be explicitly forwarded from Next.js request
export function getClient(cookieHeader?: string) {
  // Create HTTP link for server-side with cookie forwarding
  const serverHttpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
    credentials: "include",
    fetch: (uri, options) => {
      // Forward cookies from Next.js request to GraphQL backend
      return fetch(uri, {
        ...options,
        headers: {
          ...options?.headers,
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
      });
    },
  });

  // Create a server-side client
  return new ApolloClient({
    link: from([serverHttpLink]),
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
