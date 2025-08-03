export type TransactionStatus = 'pending' | 'approving' | 'executing' | 'completed' | 'failed' | 'cancelled';

export interface QueueTransaction {
  id: string;
  title: string;
  subtitle: string;
  contractAddress: string;
  chainId: number;
  type: 'approve' | 'deposit' | 'withdraw' | 'mint' | 'redeem' | 'transfer' | 'swap' | 'custom';
  status: TransactionStatus;
  txHash?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  progress?: number; // 0-100
  // Transaction parameters (generic)
  targetContract?: string;
  functionName?: string;
  args?: readonly unknown[];
  value?: string;
  gasLimit?: string;
  // Optional metadata
  amount?: string;
  symbol?: string;
  icon?: string;
}

export interface TransactionQueueContextType {
  transactions: QueueTransaction[];
  activeTransactionId: string | null;
  addTransaction: (transaction: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress'>) => string;
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