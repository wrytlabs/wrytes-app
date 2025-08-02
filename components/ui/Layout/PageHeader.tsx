import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { PageHeaderProps } from './types';

/**
 * PageHeader - Consistent page header component
 * Provides title, description, badges, actions, and breadcrumbs
 * Replaces repeated header patterns across pages
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  badge,
  actions,
  breadcrumbs,
  className,
  userInfo
}) => {
  // Badge variant styles
  const badgeVariants = {
    success: 'bg-green-400/20 text-green-400',
    warning: 'bg-yellow-400/20 text-yellow-400',
    info: 'bg-blue-400/20 text-blue-400',
    error: 'bg-red-400/20 text-red-400'
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <FontAwesomeIcon 
                  icon={faChevronRight} 
                  className="w-3 h-3 text-text-secondary" 
                />
              )}
              {item.href ? (
                <Link 
                  href={item.href}
                  className="text-text-secondary hover:text-accent-orange transition-colors"
                >
                  {item.label}
                </Link>
              ) : item.onClick ? (
                <button
                  onClick={item.onClick}
                  className="text-text-secondary hover:text-accent-orange transition-colors"
                >
                  {item.label}
                </button>
              ) : (
                <span className="text-white font-medium">
                  {item.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Header Content */}
      <div className="flex items-start justify-between gap-4">
        {/* Title and Description */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white truncate">
              {title}
            </h1>
            
            {/* Badge */}
            {badge && (
              <div className={cn(
                'px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap',
                badgeVariants[badge.variant]
              )}>
                {badge.text}
              </div>
            )}

            {/* User Info */}
            {userInfo && (
              <div className="flex items-center">
                {userInfo}
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-text-secondary leading-relaxed max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;