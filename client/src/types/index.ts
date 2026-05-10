/**
 * Exportaciones centralizadas de todos los tipos del proyecto.
 * Importa desde aquí para acceder a cualquier tipo: `import type { Challenge } from '@/types'`
 */
export type { ApiEnvelope, ApiError, Paginated } from './api';
export type { User, AuthCredentials, RegisterPayload, AuthSession } from './user';
export type {
  Challenge,
  ChallengeDifficulty,
  ChallengeSort,
  ChallengeCategory,
  ChallengeFilter,
  ChallengePayload,
} from './challenge';
export type { Solution, SolutionStatus } from './solution';
export type { DashboardStats, ProgressItem, Notification, NotificationKind } from './dashboard';
