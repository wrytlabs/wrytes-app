import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { Vault } from '@/lib/vaults/types';
import { useVaultActions } from '@/lib/vaults/vault';
import { useAssetTokenBalance } from '@/hooks/vaults/useAssetTokenBalance';
import { useVaultData } from '@/hooks/vaults/useVaultData';
import { parseUnits, formatUnits } from 'viem';
import { handleTransactionError } from '@/lib/utils/error-handling';
import { ColoredBadge } from '@/components/ui/Badge';

interface VaultDepositModalProps {
  vault: Vault;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const VaultDepositModal: React.FC<VaultDepositModalProps> = ({
  vault,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [depositMode, setDepositMode] = useState<'deposit' | 'mint'>('deposit');
  
  const { deposit, mint, isDepositing, isMinting, calculateSharesFromAssets } = useVaultActions(vault.address);
  const { balance: assetBalance, symbol: assetSymbol, decimals: assetDecimals, loading: balanceLoading } = useAssetTokenBalance(vault);
  const { apy, loading: vaultLoading } = useVaultData(vault);

  const handleAmountChange = (value: string) => {
    setAmount(value);
    setError('');
    
    // Validate amount
    if (value && parseFloat(value) > 0) {
      const numValue = parseFloat(value);
      const maxDecimals = depositMode === 'deposit' ? assetDecimals : vault.decimals;
      const availableBalance = depositMode === 'deposit' ? assetBalance : assetBalance; // For now, use asset balance for both
      const availableBalanceFormatted = parseFloat(formatUnits(availableBalance, maxDecimals));
      
      if (numValue > availableBalanceFormatted) {
        const balanceSymbol = depositMode === 'deposit' ? assetSymbol : vault.symbol;
        setError(`Insufficient balance. You have ${formatUnits(availableBalance, maxDecimals)} ${balanceSymbol}`);
      }
    } else if (value && parseFloat(value) <= 0) {
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
      const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
      const amountInWei = parseUnits(amount, decimalsToUse);
      
      if (depositMode === 'deposit') {
        await deposit?.(amountInWei);
      } else {
        await mint?.(amountInWei);
      }
      
      onSuccess();
    } catch (error: unknown) {
      console.error('Deposit failed:', error);
      setError(handleTransactionError(error));
    }
  };

  const calculateEstimatedShares = () => {
    if (!amount || parseFloat(amount) <= 0) return '0';
    try {
      const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
      const amountInWei = parseUnits(amount, decimalsToUse);
      
      if (depositMode === 'deposit') {
        const shares = calculateSharesFromAssets(amountInWei);
        return formatUnits(shares, vault.decimals);
      } else {
        // In mint mode, the amount is already in shares
        return amount;
      }
    } catch {
      return '0';
    }
  };

  const handleMaxClick = () => {
    const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
    const amountToUse = depositMode === 'deposit' ? assetBalance : parseUnits(calculateEstimatedShares(), decimalsToUse);
    const maxAmount = formatUnits(amountToUse, decimalsToUse);
    setAmount(maxAmount);
  };

  const formatAvailableBalance = () => {
    const decimalsToUse = depositMode === 'deposit' ? assetDecimals : vault.decimals;
    const balanceSymbol = depositMode === 'deposit' ? assetSymbol : vault.symbol;
    return `${formatUnits(assetBalance, decimalsToUse)} ${balanceSymbol}`;
  };

  const getInputLabel = () => {
    return depositMode === 'deposit' ? `Amount to Deposit (${assetSymbol})` : `Shares to Mint (${vault.symbol})`;
  };

  const getInputSymbol = () => {
    return depositMode === 'deposit' ? assetSymbol : vault.symbol;
  };

  useEffect(() => {
    if (!isOpen) {
      setAmount('');
      setError('');
      setDepositMode('deposit');
    }
  }, [isOpen]);

  useEffect(() => {
    setError('');
  }, [depositMode]);

  if (!isOpen) return null;

  const isLoading = isDepositing || isMinting;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card rounded-xl p-6 w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-white">Deposit to {vault.name}</h2>
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
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-white transition-colors p-2"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
        </div>

        {/* Deposit Mode Toggle */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm mb-2">
            Deposit Mode
          </label>
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
          <p className="text-xs text-text-secondary mt-1">
            {depositMode === 'deposit' 
              ? `Deposit ${assetSymbol} tokens to receive vault shares` 
              : `Specify exact shares to mint (requires ${assetSymbol} tokens)`
            }
          </p>
        </div>

        {/* Amount Input */}
        <div className="mb-6">
          <label className="block text-text-secondary text-sm mb-2">
            {getInputLabel()}
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
              {getInputSymbol()}
            </div>
            <button
              onClick={handleMaxClick}
              className="absolute right-16 top-1/2 transform -translate-y-1/2 text-accent-orange hover:text-accent-orange/80 text-sm font-medium"
            >
              MAX
            </button>
          </div>
          {error && (
            <p className="text-red-400 text-xs mt-2">{error}</p>
          )}
          <div className="text-xs text-text-secondary mt-2">
            Available: {balanceLoading ? 'Loading...' : formatAvailableBalance()}
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-dark-surface/50 rounded-lg space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Estimated Shares:</span>
            <span className="text-white font-medium">{calculateEstimatedShares()} {vault.symbol}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Current APY:</span>
            <span className="text-green-400 font-medium">
              {vaultLoading ? 'Loading...' : `${apy.toFixed(2)}%`}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Deposit Mode:</span>
            <span className="text-white">{depositMode === 'deposit' ? 'Assets' : 'Shares'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Risk Level:</span>
            <ColoredBadge 
              variant="risk" 
              riskLevel={vault.riskLevel}
              text={vault.riskLevel.toUpperCase()}
              size="sm"
            />
          </div>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-3 bg-blue-400/10 border border-blue-400/20 rounded-lg">
          <div className="flex items-start gap-2">
            <FontAwesomeIcon icon={faInfoCircle} className="w-4 h-4 text-blue-400 mt-0.5" />
            <div className="text-xs text-blue-400">
              <p className="font-medium mb-1">Important Information</p>
              <p>
                {depositMode === 'deposit' 
                  ? `You will deposit ${assetSymbol} tokens and receive ${vault.symbol} shares based on the current exchange rate.`
                  : `You will mint exact ${vault.symbol} shares by depositing the required amount of ${assetSymbol} tokens.`
                }
                {' '}APY rates are variable and may change over time.
              </p>
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
            disabled={isLoading || !amount || !!error || assetBalance === 0n}
            className="flex-1 bg-accent-orange hover:bg-accent-orange/90 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </div>
            ) : (
              depositMode === 'deposit' ? 'Deposit' : 'Mint'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};