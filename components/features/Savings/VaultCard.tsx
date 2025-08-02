import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPiggyBank, 
  faShieldAlt, 
  faCoins,
  faVault,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useVaultData } from '@/hooks/business/useVaultData';
import { getBlockExplorerUrl } from '@/lib/web3/config';
import { formatUnits } from 'viem';
import { VaultCardProps } from './types';

/**
 * VaultCard - Refactored vault display component
 * Reduced from 174 lines to <100 lines by:
 * - Extracting data fetching to useVaultData hook
 * - Simplifying prop interface
 * - Focusing on pure UI display
 * - Using composition pattern
 */
export const VaultCard: React.FC<VaultCardProps> = ({
  vault,
  onDeposit,
  onWithdraw,
  className
}) => {
  const { balance, apy, tvl, loading } = useVaultData(vault);

  // Vault icon mapping
  const getVaultIcon = (icon?: string) => {
    const iconMap = {
      ethereum: faCoins,
      vault: faVault,
      coins: faCoins
    };
    return iconMap[icon as keyof typeof iconMap] || faPiggyBank;
  };

  // Vault color mapping
  const getVaultColor = (color?: string) => {
    const colorMap = {
      green: 'text-green-400 bg-green-400/20',
      blue: 'text-blue-400 bg-blue-400/20',
      orange: 'text-orange-400 bg-orange-400/20'
    };
    return colorMap[color as keyof typeof colorMap] || 'text-accent-orange bg-accent-orange/20';
  };

  // Format balance for display
  const formatBalance = (balance: bigint) => {
    if (balance === 0n) return '0';
    return formatUnits(balance, vault.decimals);
  };

  return (
    <Card className={cn(
      'relative overflow-hidden group hover:scale-105 transition-transform duration-300',
      className
    )}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', getVaultColor(vault.color))}>
            <FontAwesomeIcon icon={getVaultIcon(vault.icon)} className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{vault.name}</h3>
            <a
              href={getBlockExplorerUrl(`token/${vault.address}`, vault.chainId)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary text-sm hover:text-accent-orange transition-colors flex items-center gap-1"
            >
              {vault.symbol}
              <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4 line-clamp-2 h-[40px]">
        {vault.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-dark-surface/50 rounded-lg">
          <p className="text-text-secondary text-xs">APY</p>
          {loading ? (
            <div className="w-8 h-6 bg-dark-surface/30 rounded animate-pulse mx-auto"></div>
          ) : (
            <p className="text-xl font-bold text-green-400">{apy}%</p>
          )}
        </div>
        <div className="text-center p-3 bg-dark-surface/50 rounded-lg">
          <p className="text-text-secondary text-xs">TVL</p>
          {loading ? (
            <div className="w-12 h-6 bg-dark-surface/30 rounded animate-pulse mx-auto"></div>
          ) : (
            <p className="text-lg font-semibold text-white">{tvl}</p>
          )}
        </div>
      </div>

      {/* User Balance */}
      {balance > 0n && (
        <div className="mb-4 p-3 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
          <p className="text-text-secondary text-xs">Your Balance</p>
          <p className="text-white font-semibold">
            {formatBalance(balance)} {vault.symbol}
          </p>
        </div>
      )}

      {/* Strategy Info */}
      <div className="mb-4 p-3 bg-dark-surface/30 rounded-lg">
        <div className="flex items-center gap-2 mb-1">
          <FontAwesomeIcon icon={faShieldAlt} className="w-3 h-3 text-text-secondary" />
          <p className="text-text-secondary text-xs font-medium">Strategy</p>
        </div>
        <p className="text-text-secondary text-xs">{vault.strategy}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-auto">
        <Button
          variant="primary"
          onClick={() => onDeposit?.(vault)}
          className="flex-1"
        >
          Deposit
        </Button>
        <Button
          variant="outline"
          onClick={() => onWithdraw?.(vault)}
          disabled={balance === 0n}
          className="flex-1"
        >
          Withdraw
        </Button>
      </div>
    </Card>
  );
};

export default VaultCard;