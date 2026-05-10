/**
 * Combina múltiples valores de className en una sola cadena.
 * Filtra valores falsy (undefined, null, false, '') automáticamente.
 * Equivalente liviano a clsx sin dependencia externa.
 *
 * @param classes - Lista de strings, undefined o false a combinar.
 * @returns String con las clases válidas separadas por espacio.
 *
 * @example
 * cn('base-class', isActive && 'active', undefined) // → 'base-class active'
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
