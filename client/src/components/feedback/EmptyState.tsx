/**
 * Estado vacío genérico para listas o secciones sin contenido.
 * Muestra un ícono, un título, una descripción y opcionalmente un botón de acción.
 *
 * Props:
 * - icon: elemento React a usar como ícono (ej: componente lucide-react).
 * - title: título principal del estado vacío.
 * - description: texto descriptivo secundario.
 * - action: (opcional) configuración del botón de acción.
 */

import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center gap-3">
      <div className="text-zinc-300 dark:text-dark-600 mb-2">{icon}</div>
      <h3 className="text-base font-semibold text-zinc-700 dark:text-zinc-300">{title}</h3>
      <p className="text-sm text-zinc-400 dark:text-zinc-500 max-w-xs">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-3 px-5 py-2 rounded-lg text-sm font-medium text-white bg-gradient-primary hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
