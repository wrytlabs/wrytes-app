import { QueueTransaction } from '@/lib/transactions/types';

const TRANSACTION_QUEUE_KEY = 'wrytes_transaction_queue';
const ACTIVE_TRANSACTION_KEY = 'wrytes_active_transaction';

export class TransactionQueueStorage {
  // Helper to serialize dates for localStorage
  private static serializeTransaction(transaction: QueueTransaction): QueueTransaction {
    return {
      ...transaction,
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
    };
  }

  // Helper to deserialize dates from localStorage
  private static deserializeTransaction(data: QueueTransaction): QueueTransaction {
    return {
      ...data,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  // Save transactions to localStorage
  static saveTransactions(transactions: QueueTransaction[]): void {
    if (typeof window !== 'undefined') {
      try {
        const serialized = transactions.map(tx => this.serializeTransaction(tx));
        localStorage.setItem(TRANSACTION_QUEUE_KEY, JSON.stringify(serialized));
      } catch (error) {
        console.error('Failed to save transaction queue:', error);
      }
    }
  }

  // Load transactions from localStorage
  static loadTransactions(): QueueTransaction[] {
    if (typeof window !== 'undefined') {
      try {
        const data = localStorage.getItem(TRANSACTION_QUEUE_KEY);
        if (!data) return [];
        
        const serialized = JSON.parse(data);
        return serialized.map((tx: QueueTransaction) => this.deserializeTransaction(tx));
      } catch (error) {
        console.error('Failed to load transaction queue:', error);
        return [];
      }
    }
    return [];
  }

  // Save active transaction ID
  static saveActiveTransactionId(id: string | null): void {
    if (typeof window !== 'undefined') {
      try {
        if (id) {
          localStorage.setItem(ACTIVE_TRANSACTION_KEY, id);
        } else {
          localStorage.removeItem(ACTIVE_TRANSACTION_KEY);
        }
      } catch (error) {
        console.error('Failed to save active transaction ID:', error);
      }
    }
  }

  // Load active transaction ID
  static loadActiveTransactionId(): string | null {
    if (typeof window !== 'undefined') {
      try {
        return localStorage.getItem(ACTIVE_TRANSACTION_KEY);
      } catch (error) {
        console.error('Failed to load active transaction ID:', error);
        return null;
      }
    }
    return null;
  }

  // Clear all transaction queue data
  static clearAll(): void {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(TRANSACTION_QUEUE_KEY);
        localStorage.removeItem(ACTIVE_TRANSACTION_KEY);
      } catch (error) {
        console.error('Failed to clear transaction queue data:', error);
      }
    }
  }

  // Clean up old completed/failed transactions (older than 24 hours)
  static cleanupOldTransactions(): void {
    const transactions = this.loadTransactions();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const filtered = transactions.filter(tx => {
      const isOld = tx.updatedAt < oneDayAgo;
      const isCompleted = tx.status === 'completed' || tx.status === 'failed' || tx.status === 'cancelled';
      return !(isOld && isCompleted);
    });

    if (filtered.length !== transactions.length) {
      this.saveTransactions(filtered);
    }
  }
} 