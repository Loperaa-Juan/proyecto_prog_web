/**
 * Página de listado de desafíos.
 * Incluye un header con estadísticas, una toolbar de filtros y el grid/lista de desafíos.
 * Todo el estado de filtros, búsqueda, ordenación y paginación se maneja con useChallenges.
 *
 * Comportamiento:
 * - Búsqueda en tiempo real (debounceada 300ms en el hook).
 * - Filtro por dificultad con pastillas.
 * - Ordenación por nuevos/antiguos/populares/A-Z.
 * - Toggle entre vista grid y lista.
 * - Paginación real con AbortController para evitar race conditions.
 */

import { Link } from 'react-router-dom';
import { Plus, Code2 } from 'lucide-react';
import { SearchBox } from '@/components/listing/SearchBox';
import { FilterPills } from '@/components/listing/FilterPills';
import { SortSelect } from '@/components/listing/SortSelect';
import { ViewToggle } from '@/components/listing/ViewToggle';
import { Pagination } from '@/components/listing/Pagination';
import { ChallengeCardLg } from '@/components/domain/ChallengeCardLg';
import { EmptyState } from '@/components/feedback/EmptyState';
import { DecorativeBlobs } from '@/components/branding/DecorativeBlobs';
import { GridPattern } from '@/components/branding/GridPattern';
import { Spinner } from '@/components/feedback/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useChallenges } from '@/hooks/useChallenges';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { cn } from '@/lib/classNames';

export default function ChallengesPage() {
  useDocumentTitle('Desafíos');
  const { isAuthenticated } = useAuth();
  const {
    items, total, totalPages, page,
    loading, searchTerm, difficulty, sort, view,
    setSearchTerm, setDifficulty, setSort, setView, setPage,
  } = useChallenges();

  return (
    <div>
      {/* ===== HEADER DE PÁGINA ===== */}
      <section className="relative py-14 px-4 overflow-hidden bg-zinc-50 dark:bg-dark-900 border-b border-zinc-200 dark:border-dark-600">
        <DecorativeBlobs variant="pageHeader" />
        <GridPattern />
        <div className="relative z-10 max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-400 text-xs font-medium mb-3">
              <Code2 size={12} />
              Explorar desafíos
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Desafíos de programación
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-base">
              {total > 0 ? `${total} desafíos disponibles` : 'Busca y filtra entre los desafíos'}
            </p>
          </div>

          {isAuthenticated && (
            <Link
              to="/challenges/new"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity shrink-0"
            >
              <Plus size={16} /> Crear desafío
            </Link>
          )}
        </div>
      </section>

      {/* ===== TOOLBAR ===== */}
      <div className="sticky top-16 z-30 bg-white/95 dark:bg-dark-900/95 backdrop-blur-sm border-b border-zinc-200 dark:border-dark-600 px-4 py-3">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3">
          {/* Búsqueda */}
          <div className="w-full sm:w-72">
            <SearchBox value={searchTerm} onChange={setSearchTerm} />
          </div>

          {/* Filtros de dificultad */}
          <div className="flex-1 overflow-x-auto pb-1 sm:pb-0">
            <FilterPills active={difficulty} onChange={setDifficulty} />
          </div>

          {/* Ordenación y vista */}
          <div className="flex items-center gap-2 shrink-0">
            <SortSelect value={sort} onChange={setSort} />
            <ViewToggle view={view} onChange={setView} />
          </div>
        </div>
      </div>

      {/* ===== CONTENIDO ===== */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Contador de resultados */}
        {!loading && (
          <p className="text-sm text-zinc-400 dark:text-zinc-500 mb-5">
            Mostrando {items.length} de {total} desafíos
            {searchTerm && ` para "${searchTerm}"`}
          </p>
        )}

        {/* Estado de carga */}
        {loading && (
          <div className="flex justify-center py-16">
            <Spinner size={32} className="border-primary-500 border-t-transparent" />
          </div>
        )}

        {/* Estado vacío */}
        {!loading && items.length === 0 && (
          <EmptyState
            icon={<Code2 size={48} />}
            title="Sin resultados"
            description="No hay desafíos que coincidan con tus filtros. Prueba con otros criterios de búsqueda."
          />
        )}

        {/* Grid / Lista de tarjetas */}
        {!loading && items.length > 0 && (
          <div
            className={cn(
              'gap-5',
              view === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                : 'flex flex-col',
            )}
          >
            {items.map((challenge) => (
              <ChallengeCardLg
                key={challenge.id}
                challenge={challenge}
                viewMode={view}
              />
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
}
