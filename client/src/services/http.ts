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
function extractError(err: Record<string, unknown>, fallback: string): string {
  if (typeof err.detail === 'string') return err.detail;
  if (Array.isArray(err.detail)) return String((err.detail[0] as Record<string, unknown>)?.msg ?? fallback);
  if (typeof err.message === 'string') return err.message;
  return fallback;
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (session?.token) headers['Authorization'] = `Bearer ${session.token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as Record<string, unknown>));
    throw new Error(extractError(err, res.statusText));
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}

async function requestForm<T>(method: string, path: string, form: FormData): Promise<T> {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  const headers: Record<string, string> = {};
  if (session?.token) headers['Authorization'] = `Bearer ${session.token}`;

  const res = await fetch(`${BASE_URL}${path}`, { method, headers, body: form });

  if (!res.ok) {
    const err = await res.json().catch(() => ({} as Record<string, unknown>));
    throw new Error(extractError(err, res.statusText));
  }

  return res.json() as Promise<T>;
}

/** Métodos HTTP exportados listos para usar en los servicios */
export const http = {
  get: <T>(path: string) => request<T>('GET', path),
  post: <T>(path: string, body: unknown) => request<T>('POST', path, body),
  put: <T>(path: string, body: unknown) => request<T>('PUT', path, body),
  delete: <T>(path: string) => request<T>('DELETE', path),
  postForm: <T>(path: string, form: FormData) => requestForm<T>('POST', path, form),
  putForm: <T>(path: string, form: FormData) => requestForm<T>('PUT', path, form),
};
