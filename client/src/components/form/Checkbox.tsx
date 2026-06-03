/**
 * Checkbox personalizado estilizado con Tailwind.
 * Muestra un checkbox cuadrado con borde de marca y checkmark blanco al seleccionarse.
 *
 * Props:
 * - id: id del input (también para la etiqueta).
 * - label: contenido JSX de la etiqueta (puede contener links).
 * - error: mensaje de error si no está seleccionado cuando se requiere.
 * - Resto: props nativas de <input type="checkbox">.
 */

import { cn } from '@/lib/classNames';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  error?: string;
}

export function Checkbox({ id, label, error, className, ...props }: CheckboxProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer group">
        <input
          id={id}
          type="checkbox"
          className={cn(
            'mt-0.5 w-4 h-4 rounded border-2 cursor-pointer shrink-0',
            'accent-primary-500',
            error ? 'border-rose-400' : 'border-zinc-300 dark:border-dark-500',
          )}
          {...props}
        />
        <span className="text-sm text-zinc-600 dark:text-zinc-400 leading-5">{label}</span>
      </label>
      {error && <p role="alert" className="text-xs text-rose-500 ml-6">{error}</p>}
    </div>
  );
}
