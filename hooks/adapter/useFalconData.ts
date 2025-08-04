import { useState, useEffect } from 'react';

export interface FalconStatistics {
  tvl: string;
  '7d_apy': string;
  sUSDf_7d_apy: string;
  usdf_supply: string;
  susdf_supply: string;
  usdf_staked: string;
  susdf_share_price: string;
  staking_tenures: FalconTenure[];
  sUSDf: FalconTenure[];
}

export interface FalconTenure {
  tenure: string;
  '7d_apy': string;
  apy_boost: string;
  min_apy: string;
}

export interface UseFalconDataReturn {
  data: FalconStatistics | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  // Convenience getters
  apy: number;
  tvl: number;
  usdfSupply: number;
  susdfSupply: number;
  usdfStaked: number;
  sharePrice: number;
  tenures: FalconTenure[];
}

export const FALCON_API_URL = 'https://api.falcon.finance/api/v1/statistics';

export const useFalconData = (): UseFalconDataReturn => {
  const [data, setData] = useState<FalconStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(FALCON_API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result: FalconStatistics = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch Falcon data';
      setError(errorMessage);
      console.error('Error fetching Falcon data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const refetch = async (): Promise<void> => {
    await fetchData();
  };

  // Initial fetch
  useEffect(() => {
    fetchData();
  }, []);

  // Convenience getters
  const apy = data ? Number(data['7d_apy']) * 100 : 0; // Convert to percentage
  const tvl = data ? Number(data.tvl) : 0;
  const usdfSupply = data ? Number(data.usdf_supply) : 0;
  const susdfSupply = data ? Number(data.susdf_supply) : 0;
  const usdfStaked = data ? Number(data.usdf_staked) : 0;
  const sharePrice = data ? Number(data.susdf_share_price) : 0;
  const tenures = data?.staking_tenures || [];

  return {
    data,
    isLoading,
    error,
    refetch,
    apy,
    tvl,
    usdfSupply,
    susdfSupply,
    usdfStaked,
    sharePrice,
    tenures,
  };
};

// Hook for getting specific tenure APY
export const useFalconTenureApy = (tenureSeconds: number): number => {
  const { tenures } = useFalconData();
  
  const tenure = tenures.find(t => Number(t.tenure) === tenureSeconds);
  return tenure ? Number(tenure['7d_apy']) * 100 : 0; // Convert to percentage
};

// Hook for getting base APY (no tenure boost)
export const useFalconBaseApy = (): number => {
  const { apy } = useFalconData();
  return apy;
};

// Hook for getting TVL
export const useFalconTvl = (): number => {
  const { tvl } = useFalconData();
  return tvl;
};
