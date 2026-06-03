/**
 * Tarjeta de estadística del dashboard.
 * Muestra un ícono, un valor numérico grande y una etiqueta descriptiva.
 * Soporta variantes de color para diferenciar cada métrica.
 *
 * Props:
 * - icon: componente de ícono (lucide-react).
 * - label: descripción de la estadística.
 * - value: valor numérico o string a mostrar.
 * - color: variante de color ('primary' | 'accent' | 'violet' | 'amber').
 * - trend: texto opcional de tendencia (ej: "+12%").
 */

import type { ReactNode } from 'react';
import { cn } from '@/lib/classNames';

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: number | string;
  color?: 'primary' | 'accent' | 'violet' | 'amber';
  trend?: string;
}

const COLOR_MAP = {
  primary: { icon: 'text-primary-400 bg-primary-500/10', border: 'border-primary-500/20' },
  accent:  { icon: 'text-accent-500 bg-accent-500/10',   border: 'border-accent-500/20'  },
  violet:  { icon: 'text-violet-500 bg-violet-500/10',   border: 'border-violet-500/20'  },
  amber:   { icon: 'text-amber-500 bg-amber-500/10',     border: 'border-amber-500/20'   },
};

export function StatCard({ icon, label, value, color = 'primary', trend }: StatCardProps) {
  const styles = COLOR_MAP[color];
  return (
    <div
      className={cn(
        'rounded-xl border p-5 flex items-center gap-4',
        'bg-white dark:bg-dark-800',
        'border-zinc-200 dark:border-dark-600',
        'hover:-translate-y-0.5 transition-transform duration-200',
      )}
    >
      <div className={cn('w-12 h-12 flex items-center justify-center rounded-xl shrink-0', styles.icon)}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-zinc-900 dark:text-white tabular-nums">{value}</p>
        <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 truncate">{label}</p>
        {trend && <p className="text-xs text-accent-500 mt-0.5">{trend}</p>}
      </div>
    </div>
  );
}
