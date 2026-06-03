/**
 * Contexto de notificaciones tipo toast.
 * Gestiona una cola de toasts con auto-dismiss a los 3.5 segundos.
 * Los toasts se renderizan en un portal fuera del árbol de la app
 * para garantizar posicionamiento fijo correcto.
 *
 * Uso: envuelve la app con <ToastProvider> y consume con useToast().
 */

import { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { cn } from '@/lib/classNames';

export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  /**
   * Muestra un toast en la pantalla.
   * @param message - Texto del mensaje.
   * @param kind - Variante visual: 'success' | 'error' | 'info'.
   */
  showToast: (message: string, kind?: ToastKind) => void;
}

export const ToastContext = createContext<ToastContextValue | null>(null);

const ICON = {
  success: <CheckCircle2 size={16} />,
  error:   <AlertCircle  size={16} />,
  info:    <Info         size={16} />,
};

const TOAST_STYLES: Record<ToastKind, string> = {
  success: 'bg-accent-500 text-white',
  error:   'bg-rose-500 text-white',
  info:    'bg-primary-500 text-white',
};

/**
 * Componente individual de toast.
 * Se anima al entrar y al salir, y se descarta automáticamente.
 *
 * Props:
 * - toast: objeto Toast con id, kind y message.
 * - onDismiss: función para eliminarlo de la cola.
 */
function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const [leaving, setLeaving] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    timer.current = setTimeout(() => {
      setLeaving(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, 3500);
    return () => clearTimeout(timer.current);
  }, [toast.id, onDismiss]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-medium',
        'min-w-[260px] max-w-[380px] cursor-pointer',
        TOAST_STYLES[toast.kind],
        leaving ? 'animate-fade-out' : 'animate-slide-down',
      )}
      onClick={() => { setLeaving(true); setTimeout(() => onDismiss(toast.id), 300); }}
    >
      {ICON[toast.kind]}
      <span className="flex-1">{toast.message}</span>
      <X size={14} className="shrink-0 opacity-80" />
    </div>
  );
}

/**
 * Proveedor del contexto de toasts.
 * Renderiza la cola de toasts en un portal anclado al documento.
 *
 * @param children - Árbol de componentes con acceso al showToast.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, kind, message }]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {createPortal(
        <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 items-end">
          {toasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  );
}
