/**
 * Hook que encapsula todo el estado de filtrado, búsqueda, ordenación
 * y paginación del listado de desafíos.
 * Usa un AbortController interno para cancelar peticiones obsoletas
 * cuando el usuario cambia los filtros rápidamente (evita race conditions).
 *
 * @returns Estado completo del listado y funciones para modificar cada filtro.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import * as challengeService from '@/services/challenges';
import { useDebouncedValue } from './useDebouncedValue';
import type { Challenge, ChallengeDifficulty, ChallengeSort, Paginated } from '@/types';

const PAGE_SIZE = 9;

export interface UseChallengesReturn {
  items: Challenge[];
  total: number;
  totalPages: number;
  page: number;
  loading: boolean;
  error: string | null;
  searchTerm: string;
  difficulty: ChallengeDifficulty | 'all';
  sort: ChallengeSort;
  view: 'grid' | 'list';
  setSearchTerm: (v: string) => void;
  setDifficulty: (v: ChallengeDifficulty | 'all') => void;
  setSort: (v: ChallengeSort) => void;
  setView: (v: 'grid' | 'list') => void;
  setPage: (v: number) => void;
  /** Recarga los datos con los filtros actuales */
  refresh: () => void;
}

export function useChallenges(): UseChallengesReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | 'all'>('all');
  const [sort, setSort] = useState<ChallengeSort>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [result, setResult] = useState<Paginated<Challenge>>({
    items: [], total: 0, page: 1, pageSize: PAGE_SIZE, totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Referencia al AbortController para cancelar peticiones en vuelo
  const abortRef = useRef<AbortController | null>(null);

  // Debouncear el texto de búsqueda (300ms) para evitar peticiones por cada keystroke
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // Resetear página a 1 cuando cambian los filtros de búsqueda/dificultad/sort
  useEffect(() => { setPage(1); }, [debouncedSearch, difficulty, sort]);

  /**
   * Carga el listado de desafíos con los filtros y paginación actuales.
   * Cancela la petición anterior si aún está en vuelo.
   */
  const load = useCallback(async () => {
    // Cancelar petición anterior
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    const { signal } = abortRef.current;

    setLoading(true);
    setError(null);
    try {
      const data = await challengeService.list({
        search: debouncedSearch,
        difficulty,
        sort,
        page,
        pageSize: PAGE_SIZE,
      });
      if (!signal.aborted) setResult(data);
    } catch (err) {
      if (!signal.aborted) setError(err instanceof Error ? err.message : 'Error al cargar desafíos');
    } finally {
      if (!signal.aborted) setLoading(false);
    }
  }, [debouncedSearch, difficulty, sort, page]);

  useEffect(() => { void load(); }, [load]);

  return {
    items: result.items,
    total: result.total,
    totalPages: result.totalPages,
    page: result.page,
    loading,
    error,
    searchTerm,
    difficulty,
    sort,
    view,
    setSearchTerm,
    setDifficulty,
    setSort,
    setView,
    setPage,
    refresh: load,
  };
}
