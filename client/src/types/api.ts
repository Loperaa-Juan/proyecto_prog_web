/**
 * Tipos genéricos para el contrato de la API del backend.
 * Estos tipos reflejan la forma documentada de las respuestas del servidor
 * para que el cliente pueda ser tipado correctamente.
 */

/** Envelope genérico que envuelve la mayoría de respuestas del backend */
export interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

/** Estructura de error devuelta por el backend */
export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

/** Wrapper para respuestas paginadas */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
