import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faTrash, faHistory, faPlayCircle } from '@fortawesome/free-solid-svg-icons';
import { useTransactionQueue } from '@/hooks/redux/useTransactionQueue';
import { QueuePanelProps } from './types';
import { QueueItem } from './QueueItem';

export const QueuePanel: React.FC<QueuePanelProps> = ({
  isOpen,
  onClose,
  onClearCompleted
}) => {
  const {
    transactions,
    retryTransaction,
    cancelTransaction,
    removeTransaction,
    clearCompleted,
    executeAll,
    isExecuting
  } = useTransactionQueue();

  const panelRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const completedTransactions = transactions.filter(tx => 
    tx.status === 'completed' || tx.status === 'failed'
  );

  const pendingTransactions = transactions.filter(tx => 
    tx.status === 'queued' || tx.status === 'pending' || tx.status === 'executing'
  );

  const hasCompletedTransactions = completedTransactions.length > 0;
  const hasPendingTransactions = pendingTransactions.length > 0;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/20 z-40" />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-16 right-4 w-96 max-md:w-full max-md:right-0 max-h-[80vh] bg-dark-card border border-gray-500/20 rounded-xl shadow-xl z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-500/20">
          <div className="flex items-center gap-2">
            <FontAwesomeIcon icon={faHistory} className="w-4 h-4 text-accent-orange" />
            <h3 className="text-lg font-semibold text-white">Queue</h3>
            {transactions.length > 0 && (
              <span className="px-2 py-0.5 text-xs bg-accent-orange/20 text-accent-orange rounded-full">
                {transactions.length}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {hasPendingTransactions && (
              <button
                onClick={executeAll}
                disabled={isExecuting}
                className="px-3 py-1.5 bg-accent-orange hover:bg-accent-orange/80 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-colors"
                title="Execute all pending transactions"
              >
                <FontAwesomeIcon icon={faPlayCircle} className="w-3 h-3 mr-1" />
                Execute All
              </button>
            )}

            {hasCompletedTransactions && (
              <button
                onClick={() => {
                  clearCompleted();
                  onClearCompleted();
                }}
                className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
                title="Clear completed transactions"
              >
                <FontAwesomeIcon icon={faTrash} className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-text-secondary hover:text-white transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {transactions.length === 0 ? (
            <div className="p-8 text-center">
              <FontAwesomeIcon icon={faHistory} className="w-12 h-12 text-text-secondary mb-4" />
              <h4 className="text-text-secondary font-medium mb-2">No transactions</h4>
              <p className="text-text-secondary text-sm">
                Your transaction history will appear here
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {transactions.map(transaction => (
                  <QueueItem
                    key={transaction.id}
                    transaction={transaction}
                    onRetry={retryTransaction}
                    onCancel={cancelTransaction}
                    onRemove={removeTransaction}
                  />
                ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {transactions.length > 0 && (
          <div className="p-4 border-t border-gray-500/20 bg-dark-surface/30">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-secondary">
                {transactions.filter(tx => tx.status === 'queued' || tx.status === 'pending' || tx.status === 'executing').length} pending
              </span>
              
              <Link 
                href="/dashboard/queue"
                className="text-accent-orange hover:text-accent-orange/80 transition-colors font-medium hover:underline"
                onClick={onClose}
              >
                View Queue →
              </Link>
              
              <span className="text-text-secondary">
                {transactions.filter(tx => tx.status === 'completed').length} completed
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  );
};