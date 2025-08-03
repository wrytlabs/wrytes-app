import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAppKitAccount } from '@reown/appkit-controllers/react';
import { TransactionExecutor } from '@/lib/transactions/TransactionExecutor';
import { TransactionQueueStorage } from '@/lib/transactions/storage';
import { QueueTransaction, TransactionQueueContextType } from '@/lib/transactions/types';

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

  // Mock transactions for demonstration
  const mockTransactions: QueueTransaction[] = [
    {
      id: 'mock-1',
      title: 'Approve USDC',
      subtitle: 'Alpha USDC Core (0xb0f0...4BA9)',
      contractAddress: '0xA0b86a33E6441eeE9d6Ba34EB7F3e5A59ABDaAa5', // USDC contract
      chainId: 1,
      type: 'approve',
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
      updatedAt: new Date(),
      targetContract: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
      functionName: 'approve',
      args: ['0xb0f05E4De970A1aaf77f8C2F823953a367504BA9', '1000500000'], // spender, amount
      amount: '1000.50',
      symbol: 'USDC',
    },
    {
      id: 'mock-2',
      title: 'Deposit USDC',
      subtitle: 'Alpha USDC Core (0xb0f0...4BA9)',
      contractAddress: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
      chainId: 1,
      type: 'deposit',
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      updatedAt: new Date(),
      functionName: 'deposit',
      args: ['1000500000', '0x742dD1B962c1F3B1C1Ad4b7eA1a7c0a3e0e0b52a'], // assets, receiver
      amount: '1000.50',
      symbol: 'USDC',
    },
    {
      id: 'mock-3',
      title: 'Withdraw zCHF',
      subtitle: 'ZCHF Savings (0x637F...F8BC)',
      contractAddress: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
      chainId: 1,
      type: 'withdraw',
      status: 'completed',
      progress: 100,
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      updatedAt: new Date(Date.now() - 8 * 60 * 1000), // completed 8 minutes ago
      functionName: 'withdraw',
      args: ['500000000000000000000', '0x742dD1B962c1F3B1C1Ad4b7eA1a7c0a3e0e0b52a', '0x742dD1B962c1F3B1C1Ad4b7eA1a7c0a3e0e0b52a'], // assets, receiver, owner
      amount: '500.0',
      symbol: 'zCHF',
    },
    {
      id: 'mock-4',
      title: 'Mint USDU',
      subtitle: 'USDU Core (0xce22...c0a)',
      contractAddress: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
      chainId: 1,
      type: 'mint',
      status: 'failed',
      error: 'Insufficient gas fee. Please increase gas limit and try again.',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      updatedAt: new Date(Date.now() - 12 * 60 * 1000), // failed 12 minutes ago
      functionName: 'mint',
      args: ['2500000000000000000000', '0x742dD1B962c1F3B1C1Ad4b7eA1a7c0a3e0e0b52a'], // shares, receiver
      amount: '2500',
      symbol: 'USDU',
    },
    {
      id: 'mock-5',
      title: 'Approve 3CRV',
      subtitle: 'DAI/USDC/USDT (0x6c3F...6E490)',
      contractAddress: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      chainId: 1,
      type: 'approve',
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 45 * 1000), // 45 seconds ago
      updatedAt: new Date(Date.now() - 45 * 1000),
      targetContract: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      functionName: 'approve',
      args: ['0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', '750250000000000000000'], // spender, amount
      amount: '750.25',
      symbol: '3CRV',
    },
    {
      id: 'mock-6',
      title: 'Deposit 3CRV',
      subtitle: 'DAI/USDC/USDT (0x6c3F...6E490)',
      contractAddress: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      chainId: 1,
      type: 'deposit',
      status: 'pending',
      progress: 0,
      createdAt: new Date(Date.now() - 30 * 1000), // 30 seconds ago
      updatedAt: new Date(Date.now() - 30 * 1000),
      functionName: 'deposit',
      args: ['750250000000000000000', '0x742dD1B962c1F3B1C1Ad4b7eA1a7c0a3e0e0b52a'], // assets, receiver
      amount: '750.25',
      symbol: '3CRV',
    },
  ];

  // Initialize with stored data or mock data
  const [transactions, setTransactions] = useState<QueueTransaction[]>(() => {
    // Load from localStorage on mount
    const stored = TransactionQueueStorage.loadTransactions();
    return stored.length > 0 ? stored : mockTransactions;
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

  const addTransaction = useCallback((
    transactionData: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'progress'>
  ): string => {
    const id = uuidv4();
    const now = new Date();
    
    const newTransaction: QueueTransaction = {
      ...transactionData,
      id,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
      progress: 0,
    };

    saveTransactions([...transactions, newTransaction]);
    
    // Auto-start if no active transaction
    if (!activeTransactionId) {
      saveActiveTransactionId(id);
    }
    
    return id;
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
      progress: 0,
    });
    
    // Set as active if no current active transaction
    if (!activeTransactionId) {
      saveActiveTransactionId(id);
    }
  }, [updateTransaction, activeTransactionId, saveActiveTransactionId]);

  const cancelTransaction = useCallback((id: string) => {
    updateTransaction(id, {
      status: 'cancelled',
      progress: 0,
    });
    
    if (activeTransactionId === id) {
      saveActiveTransactionId(null);
    }
  }, [updateTransaction, activeTransactionId, saveActiveTransactionId]);

  const clearCompleted = useCallback(() => {
    const filtered = transactions.filter(tx => tx.status !== 'completed' && tx.status !== 'failed' && tx.status !== 'cancelled');
    saveTransactions(filtered);
  }, [transactions, saveTransactions]);

  const getTransactionById = useCallback((id: string) => {
    return transactions.find(tx => tx.id === id);
  }, [transactions]);

  const getPendingCount = useCallback(() => {
    return transactions.filter(tx => 
      tx.status === 'pending' || tx.status === 'approving' || tx.status === 'executing'
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
        progress: 10,
        error: undefined,
      });

      // Check if approval is needed
      if (transaction.type === 'approve') {
        updateTransaction(id, {
          status: 'approving',
          progress: 20,
        });

        const approvalNeeded = await executor.checkApprovalNeeded(transaction, userAddress as `0x${string}`);
        if (approvalNeeded) {
          const approvalResult = await executor.executeApproval(approvalNeeded, userAddress as `0x${string}`, transaction.chainId);
          
          if (!approvalResult.success) {
            updateTransaction(id, {
              status: 'failed',
              error: `Approval failed: ${approvalResult.error}`,
              progress: 0,
            });
            return;
          }

          updateTransaction(id, {
            txHash: approvalResult.txHash,
            progress: 50,
          });
        }
      }

      // Execute the main transaction
      updateTransaction(id, {
        status: 'executing',
        progress: 70,
      });

      const result = await executor.executeTransaction(transaction, userAddress as `0x${string}`);

      if (result.success) {
        updateTransaction(id, {
          status: 'completed',
          progress: 100,
          txHash: result.txHash,
        });
      } else {
        updateTransaction(id, {
          status: 'failed',
          error: result.error,
          progress: 0,
        });
      }
    } catch (error) {
      updateTransaction(id, {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        progress: 0,
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
          progress: 5,
          error: undefined,
        });
      });

      // Execute transactions sequentially
      const results = await executor.executeSequential(
        transactionsToExecute,
        userAddress as `0x${string}`,
        (completed, total) => {
          // Update progress for all executing transactions
          const progressPerTx = 90 / total;
          transactionsToExecute.forEach((tx, index) => {
            if (index < completed) {
              updateTransaction(tx.id, { progress: 100 });
            } else if (index === completed) {
              updateTransaction(tx.id, { progress: 10 + progressPerTx * 0.8 });
            }
          });
        }
      );

      // Update final results
      results.forEach(({ id, result }) => {
        if (result.success) {
          updateTransaction(id, {
            status: 'completed',
            progress: 100,
            txHash: result.txHash,
          });
        } else {
          updateTransaction(id, {
            status: 'failed',
            error: result.error,
            progress: 0,
          });
        }
      });
    } catch (error) {
      // Mark all as failed on batch error
      transactionsToExecute.forEach(tx => {
        updateTransaction(tx.id, {
          status: 'failed',
          error: error instanceof Error ? error.message : 'Batch execution failed',
          progress: 0,
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
  };

  return (
    <TransactionQueueContext.Provider value={contextValue}>
      {children}
    </TransactionQueueContext.Provider>
  );
};