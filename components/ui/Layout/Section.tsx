import React from 'react';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { SectionProps } from './types';

/**
 * Section - Consistent content section component
 * Provides structured layout with optional titles, descriptions, and styling variants
 */
export const Section: React.FC<SectionProps> = ({
  title,
  description,
  children,
  variant = 'default',
  spacing = 'md',
  className,
  actions
}) => {
  // Spacing variants
  const spacingVariants = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8'
  };

  // Content wrapper based on variant
  const ContentWrapper = variant === 'card' ? Card : 'div';
  
  const getContentWrapperProps = () => {
    if (variant === 'card') {
      return {};
    } else if (variant === 'filled') {
      return { className: 'bg-dark-surface/30 rounded-xl p-6' };
    }
    return {};
  };
  
  const contentWrapperProps = getContentWrapperProps();

  return (
    <section className={cn(spacingVariants[spacing], className)}>
      {/* Section Header */}
      {(title || description || actions) && (
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {title && (
              <h2 className="text-xl font-bold text-white mb-1">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-text-secondary">
                {description}
              </p>
            )}
          </div>
          
          {actions && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Section Content */}
      <ContentWrapper {...contentWrapperProps}>
        {children}
      </ContentWrapper>
    </section>
  );
};

export default Section;