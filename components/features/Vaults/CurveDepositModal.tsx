import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Vault } from '@/lib/vaults/types';
import { useVaultActions } from '@/lib/vaults/vault';
import { parseUnits, formatUnits } from 'viem';
import { AmountInput } from '@/components/ui/AmountInput';
import { useTransactionQueue } from '@/hooks/redux/useTransactionQueue';

interface CurveDepositModalProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CurveDepositModal: React.FC<CurveDepositModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const { deposit, isDepositing, calculateSharesFromAssets } = useVaultActions(vault.address);
  const { addTransaction } = useTransactionQueue();

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
    
    // Validate amount
    if (value && parseFloat(value) <= 0) {
      setError('Amount must be greater than 0');
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (error) return;

    // Add transaction to queue instead of executing directly
    addTransaction({
      title: `Deposit ${amount} ${vault.symbol}`,
      subtitle: `${vault.name} (${vault.address.slice(0,6)}...)`,
      chainId: 1, // Ethereum mainnet
      type: 'deposit',
      contractAddress: vault.address,
      functionName: 'deposit',
      abi: [] as any, // TODO: Add proper ABI
      args: [] as readonly unknown[],
      // Store amount and symbol in optional metadata fields
      tokenAmount: amount,
      tokenSymbol: vault.symbol,
    });

    // Close modal and trigger success callback
    onSuccess();
    onClose();
  };

  const calculateEstimatedShares = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    try {
      const amountInWei = parseUnits(amount, vault.decimals);
      const shares = calculateSharesFromAssets(amountInWei);
      return formatUnits(shares, vault.decimals);
    } catch {
      return '0';
    }
  };

  const handleMaxClick = () => {
    // For Curve pools, we'll use a reasonable default amount
    // In production, this would be the actual user balance
    setAmount('1000');
  };

      // Mock balance for demonstration - in production this would come from useCurveUserData
  const mockBalance = parseUnits('10000', vault.decimals);

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Deposit to {vault.name}</h2>
            <p className="text-text-secondary text-sm">{vault.symbol}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors p-2"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <AmountInput
            amount={amount}
            onAmountChange={handleAmountChange}
            title="Amount to Deposit"
            symbol={vault.symbol}
            decimals={vault.decimals}
            availableBalance={mockBalance}
            availableLabel="Available"
            onMaxClick={handleMaxClick}
            error={error}
          />
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-dark-surface/50 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Estimated Shares:</span>
            <span className="text-white font-medium">{calculateEstimatedShares()} {vault.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">APY:</span>
            <span className="text-green-400 font-medium">Variable</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Risk Level:</span>
            <span className="text-white">{vault.riskLevel.toUpperCase()}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="text-xs text-blue-400">
              <p className="font-medium mb-1">Important Information</p>
              <p>Deposits are subject to smart contract risks. APY rates are variable and may change over time.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-dark-border text-white py-3 px-4 rounded-lg hover:bg-dark-surface transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeposit}
            disabled={isDepositing || !amount || !!error}
            className="flex-1 bg-accent-orange hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isDepositing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Deposit'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 