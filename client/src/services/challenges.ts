import { getCurrentUser } from "./auth";
import { http } from "./http";
import type {
  Challenge,
  ChallengeFilter,
  ChallengePayload,
  Paginated,
} from "@/types";

interface BackendChallenge {
  Challengeid: string;
  Userid: string;
  title: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[] | null;
  status?: string;
  created_at: string;
  updated_at?: string;
  creator_name?: string | null;
}

interface BackendMyChallenge {
  id: string;
  titulo: string;
  contenido: string;
  dificultad: "easy" | "medium" | "hard";
}

const CATEGORY_LABELS: Record<string, string> = {
  arrays: "Arreglos",
  strings: "Cadenas",
  linkedlist: "Listas Enlazadas",
  trees: "Árboles",
  graphs: "Grafos",
  dp: "Prog. Dinámica",
  sorting: "Ordenamiento",
  stacks: "Pilas",
};

function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

function mapBackendChallenge(item: BackendChallenge): Challenge {
  const authorName = item.creator_name ?? "";
  return {
    id: String(item.Challengeid),
    title: item.title,
    description: item.description,
    difficulty: item.difficulty,
    category: "arrays",
    categoryLabel: "Arreglos",
    tags: item.tags ?? [],
    authorId: String(item.Userid),
    authorName,
    authorInitials: authorName ? toInitials(authorName) : "",
    createdAt: item.created_at,
    solutionsCount: 0,
    successRate: 0,
  };
}

export async function list(
  filter: ChallengeFilter = {},
): Promise<Paginated<Challenge>> {
  const raw = await http.get<BackendChallenge[]>("/challenges");
  let items = raw.map(mapBackendChallenge);

  if (filter.search) {
    const q = filter.search.toLowerCase();
    items = items.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q),
    );
  }

  if (filter.difficulty && filter.difficulty !== "all") {
    items = items.filter((c) => c.difficulty === filter.difficulty);
  }

  switch (filter.sort) {
    case "az":
      items.sort((a, b) => a.title.localeCompare(b.title));
      break;
    case "oldest":
      items.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      break;
    default:
      items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const page = filter.page ?? 1;
  const pageSize = filter.pageSize ?? 9;
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = (page - 1) * pageSize;

  return {
    items: items.slice(start, start + pageSize),
    total,
    page,
    pageSize,
    totalPages,
  };
}

export async function getById(id: string): Promise<Challenge> {
  const data = await http.get<BackendChallenge>(`/challenge/${id}`);
  return mapBackendChallenge(data);
}

export async function create(payload: ChallengePayload): Promise<Challenge> {
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para crear un desafío");

  const form = new FormData();
  form.append("title", payload.title.trim());
  form.append("description", payload.description.trim());
  form.append("difficulty", payload.difficulty);
  payload.tags.forEach((tag) => form.append("tags", tag));

  const data = await http.postForm<BackendChallenge>("/challenges", form);

  const cat = payload.category ?? "arrays";
  return {
    id: String(data.Challengeid),
    title: data.title,
    description: data.description,
    difficulty: data.difficulty,
    category: cat,
    categoryLabel: CATEGORY_LABELS[cat] ?? "Arreglos",
    tags: data.tags ?? [],
    codeTemplate: payload.codeTemplate,
    authorId: user.id,
    authorName: user.name,
    authorInitials: user.initials,
    createdAt: data.created_at,
    solutionsCount: 0,
    successRate: 0,
  };
}

export async function update(
  id: string,
  payload: ChallengePayload,
): Promise<Challenge> {
  const user = getCurrentUser();
  if (!user) throw new Error("Debes iniciar sesión para editar un desafío");

  const form = new FormData();
  form.append("title", payload.title.trim());
  form.append("description", payload.description.trim());
  form.append("difficulty", payload.difficulty);
  payload.tags.forEach((tag) => form.append("tags", tag));

  const data = await http.putForm<BackendChallenge>(`/challenge/${id}`, form);

  const cat = payload.category ?? "arrays";
  return {
    ...mapBackendChallenge(data),
    category: cat,
    categoryLabel: CATEGORY_LABELS[cat] ?? "Arreglos",
    codeTemplate: payload.codeTemplate,
    authorName: user.name,
    authorInitials: user.initials,
  };
}

export async function remove(id: string): Promise<void> {
  await http.delete<void>(`/challenges/${id}`);
}

export async function getMyChallenges(): Promise<Challenge[]> {
  const user = getCurrentUser();
  if (!user) return [];

  try {
    const data = await http.get<BackendMyChallenge[]>("/challenges/me");
    return data.map((item) => ({
      id: String(item.id),
      title: item.titulo,
      description: item.contenido,
      difficulty: item.dificultad,
      category: "arrays" as const,
      categoryLabel: "Arreglos",
      tags: [],
      authorId: user.id,
      authorName: user.name,
      authorInitials: user.initials,
      createdAt: new Date().toISOString(),
      solutionsCount: 0,
      successRate: 0,
    }));
  } catch {
    return [];
  }
}
