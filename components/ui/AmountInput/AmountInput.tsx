import React from 'react';
import { formatUnits } from 'viem';
import { AmountInputProps } from './types';

export const AmountInput: React.FC<AmountInputProps> = ({
  amount,
  onAmountChange,
  placeholder = "0.00",
  disabled = false,
  error,
  title,
  symbol,
  decimals,
  availableBalance,
  availableLabel = "Available",
  onMaxClick,
  showMaxButton = true,
  className = ""
}) => {
  const formatAvailableBalance = () => {
    return formatUnits(availableBalance, decimals);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-text-secondary text-sm font-medium">
          {title}
        </label>
      </div>

      {/* Input */}
      <div className="relative">
        <input
          type="number"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          placeholder={placeholder}
          step="0.000001"
          min="0"
          disabled={disabled}
          className={`
            w-full bg-dark-surface border rounded-lg px-4 py-3 pr-20 
            text-white placeholder-text-secondary 
            focus:outline-none transition-colors
            ${error 
              ? 'border-red-400 focus:border-red-400' 
              : 'border-dark-border focus:border-accent-orange'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        />
        
        {/* Symbol */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
          {symbol}
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs">
        {/* Available Balance */}
        <span className="text-text-secondary">
          {availableLabel}: {formatAvailableBalance()} {symbol}
        </span>

        {/* MAX Button */}
        {showMaxButton && (
          <button
            onClick={onMaxClick}
            disabled={disabled || availableBalance === 0n}
            className={`
              px-3 py-1 rounded-md text-xs font-medium transition-colors
              ${disabled || availableBalance === 0n
                ? 'text-text-secondary cursor-not-allowed'
                : 'text-accent-orange hover:text-accent-orange/80 hover:bg-accent-orange/10'
              }
            `}
          >
            MAX
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};