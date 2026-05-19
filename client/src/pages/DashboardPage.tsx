/**
 * Página del dashboard del usuario autenticado.
 * Muestra un header con el perfil, 4 tarjetas de estadísticas y
 * un layout de dos columnas: lista de desafíos propios/resueltos (izquierda)
 * y progreso por categoría + notificaciones (derecha).
 *
 * Comportamiento:
 * - Carga todos los datos en paralelo con Promise.all al montar.
 * - La eliminación de un desafío abre DeleteChallengeModal y refresca la lista.
 * - Muestras estados vacíos si no hay datos en alguna sección.
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Code2, Trophy, Flame, Settings, Edit, Trash2, Pencil } from 'lucide-react';
import { Avatar } from '@/components/domain/Avatar';
import { StatCard } from '@/components/domain/StatCard';
import { ProgressBar } from '@/components/domain/ProgressBar';
import { NotificationItem } from '@/components/domain/NotificationItem';
import { DashChallengeItem } from '@/components/domain/DashChallengeItem';
import { DeleteChallengeModal } from '@/components/domain/DeleteChallengeModal';
import { DeleteSubmissionModal } from '@/components/domain/DeleteSubmissionModal';
import { EditProfileModal } from '@/components/domain/EditProfileModal';
import { DeleteAccountModal } from '@/components/domain/DeleteAccountModal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Spinner } from '@/components/feedback/Spinner';
import { DecorativeBlobs } from '@/components/branding/DecorativeBlobs';
import { GridPattern } from '@/components/branding/GridPattern';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import * as dashService from '@/services/dashboard';
import * as submissionService from '@/services/submissions';
import { formatRelativeDate } from '@/lib/format';
import type { DashboardStats, ProgressItem, Notification, Challenge, Solution, SolutionStatus } from '@/types';

const SUBMISSION_STATUS: Record<SolutionStatus, { dot: string; text: string; label: string }> = {
  pending:  { dot: 'bg-amber-400',   text: 'text-amber-600 dark:text-amber-400',     label: 'Pendiente' },
  approved: { dot: 'bg-emerald-400', text: 'text-emerald-600 dark:text-emerald-400', label: 'Aceptada'  },
  rejected: { dot: 'bg-rose-400',    text: 'text-rose-600 dark:text-rose-400',       label: 'Rechazada' },
};

function MySubmissionItem({
  submission,
  onDelete,
}: {
  submission: Solution;
  onDelete: (submission: Solution) => void;
}) {
  const cfg = SUBMISSION_STATUS[submission.status] ?? SUBMISSION_STATUS.pending;

  return (
    <article className="flex items-center gap-3 py-3 border-b border-zinc-100 dark:border-dark-600 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200 truncate">
          {submission.challengeTitle ?? 'Desafío'}
        </p>
        <p className="text-xs text-zinc-400 mt-0.5">
          Enviado {formatRelativeDate(submission.submittedAt)}
        </p>
      </div>
      <span className={`flex items-center gap-1.5 text-xs font-medium shrink-0 ${cfg.text}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
        {cfg.label}
      </span>
      <Link
        to={`/challenges/${submission.challengeId}/solve`}
        state={{ initialCode: submission.code }}
        aria-label="Editar submission"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-primary-400 hover:bg-primary-500/10 transition-colors shrink-0"
      >
        <Edit size={14} />
      </Link>
      <button
        onClick={() => onDelete(submission)}
        aria-label="Eliminar submission"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-rose-500 hover:bg-rose-500/10 transition-colors shrink-0"
      >
        <Trash2 size={14} />
      </button>
    </article>
  );
}

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [mySubmissions, setMySubmissions] = useState<Solution[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /** Desafío seleccionado para confirmar eliminación */
  const [toDelete, setToDelete] = useState<Challenge | null>(null);
  /** Submission seleccionada para confirmar eliminación */
  const [toDeleteSubmission, setToDeleteSubmission] = useState<Solution | null>(null);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!settingsOpen) return;
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setSettingsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [settingsOpen]);

  // Carga todos los datos del dashboard en paralelo
  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashService.getStats(),
      dashService.getDashboardChallenges(),
      submissionService.getMine(),
      dashService.getProgress(),
      dashService.getNotifications(),
    ])
      .then(([s, mc, subs, pr, nt]) => {
        setStats(s);
        setMyChallenges(mc);
        setMySubmissions(subs);
        setProgress(pr);
        setNotifications(nt);
      })
      .finally(() => setLoading(false));
  }, []);

  /**
   * Elimina el desafío del estado local tras confirmación exitosa en el modal.
   * @param deletedId - ID del desafío eliminado.
   */
  const handleDeleted = (deletedId: string) => {
    setMyChallenges((prev) => prev.filter((c) => c.id !== deletedId));
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Spinner size={36} className="border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {/* ===== HEADER ===== */}
      <section className="relative py-12 px-4 bg-zinc-50 dark:bg-dark-900 border-b border-zinc-200 dark:border-dark-600">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <DecorativeBlobs variant="pageHeader" />
          <GridPattern />
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <Avatar initials={user?.initials ?? 'U'} size="lg" />
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
                {user?.name ?? 'Usuario'}
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-0.5">
                {user?.level} · Miembro desde{' '}
                {user?.joinedAt ? new Date(user.joinedAt).toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }) : '—'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen((o) => !o)}
                  aria-label="Opciones de cuenta"
                  className="w-10 h-10 flex items-center justify-center rounded-xl border border-zinc-200 dark:border-dark-500 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-dark-700 transition-colors"
                >
                  <Settings size={18} />
                </button>
                {settingsOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-dark-800 rounded-xl border border-zinc-200 dark:border-dark-600 shadow-lg py-1 z-20">
                    <button
                      onClick={() => { setSettingsOpen(false); setEditProfileOpen(true); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <Pencil size={15} /> Editar perfil
                    </button>
                    <hr className="border-zinc-100 dark:border-dark-600 mx-2" />
                    <button
                      onClick={() => { setSettingsOpen(false); setDeleteAccountOpen(true); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 size={15} /> Eliminar cuenta
                    </button>
                  </div>
                )}
              </div>
              <Link
                to="/challenges/new"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                <Plus size={16} /> Crear Desafío
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ===== ESTADÍSTICAS ===== */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCard icon={<Code2 size={22} />} label="Creados"       value={myChallenges.length}  color="primary" />
            <StatCard icon={<Trophy size={22} />} label="Enviadas"      value={mySubmissions.length} color="accent"  />
            <StatCard icon={<Flame size={22} />}  label="Días seguidos" value={stats.currentStreak}  color="violet"  />
          </div>
        )}

        {/* ===== CUERPO DEL DASHBOARD (2 columnas) ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Columna izquierda */}
          <div className="space-y-6">
            {/* Mis Desafíos */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-zinc-900 dark:text-white">Mis Desafíos</h2>
                <span className="text-xs text-zinc-400">{myChallenges.length} total</span>
              </div>
              {myChallenges.length === 0 ? (
                <EmptyState
                  icon={<Code2 size={36} />}
                  title="Sin desafíos propios"
                  description="Todavía no has creado ningún desafío. ¡Empieza ahora!"
                  action={{ label: 'Crear desafío', onClick: () => navigate('/challenges/new') }}
                />
              ) : (
                <div>
                  {myChallenges.map((c) => (
                    <DashChallengeItem
                      key={c.id}
                      challenge={c}
                      variant="own"
                      onDelete={setToDelete}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Mis Submissions */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-zinc-900 dark:text-white">Mis Submissions</h2>
                <span className="text-xs text-zinc-400">{mySubmissions.length} total</span>
              </div>
              {mySubmissions.length === 0 ? (
                <EmptyState
                  icon={<Trophy size={36} />}
                  title="Sin submissions"
                  description="Explora los desafíos y envía tu primera solución."
                  action={{ label: 'Explorar desafíos', onClick: () => navigate('/challenges') }}
                />
              ) : (
                <div>
                  {mySubmissions.map((s) => (
                    <MySubmissionItem
                      key={s.id}
                      submission={s}
                      onDelete={setToDeleteSubmission}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            {/* Progreso por categoría */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-6">
              <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Progreso</h2>
              <div className="space-y-4">
                {progress.map((item) => (
                  <ProgressBar key={item.category} {...item} />
                ))}
              </div>
            </div>

            {/* Notificaciones */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-6">
              <h2 className="font-semibold text-zinc-900 dark:text-white mb-4">Notificaciones</h2>
              {notifications.length === 0 ? (
                <p className="text-sm text-zinc-400">Sin notificaciones recientes.</p>
              ) : (
                <div>
                  {notifications.map((n) => (
                    <NotificationItem key={n.id} notification={n} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación de eliminación de desafío */}
      <DeleteChallengeModal
        challenge={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleted}
      />

      {/* Modal de confirmación de eliminación de submission */}
      <DeleteSubmissionModal
        submission={toDeleteSubmission}
        onClose={() => setToDeleteSubmission(null)}
        onDeleted={(id) => {
          setMySubmissions((prev) => prev.filter((x) => x.id !== id));
          setToDeleteSubmission(null);
        }}
      />

      {/* Modal de edición de perfil */}
      <EditProfileModal
        isOpen={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
      />

      {/* Modal de confirmación de eliminación de cuenta */}
      <DeleteAccountModal
        isOpen={deleteAccountOpen}
        onClose={() => setDeleteAccountOpen(false)}
        onDeleted={() => navigate('/')}
      />
    </div>
  );
}
