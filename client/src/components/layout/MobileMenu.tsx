/**
 * Menú móvil desplegable de la navegación.
 * Se muestra cuando el usuario toca el ícono hamburguesa en pantallas pequeñas.
 * Se cierra automáticamente al navegar a otra ruta.
 *
 * Props:
 * - isOpen: controla si el menú está visible.
 * - onClose: función para cerrarlo (usada por cada enlace).
 * - isAuthenticated: si true muestra enlace al Dashboard y el botón Cerrar sesión.
 * - onLogout: función de cierre de sesión.
 */

import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/classNames';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const NAV_LINK_CLASS = ({ isActive }: { isActive: boolean }) =>
  cn(
    'block px-4 py-3 rounded-lg text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary-500/10 text-primary-400'
      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-dark-700 hover:text-zinc-900 dark:hover:text-white',
  );

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  // Cierra el menú automáticamente al cambiar de ruta
  useEffect(() => {
    onClose();
  }, [location.pathname, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id="mobileMenu"
      className={cn(
        'md:hidden border-t border-zinc-200 dark:border-dark-600',
        'bg-white/95 dark:bg-dark-800/95 backdrop-blur-md',
        'animate-slide-down',
      )}
    >
      <nav className="px-4 py-3 flex flex-col gap-1">
        <NavLink to="/" end className={NAV_LINK_CLASS} onClick={onClose}>Inicio</NavLink>
        <NavLink to="/challenges" className={NAV_LINK_CLASS} onClick={onClose}>Desafíos</NavLink>
        {isAuthenticated && (
          <NavLink to="/dashboard" className={NAV_LINK_CLASS} onClick={onClose}>Dashboard</NavLink>
        )}
        <div className="pt-2 mt-2 border-t border-zinc-200 dark:border-dark-600 flex flex-col gap-2">
          {isAuthenticated ? (
            <button
              onClick={() => { logout(); onClose(); }}
              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
            >
              Cerrar sesión
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-center text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-dark-600 hover:border-primary-500 transition-colors"
              >
                Iniciar sesión
              </NavLink>
              <NavLink
                to="/register"
                onClick={onClose}
                className="block px-4 py-3 rounded-lg text-sm font-medium text-center text-white bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Registrarse
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
