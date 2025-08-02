import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useVaultActions, useVaultBalance } from '@/lib/vaults/vault';
import { parseUnits, formatUnits } from 'viem';
import { handleTransactionError } from '@/lib/utils/error-handling';
import { Vault } from '@/lib/vaults/types';

interface VaultWithdrawModalProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VaultWithdrawModal: React.FC<VaultWithdrawModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [withdrawMode, setWithdrawMode] = useState<'assets' | 'shares'>('assets');
  
  const { withdraw, redeem, isWithdrawing, isRedeeming, calculateAssetsFromShares } = useVaultActions(vault.address);
  const userBalance = useVaultBalance(vault.address);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
    
    // Validate amount
    if (value && parseFloat(value) > 0) {
      const numValue = parseFloat(value);
      const userBalanceNum = parseFloat(formatUnits(userBalance, vault.decimals));
      
      if (numValue > userBalanceNum) {
        setError(`Insufficient balance. You have ${formatUnits(userBalance, vault.decimals)} ${vault.symbol}`);
      }
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (error) return;

    try {
      const amountInWei = parseUnits(amount, vault.decimals);
      
      if (withdrawMode === 'assets') {
        await withdraw?.(amountInWei);
      } else {
        await redeem?.(amountInWei);
      }
      
      onSuccess();
    } catch (error: unknown) {
      console.error('Withdrawal failed:', error);
      setError(handleTransactionError(error));
    }
  };

  const calculateEstimatedAssets = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    try {
      const amountInWei = parseUnits(amount, vault.decimals);
      const assets = calculateAssetsFromShares(amountInWei);
      return formatUnits(assets, vault.decimals);
    } catch {
      return '0';
    }
  };

  const handleMaxClick = () => {
    setAmount(formatUnits(userBalance, vault.decimals));
  };

  const formatUserBalance = () => {
    return formatUnits(userBalance, vault.decimals);
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setError('');
      setWithdrawMode('assets');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Withdraw from {vault.name}</h2>
            <p className="text-text-secondary text-sm">{vault.symbol}</p>
          </div>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors p-2"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Withdraw Mode Toggle */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm mb-2">
            Withdraw Mode
          </label>
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
              onChange={(e) => handleAmountChange(e.target.value)}
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
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
          <div className="text-xs text-text-secondary mt-2">
            Available: {formatUserBalance()} {vault.symbol}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-dark-surface/50 rounded-lg space-y-3">
          {withdrawMode === 'shares' && (
            <div className="flex justify-between text-sm">
              <span className="text-text-secondary">Estimated Assets:</span>
              <span className="text-white font-medium">{calculateEstimatedAssets()} {vault.symbol}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Withdraw Mode:</span>
            <span className="text-white">{withdrawMode === 'assets' ? 'Assets' : 'Shares'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Risk Level:</span>
            <span className="text-white">{vault.riskLevel.toUpperCase()}</span>
          </div>
        </div>

        {/* Warning Box */}
        <div className="mb-6 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faExclamationTriangle} className="w-4 h-4 text-yellow-400 mt-0.5" />
            <div className="text-xs text-yellow-400">
              <p className="font-medium mb-1">Withdrawal Notice</p>
              <p>Withdrawals may be subject to fees and processing delays. Ensure you have sufficient gas for the transaction.</p>
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
            onClick={handleWithdraw}
            disabled={isWithdrawing || isRedeeming || !amount || !!error || userBalance === 0n}
            className="flex-1 bg-accent-orange hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {(isWithdrawing || isRedeeming) ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              'Withdraw'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}; 