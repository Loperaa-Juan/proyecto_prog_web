/**
 * Input de formulario con ícono, etiqueta y mensaje de error.
 * Aplica una animación de sacudida (shakeIn) cuando hay un error activo.
 * Reutilizable en login, registro y cualquier otro formulario.
 *
 * Props:
 * - id: id del input (también se usa para htmlFor de la etiqueta).
 * - label: texto de la etiqueta visible.
 * - error: mensaje de error a mostrar bajo el input (si existe).
 * - icon: ícono de lucide-react para el lado izquierdo del input.
 * - className: clases adicionales para el contenedor.
 * - Resto: cualquier prop nativa de <input>.
 */

import { forwardRef } from 'react';
import { cn } from '@/lib/classNames';
import type { InputHTMLAttributes, ReactNode } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  icon?: ReactNode;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ id, label, error, icon, className, ...props }, ref) => {
    return (
      <div className={cn('flex flex-col gap-1.5', error && 'animate-shake', className)}>
        <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
        </label>
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={id}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            className={cn(
              'w-full rounded-xl border px-4 py-3 text-sm transition-colors outline-none',
              'bg-white dark:bg-dark-700',
              'text-zinc-900 dark:text-white',
              'placeholder:text-zinc-400 dark:placeholder:text-zinc-500',
              icon ? 'pl-10' : 'pl-4',
              error
                ? 'border-rose-400 dark:border-rose-500 focus:border-rose-400'
                : 'border-zinc-200 dark:border-dark-500 focus:border-primary-500 dark:focus:border-primary-500',
            )}
            {...props}
          />
        </div>
        {error && (
          <p id={`${id}-error`} role="alert" className="text-xs text-rose-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);
FormInput.displayName = 'FormInput';
