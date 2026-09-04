import type { DecisionStatus } from '@/data/queue';
import { cx } from '@/lib/cx';

/** Status pill — `approved`, `pending`, `flagged`, `rejected`, `overridden`. */
export function StatusBadge({ status }: { readonly status: DecisionStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cx('badge', `badge-${status}`)}>{label}</span>;
}
