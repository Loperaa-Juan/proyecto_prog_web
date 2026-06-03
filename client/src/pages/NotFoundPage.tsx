/**
 * Página 404 — Recurso no encontrado.
 * Se renderiza cuando el usuario navega a una ruta no definida en el router.
 * Ofrece un enlace para volver al inicio.
 *
 * Props: ninguna.
 */

import { Link } from 'react-router-dom';
import { Home, FileQuestion } from 'lucide-react';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export default function NotFoundPage() {
  useDocumentTitle('Página no encontrada');

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 flex items-center justify-center rounded-2xl bg-zinc-100 dark:bg-dark-800 mb-6">
        <FileQuestion size={40} className="text-zinc-300 dark:text-dark-500" />
      </div>

      <p className="text-6xl font-extrabold text-zinc-200 dark:text-dark-700 mb-2 tabular-nums">404</p>

      <h1 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
        Página no encontrada
      </h1>

      <p className="text-base text-zinc-500 dark:text-zinc-400 max-w-sm mb-8">
        La ruta que buscas no existe o fue movida. Verifica la URL o vuelve al inicio.
      </p>

      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-gradient-primary hover:opacity-90 transition-opacity"
      >
        <Home size={18} /> Volver al inicio
      </Link>
    </div>
  );
}
