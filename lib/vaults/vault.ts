import { useCallback, useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { ConnectionController } from '@reown/appkit-controllers';

// ERC4626 ABI - basic functions we need
export const erc4626ABI = [
  {
    inputs: [],
    name: 'totalAssets',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'account', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'assets', type: 'uint256' }],
    name: 'previewDeposit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'previewWithdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: 'assets', type: 'uint256' }],
    name: 'deposit',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'withdraw',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'redeem',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: 'shares', type: 'uint256' }],
    name: 'mint',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const;

export const useVaultActions = (vaultAddress: string) => {
  const { address: userAddress } = useAppKitAccount();
  const [totalAssets, setTotalAssets] = useState<bigint>(0n); // Total underlying assets in the vault
  const [totalSupply, setTotalSupply] = useState<bigint>(0n); // Total vault token supply (shares)
  const [userShares, setUserShares] = useState<bigint>(0n); // User's vault token balance (shares)
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // Read vault data using Reown AppKit
  const readContractData = useCallback(async () => {
    try {
      // For now, we'll use mock data since Reown AppKit doesn't provide direct contract reading
      // In a real implementation, you would use a separate RPC provider or API
      setTotalAssets(1000000000000000000000n); // 1000 tokens
      setTotalSupply(500000000000000000000n); // 500 shares
      
      if (userAddress) {
        setUserShares(100000000000000000000n); // 100 shares for user
      } else {
        setUserShares(0n);
      }
    } catch (error) {
      console.error('Error reading contract data:', error);
    }
  }, [vaultAddress, userAddress]);

  // Refresh data when user address changes
  useEffect(() => {
    readContractData();
  }, [readContractData]);

  // Deposit function - deposits asset tokens, receives vault tokens (shares)
  const handleDeposit = useCallback(async (amount: bigint) => {
    try {
      setIsDepositing(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      // ERC4626 deposit: user deposits `amount` of asset tokens and receives vault tokens (shares)
      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [amount], // amount is in asset token units
        chainNamespace: 'eip155'
      });

      if (result) {
        // Refresh data after successful transaction
        await readContractData();
      }

      return result;
    } catch (error) {
      console.error('Deposit failed:', error);
      throw error;
    } finally {
      setIsDepositing(false);
    }
  }, [vaultAddress, userAddress, readContractData]);

  // Withdraw function - withdraws exact amount of asset tokens, burns corresponding vault tokens (shares)
  const handleWithdraw = useCallback(async (amount: bigint) => {
    try {
      setIsWithdrawing(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      // ERC4626 withdraw: user specifies exact `amount` of asset tokens to withdraw
      // Vault will burn the corresponding amount of shares
      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [amount], // amount is in asset token units
        chainNamespace: 'eip155'
      });

      if (result) {
        // Refresh data after successful transaction
        await readContractData();
      }

      return result;
    } catch (error) {
      console.error('Withdrawal failed:', error);
      throw error;
    } finally {
      setIsWithdrawing(false);
    }
  }, [vaultAddress, userAddress, readContractData]);

  // Redeem function - burns exact amount of vault tokens (shares), receives corresponding asset tokens
  const handleRedeem = useCallback(async (shares: bigint) => {
    try {
      setIsRedeeming(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      // ERC4626 redeem: user specifies exact `shares` (vault tokens) to burn
      // Vault will transfer the corresponding amount of asset tokens
      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [shares], // shares is in vault token units
        chainNamespace: 'eip155'
      });

      if (result) {
        // Refresh data after successful transaction
        await readContractData();
      }

      return result;
    } catch (error) {
      console.error('Redeem failed:', error);
      throw error;
    } finally {
      setIsRedeeming(false);
    }
  }, [vaultAddress, userAddress, readContractData]);

  // Mint function - deposits required asset tokens to mint exact amount of vault tokens (shares)
  const handleMint = useCallback(async (shares: bigint) => {
    try {
      setIsMinting(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      // ERC4626 mint: user specifies exact `shares` (vault tokens) to mint
      // Vault will calculate and transfer the required amount of asset tokens from user
      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [shares], // shares is in vault token units
        chainNamespace: 'eip155'
      });

      if (result) {
        // Refresh data after successful transaction
        await readContractData();
      }

      return result;
    } catch (error) {
      console.error('Mint failed:', error);
      throw error;
    } finally {
      setIsMinting(false);
    }
  }, [vaultAddress, userAddress, readContractData]);

  // Helper functions for ERC4626 calculations
  const calculateSharesFromAssets = useCallback((assets: bigint) => {
    // Calculate how many vault tokens (shares) the user will receive for depositing `assets`
    if (!totalAssets || totalAssets === 0n) return 0n;
    return (assets * totalSupply) / totalAssets;
  }, [totalAssets, totalSupply]);

  const calculateAssetsFromShares = useCallback((shares: bigint) => {
    // Calculate how many asset tokens the user will receive for redeeming `shares`
    if (!totalSupply || totalSupply === 0n) return 0n;
    return (shares * totalAssets) / totalSupply;
  }, [totalAssets, totalSupply]);

  return {
    // Read data
    totalAssets,
    totalSupply,
    userShares,
    
    // Write functions
    deposit: handleDeposit,
    withdraw: handleWithdraw,
    redeem: handleRedeem,
    mint: handleMint,
    
    // Loading states
    isDepositing,
    isWithdrawing,
    isRedeeming,
    isMinting,
    
    // Helper functions
    calculateSharesFromAssets,
    calculateAssetsFromShares,
    
    // Refresh function
    refreshData: readContractData,
  };
};

export const useVaultBalance = (vaultAddress: string) => {
  const { address: userAddress } = useAppKitAccount();
  const [balance, setBalance] = useState<bigint>(0n);

  const fetchBalance = useCallback(async () => {
    if (!userAddress) {
      setBalance(0n);
      return;
    }

    try {
      // For now, we'll use mock data since Reown AppKit doesn't provide direct contract reading
      // In a real implementation, you would use a separate RPC provider or API to read from the vault contract
      // Example: await readContract(client, { address: vaultAddress, abi: erc4626ABI, functionName: 'balanceOf', args: [userAddress] })
      setBalance(100000000000000000000n); // 100 vault tokens (shares) for user
    } catch (error) {
      console.error('Error fetching vault balance:', error);
      setBalance(0n);
    }
  }, [vaultAddress, userAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return balance; // Returns user's vault token balance (shares)
};

export const useVaultAllowance = (vaultAddress: string, assetTokenAddress: string) => {
  const { address: userAddress } = useAppKitAccount();
  const [allowance, setAllowance] = useState<bigint>(0n);

  const fetchAllowance = useCallback(async () => {
    if (!userAddress || !vaultAddress || !assetTokenAddress) {
      setAllowance(0n);
      return;
    }

    try {
      // For now, we'll use mock data since Reown AppKit doesn't provide direct contract reading
      // In a real implementation, you would use a separate RPC provider or API to read from the asset token contract
      // Example: await readContract(client, { address: assetTokenAddress, abi: ERC20_ABI, functionName: 'allowance', args: [userAddress, vaultAddress] })
      setAllowance(1000000000000000000000n); // 1000 tokens allowance
    } catch (error) {
      console.error('Error fetching allowance:', error);
      setAllowance(0n);
    }
  }, [vaultAddress, assetTokenAddress, userAddress]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  return allowance;
}; 