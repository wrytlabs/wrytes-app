import { toast } from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message: string) => toast.success(message, {
      style: {
        background: '#10B981',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      duration: 4000,
    }),
    error: (message: string) => toast.error(message, {
      style: {
        background: '#EF4444',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
      duration: 6000,
    }),
    loading: (message: string) => toast.loading(message, {
      style: {
        background: '#F59E0B',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
      },
    }),
    dismiss: (toastId: string) => toast.dismiss(toastId),
  };
}; 