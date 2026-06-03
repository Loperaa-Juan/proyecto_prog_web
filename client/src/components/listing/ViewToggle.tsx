/**
 * Toggle de vista grid/lista para el listado de desafíos.
 * El ícono de cuadrícula activa la vista grid y el de lista activa la vista listado.
 *
 * Props:
 * - view: vista actualmente seleccionada ('grid' | 'list').
 * - onChange: callback al cambiar de vista.
 */

import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/classNames';

interface ViewToggleProps {
  view: 'grid' | 'list';
  onChange: (view: 'grid' | 'list') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div
      className="flex items-center rounded-xl border border-zinc-200 dark:border-dark-500 p-1 gap-1"
      role="group"
      aria-label="Cambiar vista"
    >
      <button
        onClick={() => onChange('grid')}
        aria-pressed={view === 'grid'}
        aria-label="Vista cuadrícula"
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
          view === 'grid'
            ? 'bg-primary-500 text-white'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
        )}
      >
        <LayoutGrid size={16} />
      </button>
      <button
        onClick={() => onChange('list')}
        aria-pressed={view === 'list'}
        aria-label="Vista lista"
        className={cn(
          'w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
          view === 'list'
            ? 'bg-primary-500 text-white'
            : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300',
        )}
      >
        <List size={16} />
      </button>
    </div>
  );
}
