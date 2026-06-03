/**
 * Campo de entrada de etiquetas (tags) tipo chip.
 * El usuario puede agregar tags con Enter o coma, y eliminarlos con el botón X.
 * Límite máximo de 5 tags y no permite duplicados.
 *
 * Props:
 * - tags: array actual de tags.
 * - onChange: función que recibe el nuevo array de tags al agregar/eliminar.
 * - maxTags: límite máximo de tags (por defecto 5).
 * - placeholder: texto placeholder del input.
 * - error: mensaje de error opcional.
 */

import { useState, useRef, type KeyboardEvent } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/classNames';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  placeholder?: string;
  error?: string;
  label?: string;
}

export function TagInput({
  tags,
  onChange,
  maxTags = 5,
  placeholder = 'Agrega una etiqueta…',
  error,
  label,
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /**
   * Intenta agregar el valor actual del input como nuevo tag.
   * Ignora si el tag ya existe, está vacío, o se alcanzó el límite.
   */
  const addTag = () => {
    const value = inputValue.trim().toLowerCase();
    if (!value || tags.includes(value) || tags.length >= maxTags) {
      setInputValue('');
      return;
    }
    onChange([...tags, value]);
    setInputValue('');
  };

  /**
   * Maneja teclas especiales: Enter y coma agregan el tag;
   * Backspace elimina el último tag si el input está vacío.
   *
   * @param e - Evento de teclado del input.
   */
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault(); // evita que Enter submitee el formulario padre
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  /**
   * Elimina un tag por su índice en el array.
   * @param index - Posición del tag a eliminar.
   */
  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
      )}
      <div
        className={cn(
          'flex flex-wrap gap-2 rounded-xl border px-3 py-2.5 cursor-text transition-colors',
          'bg-white dark:bg-dark-700',
          error
            ? 'border-rose-400 dark:border-rose-500'
            : 'border-zinc-200 dark:border-dark-500 focus-within:border-primary-500',
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map((tag, i) => (
          <span
            key={tag}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-primary-500/15 text-primary-400"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(i)}
              aria-label={`Eliminar etiqueta ${tag}`}
              className="hover:text-rose-400 transition-colors"
            >
              <X size={11} />
            </button>
          </span>
        ))}
        {tags.length < maxTags && (
          <input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addTag}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-1 min-w-[100px] bg-transparent text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 outline-none"
          />
        )}
      </div>
      <p className="text-xs text-zinc-400">
        {tags.length}/{maxTags} etiquetas · Escribe y presiona Enter o coma para agregar
      </p>
      {error && <p role="alert" className="text-xs text-rose-500">{error}</p>}
    </div>
  );
}
