import type { DecisionStatus } from '@/data/queue';
import type { RuleStatus } from '@/data/rules';
import { cx } from '@/lib/cx';

/** Status pill — `approved`, `pending`, `flagged`, `rejected`, `overridden`. */
export function StatusBadge({ status }: { readonly status: DecisionStatus }) {
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return <span className={cx('badge', `badge-${status}`)}>{label}</span>;
}

/**
 * A rule's lifecycle state, borrowing the decision pills rather than adding a
 * third palette: live reads as approved, a draft as pending, a paused rule as
 * inert.
 */
const RULE_BADGE_CLASS: Record<RuleStatus, string> = {
  active: 'badge-approved',
  draft: 'badge-pending',
  paused: 'badge-neutral',
};

export function RuleBadge({
  status,
  label,
}: {
  readonly status: RuleStatus;
  readonly label: string;
}) {
  return <span className={cx('badge', RULE_BADGE_CLASS[status])}>{label}</span>;
}
