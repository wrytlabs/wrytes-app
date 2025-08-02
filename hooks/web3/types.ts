export interface UseBalanceProps {
  /** Address to check balance for */
  address?: string;
  /** Token contract address (undefined for native token) */
  token?: string;
  /** Chain ID */
  chainId?: number;
  /** Whether to watch for changes */
  watch?: boolean;
  /** Refetch interval */
  refetchInterval?: number;
  /** Whether the hook is enabled */
  enabled?: boolean;
}

export interface UseBalanceReturn {
  /** Balance in wei/smallest unit */
  balance: bigint;
  /** Formatted balance string */
  formatted: string;
  /** Token decimals */
  decimals: number;
  /** Token symbol */
  symbol: string;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}