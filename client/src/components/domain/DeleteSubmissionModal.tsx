import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/feedback/Modal';
import { Spinner } from '@/components/feedback/Spinner';
import * as submissionService from '@/services/submissions';
import { useToast } from '@/hooks/useToast';
import type { Solution } from '@/types';

interface DeleteSubmissionModalProps {
  submission: Solution | null;
  onClose: () => void;
  onDeleted: (deletedId: string) => void;
}

export function DeleteSubmissionModal({ submission, onClose, onDeleted }: DeleteSubmissionModalProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleDelete = async () => {
    if (!submission) return;
    setLoading(true);
    try {
      await submissionService.remove(submission.id);
      showToast('Submission eliminada correctamente', 'success');
      onDeleted(submission.id);
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={submission !== null} onClose={onClose}>
      <div className="p-6 flex flex-col gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15 mx-auto">
          <AlertTriangle size={24} className="text-rose-500" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Eliminar submission
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            ¿Estás seguro de que quieres eliminar tu submission de{' '}
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              "{submission?.challengeTitle ?? 'este desafío'}"
            </span>
            ? Esta acción no se puede deshacer.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-dark-500 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-dark-700 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-rose-500 hover:bg-rose-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Spinner size={16} /> : <Trash2 size={16} />}
            {loading ? 'Eliminando…' : 'Eliminar'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
