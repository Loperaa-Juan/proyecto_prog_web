import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Users, ArrowRight } from 'lucide-react';
import { Spinner } from '@/components/feedback/Spinner';
import { EmptyState } from '@/components/feedback/EmptyState';
import { DifficultyBadge } from '@/components/feedback/Badge';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { formatRelativeDate } from '@/lib/format';
import * as submissionService from '@/services/submissions';
import * as challengeService from '@/services/challenges';
import type { Solution, Challenge, SolutionStatus } from '@/types';

const STATUS_CONFIG: Record<SolutionStatus, { dot: string; text: string; label: string }> = {
  pending:  { dot: 'bg-amber-400',   text: 'text-amber-600 dark:text-amber-400',     label: 'Pendiente' },
  approved: { dot: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', label: 'Aceptada'  },
  rejected: { dot: 'bg-rose-400',    text: 'text-rose-600 dark:text-rose-400',       label: 'Rechazada' },
};

interface SubmissionRowProps {
  submission: Solution;
  challengeId: string;
  challengeTitle: string;
}

function SubmissionRow({ submission, challengeId, challengeTitle }: SubmissionRowProps) {
  const cfg = STATUS_CONFIG[submission.status] ?? STATUS_CONFIG.pending;

  return (
    <div className="flex items-center gap-4 py-3.5 px-4 border-b border-zinc-100 dark:border-dark-600 last:border-0 hover:bg-zinc-50 dark:hover:bg-dark-700/50 transition-colors">
      {/* Autor */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {submission.authorName ?? 'Usuario desconocido'}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">
          {formatRelativeDate(submission.submittedAt)}
        </p>
      </div>

      {/* Estado */}
      <span className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>

      {/* Ver */}
      <Link
        to={`/challenges/${challengeId}/submissions/${submission.id}`}
        state={{ submission, challengeTitle }}
        className="flex items-center gap-1 text-xs font-medium text-primary-500 hover:text-primary-400 transition-colors shrink-0"
      >
        Ver <ArrowRight size={13} />
      </Link>
    </div>
  );
}

export default function SubmissionsPage() {
  const { id } = useParams<{ id: string }>();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [submissions, setSubmissions] = useState<Solution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useDocumentTitle(challenge ? `Submissions: ${challenge.title}` : 'Submissions');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);

    Promise.all([
      challengeService.getById(id),
      submissionService.getByChallenge(id),
    ])
      .then(([c, subs]) => {
        setChallenge(c);
        setSubmissions(subs);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Error al cargar las submissions');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size={32} className="border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-rose-500 font-medium">{error}</p>
        <Link to="/dashboard" className="mt-4 inline-block text-sm text-primary-500 hover:underline">
          Volver al dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 mb-6">
        <Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link>
        <ChevronRight size={13} />
        <span className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[16rem]">
          {challenge?.title ?? 'Desafío'}
        </span>
        <ChevronRight size={13} />
        <span>Submissions</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
            {challenge?.title}
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            {submissions.length === 0
              ? 'Aún no hay submissions para este desafío'
              : `${submissions.length} ${submissions.length === 1 ? 'submission' : 'submissions'}`}
          </p>
        </div>
        {challenge && <DifficultyBadge difficulty={challenge.difficulty} />}
      </div>

      {/* Lista */}
      {submissions.length === 0 ? (
        <EmptyState
          icon={<Users size={36} />}
          title="Sin submissions"
          description="Nadie ha enviado una solución a este desafío todavía."
        />
      ) : (
        <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 overflow-hidden">
          {submissions.map((s) => (
            <SubmissionRow
              key={s.id}
              submission={s}
              challengeId={id!}
              challengeTitle={challenge?.title ?? ''}
            />
          ))}
        </div>
      )}
    </div>
  );
}
