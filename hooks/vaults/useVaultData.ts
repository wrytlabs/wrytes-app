import { useState, useEffect, useCallback } from 'react';
import { Vault } from '@/lib/vaults/types';
import { useVaultBalance } from '@/lib/vaults/vault';
import { UseVaultDataReturn } from '@/components/features/Vaults/types';

/**
 * useVaultData - Custom hook for vault data management
 * Extracts balance, APY, and TVL fetching logic from VaultCard
 * Provides centralized data management with loading and error states
 */
export const useVaultData = (vault: Vault): UseVaultDataReturn => {
  const userBalance = useVaultBalance(vault.address);
  const [apy, setApy] = useState<number>(0);
  const [tvl, setTvl] = useState<string>('$0');
  const [untilUnlocked, setuntilUnlocked] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load APY, TVL, and lock time data
  const loadVaultStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const promises: Promise<number>[] = [
        vault.apy(),
        vault.tvl(),
      ];

      // Add lock time fetching if available
      if (vault.untilUnlocked) {
        if (typeof vault.untilUnlocked === 'function') {
          promises.push(vault.untilUnlocked());
        } else {
          promises.push(Promise.resolve(vault.untilUnlocked));
        }
      } else {
        promises.push(Promise.resolve(0));
      }
      
      const [apyValue, tvlValue, untilUnlockedValue] = await Promise.all(promises);
      
      setApy(apyValue);
      setTvl(String(tvlValue));
      setuntilUnlocked(untilUnlockedValue || 0);
    } catch (err) {
      console.error('Error loading vault stats:', err);
      setError(err instanceof Error ? err.message : 'Failed to load vault data');
    } finally {
      setLoading(false);
    }
  }, [vault]);

  // Initial load and reload when vault changes
  useEffect(() => {
    loadVaultStats();
  }, [loadVaultStats]);

  // Refresh function for manual reload
  const refresh = () => {
    loadVaultStats();
  };

  return {
    balance: userBalance,
    apy,
    tvl,
    untilUnlocked,
    loading: loading || false,
    error,
    refresh
  };
};