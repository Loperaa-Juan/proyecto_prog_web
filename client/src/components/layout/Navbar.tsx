/**
 * Barra de navegación principal de la aplicación.
 * Muestra el logo, los enlaces de navegación, el toggle de tema y los botones de auth.
 * En pantallas pequeñas (<768px) colapsa a un menú hamburguesa gestionado por MobileMenu.
 * Usa glassmorphism (backdrop-filter) para el efecto de transparencia sobre el contenido.
 *
 * Props: ninguna (consume useTheme y useAuth del contexto).
 */

import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { Logo } from '@/components/branding/Logo';
import { MobileMenu } from './MobileMenu';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/classNames';

const DESKTOP_LINK = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium transition-colors',
    isActive
      ? 'text-primary-400'
      : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white',
  );

export function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 border-b transition-colors duration-200',
        'border-zinc-200 dark:border-dark-600',
        isDark ? 'glass-dark' : 'glass-light',
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" aria-label="Ir a inicio">
            <Logo size="md" />
          </Link>

          {/* Navegación desktop */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" end className={DESKTOP_LINK}>Inicio</NavLink>
            <NavLink to="/challenges" className={DESKTOP_LINK}>Desafíos</NavLink>
            {isAuthenticated && (
              <NavLink to="/dashboard" className={DESKTOP_LINK}>Dashboard</NavLink>
            )}
          </nav>

          {/* Acciones derechas */}
          <div className="flex items-center gap-2">
            {/* Toggle de tema */}
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              className={cn(
                'w-9 h-9 flex items-center justify-center rounded-lg transition-colors',
                'text-zinc-500 dark:text-zinc-400',
                'hover:bg-zinc-100 dark:hover:bg-dark-700',
              )}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Auth buttons — solo desktop */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="text-sm font-medium px-4 py-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                >
                  Cerrar sesión
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className={cn(
                      'text-sm font-medium px-4 py-2 rounded-lg transition-colors',
                      'text-zinc-700 dark:text-zinc-300',
                      'border border-zinc-200 dark:border-dark-600',
                      'hover:border-primary-500 hover:text-primary-500',
                    )}
                  >
                    Iniciar sesión
                  </Link>
                  <Link
                    to="/register"
                    className="text-sm font-medium px-4 py-2 rounded-lg text-white bg-gradient-primary hover:opacity-90 transition-opacity"
                  >
                    Registrarse
                  </Link>
                </>
              )}
            </div>

            {/* Hamburguesa — solo mobile */}
            <button
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Abrir menú"
              aria-expanded={menuOpen}
              className={cn(
                'md:hidden w-9 h-9 flex items-center justify-center rounded-lg transition-colors',
                'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-dark-700',
              )}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </header>
  );
}
