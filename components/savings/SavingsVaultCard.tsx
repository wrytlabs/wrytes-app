import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPiggyBank, 
  faShieldAlt, 
  faCoins,
  faVault,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import Card from '@/components/ui/Card';
import { SavingsVault } from '@/lib/savings/config';
import { useVaultBalance } from '@/lib/web3/savings';
import { getBlockExplorerUrl } from '@/lib/web3/config';
import { formatUnits } from 'viem';

interface SavingsVaultCardProps {
  vault: SavingsVault;
  onDeposit: (vault: SavingsVault) => void;
  onWithdraw: (vault: SavingsVault) => void;
}

export const SavingsVaultCard: React.FC<SavingsVaultCardProps> = ({
  vault,
  onDeposit,
  onWithdraw
}) => {
  const userBalance = useVaultBalance(vault.address);
  const [apy, setApy] = useState<number>(0);
  const [tvl, setTvl] = useState<string>('$0');
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Load APY and TVL data
  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoadingStats(true);
        const [apyValue, tvlValue] = await Promise.all([
          vault.apy(),
          vault.tvl()
        ]);
        setApy(apyValue);
        setTvl(tvlValue);
      } catch (error) {
        console.error('Error loading vault stats:', error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    loadStats();
  }, [vault]);

  const getVaultIcon = (icon?: string) => {
    switch (icon) {
      case 'ethereum':
        return faCoins; // Using faCoins as fallback for ethereum
      case 'vault':
        return faVault;
      case 'coins':
        return faCoins;
      default:
        return faPiggyBank;
    }
  };

  const getVaultColor = (color?: string) => {
    switch (color) {
      case 'green':
        return 'text-green-400 bg-green-400/20';
      case 'blue':
        return 'text-blue-400 bg-blue-400/20';
      case 'orange':
        return 'text-orange-400 bg-orange-400/20';
      default:
        return 'text-accent-orange bg-accent-orange/20';
    }
  };

  const formatBalance = (balance: bigint) => {
    if (balance === 0n) return '0';
    return formatUnits(balance, vault.decimals);
  };

  return (
    <Card className="relative overflow-hidden group hover:scale-105 transition-transform duration-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getVaultColor(vault.color)}`}>
            <FontAwesomeIcon 
              icon={getVaultIcon(vault.icon)} 
              className="w-5 h-5" 
            />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{vault.name}</h3>
            <div className="flex items-center gap-2">
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
      </div>

      {/* Description */}
      <p className="text-text-secondary text-sm mb-4 line-clamp-2 h-[40px]">
        {vault.description}
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-dark-surface/50 rounded-lg">
          <p className="text-text-secondary text-xs">APY</p>
          {isLoadingStats ? (
            <div className="w-8 h-6 bg-dark-surface/30 rounded animate-pulse mx-auto"></div>
          ) : (
            <p className="text-xl font-bold text-green-400">{apy}%</p>
          )}
        </div>
        <div className="text-center p-3 bg-dark-surface/50 rounded-lg">
          <p className="text-text-secondary text-xs">TVL</p>
          {isLoadingStats ? (
            <div className="w-12 h-6 bg-dark-surface/30 rounded animate-pulse mx-auto"></div>
          ) : (
            <p className="text-lg font-semibold text-white">{tvl}</p>
          )}
        </div>
      </div>

      {/* User Balance */}
      {userBalance > 0n && (
        <div className="mb-4 p-3 bg-accent-orange/10 rounded-lg border border-accent-orange/20">
          <p className="text-text-secondary text-xs">Your Balance</p>
          <p className="text-white font-semibold">
            {formatBalance(userBalance)} {vault.symbol}
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
        <button
          onClick={() => onDeposit(vault)}
          className="flex-1 bg-accent-orange hover:bg-accent-orange/90 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Deposit
        </button>
        <button
          onClick={() => onWithdraw(vault)}
          disabled={userBalance === 0n}
          className="flex-1 border border-accent-orange text-accent-orange hover:bg-accent-orange/10 py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Withdraw
        </button>
      </div>
    </Card>
  );
}; 