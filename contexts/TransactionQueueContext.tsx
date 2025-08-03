import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { TransactionExecutor } from '@/lib/transactions/executor';
import { TransactionQueueStorage } from '@/lib/transactions/storage';
import { QueueTransaction, TransactionQueueContextType, TransactionStatus } from '@/lib/transactions/types';

const TransactionQueueContext = createContext<TransactionQueueContextType | undefined>(undefined);

export const useTransactionQueue = () => {
  const context = useContext(TransactionQueueContext);
  if (context === undefined) {
    throw new Error('useTransactionQueue must be used within a TransactionQueueProvider');
  }
  return context;
};

interface TransactionQueueProviderProps {
  children: ReactNode;
}

export const TransactionQueueProvider: React.FC<TransactionQueueProviderProps> = ({ children }) => {
  const { address: userAddress } = useAppKitAccount();
  const executor = TransactionExecutor.getInstance();

  // Initialize with stored data or mock data
  const [transactions, setTransactions] = useState<QueueTransaction[]>(() => {
    // Load from localStorage on mount
    return TransactionQueueStorage.loadTransactions();
  });

  const [activeTransactionId, setActiveTransactionId] = useState<string | null>(() => {
    // Load from localStorage on mount
    return TransactionQueueStorage.loadActiveTransactionId();
  });

  const [isExecuting, setIsExecuting] = useState(false);

  // Save to localStorage whenever transactions change
  const saveTransactions = useCallback((newTransactions: QueueTransaction[]) => {
    setTransactions(newTransactions);
    TransactionQueueStorage.saveTransactions(newTransactions);
  }, []);

  // Save active transaction ID whenever it changes
  const saveActiveTransactionId = useCallback((id: string | null) => {
    setActiveTransactionId(id);
    TransactionQueueStorage.saveActiveTransactionId(id);
  }, []);

  // Clean up old transactions on mount
  useEffect(() => {
    TransactionQueueStorage.cleanupOldTransactions();
  }, []);

  const addTransaction = useCallback(async (
    transactionData: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status' >
  ): Promise<string> => {
    const now = new Date();
    const transactionsToAdd: QueueTransaction[] = [];

    // Create the main transaction
    const mainId = uuidv4();
    const mainTransaction: QueueTransaction = {
      ...transactionData,
      id: mainId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    transactionsToAdd.push(mainTransaction);

    // Add all transactions to the queue
    saveTransactions([...transactions, ...transactionsToAdd]);
    
    // Auto-start if no active transaction
    if (!activeTransactionId && transactionsToAdd.length > 0) {
      saveActiveTransactionId(transactionsToAdd[0].id);
    }
    
    return mainId; // Return the main transaction ID
  }, [transactions, activeTransactionId, saveTransactions, saveActiveTransactionId]);

  const updateTransaction = useCallback((id: string, updates: Partial<QueueTransaction>) => {
    const updated = transactions.map(tx =>
      tx.id === id
        ? { ...tx, ...updates, updatedAt: new Date() }
        : tx
    );
    saveTransactions(updated);
  }, [transactions, saveTransactions]);

  const removeTransaction = useCallback((id: string) => {
    const filtered = transactions.filter(tx => tx.id !== id);
    saveTransactions(filtered);
    
    if (activeTransactionId === id) {
      saveActiveTransactionId(null);
    }
  }, [transactions, activeTransactionId, saveTransactions, saveActiveTransactionId]);

  const retryTransaction = useCallback((id: string) => {
    updateTransaction(id, {
      status: 'pending',
      error: undefined,
      txHash: undefined,
    });
    
    // Set as active if no current active transaction
    if (!activeTransactionId) {
      saveActiveTransactionId(id);
    }
  }, [updateTransaction, activeTransactionId, saveActiveTransactionId]);

  const cancelTransaction = useCallback(removeTransaction, [removeTransaction]);

  const clearCompleted = useCallback(() => {
    const filtered = transactions.filter(tx => tx.status !== 'completed' && tx.status !== 'failed');
    saveTransactions(filtered);
  }, [transactions, saveTransactions]);

  const getTransactionById = useCallback((id: string) => {
    return transactions.find(tx => tx.id === id);
  }, [transactions]);

  const getPendingCount = useCallback(() => {
    return transactions.filter(tx => 
      tx.status === 'pending' || tx.status === 'executing'
    ).length;
  }, [transactions]);

  const getActiveTransaction = useCallback(() => {
    if (!activeTransactionId) return null;
    return getTransactionById(activeTransactionId) || null;
  }, [activeTransactionId, getTransactionById]);

  const executeTransaction = useCallback(async (id: string) => {
    if (!userAddress) {
      console.error('No user address available');
      return;
    }

    const transaction = getTransactionById(id);
    if (!transaction) {
      console.error('Transaction not found:', id);
      return;
    }

    if (transaction.status !== 'pending' && transaction.status !== 'failed') {
      console.error('Transaction is not in executable state:', transaction.status);
      return;
    }

    try {
      setIsExecuting(true);
      saveActiveTransactionId(id);

      // Update transaction status to executing
      updateTransaction(id, {
        status: 'executing',
        error: undefined,
      });

      const result = await executor.executeTransaction(transaction, userAddress as `0x${string}`);

      if (result.success) {
        updateTransaction(id, {
          status: 'completed',
          txHash: result.txHash,
        });
      } else {
        updateTransaction(id, {
          status: 'failed',
          error: result.error,
        });
      }
    } catch (error) {
      updateTransaction(id, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsExecuting(false);
      saveActiveTransactionId(null);
    }
  }, [userAddress, executor, getTransactionById, updateTransaction, saveActiveTransactionId]);

  const executeBatch = useCallback(async (ids: string[]) => {
    if (!userAddress) {
      console.error('No user address available');
      return;
    }

    const transactionsToExecute = ids
      .map(id => getTransactionById(id))
      .filter((tx): tx is QueueTransaction => 
        tx !== undefined && (tx.status === 'pending' || tx.status === 'failed')
      );

    if (transactionsToExecute.length === 0) {
      console.error('No executable transactions found');
      return;
    }

    try {
      setIsExecuting(true);

      // Mark all transactions as executing
      transactionsToExecute.forEach(tx => {
        updateTransaction(tx.id, {
          status: 'executing',
          error: undefined,
        });
      });

      // Execute transactions sequentially
      const results = await executor.executeSequential(
        transactionsToExecute,
        userAddress as `0x${string}`
      );

      // Update final results
      results.forEach(({ id, result }) => {
        if (result.success) {
          updateTransaction(id, {
            status: 'completed',
            txHash: result.txHash,
          });
        } else {
          updateTransaction(id, {
            status: 'failed',
            error: result.error,
          });
        }
      });
    } catch (error) {
      // Mark all as failed on batch error
      transactionsToExecute.forEach(tx => {
        updateTransaction(tx.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Batch execution failed',
        });
      });
    } finally {
      setIsExecuting(false);
      saveActiveTransactionId(null);
    }
  }, [userAddress, executor, getTransactionById, updateTransaction, saveActiveTransactionId]);

  const executeAll = useCallback(async () => {
    const pendingIds = transactions
      .filter(tx => tx.status === 'pending' || tx.status === 'failed')
      .map(tx => tx.id);
    
    if (pendingIds.length > 0) {
      await executeBatch(pendingIds);
    }
  }, [transactions, executeBatch]);

  // NEW: Queue management methods
  const moveTransactionUp = useCallback((id: string) => {
    const currentIndex = transactions.findIndex(tx => tx.id === id);
    if (currentIndex > 0) {
      const newTransactions = [...transactions];
      [newTransactions[currentIndex], newTransactions[currentIndex - 1]] = 
        [newTransactions[currentIndex - 1], newTransactions[currentIndex]];
      saveTransactions(newTransactions);
    }
  }, [transactions, saveTransactions]);

  const moveTransactionDown = useCallback((id: string) => {
    const currentIndex = transactions.findIndex(tx => tx.id === id);
    if (currentIndex >= 0 && currentIndex < transactions.length - 1) {
      const newTransactions = [...transactions];
      [newTransactions[currentIndex], newTransactions[currentIndex + 1]] = 
        [newTransactions[currentIndex + 1], newTransactions[currentIndex]];
      saveTransactions(newTransactions);
    }
  }, [transactions, saveTransactions]);

  const reorderTransactions = useCallback((orderedIds: string[]) => {
    const orderedTransactions = orderedIds
      .map(id => transactions.find(tx => tx.id === id))
      .filter((tx): tx is QueueTransaction => tx !== undefined);
    
    // Add any transactions not in the ordered list at the end
    const remainingTransactions = transactions.filter(
      tx => !orderedIds.includes(tx.id)
    );
    
    saveTransactions([...orderedTransactions, ...remainingTransactions]);
  }, [transactions, saveTransactions]);

  const clearAll = useCallback(() => {
    saveTransactions([]);
    saveActiveTransactionId(null);
  }, [saveTransactions, saveActiveTransactionId]);

  const bulkExecute = useCallback(async (ids: string[]) => {
    await executeBatch(ids);
  }, [executeBatch]);

  const bulkRemove = useCallback((ids: string[]) => {
    const filtered = transactions.filter(tx => !ids.includes(tx.id));
    saveTransactions(filtered);
    
    // Clear active transaction if it was removed
    if (activeTransactionId && ids.includes(activeTransactionId)) {
      saveActiveTransactionId(null);
    }
  }, [transactions, activeTransactionId, saveTransactions, saveActiveTransactionId]);

  // NEW: Enhanced querying methods
  const getTransactionsByStatus = useCallback((status: TransactionStatus) => {
    return transactions.filter(tx => tx.status === status);
  }, [transactions]);

  const getTransactionsByType = useCallback((type: string) => {
    return transactions.filter(tx => tx.type === type);
  }, [transactions]);

  const getPendingTransactions = useCallback(() => {
    return transactions.filter(tx => 
      tx.status === 'pending' || tx.status === 'executing'
    );
  }, [transactions]);

  const contextValue: TransactionQueueContextType = {
    transactions,
    activeTransactionId,
    addTransaction,
    updateTransaction,
    removeTransaction,
    retryTransaction,
    cancelTransaction,
    clearCompleted,
    getTransactionById,
    getPendingCount,
    getActiveTransaction,
    executeTransaction,
    executeBatch,
    executeAll,
    isExecuting,
    // NEW: Queue management methods
    moveTransactionUp,
    moveTransactionDown,
    reorderTransactions,
    clearAll,
    bulkExecute,
    bulkRemove,
    // NEW: Enhanced querying
    getTransactionsByStatus,
    getTransactionsByType,
    getPendingTransactions,
  };

  return (
    <TransactionQueueContext.Provider value={contextValue}>
      {children}
    </TransactionQueueContext.Provider>
  );
};