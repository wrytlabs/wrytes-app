import React from 'react';
import { cn } from '@/lib/utils';
import { VAULTS } from '@/lib/vaults/config';
import { VaultCard } from './VaultCard';
import { VaultGridProps } from './types';

/**
 * VaultGrid - Grid layout for displaying vault cards
 * Handles responsive layout and loading states
 */
export const VaultGrid: React.FC<VaultGridProps> = ({
  vaults = VAULTS,
  loading = false,
  onDeposit,
  onWithdraw,
  className,
  columns = {
    base: 1,
    md: 2,
    lg: 3
  }
}) => {
  // Generate responsive grid classes
  const getGridClasses = () => {
    const classes = ['grid', 'gap-6'];
    
    if (columns.base) classes.push(`grid-cols-${columns.base}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    
    return classes.join(' ');
  };

  if (loading) {
    // Show skeleton grid
    const skeletonCount = columns.lg || 3;
    return (
      <div className={cn(getGridClasses(), className)}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <div 
            key={index}
            className="bg-dark-card p-6 rounded-xl border border-dark-surface animate-pulse"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-dark-surface/30 rounded-lg"></div>
              <div>
                <div className="w-24 h-6 bg-dark-surface/30 rounded mb-2"></div>
                <div className="w-16 h-4 bg-dark-surface/30 rounded"></div>
              </div>
            </div>
            <div className="w-full h-10 bg-dark-surface/30 rounded mb-4"></div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="h-16 bg-dark-surface/30 rounded"></div>
              <div className="h-16 bg-dark-surface/30 rounded"></div>
            </div>
            <div className="flex gap-3">
              <div className="flex-1 h-10 bg-dark-surface/30 rounded"></div>
              <div className="flex-1 h-10 bg-dark-surface/30 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!vaults || vaults.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <p className="text-text-secondary text-lg">No vaults available</p>
      </div>
    );
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {vaults.map((vault) => (
        <VaultCard
          key={vault.address}
          vault={vault}
          onDeposit={onDeposit}
          onWithdraw={onWithdraw}
        />
      ))}
    </div>
  );
};

export default VaultGrid;