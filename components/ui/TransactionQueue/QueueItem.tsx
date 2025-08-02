import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExternalLinkAlt, 
  faRedo, 
  faTimes, 
  faTrash,
  faArrowDown,
  faArrowUp,
  faCoins,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { QueueItemProps } from './types';
import { TransactionProgress } from './TransactionProgress';
import { getBlockExplorerUrl } from '@/lib/web3/config';
import { useTransactionQueue } from '@/contexts/TransactionQueueContext';

export const QueueItem: React.FC<QueueItemProps> = ({
  transaction,
  onRetry,
  onCancel,
  onRemove
}) => {
  const { executeTransaction, isExecuting } = useTransactionQueue();
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'approve':
        return faCoins;
      case 'deposit':
      case 'mint':
        return faArrowDown;
      case 'withdraw':
      case 'redeem':
        return faArrowUp;
      case 'transfer':
        return faArrowUp;
      case 'swap':
        return faCoins;
      default:
        return faCoins;
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'approve':
        return 'text-yellow-400 bg-yellow-400/20';
      case 'deposit':
      case 'mint':
        return 'text-green-400 bg-green-400/20';
      case 'withdraw':
      case 'redeem':
        return 'text-red-400 bg-red-400/20';
      case 'transfer':
        return 'text-blue-400 bg-blue-400/20';
      case 'swap':
        return 'text-purple-400 bg-purple-400/20';
      default:
        return 'text-accent-orange bg-accent-orange/20';
    }
  };

  const formatContractAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const canExecute = transaction.status === 'pending' || transaction.status === 'failed';
  const canRetry = transaction.status === 'failed';
  const canCancel = transaction.status === 'pending' || transaction.status === 'approving';
  const canRemove = transaction.status === 'completed' || transaction.status === 'failed' || transaction.status === 'cancelled';
  const isCurrentlyExecuting = isExecuting && (transaction.status === 'executing' || transaction.status === 'approving');

  const getBorderColor = () => {
    switch (transaction.status) {
      case 'pending':
        return 'border-text-secondary/40';
      case 'approving':
        return 'border-yellow-400/40';
      case 'executing':
        return 'border-blue-400/40';
      case 'completed':
        return 'border-green-400/40';
      case 'failed':
        return 'border-red-400/40';
      case 'cancelled':
        return 'border-text-secondary/40';
      default:
        return 'border-dark-border';
    }
  };

  return (
    <div className={`p-4 bg-dark-surface/50 rounded-lg border ${getBorderColor()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Transaction Type Icon */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTransactionColor()}`}>
            <FontAwesomeIcon icon={getTransactionIcon()} className="w-4 h-4" />
          </div>

          {/* Transaction Info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">
                {transaction.title}
              </span>
              <span className="text-text-secondary text-xs">
                {formatTime(transaction.createdAt)}
              </span>
            </div>
            <div className="text-text-secondary text-xs mt-0.5">
              <a
                href={getBlockExplorerUrl(`address/${transaction.contractAddress}`, transaction.chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-accent-orange transition-colors cursor-pointer"
                title={`View contract: ${transaction.contractAddress}`}
              >
                {transaction.subtitle}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {transaction.txHash && (
            <a
              href={getBlockExplorerUrl(`tx/${transaction.txHash}`, 1)}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-text-secondary hover:text-accent-orange transition-colors"
              title="View on block explorer"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
            </a>
          )}

          {canExecute && !isCurrentlyExecuting && (
            <button
              onClick={() => executeTransaction(transaction.id)}
              disabled={isExecuting}
              className="p-1.5 text-green-400 hover:text-green-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Execute transaction"
            >
              <FontAwesomeIcon icon={faPlay} className="w-3 h-3" />
            </button>
          )}

          {canRetry && !isCurrentlyExecuting && (
            <button
              onClick={() => onRetry(transaction.id)}
              disabled={isExecuting}
              className="p-1.5 text-yellow-400 hover:text-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Retry transaction"
            >
              <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
            </button>
          )}

          {canCancel && !isCurrentlyExecuting && (
            <button
              onClick={() => onCancel(transaction.id)}
              disabled={isExecuting}
              className="p-1.5 text-red-400 hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Cancel transaction"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          )}

          {canRemove && !isCurrentlyExecuting && (
            <button
              onClick={() => onRemove(transaction.id)}
              disabled={isExecuting}
              className="p-1.5 text-text-secondary hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Remove from queue"
            >
              <FontAwesomeIcon icon={faTrash} className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Progress */}
      <TransactionProgress
        status={transaction.status}
        progress={transaction.progress}
      />

      {/* Error Message */}
      {transaction.error && (
        <div className="mt-3 p-2 bg-red-400/10 border border-red-400/20 rounded text-red-400 text-xs">
          {transaction.error}
        </div>
      )}

    </div>
  );
};