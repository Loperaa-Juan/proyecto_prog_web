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

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Code2, Trophy, Flame, Activity } from 'lucide-react';
import { Avatar } from '@/components/domain/Avatar';
import { StatCard } from '@/components/domain/StatCard';
import { ProgressBar } from '@/components/domain/ProgressBar';
import { NotificationItem } from '@/components/domain/NotificationItem';
import { DashChallengeItem } from '@/components/domain/DashChallengeItem';
import { DeleteChallengeModal } from '@/components/domain/DeleteChallengeModal';
import { EmptyState } from '@/components/feedback/EmptyState';
import { Spinner } from '@/components/feedback/Spinner';
import { DecorativeBlobs } from '@/components/branding/DecorativeBlobs';
import { GridPattern } from '@/components/branding/GridPattern';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import * as dashService from '@/services/dashboard';
import type { DashboardStats, ProgressItem, Notification, Challenge } from '@/types';

export default function DashboardPage() {
  useDocumentTitle('Dashboard');
  const { user } = useAuth();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [myChallenges, setMyChallenges] = useState<Challenge[]>([]);
  const [solved, setSolved] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  /** Desafío seleccionado para confirmar eliminación */
  const [toDelete, setToDelete] = useState<Challenge | null>(null);

  // Carga todos los datos del dashboard en paralelo
  useEffect(() => {
    setLoading(true);
    Promise.all([
      dashService.getStats(),
      dashService.getDashboardChallenges(),
      dashService.getSolvedChallenges(),
      dashService.getProgress(),
      dashService.getNotifications(),
    ])
      .then(([s, mc, sv, pr, nt]) => {
        setStats(s);
        setMyChallenges(mc);
        setSolved(sv);
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
      <section className="relative py-12 px-4 overflow-hidden bg-zinc-50 dark:bg-dark-900 border-b border-zinc-200 dark:border-dark-600">
        <DecorativeBlobs variant="pageHeader" />
        <GridPattern />
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
            <Link
              to="/challenges/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity shrink-0"
            >
              <Plus size={16} /> Crear Desafío
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* ===== ESTADÍSTICAS ===== */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Code2 size={22} />}  label="Creados"      value={stats.challengesCreated} color="primary" />
            <StatCard icon={<Trophy size={22} />}  label="Resueltos"    value={stats.solved}            color="accent"  />
            <StatCard icon={<Flame size={22} />}   label="Días seguidos" value={stats.currentStreak}   color="violet"  />
            <StatCard icon={<Activity size={22} />} label="Interacciones" value={stats.interactions}   color="amber"   />
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
                  action={{ label: 'Crear desafío', onClick: () => {} }}
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

            {/* Desafíos Resueltos */}
            <div className="bg-white dark:bg-dark-800 rounded-2xl border border-zinc-200 dark:border-dark-600 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-zinc-900 dark:text-white">Resueltos</h2>
                <span className="text-xs text-zinc-400">{solved.length} total</span>
              </div>
              {solved.length === 0 ? (
                <EmptyState
                  icon={<Trophy size={36} />}
                  title="Aún sin resolver"
                  description="Explora los desafíos y resuelve tus primeros problemas."
                  action={{ label: 'Explorar desafíos', onClick: () => {} }}
                />
              ) : (
                <div>
                  {solved.map((c) => (
                    <DashChallengeItem key={c.id} challenge={c} variant="solved" />
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

      {/* Modal de confirmación de eliminación */}
      <DeleteChallengeModal
        challenge={toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={handleDeleted}
      />
    </div>
  );
}
