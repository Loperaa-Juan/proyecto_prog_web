/**
 * Scaffold de cliente HTTP tipado para cuando el backend esté implementado.
 * Actualmente no se usa: los servicios retornan datos mockeados.
 *
 * Para migrar a llamadas reales, importa este módulo en los servicios
 * y reemplaza cada `return randomDelay().then(...)` por `http.get/post/put/delete(...)`.
 *
 * El proxy de Vite (o nginx en producción) mapea /api → http://localhost:8000
 */

import { getJSON, STORAGE_KEYS } from '@/lib/storage';
import type { AuthSession } from '@/types';

const BASE_URL = '/api';

/**
 * Realiza una petición HTTP tipada al backend.
 * Adjunta automáticamente el header Authorization si hay un token guardado.
 *
 * @param method - Método HTTP (GET, POST, PUT, DELETE).
 * @param path - Ruta relativa a /api (ej: '/users/login').
 * @param body - Cuerpo de la petición (opcional, se serializa como JSON).
 * @returns Promesa con la respuesta deserializada del tipo T.
 */
async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (session?.token) {
    headers['Authorization'] = `Bearer ${session.token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message ?? 'Error de servidor');
  }

  return res.json() as Promise<T>;
}

/** Métodos HTTP exportados listos para usar en los servicios */
export const http = {
  /** @param path - Ruta relativa. @returns Respuesta deserializada. */
  get: <T>(path: string) => request<T>('GET', path),
  /** @param path - Ruta relativa. @param body - Cuerpo JSON. @returns Respuesta deserializada. */
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  /** @param path - Ruta relativa. @param body - Cuerpo JSON. @returns Respuesta deserializada. */
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  /** @param path - Ruta relativa. @returns Respuesta deserializada. */
  delete: <T>(path: string) => request<T>('DELETE', path),
};
