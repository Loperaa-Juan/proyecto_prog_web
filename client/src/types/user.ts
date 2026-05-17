/**
 * Tipos relacionados con el usuario autenticado y el sistema de autenticación.
 * Reflejan las entidades documentadas en docs/arquitectura.md.
 */

/** Representa un usuario registrado en la plataforma */
export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  /** Iniciales para mostrar en el Avatar (ej: "JD" para "Juan David") */
  initials: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  joinedAt: string; // ISO 8601
}

/** Credenciales para el formulario de login */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Payload para el formulario de registro */
export interface RegisterPayload {
  name: string;
  username: string;
  email: string;
  password: string;
}

/** Sesión autenticada guardada localmente tras un login exitoso */
export interface AuthSession {
  token: string;
  user: User;
}
