/**
 * Modal de confirmación para eliminar un desafío.
 * Muestra el nombre del desafío a eliminar y permite confirmar o cancelar.
 * La acción de confirmación llama al servicio de eliminación y muestra un toast.
 *
 * Props:
 * - challenge: el desafío a eliminar (o null si el modal está cerrado).
 * - onClose: cierra el modal.
 * - onConfirm: callback llamado tras la eliminación exitosa.
 */

import { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/feedback/Modal';
import { Spinner } from '@/components/feedback/Spinner';
import * as challengeService from '@/services/challenges';
import { useToast } from '@/hooks/useToast';
import type { Challenge } from '@/types';

interface DeleteChallengeModalProps {
  challenge: Challenge | null;
  onClose: () => void;
  onConfirm: (deletedId: string) => void;
}

export function DeleteChallengeModal({ challenge, onClose, onConfirm }: DeleteChallengeModalProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  /**
   * Ejecuta la eliminación del desafío y notifica al componente padre.
   */
  const handleDelete = async () => {
    if (!challenge) return;
    setLoading(true);
    try {
      await challengeService.remove(challenge.id);
      showToast(`"${challenge.title}" eliminado correctamente`, 'success');
      onConfirm(challenge.id);
      onClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al eliminar', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={challenge !== null} onClose={onClose}>
      <div className="p-6 flex flex-col gap-4">
        {/* Icono de alerta */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-rose-100 dark:bg-rose-500/15 mx-auto">
          <AlertTriangle size={24} className="text-rose-500" />
        </div>

        <div className="text-center">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Eliminar desafío
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            ¿Estás seguro de que quieres eliminar{' '}
            <span className="font-medium text-zinc-700 dark:text-zinc-200">
              "{challenge?.title}"
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
