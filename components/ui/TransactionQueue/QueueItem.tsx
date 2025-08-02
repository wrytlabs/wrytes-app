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
  faPiggyBank
} from '@fortawesome/free-solid-svg-icons';
import { QueueItemProps } from './types';
import { TransactionProgress } from './TransactionProgress';
import { getBlockExplorerUrl } from '@/lib/web3/config';

export const QueueItem: React.FC<QueueItemProps> = ({
  transaction,
  onRetry,
  onCancel,
  onRemove
}) => {
  const getTransactionIcon = () => {
    switch (transaction.type) {
      case 'deposit':
      case 'mint':
        return faArrowDown;
      case 'withdraw':
      case 'redeem':
        return faArrowUp;
      default:
        return faCoins;
    }
  };

  const getTransactionColor = () => {
    switch (transaction.type) {
      case 'deposit':
      case 'mint':
        return 'text-green-400 bg-green-400/20';
      case 'withdraw':
      case 'redeem':
        return 'text-red-400 bg-red-400/20';
      default:
        return 'text-accent-orange bg-accent-orange/20';
    }
  };

  const getTransactionLabel = () => {
    switch (transaction.type) {
      case 'deposit':
        return 'Deposit';
      case 'mint':
        return 'Mint';
      case 'withdraw':
        return 'Withdraw';
      case 'redeem':
        return 'Redeem';
      default:
        return transaction.type;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const canRetry = transaction.status === 'failed';
  const canCancel = transaction.status === 'pending' || transaction.status === 'approving';
  const canRemove = transaction.status === 'completed' || transaction.status === 'failed' || transaction.status === 'cancelled';

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
                {getTransactionLabel()} {transaction.amount} {transaction.symbol}
              </span>
              <span className="text-text-secondary text-xs">
                {formatTime(transaction.createdAt)}
              </span>
            </div>
            <div className="text-text-secondary text-xs mt-0.5">
              {transaction.vault.name}
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

          {canRetry && (
            <button
              onClick={() => onRetry(transaction.id)}
              className="p-1.5 text-yellow-400 hover:text-yellow-300 transition-colors"
              title="Retry transaction"
            >
              <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
            </button>
          )}

          {canCancel && (
            <button
              onClick={() => onCancel(transaction.id)}
              className="p-1.5 text-red-400 hover:text-red-300 transition-colors"
              title="Cancel transaction"
            >
              <FontAwesomeIcon icon={faTimes} className="w-3 h-3" />
            </button>
          )}

          {canRemove && (
            <button
              onClick={() => onRemove(transaction.id)}
              className="p-1.5 text-text-secondary hover:text-red-400 transition-colors"
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
        estimatedTime={transaction.estimatedTime}
      />

      {/* Error Message */}
      {transaction.error && (
        <div className="mt-3 p-2 bg-red-400/10 border border-red-400/20 rounded text-red-400 text-xs">
          {transaction.error}
        </div>
      )}

      {/* Approval Info */}
      {transaction.needsApproval && transaction.approvalTxHash && (
        <div className="mt-2 flex items-center gap-2 text-xs text-text-secondary">
          <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
          <a
            href={getBlockExplorerUrl(`tx/${transaction.approvalTxHash}`, 1)}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-accent-orange transition-colors"
          >
            View approval transaction
          </a>
        </div>
      )}
    </div>
  );
};