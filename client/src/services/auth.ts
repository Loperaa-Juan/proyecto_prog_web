import { getJSON, setJSON, removeItem, STORAGE_KEYS } from '@/lib/storage';
import type { AuthCredentials, RegisterPayload, AuthSession, User } from '@/types';

const BASE_URL = '/api';

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface UserMeResponse {
  Userid: string;
  username: string;
  email: string;
  full_name: string;
}

function extractApiError(err: unknown): string {
  if (!err || typeof err !== 'object') return 'Error desconocido';
  const e = err as Record<string, unknown>;
  if (Array.isArray(e.detail)) {
    const msg = (e.detail[0] as Record<string, unknown>)?.msg;
    return String(msg ?? 'Error de validación').replace(/^Value error,\s*/i, '');
  }
  return String(e.detail ?? 'Error del servidor');
}

function buildUser(me: UserMeResponse): User {
  const displayName = me.full_name || me.username;
  const nameParts = displayName.trim().split(/\s+/);
  const initials = nameParts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('') || displayName[0].toUpperCase();

  return {
    id: me.Userid,
    name: displayName,
    username: me.username,
    email: me.email,
    initials,
    level: 'Principiante',
    joinedAt: new Date().toISOString(),
  };
}

export async function login(credentials: AuthCredentials): Promise<AuthSession> {
  const formData = new URLSearchParams();
  formData.append('username', credentials.email.trim().toLowerCase());
  formData.append('password', credentials.password);

  const tokenRes = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formData.toString(),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.json().catch(() => ({}));
    throw new Error(extractApiError(err) || 'Correo o contraseña incorrectos');
  }

  const { access_token }: TokenResponse = await tokenRes.json();

  const meRes = await fetch(`${BASE_URL}/users/me`, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  if (!meRes.ok) {
    throw new Error('No se pudo obtener la información del usuario');
  }

  const me: UserMeResponse = await meRes.json();
  const user = buildUser(me);
  const session: AuthSession = { token: access_token, user };

  setJSON(STORAGE_KEYS.TOKEN, access_token);
  setJSON(STORAGE_KEYS.USER, session);
  return session;
}

export async function register(payload: RegisterPayload): Promise<void> {
  const res = await fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: payload.username.trim().toLowerCase(),
      full_name: payload.name.trim(),
      email: payload.email.trim().toLowerCase(),
      password_hash: payload.password,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(extractApiError(err) || 'Error al crear la cuenta');
  }
}

export function logout(): void {
  removeItem(STORAGE_KEYS.TOKEN);
  removeItem(STORAGE_KEYS.USER);
}

export function getToken(): string | null {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  return session?.token ?? null;
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

export function getCurrentUser(): User | null {
  const session = getJSON<AuthSession>(STORAGE_KEYS.USER);
  return session?.user ?? null;
}
