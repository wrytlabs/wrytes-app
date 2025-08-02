import { useState, useEffect, useCallback } from 'react';
import { Vault } from '@/lib/vaults/config';
import { useVaultBalance } from '@/lib/web3/savings';
import { UseVaultDataReturn } from '@/components/features/Vaults/types';
import { useMorphoVaultData } from '@/hooks/morpho';

/**
 * useVaultData - Custom hook for vault data management
 * Extracts balance, APY, and TVL fetching logic from VaultCard
 * Provides centralized data management with loading and error states
 * Integrates Morpho GraphQL data when vault.useMorphoData is true
 */
export const useVaultData = (vault: Vault): UseVaultDataReturn => {
  const userBalance = useVaultBalance(vault.address);
  const [apy, setApy] = useState<number>(0);
  const [tvl, setTvl] = useState<string>('$0');
  const [untilUnlocked, setuntilUnlocked] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch Morpho data if enabled for this vault
  const morphoData = useMorphoVaultData({
    vaultAddress: vault.morphoAddress,
    enabled: vault.useMorphoData && !!vault.morphoAddress,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    watchUpdates: false
  });

  // Load APY, TVL, and lock time data
  const loadVaultStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use Morpho data if available and enabled
      if (vault.useMorphoData && morphoData.hasData && !morphoData.loading) {
        setApy(morphoData.netApy);
        setTvl(morphoData.tvl);
        
        // Still get untilUnlocked from contract if available
        let untilUnlockedValue = 0;
        if (vault.untilUnlocked) {
          if (typeof vault.untilUnlocked === 'function') {
            untilUnlockedValue = await vault.untilUnlocked();
          } else {
            untilUnlockedValue = vault.untilUnlocked;
          }
        }
        setuntilUnlocked(untilUnlockedValue);
        
        // Handle Morpho errors
        if (morphoData.error) {
          setError(`Morpho data error: ${morphoData.error}`);
        }
        
        return;
      }
      
      // Fallback to contract calls when Morpho data is not available
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
  }, [vault, morphoData]);

  // Initial load and reload when Morpho data changes
  useEffect(() => {
    loadVaultStats();
  }, [loadVaultStats]); // Re-load if vault or Morpho data changes

  // Refresh function for manual reload
  const refresh = () => {
    loadVaultStats();
    if (vault.useMorphoData && morphoData.refetch) {
      morphoData.refetch();
    }
  };

  // Combine loading states: show loading if either vault data or Morpho data is loading
  const isLoading = loading || (vault.useMorphoData && morphoData.loading);

  return {
    balance: userBalance,
    apy,
    tvl,
    untilUnlocked,
    loading: isLoading || false,
    error,
    refresh
  };
};