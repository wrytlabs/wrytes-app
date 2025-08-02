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

export const useSavingsVault = (vaultAddress: string) => {
  const { address: userAddress } = useAppKitAccount();
  const [totalAssets, setTotalAssets] = useState<bigint>(0n);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [userShares, setUserShares] = useState<bigint>(0n);
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

  // Deposit function
  const handleDeposit = useCallback(async (amount: bigint) => {
    try {
      setIsDepositing(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [amount],
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

  // Withdraw function
  const handleWithdraw = useCallback(async (amount: bigint) => {
    try {
      setIsWithdrawing(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [amount],
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

  // Redeem function (withdraw using shares)
  const handleRedeem = useCallback(async (shares: bigint) => {
    try {
      setIsRedeeming(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [shares],
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

  // Mint function (deposit using shares)
  const handleMint = useCallback(async (shares: bigint) => {
    try {
      setIsMinting(true);
      const connectionController = ConnectionController._getClient();
      if (!connectionController) throw new Error('No connection available');

      const result = await connectionController.writeContract({
        tokenAddress: vaultAddress as `0x${string}`,
        fromAddress: userAddress as `0x${string}`,
        method: 'call',
        abi: erc4626ABI,
        args: [shares],
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

  // Helper functions
  const calculateSharesFromAssets = useCallback((assets: bigint) => {
    if (!totalAssets || totalAssets === 0n) return 0n;
    return (assets * totalSupply) / totalAssets;
  }, [totalAssets, totalSupply]);

  const calculateAssetsFromShares = useCallback((shares: bigint) => {
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
      // In a real implementation, you would use a separate RPC provider or API
      setBalance(100000000000000000000n); // 100 shares for user
    } catch (error) {
      console.error('Error fetching vault balance:', error);
      setBalance(0n);
    }
  }, [vaultAddress, userAddress]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return balance;
};

export const useVaultAllowance = (vaultAddress: string, tokenAddress: string) => {
  const { address: userAddress } = useAppKitAccount();
  const [allowance, setAllowance] = useState<bigint>(0n);

  const fetchAllowance = useCallback(async () => {
    if (!userAddress || !vaultAddress || !tokenAddress) {
      setAllowance(0n);
      return;
    }

    try {
      // For now, we'll use mock data since Reown AppKit doesn't provide direct contract reading
      // In a real implementation, you would use a separate RPC provider or API
      setAllowance(1000000000000000000000n); // 1000 tokens allowance
    } catch (error) {
      console.error('Error fetching allowance:', error);
      setAllowance(0n);
    }
  }, [vaultAddress, tokenAddress, userAddress]);

  useEffect(() => {
    fetchAllowance();
  }, [fetchAllowance]);

  return allowance;
}; 