import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/types';

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  href,
  target,
  disabled = false,
  loading = false,
  icon,
}) => {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-orange focus:ring-offset-2 focus:ring-offset-dark-bg disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent-orange text-white hover:bg-opacity-90 shadow-md hover:shadow-lg',
    secondary: 'bg-dark-card text-text-primary hover:bg-opacity-80 border border-text-muted',
    outline: 'border border-accent-orange text-accent-orange hover:bg-accent-orange hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-xl',
  };

  const buttonClasses = cn(
    baseStyles,
    variants[variant],
    sizes[size],
    className
  );

  const content = (
    <>
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span>{icon}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        target={target}
        className={buttonClasses}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
};

export default Button;