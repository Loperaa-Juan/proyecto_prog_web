/**
 * Tipos para los datos del dashboard del usuario.
 * Incluye estadísticas, progreso por categoría y notificaciones.
 */

/** Estadísticas generales mostradas en las tarjetas del dashboard */
export interface DashboardStats {
  challengesCreated: number;
  solved: number;
  currentStreak: number;
  interactions: number;
}

/** Ítem de progreso por categoría en la barra lateral del dashboard */
export interface ProgressItem {
  category: string;
  solved: number;
  total: number;
  color: 'primary' | 'accent' | 'violet' | 'amber';
}

/** Tipo de notificación */
export type NotificationKind = 'success' | 'info' | 'empty';

/** Notificación del dashboard */
export interface Notification {
  id: string;
  kind: NotificationKind;
  message: string;
  createdAt?: string;
}
