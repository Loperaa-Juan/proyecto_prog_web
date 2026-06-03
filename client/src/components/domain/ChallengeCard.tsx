/**
 * Tarjeta compacta de desafío para la sección de destacados en la LandingPage.
 * Muestra el título, dificultad, una descripción resumida y el número de soluciones.
 * Al hacer clic navega al listado de desafíos.
 *
 * Props:
 * - challenge: objeto Challenge con los datos del desafío.
 */

import { Link } from 'react-router-dom';
import { ArrowRight, Users } from 'lucide-react';
import { DifficultyBadge } from '@/components/feedback/Badge';
import { cn } from '@/lib/classNames';
import type { Challenge } from '@/types';

interface ChallengeCardProps {
  challenge: Challenge;
}

export function ChallengeCard({ challenge }: ChallengeCardProps) {
  return (
    <div
      className={cn(
        'group rounded-2xl border p-6 flex flex-col gap-3',
        'bg-white dark:bg-dark-800',
        'border-zinc-200 dark:border-dark-600',
        'hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)] transition-all duration-300',
        'animate-fade-in-up',
        /* Línea de acento en la parte superior */
        'relative overflow-hidden',
      )}
    >
      {/* Línea de color en el borde superior */}
      <div
        className="absolute top-0 left-0 right-0 h-0.5"
        style={{ background: 'linear-gradient(to right, #6366f1, #10b981)' }}
      />

      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2 leading-snug">
          {challenge.title}
        </h3>
        <DifficultyBadge difficulty={challenge.difficulty} />
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed flex-1">
        {challenge.description}
      </p>

      <div className="flex items-center justify-between pt-1">
        <span className="flex items-center gap-1.5 text-xs text-zinc-400">
          <Users size={13} />
          {challenge.solutionsCount.toLocaleString()} soluciones
        </span>
        <Link
          to={`/challenges/${challenge.id}/solve`}
          className="flex items-center gap-1 text-xs font-medium text-primary-400 hover:text-primary-300 transition-colors"
        >
          Resolver <ArrowRight size={12} />
        </Link>
      </div>
    </div>
  );
}
