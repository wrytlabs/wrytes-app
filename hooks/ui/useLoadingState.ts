import { useState, useCallback } from 'react';
import { UseLoadingStateReturn } from './types';

/**
 * useLoadingState - Hook for managing loading states
 * Provides consistent loading patterns across components
 * Includes helper for async operations
 */
export const useLoadingState = (initialLoading = false): UseLoadingStateReturn => {
  const [loading, setLoading] = useState(initialLoading);

  // Start loading
  const startLoading = useCallback(() => {
    setLoading(true);
  }, []);

  // Stop loading
  const stopLoading = useCallback(() => {
    setLoading(false);
  }, []);

  // Toggle loading state
  const toggleLoading = useCallback(() => {
    setLoading(prev => !prev);
  }, []);

  // Execute async function with loading state
  const withLoading = useCallback(async <T>(fn: () => Promise<T>): Promise<T> => {
    try {
      setLoading(true);
      const result = await fn();
      return result;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    startLoading,
    stopLoading,
    toggleLoading,
    withLoading
  };
};

export default useLoadingState;