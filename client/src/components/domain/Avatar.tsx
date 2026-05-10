/**
 * Avatar de usuario con gradiente de marca y texto de iniciales.
 * Se usa en el header del dashboard y en las tarjetas de desafío.
 *
 * Props:
 * - initials: texto de iniciales a mostrar (ej: "JD").
 * - size: 'sm' | 'md' | 'lg' — controla el tamaño del avatar.
 * - className: clases adicionales.
 */

import { cn } from '@/lib/classNames';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-11 h-11 text-sm',
  lg: 'w-16 h-16 text-lg',
};

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full font-bold text-white shrink-0 select-none',
        SIZE_MAP[size],
        className,
      )}
      style={{
        background: 'linear-gradient(135deg, #6366f1, #10b981)',
      }}
      aria-label={`Avatar de ${initials}`}
    >
      {initials}
    </div>
  );
}
