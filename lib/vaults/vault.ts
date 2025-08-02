import { useCallback, useState, useEffect } from 'react';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { WAGMI_CONFIG } from '@/lib/web3/config';
import { writeContract, readContract } from 'wagmi/actions';
import { mainnet } from '@reown/appkit/networks';
import { erc4626ABI } from './abi';

export const useVaultActions = (vaultAddress: string) => {
  const { address: userAddress } = useAppKitAccount();
  const [totalAssets, setTotalAssets] = useState<bigint>(0n);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [userShares, setUserShares] = useState<bigint>(0n);
  const [isDepositing, setIsDepositing] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [isMinting, setIsMinting] = useState(false);

  // Read vault data using readContract
  const readContractData = useCallback(async () => {
    try {
      if (!userAddress) {
        setUserShares(0n);
        return;
      }

      // Read total assets
      const totalAssetsResult = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'totalAssets',
      });
      setTotalAssets(totalAssetsResult as bigint);

      // Read total supply
      const totalSupplyResult = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'totalSupply',
      });
      setTotalSupply(totalSupplyResult as bigint);

      // Read user shares
      const userSharesResult = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`],
      });
      setUserShares(userSharesResult as bigint);
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

      // ERC4626 deposit: (uint256 assets, address receiver)
      const result = await writeContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'deposit',
        args: [amount, userAddress as `0x${string}`], // assets, receiver
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

      // ERC4626 withdraw: (uint256 assets, address receiver, address owner)
      const result = await writeContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'withdraw',
        args: [amount, userAddress as `0x${string}`, userAddress as `0x${string}`], // assets, receiver, owner
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

      // ERC4626 redeem: (uint256 shares, address receiver, address owner)
      const result = await writeContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'redeem',
        args: [shares, userAddress as `0x${string}`, userAddress as `0x${string}`], // shares, receiver, owner
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

      // ERC4626 mint: (uint256 shares, address receiver)
      const result = await writeContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'mint',
        args: [shares, userAddress as `0x${string}`], // shares, receiver
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
      const balanceResult = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: vaultAddress as `0x${string}`,
        abi: erc4626ABI,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`],
      });
      setBalance(balanceResult as bigint);
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
      // Read allowance from the asset token contract
      const allowanceResult = await readContract(WAGMI_CONFIG, {
        chainId: mainnet.id,
        address: assetTokenAddress as `0x${string}`,
        abi: [
          {
            name: "allowance",
            type: "function",
            stateMutability: "view",
            inputs: [
              { internalType: "address", name: "owner", type: "address" },
              { internalType: "address", name: "spender", type: "address" }
            ],
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }]
          }
        ],
        functionName: 'allowance',
        args: [userAddress as `0x${string}`, vaultAddress as `0x${string}`],
      });
      setAllowance(allowanceResult as bigint);
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