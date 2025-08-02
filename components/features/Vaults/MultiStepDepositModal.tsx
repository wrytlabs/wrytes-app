import React, { useState, useEffect } from 'react';
import { Vault } from '@/lib/vaults/types';
import { useVaultActions, useVaultAllowance } from '@/lib/vaults/vault';
import { useAssetTokenBalance } from '@/hooks/vaults/useAssetTokenBalance';
import { useVaultData } from '@/hooks/vaults/useVaultData';
import { parseUnits, formatUnits } from 'viem';
import { handleTransactionError } from '@/lib/utils/error-handling';
import { MultiStepModal } from '@/components/ui/Transaction';
import { TransactionStep, TransactionStepResult } from '@/components/ui/Transaction/types';

interface MultiStepDepositModalProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const MultiStepDepositModal: React.FC<MultiStepDepositModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [depositMode, setDepositMode] = useState<'deposit' | 'mint'>('deposit');
  
  const { deposit, mint, isDepositing, isMinting } = useVaultActions(vault.address);
  const { balance: assetBalance, symbol: assetSymbol, decimals: assetDecimals } = useAssetTokenBalance(vault);
  const { apy } = useVaultData(vault);
  
  const allowance = useVaultAllowance(vault.address, vault.asset.address);

  // Calculate the required approval amount (with 10% buffer)
  const getApprovalAmount = () => {
    if (!amount) return 0n;
    const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
    const amountInWei = parseUnits(amount, decimalsToUse);
    return (amountInWei * 110n) / 100n; // 10% buffer
  };

  const needsApproval = () => {
    if (!amount) return false;
    const requiredAmount = getApprovalAmount();
    return allowance < requiredAmount;
  };

  // Create transaction steps
  const createTransactionSteps = (): Omit<TransactionStep, 'status'>[] => {
    const steps: Omit<TransactionStep, 'status'>[] = [];

    // Step 1: Token Approval (conditional)
    if (needsApproval()) {
      steps.push({
        id: 'approve',
        title: 'Approve Token',
        description: `Allow vault to spend your ${assetSymbol} tokens`,
        estimatedTime: 15,
        validation: async () => {
          if (!amount || parseFloat(amount) <= 0) {
            throw new Error('Invalid amount');
          }
          return true;
        },
        execution: async (): Promise<TransactionStepResult> => {
          try {
            // This would normally call the approve function on the ERC20 token
            // For now, we'll simulate the approval
            const approvalAmount = getApprovalAmount();
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Mock transaction hash
            const txHash = `0x${Math.random().toString(16).slice(2, 66)}`;
            
            return {
              success: true,
              txHash,
              data: { approvalAmount: formatUnits(approvalAmount, assetDecimals) }
            };
          } catch (error) {
            return {
              success: false,
              error: handleTransactionError(error)
            };
          }
        }
      });
    }

    // Step 2: Deposit/Mint
    steps.push({
      id: 'deposit',
      title: depositMode === 'deposit' ? 'Deposit Assets' : 'Mint Shares',
      description: depositMode === 'deposit' 
        ? `Deposit ${amount} ${assetSymbol} to receive vault shares`
        : `Mint ${amount} ${vault.symbol} shares`,
      estimatedTime: 20,
      validation: async () => {
        if (!amount || parseFloat(amount) <= 0) {
          throw new Error('Invalid amount');
        }
        
        // Check sufficient balance
        const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
        const amountInWei = parseUnits(amount, decimalsToUse);
        
        if (amountInWei > assetBalance) {
          throw new Error('Insufficient balance');
        }
        
        return true;
      },
      execution: async (): Promise<TransactionStepResult> => {
        try {
          const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
          const amountInWei = parseUnits(amount, decimalsToUse);
          
          let result;
          if (depositMode === 'deposit') {
            result = await deposit?.(amountInWei);
          } else {
            result = await mint?.(amountInWei);
          }
          
          // Mock transaction hash if not returned (result would be a transaction receipt)
          const txHash = (result as { hash?: string })?.hash || `0x${Math.random().toString(16).slice(2, 66)}`;
          
          return {
            success: true,
            txHash,
            data: { 
              amount,
              mode: depositMode,
              vault: vault.name
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

    // Step 3: Confirmation
    steps.push({
      id: 'confirm',
      title: 'Transaction Confirmed',
      description: 'Your deposit has been successfully processed',
      estimatedTime: 5,
      execution: async (): Promise<TransactionStepResult> => {
        // Add small delay for UX
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return {
          success: true,
          data: {
            message: `Successfully ${depositMode === 'deposit' ? 'deposited' : 'minted'} ${amount} ${depositMode === 'deposit' ? assetSymbol : vault.symbol}`
          }
        };
      }
    });

    return steps;
  };

  const handleSuccess = (results: TransactionStepResult[]) => {
    console.log('Transaction completed successfully:', results);
    onSuccess();
    onClose();
  };

  const handleError = (error: string, stepId: string) => {
    console.error(`Error in step ${stepId}:`, error);
  };

  const isProcessing = isDepositing || isMinting;

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

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setDepositMode('deposit');
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
          <h2 className="text-xl font-bold text-white mb-6">Configure Deposit</h2>
          
          {/* Mode Toggle */}
          <div className="mb-4">
            <label className="block text-text-secondary text-sm mb-2">Mode</label>
            <div className="flex bg-dark-surface rounded-lg p-1">
              <button
                onClick={() => setDepositMode('deposit')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  depositMode === 'deposit'
                    ? 'bg-accent-orange text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Deposit
              </button>
              <button
                onClick={() => setDepositMode('mint')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  depositMode === 'mint'
                    ? 'bg-accent-orange text-white'
                    : 'text-text-secondary hover:text-white'
                }`}
              >
                Mint
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="mb-6">
            <label className="block text-text-secondary text-sm mb-2">
              Amount {depositMode === 'deposit' ? `(${assetSymbol})` : `(${vault.symbol})`}
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-dark-surface border border-dark-border rounded-lg px-4 py-3 text-white placeholder-text-secondary focus:outline-none focus:border-accent-orange transition-colors"
            />
          </div>

          {/* Info */}
          <div className="mb-6 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg text-blue-400 text-sm">
            <p><strong>APY:</strong> {apy.toFixed(2)}%</p>
            <p><strong>Risk:</strong> {vault.riskLevel.toUpperCase()}</p>
            {needsApproval() && (
              <p className="mt-2 text-yellow-400">⚠️ Token approval required</p>
            )}
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
              disabled={!amount || parseFloat(amount) <= 0 || isProcessing}
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
      title={`${depositMode === 'deposit' ? 'Deposit' : 'Mint'} - ${vault.name}`}
      subtitle={`${depositMode === 'deposit' ? 'Depositing' : 'Minting'} ${amount} ${depositMode === 'deposit' ? assetSymbol : vault.symbol}`}
      allowCancel={true}
      showProgress={true}
      autoAdvance={true}
    />
  );
};