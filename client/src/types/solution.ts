/**
 * Tipos relacionados con las soluciones enviadas por los usuarios a los desafíos.
 */

/** Estado de revisión de una solución */
export type SolutionStatus = 'pending' | 'approved' | 'rejected';

/** Representa una solución enviada por un usuario */
export interface Solution {
  id: string;
  challengeId: string;
  authorId: string;
  code: string;
  status: SolutionStatus;
  feedback?: string;
  submittedAt: string; // ISO 8601
}
