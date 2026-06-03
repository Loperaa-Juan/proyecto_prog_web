/**
 * Medidor visual de fortaleza de contraseña.
 * Muestra 4 barras de colores que se van llenando según la puntuación:
 * 1 = Débil (rojo), 2 = Regular (naranja), 3 = Buena (azul), 4 = Fuerte (verde).
 *
 * Props:
 * - score: puntuación de 0 a 4 (calculada por scorePassword de lib/validation).
 */

import { cn } from '@/lib/classNames';

interface PasswordStrengthMeterProps {
  score: number;
}

const BAR_COLORS = [
  'bg-rose-500',   // Débil
  'bg-amber-500',  // Regular
  'bg-primary-400', // Buena
  'bg-accent-500', // Fuerte
];

const LABELS = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];

export function PasswordStrengthMeter({ score }: PasswordStrengthMeterProps) {
  return (
    <div className="flex flex-col gap-1.5">
      {/* Barras de indicador */}
      <div className="flex gap-1.5">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className={cn(
              'h-1 flex-1 rounded-full transition-all duration-300',
              i < score ? BAR_COLORS[score - 1] : 'bg-zinc-200 dark:bg-dark-500',
            )}
          />
        ))}
      </div>
      {/* Etiqueta de fortaleza */}
      {score > 0 && (
        <p className={cn('text-xs font-medium', BAR_COLORS[score - 1].replace('bg-', 'text-'))}>
          {LABELS[score]}
        </p>
      )}
    </div>
  );
}
