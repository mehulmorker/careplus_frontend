"use client";

import { ApolloProvider } from "@apollo/client";
import { createApolloClient } from "./client";
import { useMemo } from "react";

interface ApolloWrapperProps {
  children: React.ReactNode;
}

export function ApolloWrapper({ children }: ApolloWrapperProps) {
  const client = useMemo(() => createApolloClient(), []);

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

