/**
 * Input de contraseña con botón para mostrar/ocultar el texto.
 * Construido sobre FormInput, añade el ícono de ojo que cambia entre
 * Eye (oculto) y EyeOff (visible) al presionarlo.
 *
 * Props:
 * - id, label, error: heredados de FormInput.
 * - toggleId: id del botón toggle (para tests).
 * - Resto: cualquier prop nativa de <input> (excepto type, que se gestiona internamente).
 */

import { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { FormInput } from './FormInput';
import type { InputHTMLAttributes } from 'react';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  error?: string;
  toggleId?: string;
}

export function PasswordInput({ id, label, error, toggleId, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <FormInput
        id={id}
        label={label}
        error={error}
        type={visible ? 'text' : 'password'}
        icon={<Lock size={16} />}
        {...props}
      />
      <button
        type="button"
        id={toggleId}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute right-3 top-[38px] text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
}
