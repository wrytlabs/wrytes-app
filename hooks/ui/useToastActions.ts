import { useCallback } from 'react';
import toast from 'react-hot-toast';
import { UseToastActionsReturn, ToastOptions, ToastType } from './types';

// Helper to convert React.ReactNode to toast-compatible icon
const getToastIcon = (icon?: React.ReactNode): string | undefined => {
  if (typeof icon === 'string') return icon;
  return undefined; // Let toast use default icon for complex ReactNode
};

/**
 * useToastActions - Enhanced toast integration hook
 * Provides typed toast functions with consistent styling
 * Extends the existing useToast hook functionality
 */
export const useToastActions = (): UseToastActionsReturn => {
  // Show success toast
  const success = useCallback((message: string, options: ToastOptions = {}) => {
    toast.success(message, {
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      icon: getToastIcon(options.icon),
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #2a2a2a'
      }
    });
  }, []);

  // Show error toast
  const error = useCallback((message: string, options: ToastOptions = {}) => {
    toast.error(message, {
      duration: options.duration || 6000,
      position: options.position || 'top-right',
      icon: getToastIcon(options.icon),
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #ef4444'
      }
    });
  }, []);

  // Show info toast
  const info = useCallback((message: string, options: ToastOptions = {}) => {
    toast(message, {
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      icon: getToastIcon(options.icon) || 'ℹ️',
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #3b82f6'
      }
    });
  }, []);

  // Show warning toast
  const warning = useCallback((message: string, options: ToastOptions = {}) => {
    toast(message, {
      duration: options.duration || 5000,
      position: options.position || 'top-right',
      icon: getToastIcon(options.icon) || '⚠️',
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #f59e0b'
      }
    });
  }, []);

  // Show loading toast
  const loading = useCallback((message: string, options: ToastOptions = {}): string => {
    return toast.loading(message, {
      position: options.position || 'top-right',
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: '1px solid #2a2a2a'
      }
    });
  }, []);

  // Update existing toast
  const update = useCallback((id: string, message: string, type: ToastType = 'info') => {
    const updateOptions = {
      id,
      style: {
        background: '#1a1a1a',
        color: '#ffffff',
        border: `1px solid ${
          type === 'success' ? '#10b981' :
          type === 'error' ? '#ef4444' :
          type === 'warning' ? '#f59e0b' :
          '#3b82f6'
        }`
      }
    };

    switch (type) {
      case 'success':
        toast.success(message, updateOptions);
        break;
      case 'error':
        toast.error(message, updateOptions);
        break;
      case 'warning':
        toast(message, { ...updateOptions, icon: '⚠️' });
        break;
      default:
        toast(message, updateOptions);
    }
  }, []);

  // Dismiss toast
  const dismiss = useCallback((id?: string) => {
    if (id) {
      toast.dismiss(id);
    } else {
      toast.dismiss();
    }
  }, []);

  return {
    success,
    error,
    info,
    warning,
    loading,
    update,
    dismiss
  };
};

export default useToastActions;