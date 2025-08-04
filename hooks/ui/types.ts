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