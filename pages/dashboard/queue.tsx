import Head from 'next/head';
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHistory, 
  faPlay, 
  faBroom,
  faArrowUp,
  faArrowDown,
  faCheckCircle,
  faExclamationTriangle,
  faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import Button from '@/components/ui/Button';
import { useTransactionQueue } from '@/contexts/TransactionQueueContext';
import { StatGrid } from '@/components/ui/Stats';
import Card from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/ui/Layout';

export default function QueueManagePage() {
  const {
    transactions,
    moveTransactionUp,
    moveTransactionDown,
    clearAll,
    executeAll,
    executeTransaction,
    removeTransaction,
    getTransactionsByStatus,
    getPendingCount,
    isExecuting
  } = useTransactionQueue();

  const pendingCount = getPendingCount();
  const completedCount = getTransactionsByStatus('completed').length;
  const failedCount = getTransactionsByStatus('failed').length;

  // Create stats data for StatGrid component
  const queueStats = [
    {
      icon: faHistory,
      label: 'Total Transactions',
      value: transactions.length.toString(),
      color: 'orange' as const,
    },
    {
      icon: faSpinner,
      label: 'Pending',
      value: pendingCount.toString(),
      color: 'blue' as const,
    },
    {
      icon: faCheckCircle,
      label: 'Completed',
      value: completedCount.toString(),
      color: 'green' as const,
    },
    {
      icon: faExclamationTriangle,
      label: 'Failed',
      value: failedCount.toString(),
      color: 'purple' as const,
    }
  ];

  return (
    <>
      <Head>
        <title>Transaction Queue - Wrytes</title>
        <meta name="description" content="Manage your transaction queue" />
      </Head>

      <div className="space-y-6">
        {/* Header */}
        <PageHeader
          title="Transaction Queue"
          description="Manage your pending blockchain transactions"
          icon={faHistory}
        />

        <div className="flex items-center gap-3">
          {pendingCount > 0 && (
            <button
              onClick={executeAll}
              disabled={isExecuting}
              className="px-4 py-2 bg-green-500/20 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
            >
              <FontAwesomeIcon icon={faPlay} className="w-4 h-4 mr-2" />
              Execute All ({pendingCount})
            </button>
          )}

          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
          >
            <FontAwesomeIcon icon={faBroom} className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>

        {/* Stats using StatGrid component */}
        <StatGrid
          stats={queueStats}
          columns={{
            base: 1,
            md: 2,
            lg: 4
          }}
        />

        {/* Transaction List using Card component and RecentActivity styling */}
        <Card>
          <h2 className="text-xl font-bold text-white mb-4">Transaction Queue</h2>
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <FontAwesomeIcon icon={faHistory} className="w-16 h-16 text-text-secondary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
              <p className="text-text-secondary">
                Your transaction queue is empty
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={transaction.id}
                  className="p-4 bg-dark-surface/50 rounded-lg transition-all duration-200 hover:bg-dark-surface/70"
                >
                  {/* Main Transaction Row */}
                  <div className="flex items-center gap-4">
                    {/* Queue Controls - First */}
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => moveTransactionUp(transaction.id)}
                        disabled={index === 0}
                        className="p-1.5 text-text-secondary hover:text-accent-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />
                      </button>

                      <button
                        onClick={() => moveTransactionDown(transaction.id)}
                        disabled={index === transactions.length - 1}
                        className="p-1.5 text-text-secondary hover:text-accent-orange disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />
                      </button>
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-white font-medium truncate">
                          {transaction.title}
                        </p>
                        <div className={cn(
                          'flex items-center gap-1 text-xs font-medium',
                          transaction.status === 'completed' ? 'text-green-400' :
                          transaction.status === 'failed' ? 'text-red-400' :
                          transaction.status === 'executing' ? 'text-blue-400' :
                          'text-yellow-400'
                        )}>
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            transaction.status === 'completed' ? 'bg-green-400' :
                            transaction.status === 'failed' ? 'bg-red-400' :
                            transaction.status === 'executing' ? 'bg-blue-400' :
                            'bg-yellow-400'
                          )} />
                          {transaction.status}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-text-secondary text-sm">
                          {transaction.subtitle}
                        </p>
                        <span className="text-text-secondary text-sm">•</span>
                        <p className="text-text-secondary text-sm">
                          {transaction.createdAt.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2">
                      {/* Execute Button */}
                      <Button
                        onClick={() => executeTransaction(transaction.id)}
                        disabled={isExecuting || transaction.status === 'completed' || transaction.status === 'failed'}
                        variant="primary"
                        size="sm"
                        className="px-3 py-1"
                      >
                        Execute
                      </Button>

                      {/* Remove Button */}
                      <Button
                        onClick={() => removeTransaction(transaction.id)}
                        variant="outline"
                        size="sm"
                        className="px-3 py-1 text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
                      >
                        Remove
                      </Button>
                    </div>
                  </div>

                  {/* Error Message - Below the main row */}
                  {transaction.error && (
                    <div className="mt-3 p-2 bg-red-500/10 rounded text-red-400 text-xs max-h-30 overflow-y-auto w-full" style={{ overflowX: 'hidden' }}>
                      {transaction.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </>
  );
}