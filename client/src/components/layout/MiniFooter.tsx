/**
 * Footer simplificado de una sola línea.
 * Aparece en páginas internas: Dashboard y ChallengeFormPage.
 * Muestra el copyright y un enlace al inicio.
 *
 * Props: ninguna.
 */

import { Link } from 'react-router-dom';

export function MiniFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-200 dark:border-dark-600 py-5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          © {year} ComplexityLab. Todos los derechos reservados.
        </p>
        <Link
          to="/"
          className="text-xs text-zinc-400 dark:text-zinc-500 hover:text-primary-500 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </footer>
  );
}
