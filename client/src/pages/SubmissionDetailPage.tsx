import { useState } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, Check, X } from 'lucide-react';
import { Spinner } from '@/components/feedback/Spinner';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useToast } from '@/hooks/useToast';
import { formatRelativeDate } from '@/lib/format';
import * as submissionService from '@/services/submissions';
import type { Solution, SolutionStatus } from '@/types';

const STATUS_CONFIG: Record<SolutionStatus, { dot: string; text: string; label: string }> = {
  pending:  { dot: 'bg-amber-400',   text: 'text-amber-600 dark:text-amber-400',     label: 'Pendiente' },
  approved: { dot: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', label: 'Aceptada'  },
  rejected: { dot: 'bg-rose-400',    text: 'text-rose-600 dark:text-rose-400',       label: 'Rechazada' },
};

export default function SubmissionDetailPage() {
  const { id: challengeId, submissionId } = useParams<{ id: string; submissionId: string }>();
  const { state } = useLocation() as {
    state: { submission: Solution; challengeTitle: string } | null;
  };
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [status, setStatus] = useState<SolutionStatus>(state?.submission.status ?? 'pending');
  const [accepting, setAccepting] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  useDocumentTitle('Detalle de submission');

  if (!state?.submission) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-zinc-500 dark:text-zinc-400">Submission no encontrada.</p>
        <Link
          to={`/challenges/${challengeId}/submissions`}
          className="mt-4 inline-block text-sm text-primary-500 hover:underline"
        >
          Volver a la lista
        </Link>
      </div>
    );
  }

  const { submission, challengeTitle } = state;
  const cfg = STATUS_CONFIG[status];

  const handleAccept = async () => {
    if (accepting || rejecting) return;
    setAccepting(true);
    try {
      await submissionService.accept(submission.id);
      setStatus('approved');
      showToast('Submission aceptada', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al aceptar', 'error');
    } finally {
      setAccepting(false);
    }
  };

  const handleReject = async () => {
    if (accepting || rejecting) return;
    setRejecting(true);
    try {
      await submissionService.reject(submission.id);
      setStatus('rejected');
      showToast('Submission denegada', 'success');
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al denegar', 'error');
    } finally {
      setRejecting(false);
    }
  };

  const busy = accepting || rejecting;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 mb-6 flex-wrap">
        <Link to="/dashboard" className="hover:text-primary-400 transition-colors">Dashboard</Link>
        <ChevronRight size={13} />
        <Link
          to={`/challenges/${challengeId}/submissions`}
          className="hover:text-primary-400 transition-colors truncate max-w-[14rem]"
        >
          {challengeTitle}
        </Link>
        <ChevronRight size={13} />
        <span>Detalle</span>
      </nav>

      {/* Card principal */}
      <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 overflow-hidden">
        {/* Header de la card */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-dark-600">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <p className="text-lg font-semibold text-zinc-900 dark:text-white">
                {submission.authorName ?? 'Usuario desconocido'}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enviado {formatRelativeDate(submission.submittedAt)}
              </p>
            </div>
            <span className={`flex items-center gap-1.5 text-sm font-medium ${cfg.text}`}>
              <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Código */}
        <div className="px-6 py-4 border-b border-zinc-100 dark:border-dark-600">
          <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-3">
            Código enviado
          </p>
          <pre className="rounded-xl p-4 text-xs font-mono leading-5 overflow-x-auto bg-[#1e1e1e] text-zinc-200 max-h-[28rem] whitespace-pre">
            {submission.code}
          </pre>
        </div>

        {/* Acciones */}
        <div className="px-6 py-4 flex items-center justify-between gap-3 flex-wrap">
          <button
            onClick={() => navigate(`/challenges/${challengeId}/submissions`)}
            className="text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            ← Volver a la lista
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              disabled={busy || status === 'rejected'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border border-rose-300 dark:border-rose-500/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {rejecting ? <Spinner size={14} /> : <X size={15} />}
              Denegar
            </button>
            <button
              onClick={handleAccept}
              disabled={busy || status === 'approved'}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {accepting ? <Spinner size={14} /> : <Check size={15} />}
              Aceptar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
