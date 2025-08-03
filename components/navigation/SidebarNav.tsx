import React from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cn } from '@/lib/utils';
import { NavigationItem } from '@/lib/navigation/dashboard';

interface SidebarNavProps {
  items: NavigationItem[];
  isActive: (path: string) => boolean;
  onItemClick: () => void;
  variant: 'desktop' | 'mobile';
}

export const SidebarNav: React.FC<SidebarNavProps> = ({
  items,
  isActive,
  onItemClick,
  variant
}) => {
  const isMobile = variant === 'mobile';
  
  return (
    <nav className={isMobile ? "space-y-4" : "p-4"}>
      {isMobile ? (
        <div className="space-y-4">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                href={item.path}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                  active
                    ? "text-accent-orange bg-accent-orange/20 shadow-sm"
                    : "text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 hover:shadow-sm"
                )}
                onClick={onItemClick}
              >
                <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200",
                    active
                      ? "text-accent-orange bg-accent-orange/20 shadow-sm"
                      : "text-text-secondary hover:text-accent-orange hover:bg-accent-orange/20 hover:shadow-sm"
                  )}
                  onClick={onItemClick}
                >
                  <FontAwesomeIcon icon={item.icon} className="w-4 h-4" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
}; 