/**
 * Servicio de desafíos (mock).
 * Simula los endpoints de /challenges/* del backend documentado.
 * Todas las mutaciones operan sobre `mockChallenges` en memoria,
 * por lo que los cambios persisten solo durante la sesión del navegador.
 *
 * Para migrar a la API real, reemplaza cada función por `http.get/post/put/delete(...)`.
 * El contrato de tipos ya está alineado con el backend documentado.
 */

import { randomDelay } from '@/lib/delay';
import { mockChallenges } from '@/data/mockChallenges';
import { getCurrentUser } from './auth';
import type { Challenge, ChallengeFilter, ChallengePayload, Paginated } from '@/types';

/** Clon del array original para no afectar el módulo de datos */
const challenges: Challenge[] = [...mockChallenges];

/**
 * Simula GET /challenges/list.
 * Aplica búsqueda, filtro de dificultad, ordenación y paginación.
 *
 * @param filter - Opciones de filtro y paginación.
 * @returns Promesa con el resultado paginado de desafíos.
 */
export async function list(filter: ChallengeFilter = {}): Promise<Paginated<Challenge>> {
  await randomDelay(400, 800);

  const {
    search = '',
    difficulty = 'all',
    sort = 'newest',
    page = 1,
    pageSize = 9,
  } = filter;

  let result = [...challenges];

  // Filtro por dificultad
  if (difficulty !== 'all') {
    result = result.filter((c) => c.difficulty === difficulty);
  }

  // Búsqueda por texto (título o descripción)
  if (search.trim()) {
    const q = search.trim().toLowerCase();
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }

  // Ordenación
  switch (sort) {
    case 'newest':
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'popular':
      result.sort((a, b) => b.solutionsCount - a.solutionsCount);
      break;
    case 'az':
      result.sort((a, b) => a.title.localeCompare(b.title, 'es'));
      break;
  }

  // Paginación
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  const items = result.slice(start, start + pageSize);

  return { items, total, page: safePage, pageSize, totalPages };
}

/**
 * Obtiene un desafío por su ID.
 * Simula GET /challenges/:id (endpoint no documentado pero necesario para el edit form).
 *
 * @param id - Identificador del desafío.
 * @returns Promesa con el desafío encontrado.
 * @throws Error si no se encuentra el desafío.
 */
export async function getById(id: string): Promise<Challenge> {
  await randomDelay(300, 600);
  const challenge = challenges.find((c) => c.id === id);
  if (!challenge) throw new Error('Desafío no encontrado');
  return { ...challenge };
}

/**
 * Crea un nuevo desafío. Simula POST /challenges/create.
 *
 * @param payload - Datos del nuevo desafío.
 * @returns Promesa con el desafío creado (incluyendo id y metadatos generados).
 * @throws Error si el usuario no está autenticado.
 */
export async function create(payload: ChallengePayload): Promise<Challenge> {
  await randomDelay(600, 1100);

  const user = getCurrentUser();
  if (!user) throw new Error('Debes iniciar sesión para crear un desafío');

  const CATEGORY_LABELS: Record<string, string> = {
    arrays: 'Arreglos', strings: 'Cadenas', linkedlist: 'Listas Enlazadas',
    trees: 'Árboles', graphs: 'Grafos', dp: 'Prog. Dinámica',
    sorting: 'Ordenamiento', stacks: 'Pilas',
  };

  const newChallenge: Challenge = {
    id: `u-${Date.now()}`,
    title: payload.title.trim(),
    description: payload.description.trim(),
    difficulty: payload.difficulty,
    category: payload.category ?? 'arrays',
    categoryLabel: CATEGORY_LABELS[payload.category ?? 'arrays'] ?? 'Arreglos',
    tags: payload.tags,
    codeTemplate: payload.codeTemplate,
    authorId: user.id,
    authorName: user.name,
    authorInitials: user.initials,
    createdAt: new Date().toISOString(),
    solutionsCount: 0,
    successRate: 0,
  };

  challenges.unshift(newChallenge);
  return { ...newChallenge };
}

/**
 * Edita un desafío existente. Simula PUT /challenges/edit/:id.
 *
 * @param id - ID del desafío a editar.
 * @param payload - Campos actualizados del desafío.
 * @returns Promesa con el desafío actualizado.
 * @throws Error si el desafío no existe o el usuario no es el propietario.
 */
export async function update(id: string, payload: ChallengePayload): Promise<Challenge> {
  await randomDelay(600, 1000);

  const user = getCurrentUser();
  const idx = challenges.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Desafío no encontrado');
  if (challenges[idx].authorId !== user?.id) {
    throw new Error('No tienes permiso para editar este desafío');
  }

  const CATEGORY_LABELS: Record<string, string> = {
    arrays: 'Arreglos', strings: 'Cadenas', linkedlist: 'Listas Enlazadas',
    trees: 'Árboles', graphs: 'Grafos', dp: 'Prog. Dinámica',
    sorting: 'Ordenamiento', stacks: 'Pilas',
  };

  const updated: Challenge = {
    ...challenges[idx],
    title: payload.title.trim(),
    description: payload.description.trim(),
    difficulty: payload.difficulty,
    category: payload.category ?? challenges[idx].category,
    categoryLabel: CATEGORY_LABELS[payload.category ?? challenges[idx].category] ?? challenges[idx].categoryLabel,
    tags: payload.tags,
    codeTemplate: payload.codeTemplate,
  };

  challenges[idx] = updated;
  return { ...updated };
}

/**
 * Elimina un desafío. Simula DELETE /challenges/delete/:id.
 *
 * @param id - ID del desafío a eliminar.
 * @throws Error si el desafío no existe o el usuario no es el propietario.
 */
export async function remove(id: string): Promise<void> {
  await randomDelay(400, 800);

  const user = getCurrentUser();
  const idx = challenges.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error('Desafío no encontrado');
  if (challenges[idx].authorId !== user?.id) {
    throw new Error('No tienes permiso para eliminar este desafío');
  }

  challenges.splice(idx, 1);
}

/**
 * Retorna los desafíos creados por el usuario actual.
 * @returns Promesa con el array de desafíos del usuario.
 */
export async function getMyChallenges(): Promise<Challenge[]> {
  await randomDelay(300, 600);
  const user = getCurrentUser();
  if (!user) return [];
  return challenges.filter((c) => c.authorId === user.id).map((c) => ({ ...c }));
}
