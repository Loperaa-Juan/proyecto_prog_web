import { useState } from 'react';
import { User, Mail, AtSign } from 'lucide-react';
import { Modal } from '@/components/feedback/Modal';
import { FormInput } from '@/components/form/FormInput';
import { PasswordInput } from '@/components/form/PasswordInput';
import { Spinner } from '@/components/feedback/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/useToast';
import type { User as UserType } from '@/types';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormFields {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function validate(fields: FormFields, current: UserType | null): FormErrors {
  const errors: FormErrors = {};
  if (!fields.fullName.trim()) errors.fullName = 'El nombre no puede estar vacío';
  if (!fields.username.trim()) errors.username = 'El usuario no puede estar vacío';
  if (!fields.email.trim()) {
    errors.email = 'El correo no puede estar vacío';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = 'Correo electrónico inválido';
  }
  if (fields.password) {
    if (fields.password.length < 6) errors.password = 'Mínimo 6 caracteres';
    if (fields.password !== fields.confirmPassword) errors.confirmPassword = 'Las contraseñas no coinciden';
  }
  // Check that at least one field has changed
  const noChange =
    fields.fullName.trim() === (current?.name ?? '') &&
    fields.username.trim() === (current?.username ?? '') &&
    fields.email.trim() === (current?.email ?? '') &&
    !fields.password;
  if (noChange) errors.fullName = 'No has modificado ningún campo';
  return errors;
}

export function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateUser, loading } = useAuth();
  const { showToast } = useToast();

  const [fields, setFields] = useState<FormFields>({
    fullName: user?.name ?? '',
    username: user?.username ?? '',
    email: user?.email ?? '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (key: keyof FormFields) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const handleClose = () => {
    setErrors({});
    setFields({
      fullName: user?.name ?? '',
      username: user?.username ?? '',
      email: user?.email ?? '',
      password: '',
      confirmPassword: '',
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(fields, user);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      await updateUser({
        fullName: fields.fullName.trim(),
        username: fields.username.trim(),
        email: fields.email.trim(),
        password: fields.password || undefined,
      });
      showToast('Perfil actualizado correctamente', 'success');
      handleClose();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al actualizar', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="md">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-white mb-5">
          Editar perfil
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <FormInput
            id="edit-fullname"
            label="Nombre completo"
            value={fields.fullName}
            onChange={set('fullName')}
            error={errors.fullName}
            icon={<User size={16} />}
            autoComplete="name"
          />
          <FormInput
            id="edit-username"
            label="Nombre de usuario"
            value={fields.username}
            onChange={set('username')}
            error={errors.username}
            icon={<AtSign size={16} />}
            autoComplete="username"
          />
          <FormInput
            id="edit-email"
            label="Correo electrónico"
            type="email"
            value={fields.email}
            onChange={set('email')}
            error={errors.email}
            icon={<Mail size={16} />}
            autoComplete="email"
          />
          <PasswordInput
            id="edit-password"
            label="Nueva contraseña (opcional)"
            value={fields.password}
            onChange={set('password')}
            error={errors.password}
            placeholder="Dejar en blanco para no cambiar"
            autoComplete="new-password"
          />
          {fields.password && (
            <PasswordInput
              id="edit-confirm-password"
              label="Confirmar nueva contraseña"
              value={fields.confirmPassword}
              onChange={set('confirmPassword')}
              error={errors.confirmPassword}
              autoComplete="new-password"
            />
          )}
          <div className="flex gap-3 mt-1">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium border border-zinc-200 dark:border-dark-500 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-dark-700 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-primary hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Spinner size={16} /> : null}
              {loading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
