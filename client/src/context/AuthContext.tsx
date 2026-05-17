/**
 * Contexto de autenticación de la aplicación.
 * Gestiona el estado del usuario autenticado, el login, el registro y el logout.
 * Hidrata el estado inicial desde localStorage para mantener la sesión entre recargas.
 *
 * Uso: envuelve la app con <AuthProvider> y consume con useAuth().
 */

import { createContext, useCallback, useEffect, useState } from 'react';
import * as authService from '@/services/auth';
import type { AuthCredentials, RegisterPayload, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  /**
   * Inicia sesión con email y contraseña.
   * @throws Error si las credenciales son inválidas.
   */
  login: (credentials: AuthCredentials) => Promise<void>;
  /**
   * Registra un nuevo usuario.
   * @throws Error si el email ya está en uso.
   */
  register: (payload: RegisterPayload) => Promise<void>;
  /** Cierra la sesión del usuario actual. */
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Proveedor del contexto de autenticación.
 * Hidrata el estado del usuario desde localStorage al montar el componente.
 *
 * @param children - Componentes hijos que tendrán acceso al estado de auth.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Hidrata el estado inicial desde localStorage
  useEffect(() => {
    const current = authService.getCurrentUser();
    if (current) setUser(current);
  }, []);

  /**
   * Llama al servicio de login y actualiza el estado del usuario.
   * @param credentials - Email y contraseña del usuario.
   */
  const login = useCallback(async (credentials: AuthCredentials) => {
    setLoading(true);
    try {
      const session = await authService.login(credentials);
      setUser(session.user);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Llama al servicio de registro y actualiza el estado del usuario.
   * @param payload - Datos de registro (nombre, email, contraseña).
   */
  const register = useCallback(async (payload: RegisterPayload) => {
    setLoading(true);
    try {
      await authService.register(payload);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cierra la sesión: limpia localStorage y resetea el estado.
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: user !== null, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
