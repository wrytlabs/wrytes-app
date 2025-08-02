export interface UseModalReturn<T = any> {
  /** Whether the modal is currently open */
  isOpen: boolean;
  /** Open the modal */
  open: () => void;
  /** Close the modal */
  close: () => void;
  /** Toggle the modal state */
  toggle: () => void;
  /** Open modal with specific data */
  openWith: (data: T) => void;
  /** Data associated with the modal */
  data: T | null;
  /** Set data without opening modal */
  setData: (data: T | null) => void;
}

export interface UseLoadingStateReturn {
  /** Whether loading is active */
  loading: boolean;
  /** Start loading */
  startLoading: () => void;
  /** Stop loading */
  stopLoading: () => void;
  /** Toggle loading state */
  toggleLoading: () => void;
  /** Execute async function with loading state */
  withLoading: <T>(fn: () => Promise<T>) => Promise<T>;
}

export interface UseToastActionsReturn {
  /** Show success toast */
  success: (message: string, options?: ToastOptions) => void;
  /** Show error toast */
  error: (message: string, options?: ToastOptions) => void;
  /** Show info toast */
  info: (message: string, options?: ToastOptions) => void;
  /** Show warning toast */
  warning: (message: string, options?: ToastOptions) => void;
  /** Show loading toast */
  loading: (message: string, options?: ToastOptions) => string;
  /** Update existing toast */
  update: (id: string, message: string, type?: ToastType) => void;
  /** Dismiss toast */
  dismiss: (id?: string) => void;
}

export interface ToastOptions {
  /** Duration in milliseconds */
  duration?: number;
  /** Toast position */
  position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
  /** Custom icon */
  icon?: React.ReactNode;
  /** Action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

export type ToastType = 'success' | 'error' | 'info' | 'warning' | 'loading';