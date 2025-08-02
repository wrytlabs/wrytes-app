import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faSpinner, 
  faExclamationCircle, 
  faForward, 
  faRedo,
  faExternalLinkAlt
} from '@fortawesome/free-solid-svg-icons';
import { TransactionStepProps } from './types';

export const TransactionStep: React.FC<TransactionStepProps> = ({
  step,
  index,
  isActive,
  onExecute,
  onSkip,
  onRetry
}) => {
  const getStatusIcon = () => {
    switch (step.status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="w-4 h-4 text-green-400" />;
      case 'active':
        return <FontAwesomeIcon icon={faSpinner} className="w-4 h-4 text-accent-orange animate-spin" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationCircle} className="w-4 h-4 text-red-400" />;
      case 'skipped':
        return <FontAwesomeIcon icon={faForward} className="w-4 h-4 text-yellow-400" />;
      default:
        return <span className="w-4 h-4 rounded-full bg-text-secondary flex items-center justify-center text-xs text-dark-card font-bold">{index + 1}</span>;
    }
  };

  const getStatusColor = () => {
    switch (step.status) {
      case 'completed':
        return 'border-green-400 bg-green-400/10';
      case 'active':
        return 'border-accent-orange bg-accent-orange/10';
      case 'error':
        return 'border-red-400 bg-red-400/10';
      case 'skipped':
        return 'border-yellow-400 bg-yellow-400/10';
      default:
        return 'border-dark-border bg-dark-surface/50';
    }
  };

  const getTextColor = () => {
    switch (step.status) {
      case 'completed':
        return 'text-green-400';
      case 'active':
        return 'text-white';
      case 'error':
        return 'text-red-400';
      case 'skipped':
        return 'text-yellow-400';
      default:
        return 'text-text-secondary';
    }
  };

  const handleExecute = () => {
    if (step.status === 'active') {
      onExecute(step.id);
    }
  };

  const handleSkip = () => {
    if (step.canSkip && onSkip) {
      onSkip(step.id);
    }
  };

  const handleRetry = () => {
    if (step.status === 'error' && onRetry) {
      onRetry(step.id);
    }
  };

  const getBlockExplorerUrl = (txHash: string) => {
    // Default to Ethereum mainnet etherscan
    return `https://etherscan.io/tx/${txHash}`;
  };

  return (
    <div className={`p-4 rounded-lg border transition-all duration-300 ${getStatusColor()}`}>
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0 mt-0.5">
          {getStatusIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`font-medium ${getTextColor()}`}>
                {step.title}
              </h3>
              {step.description && (
                <p className="text-text-secondary text-sm mt-1">
                  {step.description}
                </p>
              )}
            </div>

            {/* Estimated Time */}
            {step.estimatedTime && step.status === 'active' && (
              <div className="flex-shrink-0 ml-3">
                <span className="text-xs text-text-secondary">
                  ~{step.estimatedTime}s
                </span>
              </div>
            )}
          </div>

          {/* Error Message */}
          {step.status === 'error' && step.error && (
            <div className="mt-2 p-2 bg-red-400/10 border border-red-400/20 rounded text-red-400 text-sm">
              {step.error}
            </div>
          )}

          {/* Transaction Hash */}
          {step.txHash && (step.status === 'completed' || step.status === 'active') && (
            <div className="mt-2">
              <a
                href={getBlockExplorerUrl(step.txHash)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-accent-orange hover:text-accent-orange/80 transition-colors"
              >
                <FontAwesomeIcon icon={faExternalLinkAlt} className="w-3 h-3" />
                View Transaction
              </a>
            </div>
          )}

          {/* Action Buttons */}
          {isActive && (
            <div className="flex items-center gap-2 mt-3">
              {step.status === 'active' && (
                <button
                  onClick={handleExecute}
                  className="px-3 py-1.5 bg-accent-orange text-white text-sm rounded hover:bg-accent-orange/90 transition-colors"
                >
                  Execute
                </button>
              )}
              
              {step.status === 'error' && (
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-400 text-white text-sm rounded hover:bg-red-400/90 transition-colors"
                >
                  <FontAwesomeIcon icon={faRedo} className="w-3 h-3" />
                  Retry
                </button>
              )}

              {step.canSkip && (step.status === 'active' || step.status === 'error') && (
                <button
                  onClick={handleSkip}
                  className="px-3 py-1.5 border border-dark-border text-text-secondary text-sm rounded hover:bg-dark-surface transition-colors"
                >
                  Skip
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};