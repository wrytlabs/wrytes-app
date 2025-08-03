import { QueueTransaction } from '@/lib/transactions/types';

export interface QueueIconProps {
  onClick: () => void;
  className?: string;
}

export interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
  onClearCompleted: () => void;
}

export interface QueueItemProps {
  transaction: QueueTransaction;
  onRetry: (id: string) => void;
  onCancel: (id: string) => void;
  onRemove: (id: string) => void;
}
export interface QueueItemStatusProps {
  status: QueueTransaction['status'];
}