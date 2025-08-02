import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

export type TransactionStatus = 'pending' | 'approving' | 'executing' | 'completed' | 'failed' | 'cancelled';

export interface QueueTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'mint' | 'redeem';
  vault: {
    name: string;
    symbol: string;
    address: string;
  };
  amount: string;
  symbol: string;
  status: TransactionStatus;
  txHash?: string;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
  needsApproval?: boolean;
  approvalTxHash?: string;
  estimatedTime?: number;
  progress?: number; // 0-100
}

export interface TransactionQueueContextType {
  transactions: QueueTransaction[];
  activeTransactionId: string | null;
  addTransaction: (transaction: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => string;
  updateTransaction: (id: string, updates: Partial<QueueTransaction>) => void;
  removeTransaction: (id: string) => void;
  retryTransaction: (id: string) => void;
  cancelTransaction: (id: string) => void;
  clearCompleted: () => void;
  getTransactionById: (id: string) => QueueTransaction | undefined;
  getPendingCount: () => number;
  getActiveTransaction: () => QueueTransaction | null;
}

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
  // Mock transactions for demonstration
  const mockTransactions: QueueTransaction[] = [
    {
      id: 'mock-1',
      type: 'deposit',
      vault: {
        name: 'Alpha USDC Core',
        symbol: 'aUSDC',
        address: '0xb0f05E4De970A1aaf77f8C2F823953a367504BA9',
      },
      amount: '1000.50',
      symbol: 'USDC',
      status: 'executing',
      progress: 65,
      estimatedTime: 25,
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
      updatedAt: new Date(),
      needsApproval: true,
      approvalTxHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    },
    {
      id: 'mock-2',
      type: 'withdraw',
      vault: {
        name: 'ZCHF Savings',
        symbol: 'zCHF',
        address: '0x637F00cAb9665cB07d91bfB9c6f3fa8faBFEF8BC',
      },
      amount: '500.0',
      symbol: 'zCHF',
      status: 'completed',
      progress: 100,
      txHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      updatedAt: new Date(Date.now() - 8 * 60 * 1000), // completed 8 minutes ago
    },
    {
      id: 'mock-3',
      type: 'mint',
      vault: {
        name: 'USDU Core',
        symbol: 'USDU',
        address: '0xce22b5fb17ccbc0c5d87dc2e0df47dd71e3adc0a',
      },
      amount: '2500',
      symbol: 'USDU',
      status: 'failed',
      error: 'Insufficient gas fee. Please increase gas limit and try again.',
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      updatedAt: new Date(Date.now() - 12 * 60 * 1000), // failed 12 minutes ago
    },
    {
      id: 'mock-4',
      type: 'deposit',
      vault: {
        name: 'DAI/USDC/USDT',
        symbol: '3CRV',
        address: '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490',
      },
      amount: '750.25',
      symbol: '3CRV',
      status: 'pending',
      progress: 0,
      estimatedTime: 20,
      createdAt: new Date(Date.now() - 30 * 1000), // 30 seconds ago
      updatedAt: new Date(Date.now() - 30 * 1000),
      needsApproval: true,
    },
  ];

  const [transactions, setTransactions] = useState<QueueTransaction[]>(mockTransactions);
  const [activeTransactionId, setActiveTransactionId] = useState<string | null>('mock-1');

  const addTransaction = useCallback((
    transactionData: Omit<QueueTransaction, 'id' | 'createdAt' | 'updatedAt' | 'status'>
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

    setTransactions(prev => [...prev, newTransaction]);
    
    // Auto-start if no active transaction
    if (!activeTransactionId) {
      setActiveTransactionId(id);
    }
    
    return id;
  }, [activeTransactionId]);

  const updateTransaction = useCallback((id: string, updates: Partial<QueueTransaction>) => {
    setTransactions(prev =>
      prev.map(tx =>
        tx.id === id
          ? { ...tx, ...updates, updatedAt: new Date() }
          : tx
      )
    );
  }, []);

  const removeTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(tx => tx.id !== id));
    
    if (activeTransactionId === id) {
      setActiveTransactionId(null);
    }
  }, [activeTransactionId]);

  const retryTransaction = useCallback((id: string) => {
    updateTransaction(id, {
      status: 'pending',
      error: undefined,
      txHash: undefined,
      approvalTxHash: undefined,
      progress: 0,
    });
    
    // Set as active if no current active transaction
    if (!activeTransactionId) {
      setActiveTransactionId(id);
    }
  }, [updateTransaction, activeTransactionId]);

  const cancelTransaction = useCallback((id: string) => {
    updateTransaction(id, {
      status: 'cancelled',
      progress: 0,
    });
    
    if (activeTransactionId === id) {
      setActiveTransactionId(null);
    }
  }, [updateTransaction, activeTransactionId]);

  const clearCompleted = useCallback(() => {
    setTransactions(prev =>
      prev.filter(tx => tx.status !== 'completed' && tx.status !== 'failed' && tx.status !== 'cancelled')
    );
  }, []);

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
  };

  return (
    <TransactionQueueContext.Provider value={contextValue}>
      {children}
    </TransactionQueueContext.Provider>
  );
};