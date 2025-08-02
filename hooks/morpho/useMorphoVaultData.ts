import { useState, useEffect, useCallback } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { 
  GET_VAULT_METRICS, 
  VaultByAddressData, 
  VaultByAddressVariables,
  VaultState
} from '@/lib/graphql/queries/morpho';

export interface MorphoVaultData {
  /** Current net APY */
  netApy: number;
  /** Daily net APY */
  dailyNetApy: number;
  /** Weekly net APY */
  weeklyNetApy: number;
  /** Monthly net APY */
  monthlyNetApy: number;
  /** Total value locked in the vault */
  tvl: string;
  /** Total assets in the vault */
  totalAssets: string;
  /** Total supply of vault shares */
  totalSupply: string;
  /** Risk score (0-100, if available) */
  riskScore?: number;
  /** Utilization rate (0-1, if available) */
  utilizationRate?: number;
  /** Strategy information */
  strategy?: {
    name: string;
    description: string;
    riskLevel: string;
  };
  /** Last updated timestamp */
  lastUpdated: Date;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: string | null;
  /** Refetch function */
  refetch: () => void;
  /** Data availability flag */
  hasData: boolean;
}

export interface UseMorphoVaultDataProps {
  /** Morpho vault address */
  vaultAddress?: string;
  /** Chain ID for the vault */
  chainId?: number;
  /** Whether to enable the query */
  enabled?: boolean;
  /** Refetch interval in milliseconds (default: 5 minutes) */
  refetchInterval?: number;
  /** Whether to watch for real-time updates */
  watchUpdates?: boolean;
}

/**
 * Custom hook for fetching Morpho vault data via GraphQL
 * Provides comprehensive vault metrics with caching and error handling
 * Falls back gracefully when Morpho data is unavailable
 */
export const useMorphoVaultData = ({
  vaultAddress,
  chainId,
  enabled = true,
  refetchInterval = 5 * 60 * 1000, // 5 minutes
  watchUpdates = false
}: UseMorphoVaultDataProps): MorphoVaultData => {
  
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  
  // GraphQL query for vault metrics
  const { 
    data, 
    loading, 
    error, 
    refetch: apolloRefetch,
    startPolling,
    stopPolling
  } = useQuery<VaultByAddressData, VaultByAddressVariables>(
    GET_VAULT_METRICS,
    {
      variables: { 
        address: vaultAddress || '',
        chainId: chainId || 1
      },
      skip: !enabled || !vaultAddress,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.vaultByAddress?.state) {
          setLastUpdated(new Date());
        }
      },
      onError: (error) => {
        console.warn('Morpho GraphQL query failed:', error.message);
      }
    }
  );

  // Set up polling for real-time updates
  useEffect(() => {
    if (watchUpdates && enabled && vaultAddress) {
      startPolling(refetchInterval);
    } else {
      stopPolling();
    }

    return () => stopPolling();
  }, [watchUpdates, enabled, vaultAddress, refetchInterval, startPolling, stopPolling]);

  // Manual refetch function
  const refetch = useCallback(() => {
    return apolloRefetch();
  }, [apolloRefetch]);

  // Format error message
  const formatError = (error: ApolloError | undefined): string | null => {
    if (!error) return null;
    
    if (error.networkError) {
      return `Network error: ${error.networkError.message}`;
    }
    
    if (error.graphQLErrors.length > 0) {
      return `GraphQL error: ${error.graphQLErrors[0].message}`;
    }
    
    return error.message || 'Unknown error occurred';
  };

  // Parse and format vault data
  const parseVaultData = (state: VaultState | undefined): Partial<MorphoVaultData> => {
    if (!state) {
      return {
        netApy: 0,
        dailyNetApy: 0,
        weeklyNetApy: 0,
        monthlyNetApy: 0,
        tvl: '0',
        totalAssets: '0',
        totalSupply: '0',
        hasData: false
      };
    }

    return {
      netApy: state.netApy || 0,
      dailyNetApy: state.dailyNetApy || 0,
      weeklyNetApy: state.weeklyNetApy || 0,
      monthlyNetApy: state.avgNetApy || 0, // Using avgNetApy as monthly
      tvl: state.totalAssetsUsd || '0',
      totalAssets: state.totalAssets || '0',
      totalSupply: state.totalSupply || '0',
      hasData: true
    };
  };

  const parsedData = parseVaultData(data?.vaultByAddress?.state);

  return {
    ...parsedData,
    lastUpdated,
    loading,
    error: formatError(error),
    refetch,
    hasData: !!data?.vaultByAddress?.state,
    // Provide default values for required fields
    netApy: parsedData.netApy || 0,
    dailyNetApy: parsedData.dailyNetApy || 0,
    weeklyNetApy: parsedData.weeklyNetApy || 0,
    monthlyNetApy: parsedData.monthlyNetApy || 0,
    tvl: parsedData.tvl || '0',
    totalAssets: parsedData.totalAssets || '0',
    totalSupply: parsedData.totalSupply || '0',
  };
};

export default useMorphoVaultData;