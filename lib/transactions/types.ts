import { QueueTransaction } from '@/contexts/TransactionQueueContext';

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