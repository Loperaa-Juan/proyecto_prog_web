/**
 * Servicio de autenticación (mock).
 * Simula los endpoints POST /users/login y POST /users/register del backend.
 * Para migrar a la API real, reemplaza cada implementación de función
 * por `http.post(...)` del módulo http.ts.
 *
 * Persistencia: guarda el token en localStorage["complexitylab-token"]
 * y el usuario en localStorage["complexitylab-user"].
 */

import { randomDelay } from '@/lib/delay';
import { getJSON, setJSON, removeItem, STORAGE_KEYS } from '@/lib/storage';
import type { AuthCredentials, RegisterPayload, AuthSession, User } from '@/types';

/** Base de datos de usuarios mockeados en memoria */
interface StoredUser extends User {
  passwordHash: string; // En el mock guardamos la contraseña en claro (¡no hacer en prod!)
}
const mockUsers: StoredUser[] = [
  {
    id: 'u-1',
    name: 'Juan David Berrio',
    username: 'juandavid',
    email: 'juan@example.com',
    initials: 'JD',
    level: 'Avanzado',
    joinedAt: '2025-01-15T00:00:00.000Z',
    passwordHash: 'password123',
  },
];

/**
 * Simula el endpoint POST /users/login.
 * Valida las credenciales contra los usuarios mockeados.
 *
 * @param credentials - Email y contraseña del usuario.
 * @returns Promesa con la sesión autenticada (token + user).
 * @throws Error si las credenciales son inválidas.
 */
export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  await randomDelay(700, 1100);

  const user = mockUsers.find((u) => u.email === credentials.email);
  if (!user || user.passwordHash !== credentials.password) {
    throw new Error('Correo o contraseña incorrectos');
  }

  const session: AuthSession = {
    token: `mock-token-${user.id}-${Date.now()}`,
    user: {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      initials: user.initials,
      level: user.level,
      joinedAt: user.joinedAt,
    },
  };

  setJSON(STORAGE_KEYS.TOKEN, session.token);
  setJSON(STORAGE_KEYS.USER, session);
  return session;
}

/**
 * Simula el endpoint POST /users/register.
 * Crea un nuevo usuario si el email no está en uso.
 *
 * @param payload - Datos de registro: nombre, email y contraseña.
 * @returns Promesa con la sesión del nuevo usuario.
 * @throws Error si el email ya está registrado.
 */
export async function register(payload: RegisterPayload): Promise<AuthSession> {
  await randomDelay(800, 1200);

  if (mockUsers.some((u) => u.email === payload.email)) {
    throw new Error('El correo ya está registrado');
  }

  const nameParts = payload.name.trim().split(' ');
  const initials = nameParts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');

  const newUser: StoredUser = {
    id: `u-${Date.now()}`,
    name: payload.name.trim(),
    username: payload.name.trim().toLowerCase().replace(/\s+/g, ''),
    email: payload.email.trim().toLowerCase(),
    initials,
    level: 'Principiante',
    joinedAt: new Date().toISOString(),
    passwordHash: payload.password,
  };

  mockUsers.push(newUser);

  const session: AuthSession = {
    token: `mock-token-${newUser.id}-${Date.now()}`,
    user: {
      id: newUser.id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      initials: newUser.initials,
      level: newUser.level,
      joinedAt: newUser.joinedAt,
    },
  };

  setJSON(STORAGE_KEYS.TOKEN, session.token);
  setJSON(STORAGE_KEYS.USER, session);
  return session;
}

/**
 * Cierra la sesión eliminando el token y el usuario de localStorage.
 */
export function logout(): void {
  removeItem(STORAGE_KEYS.TOKEN);
  removeItem(STORAGE_KEYS.USER);
}

/**
 * Obtiene el token JWT guardado en localStorage, o null si no hay sesión.
 * @returns El token de acceso o null.
 */
export function getToken(): string | null {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  return session?.token ?? null;
}

/**
 * Comprueba si el usuario tiene una sesión activa (token guardado).
 * @returns true si hay un token en localStorage.
 */
export function isAuthenticated(): boolean {
  return getToken() !== null;
}

/**
 * Retorna el usuario actual desde localStorage, o null si no hay sesión.
 * @returns El objeto User o null.
 */
export function getCurrentUser(): User | null {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  return session?.user ?? null;
}
