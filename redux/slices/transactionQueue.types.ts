import { PayloadAction } from '@reduxjs/toolkit';
import { QueueTransaction, TransactionStatus } from '@/lib/transactions/types';

// --------------------------------------------------------------------------------
// Redux State Types
// --------------------------------------------------------------------------------

export interface TransactionQueueState {
  transactions: QueueTransaction[];
  activeTransactionId: string | null;
  isExecuting: boolean;
  lastUpdated: number;
}

// --------------------------------------------------------------------------------
// Redux Action Payload Types
// --------------------------------------------------------------------------------

export interface AddTransactionPayload {
  transactions: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status'>[];
}

export interface UpdateTransactionPayload {
  id: string;
  updates: Partial<QueueTransaction>;
}

export interface RemoveTransactionPayload {
  id: string;
}

export interface RemoveMultipleTransactionsPayload {
  ids: string[];
}

export interface ReorderTransactionsPayload {
  orderedIds: string[];
}

export interface MoveTransactionPayload {
  id: string;
  direction: 'up' | 'down';
}

export interface SetActiveTransactionPayload {
  id: string | null;
}

export interface SetIsExecutingPayload {
  isExecuting: boolean;
}

export interface ClearTransactionsByStatusPayload {
  status: TransactionStatus[];
}

export interface UpdateTransactionStatusPayload {
  id: string;
  status: TransactionStatus;
  error?: string;
  txHash?: string;
}

// --------------------------------------------------------------------------------
// Redux Action Types
// --------------------------------------------------------------------------------

export type TransactionQueueActionPayloads = {
  addTransactions: AddTransactionPayload;
  updateTransaction: UpdateTransactionPayload;
  removeTransaction: RemoveTransactionPayload;
  removeMultipleTransactions: RemoveMultipleTransactionsPayload;
  reorderTransactions: ReorderTransactionsPayload;
  moveTransaction: MoveTransactionPayload;
  setActiveTransaction: SetActiveTransactionPayload;
  setIsExecuting: SetIsExecutingPayload;
  clearTransactionsByStatus: ClearTransactionsByStatusPayload;
  updateTransactionStatus: UpdateTransactionStatusPayload;
  clearAllTransactions: void;
  retryTransaction: { id: string };
};

// --------------------------------------------------------------------------------
// Helper Types for Action Creators
// --------------------------------------------------------------------------------

export type TransactionQueueActions = {
  [K in keyof TransactionQueueActionPayloads]: PayloadAction<TransactionQueueActionPayloads[K]>;
};

// --------------------------------------------------------------------------------
// Selector Helper Types
// --------------------------------------------------------------------------------

export interface TransactionsByStatusFilter {
  status: TransactionStatus;
}

export interface TransactionsByTypeFilter {
  type: string;
}

// --------------------------------------------------------------------------------
// Persistence Types
// --------------------------------------------------------------------------------

export interface PersistenceConfig {
  key: string;
  version: number;
  cleanupOlderThan: number; // hours
}

export const PERSISTENCE_CONFIG: PersistenceConfig = {
  key: 'wrytes_transaction_queue_redux',
  version: 1,
  cleanupOlderThan: 24,
};

// --------------------------------------------------------------------------------
// Initial State
// --------------------------------------------------------------------------------

export const initialTransactionQueueState: TransactionQueueState = {
  transactions: [],
  activeTransactionId: null,
  isExecuting: false,
  lastUpdated: Date.now(),
};