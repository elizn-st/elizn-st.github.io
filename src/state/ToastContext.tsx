import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

export interface ToastEntry {
  readonly id: number;
  readonly message: string;
  readonly leaving: boolean;
}

/** Matches the original timings: 2600ms visible, 220ms leave animation. */
const VISIBLE_MS = 2600;
const LEAVE_MS = 220;

interface ToastValue {
  readonly toasts: readonly ToastEntry[];
  readonly toast: (message: string) => void;
}

const ToastContext = createContext<ToastValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<readonly ToastEntry[]>([]);
  const nextId = useRef(0);

  const toast = useCallback((message: string) => {
    const id = nextId.current++;
    setToasts((current) => [...current, { id, message, leaving: false }]);
    window.setTimeout(() => {
      setToasts((current) => current.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
      window.setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id));
      }, LEAVE_MS);
    }, VISIBLE_MS);
  }, []);

  const value = useMemo<ToastValue>(() => ({ toasts, toast }), [toasts, toast]);
  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast(): (message: string) => void {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToast must be used inside <ToastProvider>');
  return value.toast;
}

export function useToasts(): readonly ToastEntry[] {
  const value = useContext(ToastContext);
  if (!value) throw new Error('useToasts must be used inside <ToastProvider>');
  return value.toasts;
}
