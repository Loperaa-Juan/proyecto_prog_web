/**
 * Utilidades de formateo de fechas usando la API Intl nativa del navegador.
 * Todas las salidas están en español (es-CO).
 */

const rtf = new Intl.RelativeTimeFormat('es-CO', { numeric: 'auto' });

/** Umbrales en segundos para el formateo relativo */
const THRESHOLDS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: 'year',   seconds: 31536000 },
  { unit: 'month',  seconds: 2592000  },
  { unit: 'week',   seconds: 604800   },
  { unit: 'day',    seconds: 86400    },
  { unit: 'hour',   seconds: 3600     },
  { unit: 'minute', seconds: 60       },
  { unit: 'second', seconds: 1        },
];

/**
 * Formatea una fecha ISO 8601 como tiempo relativo en español.
 * Ejemplo: "hace 3 días", "hace 2 horas".
 *
 * @param iso - Cadena de fecha en formato ISO 8601.
 * @returns Cadena de tiempo relativo localizada en español.
 */
export function formatRelativeDate(iso: string): string {
  const diffSeconds = (Date.now() - new Date(iso).getTime()) / 1000;
  for (const { unit, seconds } of THRESHOLDS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return rtf.format(-Math.round(diffSeconds / seconds), unit);
    }
  }
  return 'ahora mismo';
}

/**
 * Formatea una fecha ISO 8601 como fecha corta en español.
 * Ejemplo: "10 may 2026".
 *
 * @param iso - Cadena de fecha en formato ISO 8601.
 * @returns Fecha formateada.
 */
export function formatShortDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}
