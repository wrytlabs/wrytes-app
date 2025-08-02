import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { cn } from '@/lib/utils';
import { ModalProps } from './types';

/**
 * Modal - Base modal component with backdrop, animations, and accessibility
 * Features:
 * - Portal rendering for proper z-index stacking
 * - Backdrop blur and click-to-close
 * - Keyboard navigation (ESC to close, focus trapping)
 * - Smooth animations
 * - ARIA compliance
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className,
  header,
  footer,
  showCloseButton = true
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Size variants
  const sizeVariants = {
    sm: 'max-w-md',
    md: 'max-w-lg', 
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  // Handle ESC key
  useEffect(() => {
    if (!closeOnEscape) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose, closeOnEscape]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      // Store current focus
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      // Focus modal after animation
      setTimeout(() => {
        if (modalRef.current) {
          const focusableElement = modalRef.current.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          
          if (focusableElement) {
            focusableElement.focus();
          } else {
            modalRef.current.focus();
          }
        }
      }, 100);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Focus trap
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Tab' && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    }
  };

  // Handle backdrop click
  const handleBackdropClick = (event: React.MouseEvent) => {
    if (closeOnBackdrop && event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div 
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center p-4',
        'bg-black/50 backdrop-blur-sm',
        'animate-in fade-in duration-200'
      )}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div 
        ref={modalRef}
        className={cn(
          'relative w-full bg-dark-card rounded-2xl border border-dark-surface',
          'shadow-2xl transform transition-all duration-200',
          'animate-in zoom-in-95 slide-in-from-bottom-4',
          sizeVariants[size],
          className
        )}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        {(title || header || showCloseButton) && (
          <div className="flex items-center justify-between p-6 border-b border-dark-surface">
            <div className="flex-1">
              {header || (
                title && (
                  <h2 
                    id="modal-title"
                    className="text-xl font-bold text-white"
                  >
                    {title}
                  </h2>
                )
              )}
            </div>
            {showCloseButton && (
              <button
                onClick={onClose}
                className="ml-4 p-2 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-dark-surface/50"
                aria-label="Close modal"
              >
                <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-end gap-3 p-6 border-t border-dark-surface">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  // Render in portal
  return createPortal(modalContent, document.body);
};

export default Modal;