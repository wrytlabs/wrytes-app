import React from 'react';
import { 
  faUsers, 
  faChartLine, 
  faDollarSign, 
  faRocket 
} from '@fortawesome/free-solid-svg-icons';
import { StatGrid } from '@/components/ui/Stats';
import { DashboardStatsProps } from './types';

/**
 * DashboardStats - Extracted stats grid from dashboard page
 * Uses the new StatCard components for consistent display
 * Replaces the hardcoded stats grid with configurable data
 */
export const DashboardStats: React.FC<DashboardStatsProps> = ({
  stats,
  loading = false,
  className
}) => {
  // Default dashboard stats (can be overridden via props)
  const defaultStats = [
    {
      icon: faRocket,
      label: 'Total Projects',
      value: '24',
      color: 'orange' as const,
      trend: {
        value: 8.2,
        direction: 'up' as const,
        label: 'this month'
      }
    },
    {
      icon: faUsers,
      label: 'Active Users',
      value: '1,234',
      color: 'blue' as const,
      trend: {
        value: 12.5,
        direction: 'up' as const,
        label: 'this week'
      }
    },
    {
      icon: faDollarSign,
      label: 'Revenue',
      value: '$45.2K',
      color: 'green' as const,
      trend: {
        value: 5.3,
        direction: 'up' as const,
        label: 'this month'
      }
    },
    {
      icon: faChartLine,
      label: 'Growth',
      value: '+12.5%',
      color: 'purple' as const,
      trend: {
        value: 2.1,
        direction: 'up' as const,
        label: 'vs last month'
      }
    }
  ];

  // Use provided stats or default stats
  const statsData = stats || defaultStats;

  return (
    <StatGrid
      stats={statsData}
      loading={loading}
      columns={{
        base: 1,
        md: 2,
        lg: 4
      }}
      className={className}
    />
  );
};

export default DashboardStats;