import { Abi } from 'viem';

export type TransactionStatus = 'queued' | 'pending' | 'executing' | 'completed' | 'failed';

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
  icon?: string;
  chainId: number;
  type: string; // Made generic - can be any transaction type
  status: TransactionStatus;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  // Transaction parameters (generic)
  contractAddress: string;
  functionName: string;
  abi: Abi;
  args?: readonly unknown[];
  value?: string;
  gasLimit?: string;
  txHash?: string;
  // Optional metadata token or token input
  tokenAddress?: string;
  tokenDecimals?: number;
  tokenAmount?: string;
  tokenSymbol?: string;
  // Optional metadata tokenOut
  tokenOutAddress?: string;
  tokenOutDecimals?: number;
  tokenOutAmount?: string;
  tokenOutSymbol?: string;

}

export interface TransactionQueueContextType {
  transactions: QueueTransaction[];
  activeTransactionId: string | null;
  // transaction management
  addTransaction: (transaction: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status' >) => Promise<string>;
  updateTransaction: (id: string, updates: Partial<QueueTransaction>) => void;
  removeTransaction: (id: string) => void;
  retryTransaction: (id: string) => void;
  cancelTransaction: (id: string) => void;
  clearCompleted: () => void;
  // enhanced querying
  getTransactionById: (id: string) => QueueTransaction | undefined;
  getPendingCount: () => number;
  getActiveTransaction: () => QueueTransaction | null;
  getTransactionsByStatus: (status: TransactionStatus) => QueueTransaction[];
  getTransactionsByType: (type: string) => QueueTransaction[];
  getPendingTransactions: () => QueueTransaction[];
  // execution
  executeTransaction: (id: string) => Promise<void>;
  executeBatch: (ids: string[]) => Promise<void>;
  executeAll: () => Promise<void>;
  isExecuting: boolean;
  // queue management
  moveTransactionUp: (id: string) => void;
  moveTransactionDown: (id: string) => void;
  reorderTransactions: (orderedIds: string[]) => void;
  clearAll: () => void;
  bulkExecute: (ids: string[]) => Promise<void>;
  bulkRemove: (ids: string[]) => void;
}

export interface BatchExecutionOptions {
  maxGasLimit?: bigint;
  gasPrice?: bigint;
  useMulticall?: boolean;
  walletType?: 'safe' | 'metamask' | 'walletconnect' | 'aragon' | 'other';
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
  chainId: number;
  contractAddress: `0x${string}`;
  functionName: string;
  abi: Abi;
  args?: readonly unknown[];
  value?: bigint;
  gasLimit?: bigint;
}