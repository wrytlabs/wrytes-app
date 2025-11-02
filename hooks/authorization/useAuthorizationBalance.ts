import { useState, useEffect, useCallback } from 'react';
import { readContract } from 'wagmi/actions';
import { UseAuthorizationBalanceProps, UseAuthorizationBalanceReturn } from './types';
import { WAGMI_CONFIG } from '@/lib/web3/config';

/**
 * useAuthorizationBalance - Fetch balances from the AuthorizationProcessor contract
 * Provides balance checking for processor deposits using balanceOf(owner, token)
 */
export const useAuthorizationBalance = ({
  processorAddress,
  owner,
  token,
  chainId,
  watch = false,
  refetchInterval = 30000,
  enabled = true
}: UseAuthorizationBalanceProps): UseAuthorizationBalanceReturn => {
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Fetch balance from AuthorizationProcessor
  const fetchBalance = useCallback(async () => {
    if (!enabled || !processorAddress || !owner || !token) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Call balanceOf(address owner, address token) on the processor
      const processorBalance = await readContract(WAGMI_CONFIG, {
        chainId,
        address: processorAddress as `0x${string}`,
        abi: [
          {
            name: 'balanceOf',
            type: 'function',
            stateMutability: 'view',
            inputs: [
              { name: 'owner', type: 'address' },
              { name: 'token', type: 'address' }
            ],
            outputs: [{ name: 'balance', type: 'uint256' }]
          }
        ],
        functionName: 'balanceOf',
        args: [owner as `0x${string}`, token as `0x${string}`]
      });

      setBalance(processorBalance as bigint);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch authorization processor balance');
      console.error('Authorization balance fetch error:', error);
      setError(error);
      setBalance(0n);
    } finally {
      setLoading(false);
    }
  }, [enabled, processorAddress, owner, token, chainId]);

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
    loading,
    error,
    refetch
  };
};