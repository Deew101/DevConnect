import React, { createContext, useContext, useCallback } from 'react';
import { Toaster, toast as sonnerToast } from 'sonner';

export type ToastType = 'success' | 'error' | 'info';

interface ToastContextValue {
  toast: (options: { title: string; description?: string; type?: ToastType }) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const triggerToast = useCallback(
    ({ title, description, type = 'info' }: { title: string; description?: string; type?: ToastType }) => {
      switch (type) {
        case 'success':
          sonnerToast.success(title, { description });
          break;
        case 'error':
          sonnerToast.error(title, { description });
          break;
        case 'info':
        default:
          sonnerToast.info(title, { description });
          break;
      }
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast: triggerToast }}>
      {children}
      <Toaster
        position="bottom-right"
        theme="dark"
        toastOptions={{
          style: {
            background: '#0d111a',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: '#f8fafc',
            borderRadius: '0.875rem',
            fontSize: '12px',
          },
        }}
      />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
