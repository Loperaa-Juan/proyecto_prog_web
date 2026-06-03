/**
 * Spinner de carga circular reutilizable.
 * Se usa dentro de botones de submit y en estados de carga de secciones.
 *
 * Props:
 * - size: tamaño en píxeles (por defecto 18).
 * - className: clases adicionales de Tailwind.
 */

import { cn } from '@/lib/classNames';

interface SpinnerProps {
  size?: number;
  className?: string;
}

export function Spinner({ size = 18, className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Cargando"
      className={cn('inline-block rounded-full border-2 border-white border-t-transparent animate-spin-fast', className)}
      style={{ width: size, height: size }}
    />
  );
}
