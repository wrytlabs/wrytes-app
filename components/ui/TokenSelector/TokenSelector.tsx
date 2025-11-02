import React from 'react';
import { TOKENS, TokenConfig } from '@/lib/tokens/config';
import { TokenLogo } from '@/components/ui/TokenLogo';
import { TokenSelectorProps } from './types';

export const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onChange,
  title = "Token",
  disabled = false,
  error,
  className = "",
  availableTokens
}) => {
  // Get available tokens (filter if specified)
  const getAvailableTokens = (): [string, TokenConfig][] => {
    const tokenEntries = Object.entries(TOKENS);
    
    if (availableTokens && availableTokens.length > 0) {
      return tokenEntries.filter(([symbol]) => availableTokens.includes(symbol));
    }
    
    return tokenEntries;
  };

  const handleTokenChange = (tokenAddress: string) => {
    // Find the token config by address
    const tokenEntry = Object.entries(TOKENS).find(([, config]) => config.address === tokenAddress);
    if (tokenEntry) {
      const [, tokenConfig] = tokenEntry;
      onChange(tokenAddress, tokenConfig);
    }
  };

  const availableTokensList = getAvailableTokens();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <label className="block text-text-secondary text-sm font-medium">
          {title}
        </label>
      </div>

      {/* Select */}
      <div className="relative">
        <select
          value={selectedToken}
          onChange={(e) => handleTokenChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full bg-dark-surface border rounded-lg px-4 py-3 
            text-white 
            focus:outline-none transition-colors
            ${error 
              ? 'border-red-400 focus:border-red-400' 
              : 'border-gray-600 focus:border-accent-orange'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <option value="" disabled>
            Select a token
          </option>
          {availableTokensList.map(([symbol, config]) => (
            <option key={config.address} value={config.address}>
              {config.symbol} - {config.name} ({config.decimals} decimals)
            </option>
          ))}
        </select>
      </div>

      {/* Token Info */}
      {selectedToken && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            {(() => {
              const tokenEntry = Object.entries(TOKENS).find(([, config]) => config.address === selectedToken);
              if (tokenEntry) {
                const [, tokenConfig] = tokenEntry;
                return (
                  <>
                    <TokenLogo currency={tokenConfig.symbol} size={4} />
                    <span className="text-text-secondary">
                      {tokenConfig.symbol} - {tokenConfig.name}
                    </span>
                  </>
                );
              }
              return (
                <span className="text-text-secondary">
                  Contract: {selectedToken.slice(0, 6)}...{selectedToken.slice(-4)}
                </span>
              );
            })()}
          </div>
          {(() => {
            const tokenEntry = Object.entries(TOKENS).find(([, config]) => config.address === selectedToken);
            if (tokenEntry) {
              const [, tokenConfig] = tokenEntry;
              return (
                <span className="text-text-secondary">
                  Decimals: {tokenConfig.decimals}
                </span>
              );
            }
            return null;
          })()}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-400 text-xs mt-1">{error}</p>
      )}
    </div>
  );
};