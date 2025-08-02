export interface ColoredBadgeProps {
  text: string;
  variant?: 'risk' | 'custom';
  riskLevel?: 'low' | 'medium' | 'high';
  customColor?: string;
  customBgColor?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface BadgeVariant {
  text: string;
  bg: string;
}