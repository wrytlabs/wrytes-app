import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheck, 
  faSpinner, 
  faExclamationCircle, 
  faForward 
} from '@fortawesome/free-solid-svg-icons';
import { StepProgressProps, TransactionStep } from './types';

export const StepProgress: React.FC<StepProgressProps> = ({
  steps,
  showLabels = true,
  compact = false
}) => {
  const getStepIcon = (step: TransactionStep, index: number) => {
    switch (step.status) {
      case 'completed':
        return <FontAwesomeIcon icon={faCheck} className="w-3 h-3 text-green-400" />;
      case 'active':
        return <FontAwesomeIcon icon={faSpinner} className="w-3 h-3 text-accent-orange animate-spin" />;
      case 'error':
        return <FontAwesomeIcon icon={faExclamationCircle} className="w-3 h-3 text-red-400" />;
      case 'skipped':
        return <FontAwesomeIcon icon={faForward} className="w-3 h-3 text-yellow-400" />;
      default:
        return <span className="w-3 h-3 rounded-full bg-text-secondary flex items-center justify-center text-xs text-dark-card">{index + 1}</span>;
    }
  };

  const getStepColor = (step: TransactionStep) => {
    switch (step.status) {
      case 'completed':
        return 'border-green-400 bg-green-400/20';
      case 'active':
        return 'border-accent-orange bg-accent-orange/20';
      case 'error':
        return 'border-red-400 bg-red-400/20';
      case 'skipped':
        return 'border-yellow-400 bg-yellow-400/20';
      default:
        return 'border-dark-border bg-dark-surface';
    }
  };

  const getConnectorColor = (currentStep: TransactionStep) => {
    if (currentStep.status === 'completed' || currentStep.status === 'skipped') {
      return 'bg-green-400';
    }
    if (currentStep.status === 'error') {
      return 'bg-red-400';
    }
    return 'bg-dark-border';
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${getStepColor(step)}`}>
              {getStepIcon(step, index)}
            </div>
            {index < steps.length - 1 && (
              <div className={`w-4 h-0.5 ${getConnectorColor(step)}`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center flex-1">
              {/* Step Circle */}
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStepColor(step)} transition-all duration-300`}>
                {getStepIcon(step, index)}
              </div>
              
              {/* Step Label */}
              {showLabels && (
                <div className="mt-2 text-center">
                  <p className={`text-sm font-medium ${
                    step.status === 'active' ? 'text-white' : 
                    step.status === 'completed' ? 'text-green-400' :
                    step.status === 'error' ? 'text-red-400' :
                    step.status === 'skipped' ? 'text-yellow-400' :
                    'text-text-secondary'
                  }`}>
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-text-secondary mt-1 max-w-20 mx-auto">
                      {step.description}
                    </p>
                  )}
                  {step.status === 'error' && step.error && (
                    <p className="text-xs text-red-400 mt-1 max-w-20 mx-auto">
                      {step.error}
                    </p>
                  )}
                </div>
              )}
            </div>
            
            {/* Connector */}
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div className={`h-0.5 w-full transition-all duration-300 ${getConnectorColor(step)}`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};