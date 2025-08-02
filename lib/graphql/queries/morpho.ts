import { gql } from '@apollo/client';

// Health check query to verify GraphQL endpoint availability
export const HEALTH_CHECK_QUERY = gql`
  query HealthCheck {
    __schema {
      queryType {
        name
      }
    }
  }
`;

// Main query to fetch vault metrics from Morpho
export const GET_VAULT_METRICS = gql`
  query VaultByAddress($address: String!, $chainId: Int) {
    vaultByAddress(address: $address, chainId: $chainId) {
      state {
        dailyNetApy
        avgNetApy
        weeklyNetApy
        totalAssetsUsd
        sharePriceUsd
        sharePrice
        totalSupply
        totalAssets
        netApy
        lastTotalAssets
      }
    }
  }
`;

// Query for multiple vaults (batch query)
export const GET_MULTIPLE_VAULT_METRICS = gql`
  query GetMultipleVaultMetrics($vaultAddresses: [String!]!) {
    vaults(addresses: $vaultAddresses) {
      id
      address
      name
      symbol
      netApy
      dailyNetApy
      weeklyNetApy
      monthlyNetApy
      totalValueLocked
      lastUpdated
      riskScore
    }
  }
`;

// Subscription for real-time vault updates (if supported)
export const VAULT_METRICS_SUBSCRIPTION = gql`
  subscription VaultMetricsUpdated($vaultAddress: String!) {
    vaultUpdated(address: $vaultAddress) {
      address
      netApy
      dailyNetApy
      weeklyNetApy
      monthlyNetApy
      totalValueLocked
      lastUpdated
    }
  }
`;

// Query for historical APY data (for charts/trends)
export const GET_VAULT_HISTORICAL_APY = gql`
  query GetVaultHistoricalApy(
    $vaultAddress: String!
    $timeWindow: String!
    $limit: Int
  ) {
    vault(address: $vaultAddress) {
      address
      metricsByTime(
        timeWindow: $timeWindow
        limit: $limit
      ) {
        timestamp
        netApy
        dailyNetApy
        weeklyNetApy
        monthlyNetApy
        totalValueLocked
      }
    }
  }
`;

// Query for vault search/discovery
export const SEARCH_VAULTS = gql`
  query SearchVaults(
    $search: String
    $minApy: Float
    $maxRisk: Float
    $limit: Int
  ) {
    vaults(
      search: $search
      filters: {
        minApy: $minApy
        maxRisk: $maxRisk
      }
      limit: $limit
    ) {
      id
      address
      name
      symbol
      netApy
      totalValueLocked
      riskScore
      strategy {
        name
        riskLevel
      }
    }
  }
`;

// TypeScript interfaces for the GraphQL responses
export interface VaultState {
  dailyNetApy: number;
  avgNetApy: number;
  weeklyNetApy: number;
  totalAssetsUsd: string;
  sharePriceUsd: string;
  sharePrice: string;
  totalSupply: string;
  totalAssets: string;
  netApy: number;
  lastTotalAssets: string;
}

export interface VaultByAddressData {
  vaultByAddress: {
    state: VaultState;
  };
}

export interface VaultByAddressVariables {
  address: string;
  chainId?: number;
}

export interface GetMultipleVaultMetricsData {
  vaults: Array<{
    id: string;
    address: string;
    name: string;
    symbol: string;
    netApy: number;
    dailyNetApy: number;
    weeklyNetApy: number;
    totalAssetsUsd: string;
  }>;
}

export interface GetMultipleVaultMetricsVariables {
  vaultAddresses: string[];
}

export interface VaultHistoricalApy {
  timestamp: string;
  netApy: number;
  dailyNetApy: number;
  weeklyNetApy: number;
  monthlyNetApy: number;
  totalValueLocked: string;
}

export interface GetVaultHistoricalApyData {
  vault: {
    address: string;
    metricsByTime: VaultHistoricalApy[];
  };
}

export interface GetVaultHistoricalApyVariables {
  vaultAddress: string;
  timeWindow: string;
  limit?: number;
}