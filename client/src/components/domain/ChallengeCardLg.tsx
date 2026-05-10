/**
 * Tarjeta grande de desafío para el listado de ChallengesPage.
 * Muestra información completa: título, dificultad, categoría, tags,
 * autor, fecha, conteo de soluciones y tasa de éxito.
 *
 * Props:
 * - challenge: objeto Challenge completo.
 * - viewMode: 'grid' | 'list' — cambia el layout de la tarjeta.
 */

import { Link } from 'react-router-dom';
import { Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Avatar } from './Avatar';
import { DifficultyBadge } from '@/components/feedback/Badge';
import { formatRelativeDate } from '@/lib/format';
import { cn } from '@/lib/classNames';
import type { Challenge } from '@/types';

interface ChallengeCardLgProps {
  challenge: Challenge;
  viewMode?: 'grid' | 'list';
}

export function ChallengeCardLg({ challenge, viewMode = 'grid' }: ChallengeCardLgProps) {
  const isGrid = viewMode === 'grid';

  return (
    <div
      className={cn(
        'group rounded-2xl border',
        'bg-white dark:bg-dark-800',
        'border-zinc-200 dark:border-dark-600',
        'hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(99,102,241,0.15)] transition-all duration-300',
        'animate-fade-in-up overflow-hidden',
        isGrid ? 'flex flex-col' : 'flex flex-row items-start',
      )}
    >
      {/* Acento superior */}
      <div
        className={cn('shrink-0', isGrid ? 'h-0.5 w-full' : 'w-0.5 self-stretch')}
        style={{ background: 'linear-gradient(to right, #6366f1, #10b981)' }}
      />

      <div className={cn('flex flex-col gap-3 p-5 flex-1', !isGrid && 'pl-5')}>
        {/* Cabecera */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <DifficultyBadge difficulty={challenge.difficulty} />
              <span className="text-xs text-zinc-400 dark:text-zinc-500 truncate">
                {challenge.categoryLabel}
              </span>
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-2 leading-snug">
              {challenge.title}
            </h3>
          </div>
        </div>

        {/* Descripción */}
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {challenge.description}
        </p>

        {/* Tags */}
        {challenge.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {challenge.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md text-xs font-medium bg-zinc-100 dark:bg-dark-700 text-zinc-500 dark:text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Pie de tarjeta */}
        <div className="flex items-center justify-between pt-1 mt-auto">
          {/* Autor y fecha */}
          <div className="flex items-center gap-2">
            <Avatar initials={challenge.authorInitials} size="sm" />
            <div>
              <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300">{challenge.authorName}</p>
              <p className="text-xs text-zinc-400">{formatRelativeDate(challenge.createdAt)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1">
              <Users size={12} />
              {challenge.solutionsCount}
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp size={12} />
              {challenge.successRate}%
            </span>
            <Link
              to={`/challenges/${challenge.id}/solve`}
              className="flex items-center gap-1 text-primary-400 font-medium hover:text-primary-300 transition-colors"
              aria-label={`Resolver ${challenge.title}`}
            >
              Resolver <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
