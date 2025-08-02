import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { Modal } from './Modal';
import { ConfirmModalProps } from './types';

/**
 * ConfirmModal - Confirmation dialog with customizable actions
 * Useful for destructive actions, form submissions, etc.
 */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  onConfirm,
  loading = false,
  className
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  // Button variant mapping
  const buttonVariants = {
    primary: 'primary',
    secondary: 'secondary',
    danger: 'primary' // We'll style danger with custom classes
  } as const;

  const getDangerStyles = () => {
    if (confirmVariant === 'danger') {
      return 'bg-red-600 hover:bg-red-700 text-white border-red-600';
    }
    return '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      className={className}
      closeOnBackdrop={!loading} // Prevent closing during loading
      closeOnEscape={!loading}   // Prevent closing during loading
    >
      <div className="text-center">
        {/* Icon */}
        <div className="mx-auto mb-4 w-12 h-12 bg-yellow-400/20 rounded-full flex items-center justify-center">
          <FontAwesomeIcon 
            icon={faExclamationTriangle} 
            className="w-6 h-6 text-yellow-400" 
          />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-white mb-2">
          {title}
        </h3>

        {/* Message */}
        <div className="text-text-secondary mb-6">
          {typeof message === 'string' ? (
            <p>{message}</p>
          ) : (
            message
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-center">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="min-w-[80px]"
          >
            {cancelText}
          </Button>
          
          <Button
            variant={buttonVariants[confirmVariant]}
            onClick={handleConfirm}
            disabled={loading}
            loading={loading}
            className={cn(
              'min-w-[80px]',
              getDangerStyles()
            )}
            icon={loading ? <FontAwesomeIcon icon={faSpinner} className="animate-spin" /> : undefined}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;