/**
 * Select personalizado con ícono de chevron.
 * Mantiene la apariencia consistente con FormInput en modo claro y oscuro.
 *
 * Props:
 * - id: id del select.
 * - label: etiqueta visible.
 * - error: mensaje de error opcional.
 * - options: array de { value, label } para las opciones.
 * - Resto: props nativas de <select>.
 */

import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/classNames';
import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  options: SelectOption[];
  error?: string;
  placeholder?: string;
}

export function Select({ id, label, options, error, placeholder, className, ...props }: SelectProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          className={cn(
            'w-full appearance-none rounded-xl border px-4 py-3 pr-10 text-sm transition-colors outline-none cursor-pointer',
            'bg-white dark:bg-dark-700',
            'text-zinc-900 dark:text-white',
            error
              ? 'border-rose-400 dark:border-rose-500'
              : 'border-zinc-200 dark:border-dark-500 focus:border-primary-500 dark:focus:border-primary-500',
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
        />
      </div>
      {error && <p role="alert" className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
