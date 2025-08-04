import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';
import { v4 as uuidv4 } from 'uuid';
import {  
  initialTransactionQueueState,
  AddTransactionPayload,
  UpdateTransactionPayload,
  RemoveTransactionPayload,
  RemoveMultipleTransactionsPayload,
  ReorderTransactionsPayload,
  MoveTransactionPayload,
  SetActiveTransactionPayload,
  SetIsExecutingPayload,
  ClearTransactionsByStatusPayload,
  UpdateTransactionStatusPayload,
} from './transactionQueue.types';
import { QueueTransaction } from '@/lib/transactions/types';
import { TransactionExecutor } from '@/lib/transactions/executor';
import { RootState } from '../redux.store';
import { simulateContract } from 'wagmi/actions';

// --------------------------------------------------------------------------------
// Async Thunks
// --------------------------------------------------------------------------------

export const executeTransaction = createAsyncThunk<
  { id: string; success: boolean; txHash?: string; error?: string },
  { id: string; userAddress: `0x${string}` }
>(
  'transactionQueue/executeTransaction',
  async ({ id, userAddress }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const transaction = state.transactionQueue.transactions.find((tx: QueueTransaction) => tx.id === id);
    
    if (!transaction) {
      throw new Error(`Transaction not found: ${id}`);
    }

    if (transaction.status !== 'queued' && transaction.status !== 'pending' && transaction.status !== 'failed') {
      throw new Error(`Transaction is not in executable state: ${transaction.status}`);
    }

    try {
      dispatch(setIsExecuting({ isExecuting: true }));
      dispatch(setActiveTransaction({ id }));
      dispatch(updateTransactionStatus({ id, status: 'executing' }));

      const executor = TransactionExecutor.getInstance();
      const result = await executor.executeTransaction(transaction, userAddress);

      if (result.success) {
        dispatch(updateTransactionStatus({ 
          id, 
          status: 'completed', 
          txHash: result.txHash 
        }));
        return { id, success: true, txHash: result.txHash };
      } else {
        dispatch(updateTransactionStatus({ 
          id, 
          status: 'failed', 
          error: result.error 
        }));
        return { id, success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      dispatch(updateTransactionStatus({ 
        id, 
        status: 'failed', 
        error: errorMessage 
      }));
      return { id, success: false, error: errorMessage };
    } finally {
      dispatch(setIsExecuting({ isExecuting: false }));
      dispatch(setActiveTransaction({ id: null }));
    }
  }
);

export const executeBatch = createAsyncThunk<
  { results: Array<{ id: string; success: boolean; txHash?: string; error?: string }> },
  { ids: string[]; userAddress: `0x${string}` }
>(
  'transactionQueue/executeBatch',
  async ({ ids, userAddress }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const transactionsToExecute = ids
      .map(id => state.transactionQueue.transactions.find((tx: QueueTransaction) => tx.id === id))
      .filter((tx): tx is QueueTransaction => 
        tx !== undefined && (tx.status === 'queued' || tx.status === 'pending' || tx.status === 'failed')
      );

    if (transactionsToExecute.length === 0) {
      throw new Error('No executable transactions found');
    }

    try {
      dispatch(setIsExecuting({ isExecuting: true }));

      // Mark all transactions as pending
      transactionsToExecute.forEach(tx => {
        dispatch(updateTransactionStatus({ 
          id: tx.id, 
          status: 'pending' 
        }));
      });

      const executor = TransactionExecutor.getInstance();
      const results: Array<{ id: string; success: boolean; txHash?: string; error?: string }> = [];

      // Execute transactions sequentially
      for (const tx of transactionsToExecute) {
        try {
          dispatch(updateTransactionStatus({ 
            id: tx.id, 
            status: 'executing' 
          }));

          const result = await executor.executeTransaction(tx, userAddress, false);

          if (result.success) {
            dispatch(updateTransactionStatus({ 
              id: tx.id, 
              status: 'completed', 
              txHash: result.txHash 
            }));
            results.push({ id: tx.id, success: true, txHash: result.txHash });
          } else {
            dispatch(updateTransactionStatus({ 
              id: tx.id, 
              status: 'failed', 
              error: result.error 
            }));
            results.push({ id: tx.id, success: false, error: result.error });
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Transaction execution failed';
          dispatch(updateTransactionStatus({ 
            id: tx.id, 
            status: 'failed', 
            error: errorMessage 
          }));
          results.push({ id: tx.id, success: false, error: errorMessage });
        }
      }

      return { results };
    } catch (error) {
      // Mark all as failed on batch error
      transactionsToExecute.forEach(tx => {
        dispatch(updateTransactionStatus({ 
          id: tx.id, 
          status: 'failed', 
          error: error instanceof Error ? error.message : 'Batch execution failed' 
        }));
      });
      throw error;
    } finally {
      dispatch(setIsExecuting({ isExecuting: false }));
      dispatch(setActiveTransaction({ id: null }));
    }
  }
);

export const executeAll = createAsyncThunk<
  { results: Array<{ id: string; success: boolean; txHash?: string; error?: string }> },
  { userAddress: `0x${string}` }
>(
  'transactionQueue/executeAll',
  async ({ userAddress }, { getState, dispatch }) => {
    const state = getState() as RootState;
    const pendingIds = state.transactionQueue.transactions
      .filter((tx: QueueTransaction) => tx.status === 'queued' || tx.status === 'pending' || tx.status === 'failed')
      .map((tx: QueueTransaction) => tx.id);
    
    if (pendingIds.length === 0) {
      return { results: [] };
    }

    const result = await dispatch(executeBatch({ ids: pendingIds, userAddress }));
    return result.payload as { results: Array<{ id: string; success: boolean; txHash?: string; error?: string }> };
  }
);

export const simulateTransaction = createAsyncThunk<
  { id: string; success: boolean; simulation?: ReturnType<typeof simulateContract>; error?: string },
  { id: string; userAddress: `0x${string}` }
>(
  'transactionQueue/simulateTransaction',
  async ({ id, userAddress }, { getState }) => {
    const state = getState() as RootState;
    const transaction = state.transactionQueue.transactions.find((tx: QueueTransaction) => tx.id === id);
    
    if (!transaction) {
      throw new Error(`Transaction not found: ${id}`);
    }

    try {
      const executor = TransactionExecutor.getInstance();
      const result = await executor.simulateTransaction(transaction, userAddress);

      if (result.success) {
        return { id, success: true, simulation: result.simulation };
      } else {
        return { id, success: false, error: result.error };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Simulation failed';
      return { id, success: false, error: errorMessage };
    }
  }
);

// --------------------------------------------------------------------------------
// Slice
// --------------------------------------------------------------------------------

export const transactionQueueSlice = createSlice({
  name: 'transactionQueue',
  initialState: initialTransactionQueueState,
  reducers: {
    // Add transactions to the queue
    addTransactions: (state, action: PayloadAction<AddTransactionPayload>) => {
      const now = Date.now();

      for (const txData of action.payload.transactions) {
        const id = uuidv4();
        const transaction = {
          ...txData,
          id,
          status: 'queued' as const,
          createdAt: now,
          updatedAt: now,
        };
        state.transactions.push(transaction as any);
      }
      
      // Auto-start if no active transaction and we have transactions
      if (!state.activeTransactionId && state.transactions.length > 0) {
        state.activeTransactionId = state.transactions[state.transactions.length - 1].id;
      }
      
      state.lastUpdated = Date.now();
    },

    // Update a specific transaction
    updateTransaction: (state, action: PayloadAction<UpdateTransactionPayload>) => {
      const { id, updates } = action.payload;
      const transactionIndex = state.transactions.findIndex(tx => tx.id === id);
      
      if (transactionIndex !== -1) {
        state.transactions[transactionIndex] = {
          ...state.transactions[transactionIndex],
          ...updates,
          updatedAt: Date.now(),
        } as any;
        state.lastUpdated = Date.now();
      }
    },

    // Remove a single transaction
    removeTransaction: (state, action: PayloadAction<RemoveTransactionPayload>) => {
      const { id } = action.payload;
      state.transactions = state.transactions.filter(tx => tx.id !== id);
      
      if (state.activeTransactionId === id) {
        state.activeTransactionId = null;
      }
      
      state.lastUpdated = Date.now();
    },

    // Remove multiple transactions
    removeMultipleTransactions: (state, action: PayloadAction<RemoveMultipleTransactionsPayload>) => {
      const { ids } = action.payload;
      state.transactions = state.transactions.filter(tx => !ids.includes(tx.id));
      
      if (state.activeTransactionId && ids.includes(state.activeTransactionId)) {
        state.activeTransactionId = null;
      }
      
      state.lastUpdated = Date.now();
    },

    // Reorder transactions
    reorderTransactions: (state, action: PayloadAction<ReorderTransactionsPayload>) => {
      const { orderedIds } = action.payload;
      const orderedTransactions = orderedIds
        .map(id => state.transactions.find(tx => tx.id === id))
        .filter(tx => tx !== undefined);
      
      // Add any transactions not in the ordered list at the end
      const remainingTransactions = state.transactions.filter(
        tx => !orderedIds.includes(tx.id)
      );
      
      state.transactions = [...orderedTransactions, ...remainingTransactions];
      state.lastUpdated = Date.now();
    },

    // Move transaction up or down
    moveTransaction: (state, action: PayloadAction<MoveTransactionPayload>) => {
      const { id, direction } = action.payload;
      const currentIndex = state.transactions.findIndex(tx => tx.id === id);
      
      if (currentIndex === -1) return;
      
      let newIndex: number;
      if (direction === 'up' && currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (direction === 'down' && currentIndex < state.transactions.length - 1) {
        newIndex = currentIndex + 1;
      } else {
        return; // Can't move further
      }
      
      // Swap transactions
      [state.transactions[currentIndex], state.transactions[newIndex]] = 
        [state.transactions[newIndex], state.transactions[currentIndex]];
      
      state.lastUpdated = Date.now();
    },

    // Set active transaction
    setActiveTransaction: (state, action: PayloadAction<SetActiveTransactionPayload>) => {
      state.activeTransactionId = action.payload.id;
      state.lastUpdated = Date.now();
    },

    // Set execution status
    setIsExecuting: (state, action: PayloadAction<SetIsExecutingPayload>) => {
      state.isExecuting = action.payload.isExecuting;
      state.lastUpdated = Date.now();
    },

    // Clear transactions by status
    clearTransactionsByStatus: (state, action: PayloadAction<ClearTransactionsByStatusPayload>) => {
      const { status } = action.payload;
      state.transactions = state.transactions.filter(tx => !status.includes(tx.status));
      state.lastUpdated = Date.now();
    },

    // Update transaction status (convenience action)
    updateTransactionStatus: (state, action: PayloadAction<UpdateTransactionStatusPayload>) => {
      const { id, status, error, txHash } = action.payload;
      const transactionIndex = state.transactions.findIndex(tx => tx.id === id);
      
      if (transactionIndex !== -1) {
        state.transactions[transactionIndex] = {
          ...state.transactions[transactionIndex],
          status,
          error,
          txHash,
          updatedAt: Date.now(),
        };
        state.lastUpdated = Date.now();
      }
    },

    // Clear all transactions
    clearAllTransactions: (state) => {
      state.transactions = [];
      state.activeTransactionId = null;
      state.isExecuting = false;
      state.lastUpdated = Date.now();
    },

    // Retry transaction
    retryTransaction: (state, action: PayloadAction<{ id: string }>) => {
      const { id } = action.payload;
      const transactionIndex = state.transactions.findIndex(tx => tx.id === id);
      
      if (transactionIndex !== -1) {
        state.transactions[transactionIndex] = {
          ...state.transactions[transactionIndex],
          status: 'pending',
          error: undefined,
          txHash: undefined,
          updatedAt: Date.now(),
        };
        
        // Set as active if no current active transaction
        if (!state.activeTransactionId) {
          state.activeTransactionId = id;
        }
        
        state.lastUpdated = Date.now();
      }
    },

  },
  extraReducers: (builder) => {
    builder
      // Handle async execution states
      .addCase(executeTransaction.pending, (state) => {
        state.isExecuting = true;
      })
      .addCase(executeTransaction.fulfilled, (state) => {
        state.isExecuting = false;
        state.activeTransactionId = null;
      })
      .addCase(executeTransaction.rejected, (state) => {
        state.isExecuting = false;
        state.activeTransactionId = null;
      })
      .addCase(executeBatch.pending, (state) => {
        state.isExecuting = true;
      })
      .addCase(executeBatch.fulfilled, (state) => {
        state.isExecuting = false;
        state.activeTransactionId = null;
      })
      .addCase(executeBatch.rejected, (state) => {
        state.isExecuting = false;
        state.activeTransactionId = null;
      })
      // Handle redux-persist REHYDRATE action
      .addCase(REHYDRATE, (state, action: any) => {
        if (action.payload?.transactionQueue) {
          const persistedState = action.payload.transactionQueue;
          
          // The BigInt transform handles serialization/deserialization automatically
          // Since createdAt and updatedAt are now Unix timestamps (numbers), no conversion needed
          if (persistedState.transactions) {
            state.transactions = persistedState.transactions;
          }
          
          // Reset execution states on rehydration for safety
          state.isExecuting = false;
          state.activeTransactionId = null;
          state.lastUpdated = Date.now();
        }
      });
  },
});

// --------------------------------------------------------------------------------
// Export Actions and Reducer
// --------------------------------------------------------------------------------

export const {
  addTransactions,
  updateTransaction,
  removeTransaction,
  removeMultipleTransactions,
  reorderTransactions,
  moveTransaction,
  setActiveTransaction,
  setIsExecuting,
  clearTransactionsByStatus,
  updateTransactionStatus,
  clearAllTransactions,
  retryTransaction,
} = transactionQueueSlice.actions;

export const transactionQueueReducer = transactionQueueSlice.reducer;

// --------------------------------------------------------------------------------
// Convenience Action Creators
// --------------------------------------------------------------------------------

export const clearCompleted = () => 
  clearTransactionsByStatus({ status: ['completed', 'failed'] });

export const moveTransactionUp = (id: string) => 
  moveTransaction({ id, direction: 'up' });

export const moveTransactionDown = (id: string) => 
  moveTransaction({ id, direction: 'down' });

export const cancelTransaction = (id: string) => 
  removeTransaction({ id });

export const bulkRemove = (ids: string[]) => 
  removeMultipleTransactions({ ids });