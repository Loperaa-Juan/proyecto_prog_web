/**
 * Componente de paginación con botones anterior/siguiente y números de página.
 * Muestra elipsis (...) cuando hay muchas páginas para no saturar la UI.
 * Deshabilita los botones cuando no hay más páginas en esa dirección.
 *
 * Props:
 * - page: página actual (base 1).
 * - totalPages: total de páginas disponibles.
 * - onChange: callback con el número de página seleccionado.
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/classNames';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/**
 * Genera el array de páginas a mostrar, con elipsis cuando corresponda.
 * Siempre muestra la primera, la última y las adyacentes a la actual.
 *
 * @param current - Página actual.
 * @param total - Total de páginas.
 * @returns Array con números de página o '…' como separadores.
 */
function buildPages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages: (number | '…')[] = [1];
  if (current > 3) pages.push('…');
  for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
    pages.push(p);
  }
  if (current < total - 2) pages.push('…');
  pages.push(total);
  return pages;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPages(page, totalPages);

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-1">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        aria-label="Página anterior"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-dark-500 text-zinc-500 disabled:opacity-40 hover:border-primary-500 hover:text-primary-500 transition-colors disabled:cursor-not-allowed"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-sm text-zinc-400">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
              p === page
                ? 'bg-primary-500 text-white border border-primary-500'
                : 'border border-zinc-200 dark:border-dark-500 text-zinc-600 dark:text-zinc-400 hover:border-primary-400 hover:text-primary-400',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Página siguiente"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-dark-500 text-zinc-500 disabled:opacity-40 hover:border-primary-500 hover:text-primary-500 transition-colors disabled:cursor-not-allowed"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
