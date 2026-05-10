/**
 * Hook para consumir el contexto de autenticación.
 * Lanza un error si se usa fuera del AuthProvider.
 *
 * @returns El valor del AuthContext (user, isAuthenticated, login, register, logout, loading).
 */

import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
