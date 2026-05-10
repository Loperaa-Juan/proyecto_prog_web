/**
 * Componente Logo de ComplexityLab.
 * Muestra el ícono SVG de red neuronal junto al nombre de la marca.
 * El texto "Lab" lleva el gradiente de color de marca (cyan → azul).
 *
 * Props:
 * - size: 'sm' | 'md' | 'lg' — controla el tamaño del ícono y del texto.
 */

import { cn } from '@/lib/classNames';
import logoSvg from '@/assets/logo.svg';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: { img: 'w-6 h-6', text: 'text-lg' },
  md: { img: 'w-7 h-7', text: 'text-xl' },
  lg: { img: 'w-9 h-9', text: 'text-2xl' },
};

export function Logo({ size = 'md', className }: LogoProps) {
  const s = SIZE_MAP[size];
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img src={logoSvg} alt="ComplexityLab logo" className={cn(s.img, 'shrink-0')} />
      <span className={cn('font-bold tracking-tight', s.text)}>
        <span className="text-zinc-900 dark:text-white">Complexity</span>
        <span
          className="font-extrabold"
          style={{
            background: 'linear-gradient(135deg, #06b6d4, #2563eb)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Lab
        </span>
      </span>
    </div>
  );
}
