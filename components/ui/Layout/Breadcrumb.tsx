import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { BreadcrumbProps } from './types';

/**
 * Breadcrumb - Navigation breadcrumb component
 * Can be used standalone or within PageHeader
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className
}) => {
  if (!items || items.length === 0) return null;

  return (
    <nav className={cn('flex items-center gap-2 text-sm', className)} aria-label="Breadcrumb">
      {/* Home icon for first item if it's a link */}
      {items[0]?.href && (
        <>
          <Link 
            href="/"
            className="text-text-secondary hover:text-accent-orange transition-colors p-1 rounded"
            aria-label="Home"
          >
            <FontAwesomeIcon icon={faHome} className="w-4 h-4" />
          </Link>
          <FontAwesomeIcon 
            icon={faChevronRight} 
            className="w-3 h-3 text-text-secondary" 
          />
        </>
      )}

      {/* Breadcrumb Items */}
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <FontAwesomeIcon 
              icon={faChevronRight} 
              className="w-3 h-3 text-text-secondary" 
            />
          )}
          
          {index === items.length - 1 ? (
            // Last item - current page
            <span 
              className="text-white font-medium px-1 py-0.5 rounded"
              aria-current="page"
            >
              {item.label}
            </span>
          ) : item.href ? (
            // Link item
            <Link 
              href={item.href}
              className="text-text-secondary hover:text-accent-orange transition-colors px-1 py-0.5 rounded hover:bg-dark-surface/30"
            >
              {item.label}
            </Link>
          ) : item.onClick ? (
            // Button item
            <button
              onClick={item.onClick}
              className="text-text-secondary hover:text-accent-orange transition-colors px-1 py-0.5 rounded hover:bg-dark-surface/30"
            >
              {item.label}
            </button>
          ) : (
            // Plain text item
            <span className="text-text-secondary px-1 py-0.5">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;