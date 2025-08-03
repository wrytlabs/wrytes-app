import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faClock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { useTransactionQueue } from '@/contexts/TransactionQueueContext';
import { QueueIconProps } from './types';

export const QueueIcon: React.FC<QueueIconProps> = ({ onClick, className = "" }) => {
  const { getPendingCount, transactions } = useTransactionQueue();
  
  const pendingCount = getPendingCount();
  const hasCompleted = transactions.some(tx => tx.status === 'completed');
  
  const getIconColor = () => {
    if (pendingCount > 0) return 'text-blue-400';
    if (hasCompleted) return 'text-green-400';
    return 'text-text-secondary';
  };

  const getIcon = () => {
    if (pendingCount > 0) return faClock;
    if (hasCompleted) return faCheckCircle;
    return faList;
  };

  return (
    <button
      onClick={onClick}
      className={`
        relative p-2 rounded-lg transition-all duration-200 bg-blue-400/20
        hover:bg-accent-orange/10 hover:text-accent-orange
        ${getIconColor()}
        ${className}
      `}
      title={`${pendingCount} pending transactions`}
    >
      <span className="flex flex-col items-center justify-center h-full">
        <FontAwesomeIcon icon={getIcon()} className="w-5 h-5" />
        {(pendingCount > 0 || transactions.length > 0) && (
          <span className={`
            absolute -top-1 -right-1 w-5 h-5 
            flex items-center justify-center
            text-xs font-bold text-white rounded-full
            ${pendingCount > 0 ? 'bg-blue-500' : 'bg-green-500'}
          `}>
            {pendingCount > 0 ? pendingCount : transactions.length}
          </span>
        )}
      </span>
    </button>
  );
};