import React from 'react';
import { getRiskColor } from '@/lib/vaults/config';
import { ColoredBadgeProps } from './types';

export const ColoredBadge: React.FC<ColoredBadgeProps> = ({
  text,
  variant = 'risk',
  riskLevel,
  customColor,
  customBgColor,
  size = 'sm',
  className = ''
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'md':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-2 py-1 text-xs';
    }
  };

  const getColorClasses = () => {
    if (variant === 'custom' && customColor && customBgColor) {
      return `${customColor} ${customBgColor}`;
    }
    
    if (variant === 'risk' && riskLevel) {
      return getRiskColor(riskLevel);
    }
    
    // Default fallback
    return 'text-gray-400 bg-gray-400/20';
  };

  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium border border-transparent';
  const sizeClasses = getSizeClasses();
  const colorClasses = getColorClasses();

  return (
    <span className={`${baseClasses} ${sizeClasses} ${colorClasses} ${className}`}>
      {text}
    </span>
  );
};