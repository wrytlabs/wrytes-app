import { useState, useEffect, useCallback } from 'react';
import { useQuery, ApolloError } from '@apollo/client';
import { 
  GET_VAULT_METRICS, 
  GetVaultMetricsData, 
  GetVaultMetricsVariables,
  VaultMetrics
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
  /** Historical APY data for trends */
  historicalData: Array<{
    timestamp: string;
    netApy: number;
    tvl: string;
  }>;
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
  } = useQuery<GetVaultMetricsData, GetVaultMetricsVariables>(
    GET_VAULT_METRICS,
    {
      variables: { vaultAddress: vaultAddress || '' },
      skip: !enabled || !vaultAddress,
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
      onCompleted: (data) => {
        if (data?.vault) {
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
  const parseVaultData = (vault: VaultMetrics | undefined): Partial<MorphoVaultData> => {
    if (!vault) {
      return {
        netApy: 0,
        dailyNetApy: 0,
        weeklyNetApy: 0,
        monthlyNetApy: 0,
        tvl: '0',
        totalAssets: '0',
        totalSupply: '0',
        historicalData: [],
        hasData: false
      };
    }

    return {
      netApy: vault.netApy || 0,
      dailyNetApy: vault.dailyNetApy || 0,
      weeklyNetApy: vault.weeklyNetApy || 0,
      monthlyNetApy: vault.monthlyNetApy || 0,
      tvl: vault.totalValueLocked || '0',
      totalAssets: vault.totalAssets || '0',
      totalSupply: vault.totalSupply || '0',
      riskScore: vault.riskScore,
      utilizationRate: vault.utilizationRate,
      strategy: vault.strategy,
      historicalData: vault.metricsByTime?.map(metric => ({
        timestamp: metric.timestamp,
        netApy: metric.netApy,
        tvl: metric.totalValueLocked
      })) || [],
      hasData: true
    };
  };

  const parsedData = parseVaultData(data?.vault);

  return {
    ...parsedData,
    lastUpdated,
    loading,
    error: formatError(error),
    refetch,
    hasData: !!data?.vault,
    // Provide default values for required fields
    netApy: parsedData.netApy || 0,
    dailyNetApy: parsedData.dailyNetApy || 0,
    weeklyNetApy: parsedData.weeklyNetApy || 0,
    monthlyNetApy: parsedData.monthlyNetApy || 0,
    tvl: parsedData.tvl || '0',
    totalAssets: parsedData.totalAssets || '0',
    totalSupply: parsedData.totalSupply || '0',
    historicalData: parsedData.historicalData || []
  };
};

export default useMorphoVaultData;