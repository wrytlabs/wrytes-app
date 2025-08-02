import { useState, useEffect } from 'react';
import { SavingsVault } from '@/lib/savings/config';
import { useVaultBalance } from '@/lib/web3/savings';
import { UseVaultDataReturn } from '@/components/features/Savings/types';

/**
 * useVaultData - Custom hook for vault data management
 * Extracts balance, APY, and TVL fetching logic from VaultCard
 * Provides centralized data management with loading and error states
 */
export const useVaultData = (vault: SavingsVault): UseVaultDataReturn => {
  const userBalance = useVaultBalance(vault.address);
  const [apy, setApy] = useState<number>(0);
  const [tvl, setTvl] = useState<string>('$0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load APY and TVL data
  const loadVaultStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [apyValue, tvlValue] = await Promise.all([
        vault.apy(),
        vault.tvl()
      ]);
      
      setApy(apyValue);
      setTvl(tvlValue);
    } catch (err) {
      console.error('Error loading vault stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vault data');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadVaultStats();
  }, [vault.address]); // Re-load if vault changes

  // Refresh function for manual reload
  const refresh = () => {
    loadVaultStats();
  };

  return {
    balance: userBalance,
    apy,
    tvl,
    loading,
    error,
    refresh
  };
};