import { useState, useEffect, useCallback } from 'react';
import { readContract } from 'wagmi/actions';
import { formatUnits } from 'viem';
import { UseBalanceProps, UseBalanceReturn } from './types';
import { WAGMI_CONFIG } from '@/lib/web3/config';

/**
 * useBalance - Generic balance checking hook with auto-refresh
 * Supports both native tokens and ERC20 tokens
 * Provides formatted balance strings and automatic refreshing
 */
export const useBalance = ({
  address,
  token,
  chainId,
  watch = false,
  refetchInterval = 30000, // 30 seconds default
  enabled = true
}: UseBalanceProps): UseBalanceReturn => {;
  const [balance, setBalance] = useState<bigint>(0n);
  const [formatted, setFormatted] = useState<string>('0');
  const [decimals, setDecimals] = useState<number>(18);
  const [symbol, setSymbol] = useState<string>('ETH');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch balance
  const fetchBalance = useCallback(async () => {
    if (!enabled || !address) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      if (token) {
        // ERC20 token balance
        const [tokenBalance, tokenDecimals, tokenSymbol] = await Promise.all([
          readContract(WAGMI_CONFIG, {
            chainId,
            address: token as `0x${string}`,
            abi: [
              {
                name: 'balanceOf',
                type: 'function',
                stateMutability: 'view',
                inputs: [{ name: 'account', type: 'address' }],
                outputs: [{ name: 'balance', type: 'uint256' }]
              }
            ],
            functionName: 'balanceOf',
            args: [address as `0x${string}`]
          }),
          readContract(WAGMI_CONFIG, {
            chainId,
            address: token as `0x${string}`,
            abi: [
              {
                name: 'decimals',
                type: 'function',
                stateMutability: 'view',
                inputs: [],
                outputs: [{ name: 'decimals', type: 'uint8' }]
              }
            ],
            functionName: 'decimals'
          }),
          readContract(WAGMI_CONFIG, {
            chainId,
            address: token as `0x${string}`,
            abi: [
              {
                name: 'symbol',
                type: 'function',
                stateMutability: 'view',
                inputs: [],
                outputs: [{ name: 'symbol', type: 'string' }]
              }
            ],
            functionName: 'symbol'
          })
        ]);

        const balanceValue = tokenBalance as bigint;
        const decimalsValue = tokenDecimals as number;
        const symbolValue = tokenSymbol as string;

        setBalance(balanceValue);
        setDecimals(decimalsValue);
        setSymbol(symbolValue);
        setFormatted(formatUnits(balanceValue, decimalsValue));
      } else {
        // Native token balance
        const nativeBalance = await readContract(WAGMI_CONFIG, {
          chainId,
          address: address as `0x${string}`,
          abi: [
            {
              name: 'balanceOf',
              type: 'function',
              stateMutability: 'view',
              inputs: [],
              outputs: [{ name: 'balance', type: 'uint256' }]
            }
          ],
          functionName: 'balanceOf'
        });

        setBalance(nativeBalance);
        setDecimals(18);
        setSymbol('ETH'); // This should be dynamic based on chain
        setFormatted(formatUnits(nativeBalance, 18));
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch balance');
      console.error('Balance fetch error:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  }, [enabled, address, token, chainId]);

  // Refetch function
  const refetch = useCallback(() => {
    return fetchBalance();
  }, [fetchBalance]);

  // Initial fetch
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh interval
  useEffect(() => {
    if (!watch || !refetchInterval || !enabled) return;

    const interval = setInterval(() => {
      fetchBalance();
    }, refetchInterval);

    return () => clearInterval(interval);
  }, [watch, refetchInterval, enabled, fetchBalance]);

  return {
    balance,
    formatted,
    decimals,
    symbol,
    loading,
    error,
    refetch
  };
};