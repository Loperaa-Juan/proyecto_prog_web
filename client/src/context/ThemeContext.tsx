/**
 * Contexto de tema de la aplicación.
 * Gestiona el estado claro/oscuro de la UI y lo persiste en localStorage.
 * Modifica la clase "dark" en el elemento <html> para activar las utilidades dark: de Tailwind.
 *
 * Uso: envuelve la app con <ThemeProvider> y consume con useTheme().
 */

import { createContext, useCallback, useEffect, useState } from 'react';
import { getJSON, setJSON, STORAGE_KEYS } from '@/lib/storage';

export type Theme = 'dark' | 'light';

interface ThemeContextValue {
  theme: Theme;
  /** Alterna entre modo claro y oscuro */
  toggleTheme: () => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Proveedor del contexto de tema.
 * Lee el tema inicial de localStorage (default: 'dark') y sincroniza
 * la clase CSS con el elemento raíz del documento.
 *
 * @param children - Árbol de componentes que tendrán acceso al tema.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(
    () => getJSON<Theme>(STORAGE_KEYS.THEME) ?? 'dark',
  );

  // Aplica/remueve la clase "dark" en <html> al cambiar de tema
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    setJSON(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  /**
   * Alterna el tema entre claro y oscuro.
   */
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  );
}
