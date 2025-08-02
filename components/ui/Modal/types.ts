import { ReactNode } from 'react';

export interface ModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should be closed */
  onClose: () => void;
  /** Modal title (optional) */
  title?: string;
  /** Modal content */
  children: ReactNode;
  /** Modal size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether clicking backdrop closes modal */
  closeOnBackdrop?: boolean;
  /** Whether ESC key closes modal */
  closeOnEscape?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Custom header content (overrides title) */
  header?: ReactNode;
  /** Custom footer content */
  footer?: ReactNode;
  /** Whether to show close button */
  showCloseButton?: boolean;
}

export interface ConfirmModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Function to call when modal should be closed */
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Confirmation message */
  message: string | ReactNode;
  /** Confirm button text */
  confirmText?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button variant */
  confirmVariant?: 'primary' | 'secondary' | 'danger';
  /** Function to call when confirmed */
  onConfirm: () => void;
  /** Whether confirm action is loading */
  loading?: boolean;
  /** Additional CSS classes */
  className?: string;
}