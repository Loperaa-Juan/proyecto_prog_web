/**
 * Componente de modal genérico con overlay.
 * Se cierra al hacer clic en el overlay o presionar la tecla Escape.
 * Renderiza su contenido en un portal para evitar problemas de z-index.
 *
 * Props:
 * - isOpen: controla si el modal es visible.
 * - onClose: función que cierra el modal.
 * - children: contenido del modal.
 * - maxWidth: ancho máximo del contenedor (por defecto 'sm').
 */

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '@/lib/classNames';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg';
}

const MAX_WIDTH = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
};

export function Modal({ isOpen, onClose, children, maxWidth = 'sm' }: ModalProps) {
  // Cierra con tecla Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Bloquea el scroll del body mientras el modal está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      {/* Contenido */}
      <div
        className={cn(
          'relative w-full rounded-2xl shadow-xl animate-fade-in',
          'bg-white dark:bg-dark-800',
          'border border-zinc-200 dark:border-dark-600',
          MAX_WIDTH[maxWidth],
        )}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
