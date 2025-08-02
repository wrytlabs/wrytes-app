import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface StatCardProps {
  /** FontAwesome icon to display */
  icon: IconDefinition;
  /** Label text for the statistic */
  label: string;
  /** Main value to display (string for formatted values, number for calculations) */
  value: string | number;
  /** Optional trend indicator */
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  /** Color theme for the stat card */
  color?: 'orange' | 'green' | 'blue' | 'purple' | 'yellow';
  /** Loading state */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Optional click handler */
  onClick?: () => void;
}

export interface StatGridProps {
  /** Array of stat configurations */
  stats: Omit<StatCardProps, 'className' | 'onClick'>[];
  /** Number of columns on different screen sizes */
  columns?: {
    base?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  /** Loading state for entire grid */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface StatCardSkeletonProps {
  /** Additional CSS classes */
  className?: string;
}