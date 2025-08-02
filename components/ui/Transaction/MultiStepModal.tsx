import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { MultiStepModalProps } from './types';
import { StepProgress } from './StepProgress';
import { TransactionStep } from './TransactionStep';
import { useTransactionFlow } from '@/hooks/vaults/useTransactionFlow';

export const MultiStepModal: React.FC<MultiStepModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  steps: initialSteps,
  title,
  subtitle,
  allowCancel = true,
  showProgress = true,
  autoAdvance = true
}) => {
  const {
    steps,
    currentStepIndex,
    isExecuting,
    isCompleted,
    hasError,
    executeStep,
    skipStep,
    retryStep,
    reset
  } = useTransactionFlow({
    steps: initialSteps,
    onSuccess,
    onError,
    autoAdvance
  });

  const canClose = allowCancel && !isExecuting;

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && canClose) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-dark-card rounded-xl w-full max-w-2xl mx-auto max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-border">
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="text-text-secondary text-sm mt-1">{subtitle}</p>
            )}
          </div>
          {canClose && (
            <button
              onClick={handleClose}
              className="text-text-secondary hover:text-white transition-colors p-2"
            >
              <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress */}
        {showProgress && (
          <div className="p-6 border-b border-dark-border bg-dark-surface/30">
            <StepProgress 
              steps={steps}
              currentStepIndex={currentStepIndex}
              showLabels={true}
              compact={false}
            />
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {isCompleted && !hasError ? (
            // Success State
            <div className="text-center py-8">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                className="w-16 h-16 text-green-400 mx-auto mb-4" 
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                Transaction Completed Successfully!
              </h3>
              <p className="text-text-secondary">
                All steps have been completed. You can now close this dialog.
              </p>
            </div>
          ) : hasError && !isExecuting ? (
            // Error State
            <div className="text-center py-8">
              <FontAwesomeIcon 
                icon={faExclamationCircle} 
                className="w-16 h-16 text-red-400 mx-auto mb-4" 
              />
              <h3 className="text-xl font-semibold text-white mb-2">
                Transaction Failed
              </h3>
              <p className="text-text-secondary mb-4">
                One or more steps failed to complete. You can retry failed steps or close this dialog.
              </p>
              <div className="space-y-3">
                {steps.map((step, index) => (
                  <TransactionStep
                    key={step.id}
                    step={step}
                    index={index}
                    isActive={step.status === 'error'}
                    onExecute={executeStep}
                    onSkip={skipStep}
                    onRetry={retryStep}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Normal Flow
            <div className="space-y-4">
              {steps.map((step, index) => (
                <TransactionStep
                  key={step.id}
                  step={step}
                  index={index}
                  isActive={index === currentStepIndex}
                  onExecute={executeStep}
                  onSkip={skipStep}
                  onRetry={retryStep}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-dark-border bg-dark-surface/30">
          <div className="text-sm text-text-secondary">
            {isCompleted ? (
              <span className="text-green-400">All steps completed</span>
            ) : hasError ? (
              <span className="text-red-400">Some steps failed</span>
            ) : (
              <span>
                Step {currentStepIndex + 1} of {steps.length}
                {isExecuting && ' - Processing...'}
              </span>
            )}
          </div>

          <div className="flex gap-3">
            {(isCompleted || hasError) && (
              <button
                onClick={handleClose}
                className="px-4 py-2 bg-accent-orange text-white rounded-lg hover:bg-accent-orange/90 transition-colors"
              >
                Close
              </button>
            )}

            {!isCompleted && !hasError && canClose && (
              <button
                onClick={handleClose}
                className="px-4 py-2 border border-dark-border text-text-secondary rounded-lg hover:bg-dark-surface transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};