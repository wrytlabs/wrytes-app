import { useState, useCallback } from 'react';
import { UseModalReturn } from './types';

/**
 * useModal - Custom hook for modal state management
 * Provides clean interface for opening/closing modals with optional data
 * Replaces inline modal state logic throughout the application
 */
export const useModal = <T = any>(initialData: T | null = null): UseModalReturn<T> => {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState<T | null>(initialData);

  // Open modal
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close modal
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Toggle modal state
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Open modal with specific data
  const openWith = useCallback((newData: T) => {
    setData(newData);
    setIsOpen(true);
  }, []);

  // Set data without opening modal
  const setModalData = useCallback((newData: T | null) => {
    setData(newData);
  }, []);

  return {
    isOpen,
    open,
    close,
    toggle,
    openWith,
    data,
    setData: setModalData
  };
};

/**
 * useMultiModal - Hook for managing multiple modals
 * Useful when you need to manage several modals in one component
 */
export const useMultiModal = <T extends Record<string, any>>(
  modalKeys: (keyof T)[]
): Record<keyof T, UseModalReturn> => {
  const modals = {} as Record<keyof T, UseModalReturn>;

  modalKeys.forEach(key => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    modals[key] = useModal();
  });

  return modals;
};

export default useModal;