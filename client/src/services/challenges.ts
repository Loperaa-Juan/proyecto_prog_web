import { getCurrentUser } from './auth';
import { http } from './http';
import type { Challenge, ChallengeFilter, ChallengePayload, Paginated } from '@/types';

interface BackendChallenge {
  Challengeid: string;
  Userid: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  arrays: 'Arreglos', strings: 'Cadenas', linkedlist: 'Listas Enlazadas',
  trees: 'Árboles', graphs: 'Grafos', dp: 'Prog. Dinámica',
  sorting: 'Ordenamiento', stacks: 'Pilas',
};

export async function list(_filter: ChallengeFilter = {}): Promise<Paginated<Challenge>> {
  return { items: [], total: 0, page: 1, pageSize: 9, totalPages: 1 };
}

export async function getById(_id: string): Promise<Challenge> {
  throw new Error('Endpoint no disponible aún');
}

export async function create(payload: ChallengePayload): Promise<Challenge> {
  const user = getCurrentUser();
  if (!user) throw new Error('Debes iniciar sesión para crear un desafío');

  const form = new FormData();
  form.append('title', payload.title.trim());
  form.append('description', payload.description.trim());
  form.append('difficulty', payload.difficulty);
  payload.tags.forEach((tag) => form.append('tags', tag));

  const data = await http.postForm<BackendChallenge>('/challenge', form);

  const cat = payload.category ?? 'arrays';
  return {
    id: String(data.Challengeid),
    title: data.title,
    description: data.description,
    difficulty: data.difficulty,
    category: cat,
    categoryLabel: CATEGORY_LABELS[cat] ?? 'Arreglos',
    tags: data.tags,
    codeTemplate: payload.codeTemplate,
    authorId: user.id,
    authorName: user.name,
    authorInitials: user.initials,
    createdAt: data.created_at,
    solutionsCount: 0,
    successRate: 0,
  };
}

export async function update(_id: string, _payload: ChallengePayload): Promise<Challenge> {
  throw new Error('Endpoint no disponible aún');
}

export async function remove(_id: string): Promise<void> {
  throw new Error('Endpoint no disponible aún');
}

export async function getMyChallenges(): Promise<Challenge[]> {
  return [];
}
