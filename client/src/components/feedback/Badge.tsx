/**
 * Etiqueta de dificultad de un desafío.
 * Muestra el nivel de dificultad con color semántico:
 * - easy: verde esmeralda
 * - medium: ámbar
 * - hard: rosa/rojo
 * - neutral: indigo (para tags genéricas)
 *
 * Props:
 * - variant: tipo de badge ('easy' | 'medium' | 'hard' | 'neutral').
 * - children: texto a mostrar dentro del badge.
 * - className: clases adicionales.
 */

import { cn } from '@/lib/classNames';

export type BadgeVariant = 'easy' | 'medium' | 'hard' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const VARIANT_STYLES: Record<BadgeVariant, string> = {
  easy:    'bg-accent-500/15 text-accent-500',
  medium:  'bg-amber-500/15 text-amber-500',
  hard:    'bg-rose-500/15 text-rose-500',
  neutral: 'bg-primary-500/15 text-primary-400',
};

const VARIANT_LABELS: Record<BadgeVariant, string> = {
  easy: 'Fácil', medium: 'Medio', hard: 'Difícil', neutral: '',
};

export function Badge({ variant = 'neutral', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold',
        VARIANT_STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

/**
 * Badge especializado para mostrar la dificultad de un desafío
 * con el texto traducido al español.
 *
 * @param difficulty - Nivel de dificultad del desafío.
 */
export function DifficultyBadge({ difficulty }: { difficulty: BadgeVariant }) {
  return (
    <Badge variant={difficulty}>
      {VARIANT_LABELS[difficulty] || difficulty}
    </Badge>
  );
}
