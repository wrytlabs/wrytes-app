import React from 'react';
import { ApolloProvider as BaseApolloProvider } from '@apollo/client';
import { apolloClient } from './client';

interface ApolloProviderProps {
  children: React.ReactNode;
}

/**
 * Apollo Provider wrapper for GraphQL integration
 * Provides Apollo Client to all child components
 */
export const ApolloProvider: React.FC<ApolloProviderProps> = ({ children }) => {
  return (
    <BaseApolloProvider client={apolloClient}>
      {children}
    </BaseApolloProvider>
  );
};

export default ApolloProvider;