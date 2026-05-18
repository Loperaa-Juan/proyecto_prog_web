/**
 * Ítem de desafío en las listas del dashboard.
 * Muestra el título, dificultad, fecha de creación y botones de acción.
 * En variante 'own' muestra botones de editar y eliminar.
 * En variante 'solved' muestra solo la fecha de resolución.
 *
 * Props:
 * - challenge: objeto Challenge a mostrar.
 * - variant: 'own' (mis desafíos) | 'solved' (desafíos resueltos).
 * - onDelete: callback para iniciar el flujo de eliminación (solo 'own').
 */

import { Link } from 'react-router-dom';
import { Edit, Trash2, Users } from 'lucide-react';
import { DifficultyBadge } from '@/components/feedback/Badge';
import { formatRelativeDate } from '@/lib/format';
import type { Challenge } from '@/types';

interface DashChallengeItemProps {
  challenge: Challenge;
  variant?: 'own' | 'solved';
  onDelete?: (challenge: Challenge) => void;
}

export function DashChallengeItem({
  challenge,
  variant = 'own',
  onDelete,
}: DashChallengeItemProps) {
  return (
    <article className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-dark-600 last:border-0 group">
      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h4 className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
            {challenge.title}
          </h4>
          <DifficultyBadge difficulty={challenge.difficulty} />
        </div>
        {challenge.description && (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 line-clamp-2">
            {challenge.description}
          </p>
        )}
        <p className="text-xs text-zinc-400 mt-0.5">
          {variant === 'own' ? 'Creado ' : 'Resuelto '}
          {formatRelativeDate(challenge.createdAt)}
        </p>
      </div>

      {/* Acciones */}
      {variant === 'own' && (
        <div className="flex items-center gap-1 shrink-0">
          <Link
            to={`/challenges/${challenge.id}/submissions`}
            aria-label={`Ver submissions de ${challenge.title}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
          >
            <Users size={15} />
          </Link>
          <Link
            to={`/challenges/${challenge.id}/edit`}
            aria-label={`Editar ${challenge.title}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors"
          >
            <Edit size={15} />
          </Link>
          <button
            onClick={() => onDelete?.(challenge)}
            aria-label={`Eliminar ${challenge.title}`}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )}
    </article>
  );
}
