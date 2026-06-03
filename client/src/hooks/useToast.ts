/**
 * Hook para consumir el contexto de toasts.
 * Lanza un error si se usa fuera del ToastProvider.
 *
 * @returns Objeto con la función showToast(message, kind).
 */

import { useContext } from 'react';
import { ToastContext } from '@/context/ToastContext';

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast debe usarse dentro de ToastProvider');
  return ctx;
}
