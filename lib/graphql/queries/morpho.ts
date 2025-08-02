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
  query GetVaultMetrics($vaultAddress: String!) {
    vault(address: $vaultAddress) {
      id
      address
      name
      symbol
      asset {
        address
        symbol
        decimals
      }
      # APY metrics across different timeframes
      netApy
      dailyNetApy
      weeklyNetApy
      monthlyNetApy
      
      # Vault metrics
      totalValueLocked
      totalSupply
      totalAssets
      
      # Historical data points
      metricsByTime(
        timeWindow: "1D"
        limit: 30
      ) {
        timestamp
        netApy
        totalValueLocked
      }
      
      # Last updated timestamp
      lastUpdated
      
      # Risk metrics (if available)
      riskScore
      utilizationRate
      
      # Strategy information
      strategy {
        name
        description
        riskLevel
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
export interface VaultMetrics {
  id: string;
  address: string;
  name: string;
  symbol: string;
  asset: {
    address: string;
    symbol: string;
    decimals: number;
  };
  netApy: number;
  dailyNetApy: number;
  weeklyNetApy: number;
  monthlyNetApy: number;
  totalValueLocked: string;
  totalSupply: string;
  totalAssets: string;
  metricsByTime: Array<{
    timestamp: string;
    netApy: number;
    totalValueLocked: string;
  }>;
  lastUpdated: string;
  riskScore?: number;
  utilizationRate?: number;
  strategy?: {
    name: string;
    description: string;
    riskLevel: string;
  };
}

export interface GetVaultMetricsData {
  vault: VaultMetrics;
}

export interface GetVaultMetricsVariables {
  vaultAddress: string;
}

export interface GetMultipleVaultMetricsData {
  vaults: Array<Pick<VaultMetrics, 
    'id' | 'address' | 'name' | 'symbol' | 'netApy' | 'dailyNetApy' | 
    'weeklyNetApy' | 'monthlyNetApy' | 'totalValueLocked' | 'lastUpdated' | 'riskScore'
  >>;
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