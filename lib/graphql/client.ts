import { ApolloClient, InMemoryCache, createHttpLink, from, type FetchPolicy } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { RetryLink } from '@apollo/client/link/retry';

// Environment variables for GraphQL configuration
const MORPHO_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_MORPHO_GRAPHQL_ENDPOINT || 'https://api.morpho.org/graphql';
const MORPHO_API_KEY = process.env.NEXT_PUBLIC_MORPHO_API_KEY;

// Create HTTP link for Morpho GraphQL API
const httpLink = createHttpLink({
  uri: MORPHO_GRAPHQL_ENDPOINT,
});

// Authentication link (if API key is required)
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      ...(MORPHO_API_KEY && { authorization: `Bearer ${MORPHO_API_KEY}` }),
      'Content-Type': 'application/json',
    }
  };
});

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      );
    });
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
    
    // Log additional details for debugging
    if ('statusCode' in networkError) {
      console.error(`Status code: ${networkError.statusCode}`);
    }
  }
});

// Retry link for failed requests
const retryLink = new RetryLink({
  delay: {
    initial: 300,
    max: Infinity,
    jitter: true
  },
  attempts: {
    max: 3,
    retryIf: (error, _operation) => {
      // Retry on network errors or 5xx server errors
      return !!error && (
        error.networkError?.message.includes('Network request failed') ||
        ('statusCode' in error.networkError && error.networkError.statusCode >= 500)
      );
    }
  }
});

// Configure Apollo Client cache
const cache = new InMemoryCache({
  typePolicies: {
    Vault: {
      fields: {
        // Cache APY data for 5 minutes
        netApy: {
          merge: false,
        },
        dailyNetApy: {
          merge: false,
        },
        weeklyNetApy: {
          merge: false,
        },
        monthlyNetApy: {
          merge: false,
        },
        totalValueLocked: {
          merge: false,
        }
      }
    }
  },
  // Enable cache persistence for offline scenarios
  possibleTypes: {
    // Add possible types if using unions/interfaces
  }
});

// Create Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([
    errorLink,
    retryLink,
    authLink,
    httpLink
  ]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network' as FetchPolicy,
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'cache-and-network' as FetchPolicy,
      errorPolicy: 'all',
    },
  },
  // Enable developer tools in development
  connectToDevTools: process.env.NODE_ENV === 'development',
});

// Health check function for GraphQL endpoint
export const checkGraphQLHealth = async (): Promise<boolean> => {
  try {
    const result = await apolloClient.query({
      query: require('./queries/morpho').HEALTH_CHECK_QUERY,
      fetchPolicy: 'network-only',
    });
    return !!result.data;
  } catch (error) {
    console.warn('GraphQL health check failed:', error);
    return false;
  }
};

// Clear Apollo cache
export const clearApolloCache = () => {
  return apolloClient.clearStore();
};

// Refetch all active queries
export const refetchAllQueries = () => {
  return apolloClient.refetchQueries({
    include: 'active',
  });
};

export default apolloClient;