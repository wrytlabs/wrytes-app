import React from 'react';
import { cn } from '@/lib/utils';
import { CardProps } from '@/types';

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = true,
  gradient = false,
}) => {
  const baseStyles = 'bg-dark-card rounded-2xl p-6 border border-dark-surface transition-all duration-300';
  
  const hoverStyles = hover ? 'hover:shadow-card-hover hover:-translate-y-1' : '';
  const gradientStyles = gradient ? 'bg-gradient-card' : '';
  
  return (
    <div
      className={cn(
        baseStyles,
        hoverStyles,
        gradientStyles,
        'shadow-card',
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;