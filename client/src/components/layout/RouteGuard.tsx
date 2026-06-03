/**
 * Componente de protección de rutas autenticadas.
 * Si el usuario no está autenticado, redirige a /login preservando
 * la ruta intentada en el estado de navegación (state.from) para
 * que después del login pueda volver a la página correcta.
 *
 * Props:
 * - children: el contenido de la ruta protegida.
 */

import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface RouteGuardProps {
  children: React.ReactNode;
}

export function RouteGuard({ children }: RouteGuardProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
}
