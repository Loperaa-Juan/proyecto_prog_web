import { useCallback, useEffect, useMemo, useState } from 'react';
import * as challengeService from '@/services/challenges';
import { useDebouncedValue } from './useDebouncedValue';
import type { Challenge, ChallengeDifficulty, ChallengeSort } from '@/types';

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
  refresh: () => void;
}

export function useChallenges(): UseChallengesReturn {
  const [searchTerm, setSearchTerm] = useState('');
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | 'all'>('all');
  const [sort, setSort] = useState<ChallengeSort>('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cache completo de desafíos traído del backend (no vuelve a pedir en cada filtro)
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([]);
  const [fetchTick, setFetchTick] = useState(0);

  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => { setPage(1); }, [debouncedSearch, difficulty, sort]);

  // Petición al backend — solo al montar o al llamar refresh()
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    challengeService
      .getAll()
      .then((items) => {
        if (!cancelled) {
          setAllChallenges(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar desafíos');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [fetchTick]);

  // Filtrado, ordenación y paginación en memoria
  const { items, total, totalPages } = useMemo(() => {
    let filtered = allChallenges;

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      filtered = filtered.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
      );
    }

    if (difficulty !== 'all') {
      filtered = filtered.filter((c) => c.difficulty === difficulty);
    }

    const sorted = [...filtered];
    switch (sort) {
      case 'az':      sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'oldest':  sorted.sort((a, b) => a.createdAt.localeCompare(b.createdAt)); break;
      default:        sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    }

    const total = sorted.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;

    return { items: sorted.slice(start, start + PAGE_SIZE), total, totalPages };
  }, [allChallenges, debouncedSearch, difficulty, sort, page]);

  const refresh = useCallback(() => setFetchTick((n) => n + 1), []);

  return {
    items,
    total,
    totalPages,
    page,
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
    refresh,
  };
}
