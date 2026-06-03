/**
 * Hook para consumir el contexto de tema.
 * Lanza un error si se usa fuera del ThemeProvider.
 *
 * @returns El valor del ThemeContext (theme, toggleTheme, isDark).
 */

import { useContext } from 'react';
import { ThemeContext } from '@/context/ThemeContext';

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
}
