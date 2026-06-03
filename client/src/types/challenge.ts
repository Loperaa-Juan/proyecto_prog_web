/**
 * Tipos relacionados con los desafíos de programación.
 * Incluye la entidad Challenge y los tipos de filtrado/ordenación para el listado.
 */

/** Nivel de dificultad de un desafío */
export type ChallengeDifficulty = 'easy' | 'medium' | 'hard';

/** Orden de visualización en el listado de desafíos */
export type ChallengeSort = 'newest' | 'oldest' | 'popular' | 'az';

/** Categoría temática del desafío */
export type ChallengeCategory =
  | 'arrays'
  | 'strings'
  | 'linkedlist'
  | 'trees'
  | 'graphs'
  | 'dp'
  | 'sorting'
  | 'stacks';

/** Representa un desafío de programación completo */
export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  /** Etiqueta legible para la categoría (ej: "Arreglos", "Árboles") */
  categoryLabel: string;
  tags: string[];
  codeTemplate?: string;
  authorId: string;
  authorName: string;
  authorInitials: string;
  createdAt: string; // ISO 8601
  solutionsCount: number;
  successRate: number; // 0..100
}

/** Parámetros de filtro para el listado de desafíos */
export interface ChallengeFilter {
  search?: string;
  difficulty?: ChallengeDifficulty | 'all';
  sort?: ChallengeSort;
  page?: number;
  pageSize?: number;
}

/** Payload para crear o editar un desafío */
export interface ChallengePayload {
  title: string;
  description: string;
  difficulty: ChallengeDifficulty;
  category?: ChallengeCategory;
  tags: string[];
  codeTemplate?: string;
}
