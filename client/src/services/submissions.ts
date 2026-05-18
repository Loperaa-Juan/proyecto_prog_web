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

interface BackendMySubmission {
  Submissionid: string;
  challenge_id: string;
  challenge_title: string | null;
  code_submitted: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}

export async function getMine(): Promise<Solution[]> {
  const data = await http.get<BackendMySubmission[]>('/submissions/me');
  return data.map((s) => ({
    id:             String(s.Submissionid),
    challengeId:    String(s.challenge_id),
    challengeTitle: s.challenge_title ?? undefined,
    authorId:       '',
    code:           s.code_submitted,
    status:         STATUS_MAP[s.status] ?? 'pending',
    submittedAt:    s.created_at,
  }));
}

export async function accept(submissionId: string): Promise<void> {
  await http.post<void>(`/submissions/${submissionId}/accept`, {});
}

export async function reject(submissionId: string): Promise<void> {
  await http.post<void>(`/submissions/${submissionId}/reject`, {});
}
