import { AddressConfig } from '@/components/ui/AddressSelector';
import { TokenConfig } from '@/lib/tokens/config';

export enum OperationKind {
  TRANSFER = 0,
  DEPOSIT = 1,
  PROCESS = 2,
  CLAIM = 3,
}

export interface Authorization {
  kind: OperationKind;
  from: string;
  to: string;
  token: string;
  amount: string;
  nonce: string;
  validAfter: string;
  validBefore: string;
}

export interface AuthorizationState {
  authorization: Authorization;
  verifyingContract: string;
  selectedTokenDecimals: number;
  errors: Partial<Record<keyof Authorization | 'verifyingContract', string>>;
}

export interface UseAuthorizationAddressesReturn {
  addresses: AddressConfig[];
  connectedAddress: string | undefined;
  isLoading: boolean;
}

// Authorization Balance Hook Types
export interface UseAuthorizationBalanceProps {
  /** AuthorizationProcessor contract address */
  processorAddress?: string;
  /** Owner address to check balance for */
  owner?: string;
  /** Token contract address */
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

export interface UseAuthorizationBalanceReturn {
  /** Balance in processor */
  balance: bigint;
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => void;
}

// Token Balances Hook Types
export interface TokenBalanceInfo {
  token: TokenConfig;
  walletBalance: bigint;
  processorBalance: bigint;
  isLoading: boolean;
  error?: Error | null;
}

export interface UseTokenBalancesProps {
  /** Address to check balances for */
  address?: string;
  /** AuthorizationProcessor contract address */
  processorAddress?: string;
  /** Whether to watch for changes */
  watch?: boolean;
  /** Refetch interval */
  refetchInterval?: number;
  /** Whether the hook is enabled */
  enabled?: boolean;
}

export interface UseTokenBalancesReturn {
  /** All token balances */
  balances: TokenBalanceInfo[];
  /** Filtered balances (non-zero by default) */
  filteredBalances: TokenBalanceInfo[];
  /** Loading state */
  loading: boolean;
  /** Error state */
  error: Error | null;
  /** Refetch function */
  refetch: () => Promise<void>;
  /** Get filtered balances with custom zero balance setting */
  getFilteredBalances: (showZeroBalances?: boolean) => TokenBalanceInfo[];
}