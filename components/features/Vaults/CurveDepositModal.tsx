import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Vault } from '@/lib/vaults/types';
import { useVaultActions } from '@/lib/vaults/vault';
import { parseUnits, formatUnits } from 'viem';
import { handleTransactionError } from '@/lib/utils/error-handling';

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

    try {
      const amountInWei = parseUnits(amount, vault.decimals);
      
      await deposit?.(amountInWei);
      
      onSuccess();
    } catch (error: unknown) {
      console.error('Deposit failed:', error);
      setError(handleTransactionError(error));
    }
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
    // In a real implementation, you'd get the user's token balance
    // For now, we'll use a reasonable default
    setAmount('1000');
  };

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
          <label className="block text-text-secondary text-sm mb-2">
            Amount to Deposit
          </label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              placeholder="0.00"
              step="0.000001"
              min="0"
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
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
          <div className="flex justify-between text-xs text-text-secondary mt-2">
            <span>Enter amount to deposit</span>
          </div>
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