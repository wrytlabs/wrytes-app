import { useState, useEffect, useCallback, useRef } from 'react';
import { usePublicClient } from 'wagmi';
import { UseContractReadProps, UseContractReadReturn } from './types';

/**
 * useContractRead - Generic contract reading hook with caching
 * Provides automatic error handling, retry logic, and loading states
 * Supports watching for changes and configurable refetch intervals
 */
export const useContractRead = <T = any>({
  address,
  abi,
  functionName,
  args = [],
  chainId,
  enabled = true,
  refetchInterval,
  watch = false
}: UseContractReadProps): UseContractReadReturn<T> => {
  const publicClient = usePublicClient({ chainId });
  
  const [data, setData] = useState<T | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStale, setIsStale] = useState(false);
  
  const cacheRef = useRef<Map<string, { data: T; timestamp: number }>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  
  // Create cache key
  const cacheKey = `${address}-${functionName}-${JSON.stringify(args)}`;
  
  // Read contract data
  const readContract = useCallback(async (retryCount = 0): Promise<T | undefined> => {
    if (!enabled || !publicClient || !address || !abi || !functionName) {
      return undefined;
    }

    try {
      setLoading(true);
      setError(null);
      
      const result = await publicClient.readContract({
        address: address as `0x${string}`,
        abi,
        functionName,
        args
      });
      
      // Cache the result
      cacheRef.current.set(cacheKey, {
        data: result as T,
        timestamp: Date.now()
      });
      
      setData(result as T);
      setIsStale(false);
      retryCountRef.current = 0;
      
      return result as T;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Contract read failed');
      console.error(`Contract read error (attempt ${retryCount + 1}):`, error);
      
      // Retry logic
      if (retryCount < 3) {
        retryCountRef.current = retryCount + 1;
        setTimeout(() => readContract(retryCount + 1), 1000 * (retryCount + 1));
        return;
      }
      
      setError(error);
      setIsStale(true);
      return undefined;
    } finally {
      setLoading(false);
    }
  }, [enabled, publicClient, address, abi, functionName, JSON.stringify(args), cacheKey]);

  // Refetch function
  const refetch = useCallback(() => {
    setIsStale(true);
    return readContract();
  }, [readContract]);

  // Check cache and load data
  useEffect(() => {
    if (!enabled) return;
    
    // Check cache first (5 minute cache)
    const cached = cacheRef.current.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      setData(cached.data);
      setIsStale(false);
      setLoading(false);
      return;
    }
    
    // Load fresh data
    readContract();
  }, [enabled, cacheKey, readContract]);

  // Set up refetch interval
  useEffect(() => {
    if (!refetchInterval || !enabled) return;

    intervalRef.current = setInterval(() => {
      refetch();
    }, refetchInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [refetchInterval, enabled, refetch]);

  // Watch for changes (simplified - would need event listening in real implementation)
  useEffect(() => {
    if (!watch || !enabled) return;

    // In a real implementation, this would set up event listeners
    // for now, we'll just mark data as potentially stale
    const watchInterval = setInterval(() => {
      setIsStale(true);
    }, 30000); // Mark stale every 30 seconds

    return () => clearInterval(watchInterval);
  }, [watch, enabled]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    data,
    loading,
    error,
    refetch,
    isStale
  };
};