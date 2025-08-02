import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import Card from '@/components/ui/Card';
import { RecentActivityProps, ActivityItem } from './types';

/**
 * RecentActivity - Extracted activity feed from dashboard page
 * Displays recent activities with timestamps and status indicators
 * Supports click handlers and loading states
 */
export const RecentActivity: React.FC<RecentActivityProps> = ({
  activities,
  loading = false,
  maxItems = 5,
  className,
  onActivityClick
}) => {
  // Default activities (can be overridden via props)
  const defaultActivities: ActivityItem[] = [
    {
      id: '1',
      title: 'New project "Blockchain Analytics" created',
      description: 'AI & Blockchain team',
      timestamp: '2 hours ago',
      type: 'success'
    },
    {
      id: '2', 
      title: 'AI model training completed',
      description: 'NLP Pipeline v2.1',
      timestamp: '4 hours ago',
      type: 'info'
    },
    {
      id: '3',
      title: 'Client meeting scheduled for tomorrow',
      description: 'Swiss Financial Services AG',
      timestamp: '6 hours ago',
      type: 'warning'
    },
    {
      id: '4',
      title: 'Bitcoin option strategy executed',
      description: 'Generated CHF 2,450 premium',
      timestamp: '1 day ago',
      type: 'success'
    },
    {
      id: '5',
      title: 'Code review completed',
      description: 'DeFi integration module',
      timestamp: '2 days ago',
      type: 'info'
    }
  ];

  // Use provided activities or default activities
  const activityData = activities || defaultActivities;
  
  // Limit activities to maxItems
  const displayActivities = activityData.slice(0, maxItems);

  // Activity type colors
  const typeColors = {
    success: 'text-green-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400',
    error: 'text-red-400'
  };

  // Loading skeleton
  if (loading) {
    return (
      <Card className={className}>
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {Array.from({ length: 3 }, (_, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-dark-surface/50 rounded-lg animate-pulse">
              <div className="w-2 h-2 bg-dark-surface/30 rounded-full"></div>
              <div className="flex-1">
                <div className="w-3/4 h-4 bg-dark-surface/30 rounded mb-2"></div>
                <div className="w-1/2 h-3 bg-dark-surface/30 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // Empty state
  if (!displayActivities || displayActivities.length === 0) {
    return (
      <Card className={className}>
        <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-text-secondary">No recent activity</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {displayActivities.map((activity) => {
          const handleClick = () => {
            if (activity.onClick) {
              activity.onClick();
            } else if (onActivityClick) {
              onActivityClick(activity);
            }
          };

          const isClickable = activity.onClick || onActivityClick || activity.href;

          const content = (
            <div className={cn(
              'flex items-center gap-4 p-4 bg-dark-surface/50 rounded-lg transition-all duration-200',
              isClickable && 'cursor-pointer hover:bg-dark-surface/70 hover:scale-[1.01]'
            )}>
              {/* Status Indicator */}
              <div className={cn(
                'w-2 h-2 rounded-full flex-shrink-0',
                activity.type ? typeColors[activity.type] : 'text-accent-orange'
              )}>
                <FontAwesomeIcon icon={faCircle} className="w-full h-full" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">
                  {activity.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {activity.description && (
                    <p className="text-text-secondary text-sm">
                      {activity.description}
                    </p>
                  )}
                  <span className="text-text-secondary text-sm">
                    •
                  </span>
                  <p className="text-text-secondary text-sm">
                    {typeof activity.timestamp === 'string' 
                      ? activity.timestamp 
                      : activity.timestamp.toLocaleString()
                    }
                  </p>
                </div>
              </div>

              {/* External link indicator */}
              {activity.href && (
                <FontAwesomeIcon 
                  icon={faExternalLinkAlt} 
                  className="w-3 h-3 text-text-secondary flex-shrink-0" 
                />
              )}
            </div>
          );

          if (activity.href) {
            return (
              <a
                key={activity.id}
                href={activity.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                {content}
              </a>
            );
          }

          if (isClickable) {
            return (
              <div
                key={activity.id}
                onClick={handleClick}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleClick();
                  }
                }}
              >
                {content}
              </div>
            );
          }

          return (
            <div key={activity.id}>
              {content}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default RecentActivity;