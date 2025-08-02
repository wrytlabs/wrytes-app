import React from 'react';
import { cn } from '@/lib/utils';
import { StatCard, StatCardSkeleton } from './StatCard';
import { StatGridProps } from './types';

/**
 * StatGrid - Responsive grid layout for displaying multiple StatCard components
 * Handles responsive columns and loading states for entire grid
 */
export const StatGrid: React.FC<StatGridProps> = ({
  stats,
  columns = {
    base: 1,
    md: 2,
    lg: 4
  },
  loading = false,
  className
}) => {
  // Generate responsive grid classes based on column configuration
  const getGridClasses = () => {
    const classes = ['grid', 'gap-6'];
    
    if (columns.base) classes.push(`grid-cols-${columns.base}`);
    if (columns.sm) classes.push(`sm:grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  };

  if (loading) {
    // Show skeleton grid during loading
    const skeletonCount = columns.lg || columns.md || columns.sm || columns.base || 4;
    return (
      <div className={cn(getGridClasses(), className)}>
        {Array.from({ length: skeletonCount }, (_, index) => (
          <StatCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!stats || stats.length === 0) {
    return (
      <div className={cn('text-center py-8', className)}>
        <p className="text-text-secondary">No statistics available</p>
      </div>
    );
  }

  return (
    <div className={cn(getGridClasses(), className)}>
      {stats.map((stat, index) => (
        <StatCard
          key={`${stat.label}-${index}`}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          trend={stat.trend}
          color={stat.color}
          loading={stat.loading}
        />
      ))}
    </div>
  );
};

export default StatGrid;