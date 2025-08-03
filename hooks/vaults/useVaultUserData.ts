import { useState, useEffect, useCallback } from 'react';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { readContract } from 'wagmi/actions';
import { WAGMI_CONFIG } from '@/lib/web3/config';
import { Vault } from '@/lib/vaults/types';
import { erc4626ABI } from '@/lib/vaults/abi';

export interface UseVaultUserDataReturn {
  assetBalance: bigint;
  assetDecimals: number;
  assetSymbol: string;

  vaultBalance: bigint;
  vaultDecimals: number;
  vaultSymbol: string;

  allowanceToVault: bigint;

  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Custom hook to fetch the underlying asset token balance for a vault
 * @param vault - The vault object containing asset information
 */
export const useVaultUserData = (vault: Vault): UseVaultUserDataReturn => {
  const { address } = useAppKitAccount();
  const [assetBalance, setAssetBalance] = useState<bigint>(0n);
  const [vaultBalance, setVaultBalance] = useState<bigint>(0n);
  const [allowanceToVault, setAllowanceToVault] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get the asset token configuration from the vault
  const userAddress = address as `0x${string}`;
  const assetAddress = vault.asset.address as `0x${string}`;
  const vaultAddress = vault.address as `0x${string}`;

  // Fetch balance using readContract
  const fetchUserData = useCallback(async () => {
    if (!userAddress || !assetAddress) {
      setAssetBalance(0n);
      setVaultBalance(0n);
      setAllowanceToVault(0n);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Fetch asset balance
      const assetBalanceResult = await readContract(WAGMI_CONFIG, {
        chainId: vault.chainId,
        address: assetAddress,
        abi: erc4626ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      });

      setAssetBalance(assetBalanceResult as bigint);

      // Fetch vault balance
      const vaultBalanceResult = await readContract(WAGMI_CONFIG, {
        chainId: vault.chainId,
        address: vaultAddress,
        abi: erc4626ABI,
        functionName: 'balanceOf',
        args: [userAddress],
      });

      setVaultBalance(vaultBalanceResult as bigint);

      // Fetch allowance to vault
      const allowanceToVaultResult = await readContract(WAGMI_CONFIG, {
        chainId: vault.chainId,
        address: vaultAddress,
        abi: erc4626ABI,
        functionName: 'allowance',
        args: [userAddress, vaultAddress],
      });

      setAllowanceToVault(allowanceToVaultResult as bigint);
    } catch (error) {
      console.error('Error fetching token data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch token data');
      setAssetBalance(0n);
      setVaultBalance(0n);
      setAllowanceToVault(0n);
    } finally {
      setLoading(false);
    }
  }, [userAddress, assetAddress, vaultAddress, vault.chainId]);

  // Fetch balance when dependencies change
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  return {
    assetBalance,
    assetDecimals: vault.asset.decimals,
    assetSymbol: vault.asset.symbol,
    vaultBalance,
    vaultDecimals: vault.decimals,
    vaultSymbol: vault.symbol,
    allowanceToVault,
    loading,
    error,
    refresh: fetchUserData,
  };
};