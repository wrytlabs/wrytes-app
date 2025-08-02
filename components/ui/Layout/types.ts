import { ReactNode } from 'react';

export interface PageHeaderProps {
  /** Main page title */
  title: string;
  /** Optional description text */
  description?: string;
  /** Optional badge indicator */
  badge?: {
    text: string;
    variant: 'success' | 'warning' | 'info' | 'error';
  };
  /** Action buttons or other elements */
  actions?: ReactNode;
  /** Breadcrumb navigation */
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  /** Additional CSS classes */
  className?: string;
  /** Optional user/role indicator (for dashboard pages) */
  userInfo?: ReactNode;
}

export interface SectionProps {
  /** Section title (optional) */
  title?: string;
  /** Section description (optional) */
  description?: string;
  /** Section content */
  children: ReactNode;
  /** Section variant for styling */
  variant?: 'default' | 'card' | 'filled';
  /** Spacing size */
  spacing?: 'sm' | 'md' | 'lg';
  /** Additional CSS classes */
  className?: string;
  /** Optional header actions */
  actions?: ReactNode;
}

export interface BreadcrumbProps {
  /** Array of breadcrumb items */
  items: Array<{
    label: string;
    href?: string;
    onClick?: () => void;
  }>;
  /** Additional CSS classes */
  className?: string;
}