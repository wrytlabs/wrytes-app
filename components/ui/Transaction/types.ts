export type TransactionStepStatus = 'pending' | 'active' | 'completed' | 'error' | 'skipped';

export interface TransactionStep {
  id: string;
  title: string;
  description?: string;
  status: TransactionStepStatus;
  error?: string;
  txHash?: string;
  estimatedTime?: number; // in seconds
  validation?: () => Promise<boolean> | boolean;
  execution?: () => Promise<TransactionStepResult>;
  canSkip?: boolean;
  skipCondition?: () => Promise<boolean> | boolean;
}

export interface TransactionStepResult {
  success: boolean;
  txHash?: string;
  error?: string;
  data?: unknown;
}

export interface MultiStepModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (results: TransactionStepResult[]) => void;
  onError?: (error: string, stepId: string) => void;
  steps: Omit<TransactionStep, 'status'>[];
  title: string;
  subtitle?: string;
  allowCancel?: boolean;
  showProgress?: boolean;
  autoAdvance?: boolean;
}

export interface StepProgressProps {
  steps: TransactionStep[];
  currentStepIndex: number;
  showLabels?: boolean;
  compact?: boolean;
}

export interface TransactionStepProps {
  step: TransactionStep;
  index: number;
  isActive: boolean;
  onExecute: (stepId: string) => Promise<void>;
  onSkip?: (stepId: string) => void;
  onRetry?: (stepId: string) => void;
}

export interface UseTransactionFlowOptions {
  steps: Omit<TransactionStep, 'status'>[];
  onSuccess?: (results: TransactionStepResult[]) => void;
  onError?: (error: string, stepId: string) => void;
  autoAdvance?: boolean;
}

export interface UseTransactionFlowReturn {
  steps: TransactionStep[];
  currentStepIndex: number;
  isExecuting: boolean;
  isCompleted: boolean;
  hasError: boolean;
  results: TransactionStepResult[];
  executeStep: (stepId: string) => Promise<void>;
  skipStep: (stepId: string) => void;
  retryStep: (stepId: string) => void;
  goToStep: (index: number) => void;
  reset: () => void;
}