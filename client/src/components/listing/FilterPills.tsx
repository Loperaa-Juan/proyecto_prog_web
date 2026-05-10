/**
 * Pastillas de filtro de dificultad para el listado de desafíos.
 * Opciones: Todos, Fácil, Medio, Difícil.
 * La pastilla activa se resalta con el color de fondo primario.
 *
 * Props:
 * - active: dificultad actualmente seleccionada.
 * - onChange: callback al seleccionar una pastilla.
 */

import { cn } from '@/lib/classNames';
import type { ChallengeDifficulty } from '@/types';

type FilterValue = ChallengeDifficulty | 'all';

interface FilterPillsProps {
  active: FilterValue;
  onChange: (value: FilterValue) => void;
}

const PILLS: { value: FilterValue; label: string }[] = [
  { value: 'all',    label: 'Todos'  },
  { value: 'easy',   label: 'Fácil'  },
  { value: 'medium', label: 'Medio'  },
  { value: 'hard',   label: 'Difícil'},
];

export function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap" role="group" aria-label="Filtrar por dificultad">
      {PILLS.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          aria-pressed={active === value}
          className={cn(
            'px-3.5 py-1.5 rounded-full text-sm font-medium transition-all',
            active === value
              ? 'bg-primary-500 text-white shadow-sm'
              : 'border border-zinc-200 dark:border-dark-500 text-zinc-600 dark:text-zinc-400 hover:border-primary-400 hover:text-primary-400',
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
