import { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { readContract } from 'wagmi/actions';
import { WAGMI_CONFIG } from '@/lib/web3/config';
import { mainnet } from '@reown/appkit/networks';
import { Vault } from '@/lib/vaults/types';

// Standard ERC20 ABI for balanceOf function
const ERC20_ABI = [
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  }
] as const;

export interface UseAssetTokenBalanceReturn {
  balance: bigint;
  symbol: string;
  decimals: number;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch the underlying asset token balance for a vault
 * @param vault - The vault object containing asset information
 */
export const useAssetTokenBalance = (vault: Vault): UseAssetTokenBalanceReturn => {
  const { address: userAddress } = useAppKitAccount();
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the asset token configuration from the vault
  const assetToken = vault.asset;

  // Fetch balance using readContract
  const fetchBalance = useCallback(async () => {
    if (!userAddress || !assetToken?.address) {
      setBalance(0n);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const balanceResult = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: assetToken.address as `0x${string}`,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`],
      });

      setBalance(balanceResult as bigint);
    } catch (error) {
      console.error('Error fetching token balance:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch balance');
      setBalance(0n);
    } finally {
      setLoading(false);
    }
  }, [userAddress, assetToken?.address]);

  // Fetch balance when dependencies change
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance: balance || 0n,
    symbol: assetToken?.symbol || '',
    decimals: assetToken?.decimals || 18,
    loading,
    error,
    refresh: fetchBalance,
  };
};