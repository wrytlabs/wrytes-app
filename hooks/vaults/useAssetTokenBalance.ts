import { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { getAssetTokenForVault } from '@/lib/tokens/config';

// Standard ERC20 ABI for balanceOf function (for future use)
// const ERC20_ABI = [
//   {
//     inputs: [{ name: 'account', type: 'address' }],
//     name: 'balanceOf',
//     outputs: [{ name: '', type: 'uint256' }],
//     stateMutability: 'view',
//     type: 'function'
//   }
// ] as const;

export interface UseAssetTokenBalanceReturn {
  balance: bigint;
  symbol: string;
  decimals: number;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Custom hook to fetch the underlying asset token balance for a vault
 * @param vaultAddress - The address of the vault
 */
export const useAssetTokenBalance = (vaultAddress: string): UseAssetTokenBalanceReturn => {
  const { address: userAddress } = useAppKitAccount();
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the asset token configuration for this vault
  const assetToken = getAssetTokenForVault(vaultAddress);

  const fetchBalance = useCallback(async () => {
    if (!userAddress || !assetToken) {
      setBalance(0n);
      setLoading(false);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // For now, we'll use mock data since Reown AppKit doesn't provide direct contract reading
      // In a real implementation, you would use a separate RPC provider or API to read from the token contract
      
      // Mock different balances based on token type for demonstration
      let mockBalance: bigint;
      switch (assetToken.symbol) {
        case 'USDC':
        case 'USDT':
          mockBalance = BigInt(5000 * (10 ** assetToken.decimals)); // 5000 USDC/USDT
          break;
        case 'DAI':
          mockBalance = BigInt(3000 * (10 ** assetToken.decimals)); // 3000 DAI
          break;
        case 'ZCHF':
          mockBalance = BigInt(2000 * (10 ** assetToken.decimals)); // 2000 ZCHF
          break;
        case 'USDU':
          mockBalance = BigInt(1500 * (10 ** assetToken.decimals)); // 1500 USDU
          break;
        default:
          mockBalance = BigInt(1000 * (10 ** assetToken.decimals)); // 1000 default
      }

      setBalance(mockBalance);
    } catch (err) {
      console.error('Error fetching asset token balance:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      setBalance(0n);
    } finally {
      setLoading(false);
    }
  }, [userAddress, assetToken]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const refresh = useCallback(() => {
    fetchBalance();
  }, [fetchBalance]);

  return {
    balance,
    symbol: assetToken?.symbol || '',
    decimals: assetToken?.decimals || 18,
    loading,
    error,
    refresh
  };
};