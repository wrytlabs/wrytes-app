import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExternalLinkAlt, 
  faRedo, 
  faTimes, 
  faTrash,
  faPlay
} from '@fortawesome/free-solid-svg-icons';
import { QueueItemProps } from './types';
import { QueueItemStatus } from './QueueItemStatus';
import { getBlockExplorerUrl } from '@/lib/web3/config';
import { useTransactionQueue } from '@/hooks/redux/useTransactionQueue';
import Button from '../Button';

export const QueueItem: React.FC<QueueItemProps> = ({
  transaction,
  onRetry,
  onCancel,
  onRemove
}) => {
  const { executeTransaction, isExecuting } = useTransactionQueue();

  const canExecute = transaction.status === 'queued' || transaction.status === 'pending' || transaction.status === 'failed';
  const canRetry = transaction.status === 'failed';
  const canCancel = transaction.status === 'queued' || transaction.status === 'pending';
  const canRemove = transaction.status === 'completed' || transaction.status === 'failed';
  const isCurrentlyExecuting = isExecuting && (transaction.status === 'queued' || transaction.status === 'pending' || transaction.status === 'executing');

  const getBorderColor = () => {
    switch (transaction.status) {
      case 'queued':
        return 'border-text-secondary/40';
      case 'pending':
        return 'border-text-secondary/40';
      case 'executing':
        return 'border-blue-400/40';
      case 'completed':
        return 'border-green-400/40';
      case 'failed':
        return 'border-red-400/40';
      default:
        return 'border-dark-border';
    }
  };

  return (
    <div className={`p-4 bg-dark-surface/50 rounded-lg border ${getBorderColor()}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          {/* Transaction Info */}
          <div>
            <div className="flex items-center gap-2">
              <a
                href={getBlockExplorerUrl(`address/${transaction.contractAddress}`, transaction.chainId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium text-sm hover:text-accent-orange transition-colors cursor-pointer"
                title={`View contract: ${transaction.contractAddress}`}
              >
                {transaction.title}
              </a>
            </div>
            <div className="text-text-secondary text-xs mt-0.5">
              {transaction.subtitle}
            </div>
          </div>
        </div>
      </div>

      {/* Progress and Actions Row */}
      <div className="flex items-center justify-between mt-3">
        {/* Progress - Left aligned */}
        <div className="flex-1">
          <QueueItemStatus
            status={transaction.status}
          />
        </div>

        {/* Actions - Right aligned */}
        <div className="flex items-center gap-1 ml-4">
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
            <Button
              onClick={() => executeTransaction(transaction.id)}
              disabled={isExecuting}
              variant="primary"
              size="sm"
              icon={<FontAwesomeIcon icon={faPlay} className="w-3 h-3" />}
            >
              Execute
            </Button>
          )}
        </div>
      </div>

      {/* Error Message */}
      {transaction.error && (
        <div className="mt-3 p-2 bg-red-400/10 border border-red-400/20 rounded text-red-400 text-xs">
          {transaction.error}
        </div>
      )}

    </div>
  );
};