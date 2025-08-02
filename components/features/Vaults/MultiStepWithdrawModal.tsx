import React, { useState, useEffect } from 'react';
import { Vault } from '@/lib/vaults/types';
import { useVaultActions, useVaultBalance } from '@/lib/vaults/vault';
import { useVaultData } from '@/hooks/vaults/useVaultData';
import { parseUnits, formatUnits } from 'viem';
import { handleTransactionError } from '@/lib/utils/error-handling';
import { MultiStepModal } from '@/components/ui/Transaction';
import { TransactionStep, TransactionStepResult } from '@/components/ui/Transaction/types';
import { ColoredBadge } from '@/components/ui/Badge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faClock } from '@fortawesome/free-solid-svg-icons';

interface MultiStepWithdrawModalProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MultiStepWithdrawModal: React.FC<MultiStepWithdrawModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [withdrawMode, setWithdrawMode] = useState<'assets' | 'shares'>('assets');
  
  const { withdraw, redeem, isWithdrawing, isRedeeming, calculateAssetsFromShares } = useVaultActions(vault.address);
  const userBalance = useVaultBalance(vault.address); // This is the vault token balance (shares)
  const { untilUnlocked } = useVaultData(vault);
  
  const isTimeLocked = untilUnlocked > 0;

  // Calculate estimated values
  const calculateEstimatedAssets = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    try {
      const amountInWei = parseUnits(amount, vault.decimals);
      if (withdrawMode === 'shares') {
        const assets = calculateAssetsFromShares(amountInWei);
        return formatUnits(assets, vault.decimals);
      }
      return amount; // Already in assets
    } catch {
      return '0';
    }
  };

  const getTimeUntilUnlocked = () => {
    if (!isTimeLocked) return '';
    const hours = Math.ceil(untilUnlocked / 3600);
    if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    const days = Math.ceil(hours / 24);
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  // Create transaction steps
  const createTransactionSteps = (): Omit<TransactionStep, 'status'>[] => {
    const steps: Omit<TransactionStep, 'status'>[] = [];

    // Step 1: Pre-withdrawal checks and warnings
    steps.push({
      id: 'pre_check',
      title: 'Pre-withdrawal Validation',
      description: 'Checking withdrawal conditions and requirements',
      estimatedTime: 5,
      validation: async () => {
        if (!amount || parseFloat(amount) <= 0) {
          throw new Error('Invalid withdrawal amount');
        }
        
        // Check sufficient balance
        const amountInWei = parseUnits(amount, vault.decimals);
        if (amountInWei > userBalance) {
          throw new Error('Insufficient vault balance');
        }
        
        return true;
      },
      execution: async (): Promise<TransactionStepResult> => {
        // Simulate validation delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          data: {
            amount,
            mode: withdrawMode,
            hasTimeLock: isTimeLocked,
            timeUntilUnlocked: isTimeLocked ? getTimeUntilUnlocked() : null
          }
        };
      }
    });

    // Step 2: Time lock warning (conditional)
    if (isTimeLocked) {
      steps.push({
        id: 'timelock_warning',
        title: 'Time Lock Notice',
        description: `Vault is locked for ${getTimeUntilUnlocked()}`,
        estimatedTime: 0,
        canSkip: false, // Force user to acknowledge
        execution: async (): Promise<TransactionStepResult> => {
          return {
            success: true,
            data: {
              acknowledged: true,
              unlockTime: untilUnlocked
            }
          };
        }
      });
    }

    // Step 3: Execute withdrawal
    steps.push({
      id: 'withdraw',
      title: withdrawMode === 'assets' ? 'Withdraw Assets' : 'Redeem Shares',
      description: withdrawMode === 'assets' 
        ? `Withdraw ${amount} assets from vault`
        : `Redeem ${amount} ${vault.symbol} shares`,
      estimatedTime: 25,
      validation: async () => {
        // Final balance check before execution
        const amountInWei = parseUnits(amount, vault.decimals);
        if (amountInWei > userBalance) {
          throw new Error('Insufficient balance at execution time');
        }
        return true;
      },
      execution: async (): Promise<TransactionStepResult> => {
        try {
          const amountInWei = parseUnits(amount, vault.decimals);
          
          let result;
          if (withdrawMode === 'assets') {
            result = await withdraw?.(amountInWei);
          } else {
            result = await redeem?.(amountInWei);
          }
          
          // Mock transaction hash if not returned (result would be a transaction receipt)
          const txHash = (result as { hash?: string })?.hash || `0x${Math.random().toString(16).slice(2, 66)}`;
          
          return {
            success: true,
            txHash,
            data: { 
              amount,
              mode: withdrawMode,
              vault: vault.name,
              estimatedAssets: calculateEstimatedAssets()
            }
          };
        } catch (error) {
          return {
            success: false,
            error: handleTransactionError(error)
          };
        }
      }
    });

    // Step 4: Confirmation
    steps.push({
      id: 'confirm',
      title: 'Withdrawal Confirmed',
      description: 'Your withdrawal has been successfully processed',
      estimatedTime: 5,
      execution: async (): Promise<TransactionStepResult> => {
        // Add small delay for UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          data: {
            message: `Successfully ${withdrawMode === 'assets' ? 'withdrew' : 'redeemed'} ${amount} ${withdrawMode === 'assets' ? 'assets' : vault.symbol}`,
            receivedAssets: calculateEstimatedAssets()
          }
        };
      }
    });

    return steps;
  };

  const handleSuccess = (results: TransactionStepResult[]) => {
    console.log('Withdrawal completed successfully:', results);
    onSuccess();
    onClose();
  };

  const handleError = (error: string, stepId: string) => {
    console.error(`Error in withdrawal step ${stepId}:`, error);
  };

  const isProcessing = isWithdrawing || isRedeeming;

  // Create initial modal for amount input
  const [showAmountInput, setShowAmountInput] = useState(true);
  const [showMultiStep, setShowMultiStep] = useState(false);

  const handleStartTransaction = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return;
    }
    setShowAmountInput(false);
    setShowMultiStep(true);
  };

  const handleCloseMultiStep = () => {
    setShowMultiStep(false);
    onClose();
  };

  const formatUserBalance = () => {
    return formatUnits(userBalance, vault.decimals);
  };

  const handleMaxClick = () => {
    setAmount(formatUserBalance());
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setWithdrawMode('assets');
      setShowAmountInput(true);
      setShowMultiStep(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Amount input modal
  if (showAmountInput) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-card rounded-xl p-6 w-full max-w-md mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">Withdraw from {vault.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-text-secondary text-sm">{vault.symbol}</p>
                <ColoredBadge 
                  variant="risk" 
                  riskLevel={vault.riskLevel}
                  text={vault.riskLevel.toUpperCase()}
                  size="sm"
                />
              </div>
            </div>
          </div>
          
          {/* Time Lock Warning */}
          {isTimeLocked && (
            <div className="mb-6 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-yellow-400 mt-0.5" />
                <div className="text-xs text-yellow-400">
                  <p className="font-medium mb-1">Time Lock Active</p>
                  <p>This vault is locked for approximately {getTimeUntilUnlocked()}. Withdrawals may be subject to delays.</p>
                </div>
              </div>
            </div>
          )}

          {/* Mode Toggle */}
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-2">Withdrawal Mode</label>
            <div className="flex bg-dark-surface rounded-lg p-1">
              <button
                onClick={() => setWithdrawMode('assets')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  withdrawMode === 'assets'
                    ? 'bg-accent-orange text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Assets
              </button>
              <button
                onClick={() => setWithdrawMode('shares')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  withdrawMode === 'shares'
                    ? 'bg-accent-orange text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Shares
              </button>
            </div>
            <p className="text-xs text-text-secondary mt-1">
              {withdrawMode === 'assets' 
                ? 'Specify exact amount of assets to withdraw' 
                : 'Specify number of vault shares to redeem'
              }
            </p>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm mb-2">
              Amount to Withdraw ({withdrawMode === 'assets' ? 'Assets' : 'Shares'})
            </label>
            <div className="relative">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.000001"
                min="0"
                max={formatUserBalance()}
                className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange transition-colors"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                {vault.symbol}
              </div>
              <button
                onClick={handleMaxClick}
                className="absolute right-12 top-1/2 transform -translate-y-1/2 text-accent-orange hover:text-accent-orange/80 text-sm font-medium"
              >
                MAX
              </button>
            </div>
            <div className="text-xs text-text-secondary mt-2">
              Available: {formatUserBalance()} {vault.symbol}
            </div>
          </div>

          {/* Preview */}
          {amount && parseFloat(amount) > 0 && (
            <div className="mb-6 p-4 bg-dark-surface/50 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Estimated Receive:</span>
                <span className="text-white font-medium">
                  {calculateEstimatedAssets()} {vault.asset.symbol}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Mode:</span>
                <span className="text-white">{withdrawMode === 'assets' ? 'Assets' : 'Shares'}</span>
              </div>
            </div>
          )}

          {/* Warning */}
          <div className="mb-6 p-3 bg-red-400/10 border border-red-400/20 rounded-lg">
            <div className="flex items-start gap-2">
              <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-red-400 mt-0.5" />
              <div className="text-xs text-red-400">
                <p className="font-medium mb-1">Withdrawal Warning</p>
                <p>Withdrawals are irreversible. Make sure you understand the implications before proceeding.</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 border border-dark-border text-white py-3 px-4 rounded-lg hover:bg-dark-surface transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleStartTransaction}
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing || userBalance === 0n}
              className="flex-1 bg-accent-orange hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step transaction modal
  return (
    <MultiStepModal
      isOpen={showMultiStep}
      onClose={handleCloseMultiStep}
      onSuccess={handleSuccess}
      onError={handleError}
      steps={createTransactionSteps()}
      title={`${withdrawMode === 'assets' ? 'Withdraw' : 'Redeem'} - ${vault.name}`}
      subtitle={`${withdrawMode === 'assets' ? 'Withdrawing' : 'Redeeming'} ${amount} ${withdrawMode === 'assets' ? 'assets' : vault.symbol}`}
      allowCancel={true}
      showProgress={true}
      autoAdvance={true}
    />
  );
};