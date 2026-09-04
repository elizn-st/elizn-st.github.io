import { cx } from '@/lib/cx';
import type { Severity } from '@/data/home';
import { Icon } from './Icon';

export interface NotificationRowProps {
  readonly severity: Severity;
  readonly icon: string;
  readonly title: string;
  readonly time?: string;
  readonly delayMs?: number;
}

/** Inline alert strip — the home alerts panel and the privacy notice on C5. */
export function NotificationRow({ severity, icon, title, time, delayMs }: NotificationRowProps) {
  return (
    <div
      className={cx('notification', severity)}
      style={delayMs === undefined ? undefined : { animationDelay: `${delayMs}ms` }}
    >
      <span className="notif-icon">
        <Icon name={icon} fill />
      </span>
      <span className="notif-text">
        <span className="notif-title">{title}</span>
        {time && <span className="notif-time">{time}</span>}
      </span>
    </div>
  );
}
