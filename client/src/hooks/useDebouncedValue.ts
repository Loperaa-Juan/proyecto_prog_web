/**
 * Hook para obtener una versión "debounced" de un valor.
 * El valor retornado solo se actualiza después de que el valor original
 * no haya cambiado durante `delay` milisegundos.
 * Útil para evitar peticiones excesivas en campos de búsqueda.
 *
 * @param value - El valor a debouncear (cualquier tipo).
 * @param delay - Tiempo de espera en milisegundos (por defecto 300ms).
 * @returns El valor estabilizado después del delay.
 */

import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
