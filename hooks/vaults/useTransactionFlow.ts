import { useState, useCallback, useEffect } from 'react';
import { 
  TransactionStep, 
  TransactionStepResult, 
  UseTransactionFlowOptions, 
  UseTransactionFlowReturn 
} from '@/components/ui/Transaction/types';

export const useTransactionFlow = ({
  steps: initialSteps,
  onSuccess,
  onError,
  autoAdvance = true,
}: UseTransactionFlowOptions): UseTransactionFlowReturn => {
  const [steps, setSteps] = useState<TransactionStep[]>(() =>
    initialSteps.map((step, index) => ({
      ...step,
      status: index === 0 ? 'active' : 'pending'
    }))
  );

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [results, setResults] = useState<TransactionStepResult[]>([]);

  const isCompleted = steps.every(step => step.status === 'completed' || step.status === 'skipped');
  const hasError = steps.some(step => step.status === 'error');

  const updateStep = useCallback((stepId: string, updates: Partial<TransactionStep>) => {
    setSteps(prevSteps =>
      prevSteps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    );
  }, []);

  const moveToNextStep = useCallback(() => {
    setCurrentStepIndex(prevIndex => {
      const nextIndex = prevIndex + 1;
      if (nextIndex < steps.length) {
        setSteps(prevSteps =>
          prevSteps.map((step, index) => {
            if (index === nextIndex) {
              return { ...step, status: 'active' };
            }
            return step;
          })
        );
        return nextIndex;
      }
      return prevIndex;
    });
  }, [steps.length]);

  const executeStep = useCallback(async (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || step.status !== 'active') return;

    setIsExecuting(true);
    updateStep(stepId, { status: 'active' });

    try {
      // Run validation if provided
      if (step.validation) {
        const isValid = await step.validation();
        if (!isValid) {
          throw new Error('Step validation failed');
        }
      }

      // Check skip condition
      if (step.skipCondition) {
        const shouldSkip = await step.skipCondition();
        if (shouldSkip) {
          updateStep(stepId, { status: 'skipped' });
          setResults(prev => [...prev, { success: true, data: { skipped: true } }]);
          
          if (autoAdvance) {
            moveToNextStep();
          }
          return;
        }
      }

      // Execute the step
      if (step.execution) {
        const result = await step.execution();
        
        if (result.success) {
          updateStep(stepId, { 
            status: 'completed', 
            txHash: result.txHash,
            error: undefined 
          });
          setResults(prev => [...prev, result]);
          
          if (autoAdvance) {
            moveToNextStep();
          }
        } else {
          throw new Error(result.error || 'Step execution failed');
        }
      } else {
        // If no execution function, mark as completed
        updateStep(stepId, { status: 'completed' });
        setResults(prev => [...prev, { success: true }]);
        
        if (autoAdvance) {
          moveToNextStep();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      updateStep(stepId, { 
        status: 'error', 
        error: errorMessage 
      });
      setResults(prev => [...prev, { success: false, error: errorMessage }]);
      onError?.(errorMessage, stepId);
    } finally {
      setIsExecuting(false);
    }
  }, [steps, updateStep, moveToNextStep, autoAdvance, onError]);

  const skipStep = useCallback((stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step || !step.canSkip) return;

    updateStep(stepId, { status: 'skipped' });
    setResults(prev => [...prev, { success: true, data: { skipped: true } }]);
    
    if (autoAdvance) {
      moveToNextStep();
    }
  }, [steps, updateStep, moveToNextStep, autoAdvance]);

  const retryStep = useCallback((stepId: string) => {
    updateStep(stepId, { 
      status: 'active', 
      error: undefined 
    });
  }, [updateStep]);

  const goToStep = useCallback((index: number) => {
    if (index >= 0 && index < steps.length) {
      setCurrentStepIndex(index);
      setSteps(prevSteps =>
        prevSteps.map((step, i) => ({
          ...step,
          status: i === index ? 'active' : step.status
        }))
      );
    }
  }, [steps.length]);

  const reset = useCallback(() => {
    setSteps(
      initialSteps.map((step, index) => ({
        ...step,
        status: index === 0 ? 'active' : 'pending',
        error: undefined,
        txHash: undefined
      }))
    );
    setCurrentStepIndex(0);
    setIsExecuting(false);
    setResults([]);
  }, [initialSteps]);

  // Handle completion
  useEffect(() => {
    if (isCompleted && !hasError && results.length > 0) {
      onSuccess?.(results);
    }
  }, [isCompleted, hasError, results, onSuccess]);

  return {
    steps,
    currentStepIndex,
    isExecuting,
    isCompleted,
    hasError,
    results,
    executeStep,
    skipStep,
    retryStep,
    goToStep,
    reset,
  };
};