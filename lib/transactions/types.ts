import { Abi } from 'viem';

export type TransactionStatus = 'pending' | 'approving' | 'executing' | 'completed' | 'failed' | 'cancelled';

export interface ApprovalConfig {
  tokenAddress: string;    // ERC20 token to approve
  spenderAddress: string;  // Contract that needs approval (vault, router, etc.)
  amount: string;          // Amount needed for approval
  checkAllowance: boolean; // Whether to check current allowance first
}

export interface QueueTransaction {
  id: string;
  title: string;
  subtitle: string;
  chainId: number;
  type: string; // Made generic - can be any transaction type
  status: TransactionStatus;
  txHash?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  progress?: number; // 0-100
  // Transaction parameters (generic)
  contractAddress?: string;
  functionName?: string;
  abi?: Abi;
  args?: readonly unknown[];
  value?: string;
  gasLimit?: string;
  // Auto-approval configuration
  approvalConfig?: ApprovalConfig;
  // Optional metadata
  tokenAddress?: string;
  tokenDecimals?: number;
  amount?: string;
  symbol?: string;
  icon?: string;
}

export interface TransactionQueueContextType {
  transactions: QueueTransaction[];
  activeTransactionId: string | null;
  addTransaction: (transaction: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress'>) => Promise<string>;
  updateTransaction: (id: string, updates: Partial<QueueTransaction>) => void;
  removeTransaction: (id: string) => void;
  retryTransaction: (id: string) => void;
  cancelTransaction: (id: string) => void;
  clearCompleted: () => void;
  getTransactionById: (id: string) => QueueTransaction | undefined;
  getPendingCount: () => number;
  getActiveTransaction: () => QueueTransaction | null;
  executeTransaction: (id: string) => Promise<void>;
  executeBatch: (ids: string[]) => Promise<void>;
  executeAll: () => Promise<void>;
  isExecuting: boolean;
  // NEW: Queue management methods
  moveTransactionUp: (id: string) => void;
  moveTransactionDown: (id: string) => void;
  reorderTransactions: (orderedIds: string[]) => void;
  clearAll: () => void;
  bulkExecute: (ids: string[]) => Promise<void>;
  bulkRemove: (ids: string[]) => void;
  // NEW: Enhanced querying
  getTransactionsByStatus: (status: TransactionStatus) => QueueTransaction[];
  getTransactionsByType: (type: string) => QueueTransaction[];
  getPendingTransactions: () => QueueTransaction[];
}

export interface PreparedTransaction {
  target: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  gasLimit?: bigint;
  description: string;
}

export interface BatchExecutionOptions {
  maxGasLimit?: bigint;
  gasPrice?: bigint;
  useMulticall?: boolean;
  walletType?: 'safe' | 'metamask' | 'other';
}

export interface ExecutionResult {
  success: boolean;
  txHash?: string;
  error?: string;
  gasUsed?: bigint;
  blockNumber?: bigint;
}

export interface BatchExecutionResult {
  success: boolean;
  totalGasUsed?: bigint;
  transactions: {
    id: string;
    result: ExecutionResult;
  }[];
  batchTxHash?: string;
  error?: string;
}

export interface TransactionPreparation {
  contractAddress: `0x${string}`;
  functionName: string;
  args: readonly unknown[];
  value?: bigint;
  gasLimit?: bigint;
}

export interface ApprovalTransaction {
  tokenAddress: `0x${string}`;
  spenderAddress: `0x${string}`;
  amount: bigint;
  currentAllowance: bigint;
  requiredAllowance: bigint;
}