import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  ApolloLink,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Path: ${path}, Code: ${extensions?.code}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: "/api/graphql",
  credentials: "include",
});

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

export function getClient(cookieHeader?: string) {
  const serverHttpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/graphql",
    credentials: "include",
    fetch: (uri, options) => {
      return fetch(uri, {
        ...options,
        headers: {
          ...options?.headers,
          ...(cookieHeader && { Cookie: cookieHeader }),
        },
      });
    },
  });

  return new ApolloClient({
    link: from([serverHttpLink]),
    cache: new InMemoryCache(),
    ssrMode: true,
    defaultOptions: {
      query: {
        fetchPolicy: "no-cache",
        errorPolicy: "all",
      },
    },
  });
}
