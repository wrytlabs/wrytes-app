import React from 'react';
import { formatUnits } from 'viem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWallet, faCoins, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { TokenLogo } from '@/components/ui/TokenLogo';
import { TOKENS, TokenConfig } from '@/lib/tokens/config';

interface TokenBalancesProps {
  selectedAddress?: string;
  isOwnAddress: boolean;
  onShowAddressSelection?: () => void;
  onTokenSelect?: (tokenAddress: string, tokenConfig: TokenConfig) => void;
  selectedToken?: string;
}

interface TokenBalanceInfo {
  token: TokenConfig;
  walletBalance: bigint;
  processorBalance: bigint;
  isLoading: boolean;
}

export const TokenBalances: React.FC<TokenBalancesProps> = ({
  selectedAddress,
  isOwnAddress,
  onShowAddressSelection,
  onTokenSelect,
  selectedToken,
}) => {
  const [showZeroBalances, setShowZeroBalances] = React.useState(false);

  // Mock token balances - in real implementation, fetch from contracts
  const getTokenBalances = (): TokenBalanceInfo[] => {
    return Object.values(TOKENS).map(token => {
      // Mock different balance scenarios
      const mockWalletBalance = (() => {
        switch (token.symbol) {
          case 'USDC':
            return BigInt('1250750000'); // 1,250.75 USDC (6 decimals)
          case 'USDT':
            return BigInt('2500000000'); // 2,500 USDT (6 decimals)
          case 'DAI':
            return BigInt('500750000000000000000'); // 500.75 DAI (18 decimals)
          case 'ZCHF':
            return BigInt('1000000000000000000000'); // 1,000 ZCHF (18 decimals)
          case 'USDU':
            return BigInt('750250000000000000000'); // 750.25 USDU (18 decimals)
          default:
            return BigInt('0');
        }
      })();

      const mockProcessorBalance = (() => {
        switch (token.symbol) {
          case 'USDC':
            return BigInt('500000000'); // 500 USDC in processor
          case 'USDT':
            return BigInt('1000000000'); // 1,000 USDT in processor
          case 'DAI':
            return BigInt('250000000000000000000'); // 250 DAI in processor
          case 'ZCHF':
            return BigInt('0'); // No ZCHF in processor
          case 'USDU':
            return BigInt('100000000000000000000'); // 100 USDU in processor
          default:
            return BigInt('0');
        }
      })();

      return {
        token,
        walletBalance: isOwnAddress ? mockWalletBalance : BigInt('0'),
        processorBalance: mockProcessorBalance,
        isLoading: false,
      };
    });
  };

  const tokenBalances = getTokenBalances();
  const filteredBalances = showZeroBalances
    ? tokenBalances
    : tokenBalances.filter(balance => balance.walletBalance > 0n || balance.processorBalance > 0n);

  const formatBalance = (balance: bigint, decimals: number): string => {
    const formatted = formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    if (num === 0) return '0';
    if (num < 0.01) return '< 0.01';
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
  };

  const getTotalValue = (): string => {
    // Mock USD values for demonstration
    let totalUSD = 0;
    tokenBalances.forEach(balance => {
      const walletValue = parseFloat(formatUnits(balance.walletBalance, balance.token.decimals));
      const processorValue = parseFloat(
        formatUnits(balance.processorBalance, balance.token.decimals)
      );

      // Mock USD prices
      const usdPrice =
        balance.token.symbol === 'USDC' || balance.token.symbol === 'USDT'
          ? 1
          : balance.token.symbol === 'DAI'
            ? 0.999
            : balance.token.symbol === 'ZCHF'
              ? 1.05
              : balance.token.symbol === 'USDU'
                ? 1
                : 0;

      totalUSD += (walletValue + processorValue) * usdPrice;
    });

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(totalUSD);
  };

  if (!selectedAddress) {
    return null;
  }

  return (
    <Card>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Token Balances</h3>
            <p className="text-text-secondary text-sm">
              {isOwnAddress ? 'Your' : 'Address'} token holdings and processor deposits
            </p>
          </div>
          <div className="text-right">
            <p className="text-text-secondary text-sm">Total Value</p>
            <p className="text-white font-semibold text-lg">{getTotalValue()}</p>
          </div>
        </div>

        {/* Address Info - Clickable to show address selection */}
        <div
          onClick={onShowAddressSelection}
          className="flex items-center justify-between p-3 bg-blue-500/10 border border-gray-600 rounded-lg cursor-pointer hover:border-accent-orange/50 hover:bg-accent-orange/5 transition-all duration-200"
        >
          <div className="flex items-center gap-2">
            <FontAwesomeIcon
              icon={isOwnAddress ? faWallet : faCoins}
              className={`w-4 h-4 ${isOwnAddress ? 'text-green-400' : 'text-blue-400'}`}
            />
            <span className="text-white font-medium">
              {isOwnAddress ? 'Connected Wallet' : 'Authorized Address'}
            </span>
            <span className="text-text-secondary text-xs">(click to change)</span>
          </div>
          <span className="text-text-secondary text-sm font-mono">
            {selectedAddress.slice(0, 6)}...{selectedAddress.slice(-4)}
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-md font-medium text-white">Token Holdings</h4>
            <p className="text-text-secondary text-sm">
              Click on a token to select it for authorization
            </p>
          </div>
          <button
            onClick={() => setShowZeroBalances(!showZeroBalances)}
            className="flex items-center gap-2 text-text-secondary hover:text-accent-orange transition-colors text-sm"
          >
            <FontAwesomeIcon icon={showZeroBalances ? faEyeSlash : faEye} className="w-3 h-3" />
            {showZeroBalances ? 'Hide' : 'Show'} zero balances
          </button>
        </div>

        {/* Token List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          {filteredBalances.map(balance => (
            <div
              key={balance.token.address}
              onClick={() => onTokenSelect?.(balance.token.address, balance.token)}
              className={`
                flex items-center justify-between p-4 bg-dark-surface border rounded-lg cursor-pointer transition-all duration-200
                ${
                  selectedToken === balance.token.address
                    ? 'border-accent-orange bg-accent-orange/10'
                    : 'border-gray-600 hover:border-accent-orange/50 hover:bg-accent-orange/5'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <TokenLogo currency={balance.token.symbol} size={8} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{balance.token.symbol}</span>
                    <span className="text-text-secondary text-sm">•</span>
                    <span className="text-text-secondary text-sm">{balance.token.name}</span>
                  </div>
                  <p className="text-text-secondary text-xs">
                    {balance.token.address.slice(0, 6)}...{balance.token.address.slice(-4)}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                {/* Wallet Balance */}
                <div className="flex items-center justify-end gap-2">
                  <FontAwesomeIcon icon={faWallet} className="w-3 h-3 text-green-400" />
                  <span className="text-white text-sm">
                    {formatBalance(balance.walletBalance, balance.token.decimals)} {balance.token.symbol}
                  </span>
                </div>
                {/* Processor Balance */}
                <div className="flex items-center justify-end gap-2">
                  <FontAwesomeIcon icon={faCoins} className="w-3 h-3 text-blue-400" />
                  <span className="text-text-secondary text-sm">
                    {formatBalance(balance.processorBalance, balance.token.decimals)} {balance.token.symbol}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {filteredBalances.length === 0 && (
            <div className="lg:col-span-2 text-center py-8">
              <FontAwesomeIcon icon={faCoins} className="w-12 h-12 text-text-secondary mb-4" />
              <p className="text-text-secondary">No token balances found for this address</p>
              <button
                onClick={() => setShowZeroBalances(true)}
                className="text-accent-orange hover:text-accent-orange/80 text-sm mt-2"
              >
                Show all tokens
              </button>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="p-3 bg-gray-500/10 border border-gray-600 rounded-lg">
          <p className="text-text-secondary text-xs mb-2 font-medium">Legend:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faWallet} className="w-3 h-3 text-green-400" />
              <span className="text-text-secondary">Wallet Balance - Direct token holdings</span>
            </div>
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faCoins} className="w-3 h-3 text-blue-400" />
              <span className="text-text-secondary">
                Processor Balance - Deposited in AuthorizationProcessor
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
