/**
 * Textarea con etiqueta, contador de caracteres y mensaje de error.
 * Se usa en el formulario de creación/edición de desafíos.
 *
 * Props:
 * - id: id del textarea.
 * - label: etiqueta visible.
 * - error: mensaje de error opcional.
 * - maxLength: límite de caracteres (activa el contador si se provee).
 * - currentLength: longitud actual del valor (para el contador).
 * - Resto: props nativas de <textarea>.
 */

import { cn } from '@/lib/classNames';
import type { TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  currentLength?: number;
}

export function Textarea({ id, label, error, maxLength, currentLength, className, ...props }: TextareaProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        {maxLength !== undefined && currentLength !== undefined && (
          <span className={cn('text-xs', currentLength > maxLength ? 'text-rose-500' : 'text-zinc-400')}>
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
      <textarea
        id={id}
        maxLength={maxLength}
        aria-invalid={!!error}
        className={cn(
          'w-full rounded-xl border px-4 py-3 text-sm transition-colors outline-none resize-y',
          'bg-white dark:bg-dark-700',
          'text-zinc-900 dark:text-white',
          'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
          error
            ? 'border-rose-400 dark:border-rose-500'
            : 'border-zinc-200 dark:border-dark-500 focus:border-primary-500 dark:focus:border-primary-500',
        )}
        {...props}
      />
      {error && <p role="alert" className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
