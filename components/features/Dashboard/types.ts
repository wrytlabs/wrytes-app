import { StatCardProps } from '@/components/ui/Stats';

export interface DashboardStatsProps {
  /** Custom stats data override */
  stats?: Omit<StatCardProps, 'className'>[];
  /** Loading state for stats */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export interface RecentActivityProps {
  /** Activity items to display */
  activities?: ActivityItem[];
  /** Loading state */
  loading?: boolean;
  /** Maximum number of items to show */
  maxItems?: number;
  /** Additional CSS classes */
  className?: string;
  /** Callback when activity item is clicked */
  onActivityClick?: (activity: ActivityItem) => void;
}

export interface ActivityItem {
  /** Unique identifier */
  id: string;
  /** Activity title/message */
  title: string;
  /** Activity description or subtitle */
  description?: string;
  /** Timestamp */
  timestamp: string | Date;
  /** Activity type for styling */
  type?: 'success' | 'warning' | 'info' | 'error';
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional link destination */
  href?: string;
  /** Click handler */
  onClick?: () => void;
}

export interface QuickActionsProps {
  /** Actions to display */
  actions?: QuickAction[];
  /** Additional CSS classes */
  className?: string;
}

export interface QuickAction {
  /** Action label */
  label: string;
  /** Action description */
  description?: string;
  /** FontAwesome icon */
  icon: any; // FontAwesome icon type
  /** Click handler */
  onClick: () => void;
  /** Color variant */
  color?: 'orange' | 'green' | 'blue' | 'purple';
  /** Whether action is disabled */
  disabled?: boolean;
}