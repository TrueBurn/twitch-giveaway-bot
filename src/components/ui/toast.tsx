'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { XIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastProps extends Toast {
  onClose: (id: string) => void;
}

export function Toast({ id, title, description, type, onClose }: ToastProps) {
  return (
    <div
      className={cn(
        'pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        {
          'bg-green-50 border-green-200 text-green-900': type === 'success',
          'bg-red-50 border-red-200 text-red-900': type === 'error',
          'bg-blue-50 border-blue-200 text-blue-900': type === 'info',
          'bg-yellow-50 border-yellow-200 text-yellow-900': type === 'warning',
        }
      )}
    >
      <div className="grid gap-1">
        <h3 className="font-medium">{title}</h3>
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
      </div>
      <button
        onClick={() => onClose(id)}
        className="absolute right-2 top-2 rounded-md p-1"
      >
        <XIcon className="h-4 w-4" />
      </button>
    </div>
  );
}

type ToastEvent = CustomEvent<Toast>;

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const handleToast = (event: ToastEvent) => {
      setToasts((prev) => [...prev, { ...event.detail, id: Date.now().toString() }]);
    };

    window.addEventListener('toast', handleToast as EventListener);
    return () => window.removeEventListener('toast', handleToast as EventListener);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={removeToast} />
      ))}
    </div>,
    document.body
  );
}

export const toast = {
  success: (title: string, description?: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { title, description, type: 'success' },
      })
    );
  },
  error: (title: string, description?: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { title, description, type: 'error' },
      })
    );
  },
  info: (title: string, description?: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { title, description, type: 'info' },
      })
    );
  },
  warning: (title: string, description?: string) => {
    window.dispatchEvent(
      new CustomEvent('toast', {
        detail: { title, description, type: 'warning' },
      })
    );
  },
}; 