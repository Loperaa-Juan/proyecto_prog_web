/**
 * Ítem de notificación del dashboard.
 * Muestra el ícono correspondiente al tipo, el mensaje y la fecha relativa.
 *
 * Props:
 * - notification: objeto Notification con kind, message y createdAt.
 */

import { CheckCircle2, Info, BellOff } from 'lucide-react';
import { cn } from '@/lib/classNames';
import { formatRelativeDate } from '@/lib/format';
import type { Notification } from '@/types';

const KIND_CONFIG = {
  success: { icon: CheckCircle2, color: 'text-accent-500' },
  info:    { icon: Info,         color: 'text-primary-400' },
  empty:   { icon: BellOff,     color: 'text-zinc-400'    },
};

export function NotificationItem({ notification }: { notification: Notification }) {
  const { icon: Icon, color } = KIND_CONFIG[notification.kind];

  return (
    <div className="flex items-start gap-3 py-3 border-b border-zinc-100 dark:border-dark-600 last:border-0">
      <Icon size={16} className={cn('mt-0.5 shrink-0', color)} />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-700 dark:text-zinc-300">{notification.message}</p>
        {notification.createdAt && (
          <p className="text-xs text-zinc-400 mt-0.5">
            {formatRelativeDate(notification.createdAt)}
          </p>
        )}
      </div>
    </div>
  );
}
