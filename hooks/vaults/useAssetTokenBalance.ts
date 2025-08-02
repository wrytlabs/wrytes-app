import { useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { useReadContract } from 'wagmi';
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

  // Use wagmi's useReadContract hook for real contract calls
  const { data: tokenBalance, isLoading, error: contractError } = useReadContract({
    address: assetToken?.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && !!assetToken?.address,
    },
  });

  // Update balance when contract data changes
  useEffect(() => {
    if (tokenBalance !== undefined) {
      setBalance(tokenBalance);
    }
  }, [tokenBalance]);

  // Update loading state
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  // Update error state
  useEffect(() => {
    if (contractError) {
      setError(contractError.message);
    } else {
      setError(null);
    }
  }, [contractError]);


  return {
    balance: balance || 0n,
    symbol: assetToken?.symbol || '',
    decimals: assetToken?.decimals || 18,
    loading,
    error,
  };
};