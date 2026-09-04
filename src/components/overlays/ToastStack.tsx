import { cx } from '@/lib/cx';
import { useToasts } from '@/state/ToastContext';
import { Icon } from '@/components/common/Icon';

export function ToastStack() {
  const toasts = useToasts();
  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map((entry) => (
        <div key={entry.id} className={cx('toast', entry.leaving && 'leaving')}>
          <Icon name="check-circle" fill />
          <span>{entry.message}</span>
        </div>
      ))}
    </div>
  );
}
