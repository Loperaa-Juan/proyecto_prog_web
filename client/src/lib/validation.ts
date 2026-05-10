/**
 * Funciones de validación reutilizables para formularios.
 * Centralizadas aquí para evitar duplicación entre componentes de página.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Valida si una cadena tiene formato de email válido.
 * @param email - Cadena a validar.
 * @returns true si el formato es válido.
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Calcula la puntuación de fortaleza de una contraseña del 0 al 4.
 * Criterios: longitud≥8, mayúscula, dígito, símbolo especial.
 *
 * @param password - Contraseña a evaluar.
 * @returns Número entre 0 y 4 que indica la fortaleza.
 */
export function scorePassword(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

/**
 * Devuelve la etiqueta de fortaleza correspondiente a una puntuación.
 * @param score - Puntuación de 0 a 4.
 * @returns Texto descriptivo de la fortaleza.
 */
export function strengthLabel(score: number): string {
  const labels = ['', 'Débil', 'Regular', 'Buena', 'Fuerte'];
  return labels[score] ?? '';
}

/**
 * Comprueba que un string tenga al menos `min` caracteres tras hacer trim.
 * @param value - Cadena a comprobar.
 * @param min - Longitud mínima requerida.
 * @returns true si la cadena cumple el mínimo.
 */
export function minLength(value: string, min: number): boolean {
  return value.trim().length >= min;
}
