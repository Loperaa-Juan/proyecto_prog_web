/**
 * Patrón de rejilla decorativo para fondos de secciones.
 * Se superpone con baja opacidad para dar profundidad a la UI.
 *
 * Props:
 * - className: clases adicionales para posicionamiento o visibilidad.
 * - light: si es true usa la variante de baja opacidad para fondos claros.
 */

import { cn } from '@/lib/classNames';

interface GridPatternProps {
  className?: string;
  light?: boolean;
}

export function GridPattern({ className, light }: GridPatternProps) {
  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none',
        light ? 'grid-pattern-light' : 'grid-pattern opacity-30 dark:opacity-50',
        className,
      )}
    />
  );
}
