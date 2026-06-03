/**
 * Campo de búsqueda con ícono para el listado de desafíos.
 * El debounce se aplica en el hook useChallenges, no aquí;
 * este componente es solo presentacional y controlado.
 *
 * Props:
 * - value: valor actual del campo (controlado).
 * - onChange: callback al cambiar el texto.
 * - placeholder: texto de placeholder.
 */

import { Search } from 'lucide-react';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBox({ value, onChange, placeholder = 'Buscar desafíos…' }: SearchBoxProps) {
  return (
    <div className="relative">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar desafíos"
        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-dark-500 bg-white dark:bg-dark-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none focus:border-primary-500 transition-colors"
      />
    </div>
  );
}
