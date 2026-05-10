/**
 * Retorna una promesa que se resuelve después de `ms` milisegundos.
 * Se usa en los servicios mockeados para simular latencia de red realista.
 *
 * @param ms - Milisegundos a esperar. Por defecto entre 600 y 1200ms si se usa randomDelay.
 * @returns Promise que se resuelve tras el tiempo indicado.
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retorna una promesa que se resuelve tras un retraso aleatorio entre min y max milisegundos.
 * Simula la variabilidad natural de una respuesta HTTP.
 *
 * @param min - Mínimo de milisegundos (por defecto 500).
 * @param max - Máximo de milisegundos (por defecto 1200).
 * @returns Promise que se resuelve tras el tiempo aleatorio.
 */
export function randomDelay(min = 500, max = 1200): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return delay(ms);
}
