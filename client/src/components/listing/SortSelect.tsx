/**
 * Select de ordenación para el listado de desafíos.
 * Opciones: más nuevos, más antiguos, más populares, A-Z.
 *
 * Props:
 * - value: valor de ordenación actual.
 * - onChange: callback al cambiar la ordenación.
 */

import { ChevronDown } from 'lucide-react';
import type { ChallengeSort } from '@/types';

interface SortSelectProps {
  value: ChallengeSort;
  onChange: (value: ChallengeSort) => void;
}

const OPTIONS: { value: ChallengeSort; label: string }[] = [
  { value: 'newest',  label: 'Más nuevos'    },
  { value: 'oldest',  label: 'Más antiguos'  },
  { value: 'popular', label: 'Más populares' },
  { value: 'az',      label: 'A → Z'         },
];

export function SortSelect({ value, onChange }: SortSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as ChallengeSort)}
        aria-label="Ordenar por"
        className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-zinc-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-sm text-zinc-700 dark:text-zinc-300 outline-none focus:border-primary-500 cursor-pointer transition-colors"
      >
        {OPTIONS.map(({ value: v, label }) => (
          <option key={v} value={v}>{label}</option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
    </div>
  );
}
