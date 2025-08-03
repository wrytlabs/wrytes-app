import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faSpinner, 
  faCheckCircle, 
  faTimesCircle, 
  faBan,
  faShieldAlt 
} from '@fortawesome/free-solid-svg-icons';
import { QueueItemStatusProps } from './types';

export const QueueItemStatus: React.FC<QueueItemStatusProps> = ({
  status,
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'queued':
        return {
          icon: faClock,
          color: 'text-text-secondary',
          bgColor: 'bg-text-secondary/20',
          text: 'Queued'
        };
      case 'pending':
        return {
          icon: faShieldAlt,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-400/20',
          text: 'Pending...'
        };
      case 'executing':
        return {
          icon: faSpinner,
          color: 'text-blue-400',
          bgColor: 'bg-blue-400/20',
          text: 'Executing...'
        };
      case 'completed':
        return {
          icon: faCheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-400/20',
          text: 'Completed'
        };
      case 'failed':
        return {
          icon: faTimesCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-400/20',
          text: 'Failed'
        };
      default:
        return {
          icon: faClock,
          color: 'text-text-secondary',
          bgColor: 'bg-text-secondary/20',
          text: 'Unknown'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div className="flex items-center gap-3">
      {/* Status Icon */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${config.bgColor}`}>
        <FontAwesomeIcon 
          icon={config.icon} 
          className={`w-4 h-4 ${config.color} ${status === 'executing' ? 'animate-spin' : ''}`} 
        />
      </div>

      {/* Status Text and Progress */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${config.color}`}>
            {config.text}
          </span>
        </div>
      </div>
    </div>
  );
};