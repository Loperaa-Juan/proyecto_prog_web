import { http } from './http';
import type { Solution, SolutionStatus } from '@/types';

interface BackendSubmission {
  Submissionid: string;
  user_id: string;
  challenge_id: string;
  author_name?: string | null;
  code_submitted: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

const STATUS_MAP: Record<BackendSubmission['status'], SolutionStatus> = {
  pending:  'pending',
  accepted: 'approved',
  rejected: 'rejected',
};

function mapBackendSubmission(data: BackendSubmission): Solution {
  return {
    id:          String(data.Submissionid),
    challengeId: String(data.challenge_id),
    authorId:    String(data.user_id),
    authorName:  data.author_name ?? undefined,
    code:        data.code_submitted,
    status:      STATUS_MAP[data.status] ?? 'pending',
    submittedAt: data.created_at,
  };
}

export async function create(challengeId: string, code: string): Promise<Solution> {
  const form = new FormData();
  form.append('challenge_id', challengeId);
  form.append('code', code);
  const data = await http.postForm<BackendSubmission>('/submissions', form);
  return mapBackendSubmission(data);
}

export async function getByChallenge(challengeId: string): Promise<Solution[]> {
  const data = await http.get<BackendSubmission[]>(`/submissions/${challengeId}`);
  return data.map(mapBackendSubmission);
}

export async function accept(submissionId: string): Promise<void> {
  await http.post<void>(`/submissions/${submissionId}/accept`, {});
}

export async function reject(submissionId: string): Promise<void> {
  await http.post<void>(`/submissions/${submissionId}/reject`, {});
}
