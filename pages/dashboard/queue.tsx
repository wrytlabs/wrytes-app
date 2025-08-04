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
import { useTransactionQueue } from '@/hooks/redux/useTransactionQueue';
import { cn } from '@/lib/utils';
import { Button, Card, StatGrid, PageHeader, showToast } from '@/components/ui';
import { Section } from '@/components/ui/Layout';

export default function QueueManagePage() {
  const {
    transactions,
    moveTransactionUp,
    moveTransactionDown,
    clearAll,
    executeAll,
    executeTransaction,
    simulateTransaction,
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

  // Handle simulation with toast notifications
  const handleSimulate = async (transactionId: string) => {
    try {
      const result = await simulateTransaction(transactionId);
      
      if (result?.success) {
        const transaction = transactions.find(tx => tx.id === transactionId);
        showToast.success(
          `Simulation successful for "${transaction?.title || 'Transaction'}"`,
          {
            duration: 4000,
            id: `simulate-success-${transactionId}`,
          }
        );
        
        // You could also be helpful for debugging
        if (result.simulation) {
          console.log('Simulation data:', result.simulation);
        }
      } else {
        const transaction = transactions.find(tx => tx.id === transactionId);
        showToast.error(
          `Simulation failed for "${transaction?.title || 'Transaction'}": ${result?.error || 'Unknown error'}`,
          {
            duration: 6000,
            id: `simulate-error-${transactionId}`,
          }
        );
      }
    } catch (error) {
      showToast.error(
        'Failed to simulate transaction',
        {
          duration: 6000,
          id: `simulate-error-catch-${transactionId}`,
        }
      );
      console.error('Simulation error:', error);
    }
  };

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

        {/* Queue Actions */}
        <Section>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <Button
              onClick={executeAll}
              disabled={isExecuting || pendingCount === 0}
              variant="primary"
              size="md"
              icon={<FontAwesomeIcon icon={faPlay} className="w-4 h-4 mr-2" />}
              className="flex-1 sm:flex-none"
            >
              Execute All ({pendingCount})
            </Button>

            <Button
              onClick={clearAll}
              disabled={transactions.length === 0}
              variant="outline"
              size="md"
              icon={<FontAwesomeIcon icon={faBroom} className="w-4 h-4 mr-2" />}
              className="text-red-400 border-red-400 hover:bg-red-400/20 hover:text-white flex-1 sm:flex-none"
              >
              Clear All
            </Button>
          </div>
        </Section>

        {/* Stats */}
        <Section>
          <StatGrid
            stats={queueStats}
            columns={{
              base: 1,
              md: 4,
            }}
          />
        </Section>

        {/* Transaction List */}
        <Section
          title="Transaction Queue"
          description={`${transactions.length} transaction${transactions.length !== 1 ? 's' : ''} in queue`}
        >
          {transactions.length === 0 ? (
            <Card>
              <div className="text-center py-12">
                <FontAwesomeIcon icon={faHistory} className="w-16 h-16 text-text-secondary mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">No transactions found</h3>
                <p className="text-text-secondary">
                  Your transaction queue is empty
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4 grid grid-cols-1">
              {transactions.map((transaction, index) => (
                 <Card
                 key={transaction.id}
                >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Queue Controls - Top Left on Mobile, Left on Desktop */}
                    <div className="flex flex-row sm:flex-col gap-2 self-start">
                      <div className="flex md:flex-col items-center gap-2">
                        <Button
                          onClick={() => moveTransactionUp(transaction.id)}
                          disabled={index === 0}
                          variant="outline"
                          size="sm"
                          className="p-1.5 text-text-secondary hover:text-accent-orange border-text-muted hover:border-accent-orange"
                          icon={<FontAwesomeIcon icon={faArrowUp} className="w-3 h-3" />}
                        >
                          {""}
                        </Button>

                        <Button
                          onClick={() => moveTransactionDown(transaction.id)}
                          disabled={index === transactions.length - 1}
                          variant="outline"
                          size="sm"
                          className="p-1.5 text-text-secondary hover:text-accent-orange border-text-muted hover:border-accent-orange"
                          icon={<FontAwesomeIcon icon={faArrowDown} className="w-3 h-3" />}
                        >
                          {""}
                        </Button>
                      </div>
                     
                     {/* Status Indicator - Mobile Only */}
                     <div className="flex sm:hidden items-center gap-2 ml-2">
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
                   </div>

                   {/* Transaction Info */}
                   <div className="flex-1 min-w-0">
                     <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                       <p className="text-white font-medium truncate">
                         {transaction.title}
                       </p>
                       {/* Status Indicator - Desktop Only */}
                       <div className={cn(
                         'hidden sm:flex items-center gap-1 text-xs font-medium',
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
                     <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mt-1">
                       <p className="text-text-secondary text-sm">
                         {transaction.subtitle}
                       </p>
                       <span className="hidden sm:inline text-text-secondary text-sm">•</span>
                       <p className="text-text-secondary text-sm">
                         {new Date(transaction.createdAt).toLocaleString()}
                       </p>
                     </div>
                   </div>

                   {/* Action Buttons */}
                   <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                     {/* Execute Button */}
                     <Button
                       onClick={() => executeTransaction(transaction.id)}
                       disabled={isExecuting || transaction.status === 'completed'}
                       variant="primary"
                       size="sm"
                       className="px-3 py-1"
                     >
                       Execute
                     </Button>
                     
                     {/* Simulate Button */}
                     <Button
                       onClick={() => handleSimulate(transaction.id)}
                       disabled={isExecuting || transaction.status === 'completed'}
                       variant="primary"
                       size="sm"
                       className="px-3 py-1"
                     >
                       Simulate
                     </Button>

                     {/* Remove Button */}
                     <Button
                       onClick={() => removeTransaction(transaction.id)}
                       variant="outline"
                       size="sm"
                       className="text-red-400 border-red-400 hover:bg-red-400/20 hover:text-white"
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
               </Card>
             ))}
           </div>
          )}
        </Section>
      </div>
    </>
  );
}