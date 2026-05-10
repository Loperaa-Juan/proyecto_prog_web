/**
 * Barra de progreso con etiqueta y porcentaje.
 * Se usa en la sección de progreso por categoría del dashboard.
 *
 * Props:
 * - category: nombre de la categoría.
 * - solved: número de desafíos resueltos.
 * - total: total de desafíos disponibles en la categoría.
 * - color: variante de color de la barra.
 */

import { cn } from '@/lib/classNames';
import type { ProgressItem } from '@/types';

const COLOR_MAP: Record<ProgressItem['color'], string> = {
  primary: 'bg-primary-500',
  accent:  'bg-accent-500',
  violet:  'bg-violet-500',
  amber:   'bg-amber-500',
};

export function ProgressBar({ category, solved, total, color }: ProgressItem) {
  const pct = total > 0 ? Math.round((solved / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-zinc-700 dark:text-zinc-300">{category}</span>
        <span className="text-zinc-400 dark:text-zinc-500 tabular-nums">
          {solved}/{total}
        </span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-zinc-200 dark:bg-dark-600 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500', COLOR_MAP[color])}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${category}: ${pct}%`}
        />
      </div>
    </div>
  );
}
