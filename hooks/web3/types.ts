export interface UseContractReadProps {
  /** Contract address */
  address: string;
  /** Contract ABI */
  abi: any[];
  /** Function name to call */
  functionName: string;
  /** Function arguments */
  args?: any[];
  /** Chain ID (optional) */
  chainId?: number;
  /** Whether the hook is enabled */
  enabled?: boolean;
  /** Refetch interval in milliseconds */
  refetchInterval?: number;
  /** Whether to watch for changes */
  watch?: boolean;
}

export interface UseContractReadReturn<T = any> {
  /** The result data */
  data: T | undefined;
  /** Loading state */
  loading: boolean;
  /** Error object */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
  /** Whether data is stale */
  isStale: boolean;
}

export interface UseContractWriteProps {
  /** Contract address */
  address: string;
  /** Contract ABI */
  abi: any[];
  /** Function name to call */
  functionName: string;
  /** Chain ID (optional) */
  chainId?: number;
  /** Gas limit override */
  gasLimit?: bigint;
  /** Gas price override */
  gasPrice?: bigint;
  /** Value to send with transaction */
  value?: bigint;
}

export interface UseContractWriteReturn {
  /** Write function */
  write: (args?: any[], overrides?: WriteOverrides) => Promise<string>;
  /** Write function with prepared gas estimation */
  writeAsync: (args?: any[], overrides?: WriteOverrides) => Promise<string>;
  /** Loading state */
  loading: boolean;
  /** Error object */
  error: Error | null;
  /** Transaction hash */
  txHash: string | null;
  /** Reset function */
  reset: () => void;
}

export interface WriteOverrides {
  /** Gas limit override */
  gasLimit?: bigint;
  /** Gas price override */
  gasPrice?: bigint;
  /** Value to send */
  value?: bigint;
}

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