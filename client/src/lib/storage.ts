/**
 * Helpers tipados para interactuar con localStorage de forma segura.
 * Envuelve todas las operaciones en try/catch para manejar el modo
 * privado de Safari y otros entornos que bloquean el acceso.
 */

/**
 * Lee y parsea un valor JSON desde localStorage.
 * @param key - Clave de localStorage a leer.
 * @returns El valor parseado o null si no existe o falla.
 */
export function getJSON<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Serializa un valor como JSON y lo guarda en localStorage.
 * @param key - Clave de localStorage donde guardar.
 * @param value - Valor a serializar y guardar.
 */
export function setJSON<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silencia el error en entornos que bloquean localStorage (Safari privado)
  }
}

/**
 * Elimina una entrada de localStorage.
 * @param key - Clave a eliminar.
 */
export function removeItem(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // Silencia el error
  }
}

/** Claves de localStorage usadas en la aplicación */
export const STORAGE_KEYS = {
  THEME: 'complexitylab-theme',
  TOKEN: 'complexitylab-token',
  USER: 'complexitylab-user',
} as const;
